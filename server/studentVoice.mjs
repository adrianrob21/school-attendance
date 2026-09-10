import { spawn } from "node:child_process";
import { constants } from "node:fs";
import { access, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ENDPOINT = "/api/student-voice";
const MAX_BODY_BYTES = 2 * 1024;
const MAX_AUDIO_BYTES = 2 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 6 * 1024 * 1024;
const MAX_CONCURRENT = 2;
const VOICE_ID = "raluca-high-v3";
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const scriptPath = fileURLToPath(new URL("./piper_voice.py", import.meta.url));

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function sendJson(req, res, status, body) {
  if (res.destroyed || res.writableEnded) return;
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(req.method === "HEAD" ? undefined : JSON.stringify(body));
}

function assertSameOrigin(req) {
  const site = req.headers["sec-fetch-site"];
  if (site && site !== "same-origin" && site !== "none") {
    throw new RequestError(403, "Requests must come from this application.");
  }
  if (!req.headers.origin) return;
  try {
    const origin = new URL(req.headers.origin);
    if (origin.protocol === "http:" || origin.protocol === "https:") {
      // HTTPS may terminate at the reverse proxy; the original Host is retained.
      const expectedHost = new URL(`${origin.protocol}//${req.headers.host}`).host;
      if (origin.host === expectedHost) return;
    }
  } catch {
    // Invalid or opaque origins must not trigger generation.
  }
  throw new RequestError(403, "Requests must come from this application.");
}

async function readName(req) {
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers["content-type"] || "")) {
    throw new RequestError(415, "Send the child's name as JSON.");
  }
  if (Number(req.headers["content-length"]) > MAX_BODY_BYTES) {
    throw new RequestError(413, "The request is too large.");
  }
  const body = await new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    const cleanup = () => {
      req.off("data", onData);
      req.off("end", onEnd);
      req.off("error", onError);
      req.off("aborted", onError);
    };
    const onError = () => {
      cleanup();
      reject(new RequestError(400, "The request could not be read."));
    };
    const onData = (chunk) => {
      size += Buffer.byteLength(chunk);
      if (size > MAX_BODY_BYTES) {
        cleanup();
        req.resume();
        reject(new RequestError(413, "The request is too large."));
      } else chunks.push(Buffer.from(chunk));
    };
    const onEnd = () => {
      cleanup();
      resolve(Buffer.concat(chunks).toString("utf8"));
    };
    req.on("data", onData);
    req.on("end", onEnd);
    req.on("error", onError);
    req.on("aborted", onError);
  });
  let input;
  try {
    input = JSON.parse(body);
  } catch {
    throw new RequestError(400, "Send a valid JSON request.");
  }
  if (!input || Array.isArray(input) || typeof input.name !== "string" || /[\p{Cc}\p{Cs}]/u.test(input.name)) {
    throw new RequestError(400, "Enter a valid child name.");
  }
  const name = input.name.normalize("NFC").trim().replace(/\s+/gu, " ");
  if (!name || [...name].length > 120) {
    throw new RequestError(400, "The child name must contain 1 to 120 characters.");
  }
  return name;
}

async function availableFile(path, mode) {
  try {
    await access(path, mode);
    const info = await stat(path);
    return info.isFile() && info.size > 0;
  } catch {
    return false;
  }
}

function validatePair(value) {
  const invalid = () => new RequestError(502, "The local voice returned invalid audio. Please try again.");
  if (value?.mimeType !== "audio/wav" || value?.voiceId !== VOICE_ID) throw invalid();
  for (const status of ["present", "absent"]) {
    const encoded = value[status];
    if (typeof encoded !== "string" || encoded.length > Math.ceil(MAX_AUDIO_BYTES / 3) * 4) throw invalid();
    const audio = Buffer.from(encoded, "base64");
    if (audio.length <= 44 || audio.length > MAX_AUDIO_BYTES || audio.toString("base64") !== encoded ||
        audio.toString("ascii", 0, 4) !== "RIFF" || audio.toString("ascii", 8, 12) !== "WAVE") throw invalid();
  }
  return { present: value.present, absent: value.absent, mimeType: "audio/wav", voiceId: VOICE_ID };
}

function runPiper(name, pythonPath, modelPath) {
  return new Promise((resolveOutput, reject) => {
    const child = spawn(pythonPath, [scriptPath, modelPath], { stdio: ["pipe", "pipe", "ignore"], windowsHide: true });
    const chunks = [];
    let size = 0;
    let failure;
    const stop = (error) => {
      failure ??= error;
      child.kill("SIGKILL");
    };
    const timer = setTimeout(() => stop(new RequestError(504, "Local voice generation timed out. Please try again.")), 90_000);
    timer.unref();
    child.once("error", () => { failure ??= new RequestError(503, "The local voice could not start. Run npm run voice:setup."); });
    child.stdin.on("error", () => stop(new RequestError(502, "Local voice generation failed. Please try again.")));
    child.stdout.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_OUTPUT_BYTES) stop(new RequestError(502, "The local voice returned too much audio. Please try again."));
      else chunks.push(chunk);
    });
    child.once("close", (code) => {
      clearTimeout(timer);
      if (failure) return reject(failure);
      if (code !== 0) return reject(new RequestError(502, "Local voice generation failed. Please try again."));
      try { resolveOutput(JSON.parse(Buffer.concat(chunks).toString("utf8"))); }
      catch { reject(new RequestError(502, "The local voice returned invalid audio. Please try again.")); }
    });
    child.stdin.end(JSON.stringify({ name }));
  });
}

export function createStudentVoiceMiddleware({
  pythonPath = process.env.PIPER_PYTHON || resolve(projectRoot, process.platform === "win32" ? ".venv/Scripts/python.exe" : ".venv/bin/python"),
  modelPath = process.env.PIPER_MODEL || resolve(projectRoot, "models/raluca/ro_RO-raluca-high.onnx"),
  synthesize,
} = {}) {
  pythonPath = resolve(projectRoot, pythonPath);
  modelPath = resolve(projectRoot, modelPath);
  const inFlight = new Map();
  const generate = synthesize ?? ((name) => runPiper(name, pythonPath, modelPath));
  const isReady = async () => (await Promise.all([
    availableFile(pythonPath, constants.X_OK),
    availableFile(modelPath, constants.R_OK),
    availableFile(`${modelPath}.json`, constants.R_OK),
  ])).every(Boolean);

  return async function studentVoice(req, res, next) {
    let pathname;
    try {
      pathname = new URL(req.url, "http://localhost").pathname;
    } catch {
      return next();
    }
    if (pathname !== ENDPOINT && pathname !== `${ENDPOINT}/status`) return next();
    try {
      assertSameOrigin(req);
      const isStatus = pathname.endsWith("/status");
      const allowedMethod = isStatus ? "GET" : "POST";
      if (req.method !== allowedMethod) {
        res.setHeader("Allow", allowedMethod);
        throw new RequestError(405, "Method not allowed.");
      }
      if (isStatus) {
        const ready = await isReady();
        return sendJson(req, res, 200, { configured: ready, ready, voiceId: VOICE_ID });
      }
      const name = await readName(req);
      if (!(await isReady())) throw new RequestError(503, "Raluca is not installed. Run npm run voice:setup.");
      let generation = inFlight.get(name);
      if (!generation) {
        if (inFlight.size >= MAX_CONCURRENT) {
          res.setHeader("Retry-After", "5");
          throw new RequestError(429, "Voice generation is busy. Please try again shortly.");
        }
        generation = Promise.resolve().then(() => generate(name)).then(validatePair).finally(() => inFlight.delete(name));
        inFlight.set(name, generation);
      }
      sendJson(req, res, 200, await generation);
    } catch (error) {
      req.resume();
      const timeout = error?.name === "TimeoutError" || error?.name === "AbortError";
      const status = error instanceof RequestError ? error.status : timeout ? 504 : 502;
      const message = error instanceof RequestError ? error.message : timeout
        ? "Local voice generation timed out. Please try again."
        : "Local voice generation failed. Please try again.";
      sendJson(req, res, status, { error: message });
    }
  };
}
