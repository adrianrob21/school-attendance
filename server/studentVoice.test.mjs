import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmod, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { Readable } from "node:stream";
import test, { after, before } from "node:test";
import { setImmediate as tick } from "node:timers/promises";
import { fileURLToPath } from "node:url";

import { createStudentVoiceMiddleware } from "./studentVoice.mjs";

let directory;
let paths;
before(async () => {
  directory = await mkdtemp(resolve(tmpdir(), "raluca-voice-tests-"));
  const modelPath = resolve(directory, "raluca.onnx");
  await writeFile(modelPath, "mock model");
  await writeFile(`${modelPath}.json`, "{}");
  paths = { pythonPath: process.execPath, modelPath };
});
after(async () => { await rm(directory, { recursive: true, force: true }); });

function wav(text = "mock audio") {
  const source = Buffer.from(text);
  const data = Buffer.alloc(source.length * 2);
  source.forEach((value, index) => data.writeInt16LE((value - 128) * 128, index * 2));
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(22050, 24);
  header.writeUInt32LE(44100, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]).toString("base64");
}

function clips(name = "Șerban") {
  return { present: wav(`${name}, prezent.`), absent: wav(`${name}, absent.`), mimeType: "audio/wav", voiceId: "raluca-high-v3" };
}

async function request(middleware, options = {}) {
  const body = options.body ?? JSON.stringify({ name: "Șerban" });
  const req = Readable.from(options.chunks ?? [Buffer.from(body)]);
  Object.assign(req, {
    url: options.url ?? "/api/student-voice",
    method: options.method ?? "POST",
    headers: { host: "classroom.test", "content-type": "application/json", ...options.headers },
  });
  const headers = new Map();
  const res = {
    status: undefined, body: undefined, writableEnded: false,
    setHeader(key, value) { headers.set(key.toLowerCase(), value); },
    writeHead(status, values) {
      this.status = status;
      for (const [key, value] of Object.entries(values)) this.setHeader(key, value);
    },
    end(value) { this.body = value; this.writableEnded = true; },
  };
  let nextCalled = false;
  await middleware(req, res, () => { nextCalled = true; });
  return { status: res.status, json: res.body ? JSON.parse(res.body) : undefined, headers, nextCalled };
}

test("normalized names produce two local WAV clips and voice identity without fetch", async (t) => {
  t.mock.method(globalThis, "fetch", () => { assert.fail("Local synthesis must never call a cloud service"); });
  const calls = [];
  const middleware = createStudentVoiceMiddleware({ ...paths, synthesize: async (name) => { calls.push(name); return clips(name); } });
  const result = await request(middleware, { body: JSON.stringify({ name: "  S\u0326erban　O’Connor & 李  " }) });
  assert.equal(result.status, 200);
  assert.deepEqual(calls, ["Șerban O’Connor & 李"]);
  assert.deepEqual(result.json, clips(calls[0]));
  assert.equal(result.headers.get("cache-control"), "no-store");
});

test("status checks actual executable, model and config files without synthesis", async () => {
  let calls = 0;
  const synthesize = async () => { calls++; return clips(); };
  for (const [options, expected] of [
    [paths, true],
    [{ ...paths, pythonPath: resolve(directory, "missing-python") }, false],
    [{ ...paths, modelPath: resolve(directory, "missing-model") }, false],
  ]) {
    const middleware = createStudentVoiceMiddleware({ ...options, synthesize });
    const result = await request(middleware, { url: "/api/student-voice/status", method: "GET" });
    assert.equal(result.status, 200);
    assert.deepEqual(result.json, { configured: expected, ready: expected, voiceId: "raluca-high-v3" });
    if (!expected) assert.equal((await request(middleware)).status, 503);
  }
  const modelWithoutConfig = resolve(directory, "no-config.onnx");
  await writeFile(modelWithoutConfig, "mock model");
  const middleware = createStudentVoiceMiddleware({ ...paths, modelPath: modelWithoutConfig, synthesize });
  assert.equal((await request(middleware, { url: "/api/student-voice/status", method: "GET" })).json.ready, false);
  assert.equal(calls, 0);
});

test("invalid requests are rejected before synthesis", async () => {
  let calls = 0;
  const middleware = createStudentVoiceMiddleware({ ...paths, synthesize: async () => { calls++; return clips(); } });
  const cases = [
    { body: "{", status: 400 },
    ...[{}, [], null, { name: 123 }, { name: "   " }, { name: "A".repeat(121) }, { name: "Ana\u0000" }, { name: "Ana\nMaria" }]
      .map((value) => ({ body: JSON.stringify(value), status: 400 })),
    { headers: { "content-type": "text/plain" }, status: 415 },
    { headers: { "content-length": "2049" }, status: 413 },
    { chunks: [Buffer.alloc(1024, " "), Buffer.alloc(1025, " ")], status: 413 },
    { method: "GET", url: "/api/student-voice?name=Ana", status: 405 },
    { method: "HEAD", status: 405 },
    { url: "/api/student-voice/status", status: 405 },
    { headers: { origin: "https://evil.test" }, status: 403 },
    { headers: { origin: "null" }, status: 403 },
    { headers: { "sec-fetch-site": "cross-site" }, status: 403 },
    { headers: { "sec-fetch-site": "same-site" }, status: 403 },
  ];
  for (const options of cases) {
    const result = await request(middleware, options);
    assert.equal(result.status, options.status, JSON.stringify(options));
    assert.equal(result.headers.get("cache-control"), "no-store");
  }
  assert.equal(calls, 0);
  assert.equal((await request(middleware, { url: "/api/other" })).nextCalled, true);
});

test("same-host HTTPS works behind an HTTP proxy without trusting forwarded host", async () => {
  const middleware = createStudentVoiceMiddleware({ ...paths, synthesize: async () => clips() });
  const result = await request(middleware, {
    body: JSON.stringify({ name: "Ș".repeat(120) }),
    headers: { origin: "https://classroom.test", "sec-fetch-site": "same-origin" },
  });
  assert.equal(result.status, 200);
  assert.equal((await request(middleware, { headers: { origin: "https://evil.test", "x-forwarded-host": "evil.test" } })).status, 403);
});

test("synthesis failures expose no names or paths, discard partial clips, and allow retry", async () => {
  let fail = true;
  const middleware = createStudentVoiceMiddleware({
    ...paths,
    synthesize: async () => {
      if (fail) throw new Error("Șerban failed at /private/model/path");
      return clips();
    },
  });
  const result = await request(middleware);
  assert.equal(result.status, 502);
  assert.deepEqual(Object.keys(result.json), ["error"]);
  assert.doesNotMatch(result.json.error, /Șerban|private|path/);
  fail = false;
  assert.equal((await request(middleware)).status, 200);
  const timeout = createStudentVoiceMiddleware({ ...paths, synthesize: async () => { throw new DOMException("details", "TimeoutError"); } });
  assert.equal((await request(timeout)).status, 504);
});

test("incomplete, malformed, wrong-format, wrong-voice and oversized pairs are rejected", async () => {
  for (const value of [
    { ...clips(), absent: undefined },
    { ...clips(), present: "not base64" },
    { ...clips(), present: Buffer.from("not a WAV").toString("base64") },
    { ...clips(), mimeType: "audio/mpeg" },
    { ...clips(), voiceId: "other-voice" },
    { ...clips(), present: Buffer.alloc(2 * 1024 * 1024 + 1).toString("base64") },
  ]) {
    const middleware = createStudentVoiceMiddleware({ ...paths, synthesize: async () => value });
    const result = await request(middleware);
    assert.equal(result.status, 502);
    assert.deepEqual(Object.keys(result.json), ["error"]);
  }
});

async function waitFor(condition) {
  for (let attempt = 0; attempt < 100 && !condition(); attempt++) await tick();
  assert.ok(condition(), "expected synthesis to start");
}

test("equivalent names share one process and completed clips are not cached server-side", async () => {
  const pending = [];
  const middleware = createStudentVoiceMiddleware({ ...paths, synthesize: () => new Promise((resolve) => pending.push(resolve)) });
  const first = request(middleware, { body: JSON.stringify({ name: "  Șerban  " }) });
  const second = request(middleware, { body: JSON.stringify({ name: "S\u0326erban" }) });
  await waitFor(() => pending.length === 1);
  await tick();
  assert.equal(pending.length, 1);
  pending[0](clips());
  assert.deepEqual((await first).json, (await second).json);
  const later = request(middleware);
  await waitFor(() => pending.length === 2);
  pending[1](clips());
  assert.equal((await later).status, 200);
});

test("only two distinct local generations run and failed processes release their slot", async () => {
  const pending = [];
  const middleware = createStudentVoiceMiddleware({ ...paths, synthesize: () => new Promise((resolve, reject) => pending.push({ resolve, reject })) });
  const active = ["Ana", "Rareș"].map((name) => request(middleware, { body: JSON.stringify({ name }) }));
  await waitFor(() => pending.length === 2);
  const busy = await request(middleware, { body: JSON.stringify({ name: "Ilinca" }) });
  assert.equal(busy.status, 429);
  assert.equal(busy.headers.get("retry-after"), "5");
  assert.equal(pending.length, 2);
  pending[0].reject(new Error("Local process failed"));
  pending[1].resolve(clips());
  assert.deepEqual((await Promise.all(active)).map(({ status }) => status), [502, 200]);
  const retry = request(middleware);
  await waitFor(() => pending.length === 3);
  pending[2].resolve(clips());
  assert.equal((await retry).status, 200);
});

test("the local subprocess receives the name through JSON stdin, without a shell", async () => {
  const executable = resolve(directory, "fake-python");
  const name = "Ana $(printf injected) `echo name` ' & 李";
  const resultClips = clips(name);
  await writeFile(executable, `#!${process.execPath}\nlet body = ''; process.stdin.on('data', chunk => body += chunk); process.stdin.on('end', () => { if (JSON.parse(body).name !== ${JSON.stringify(name)} || !process.argv[2].endsWith('piper_voice.py') || process.argv[3] !== ${JSON.stringify(paths.modelPath)}) process.exit(2); process.stdout.write(${JSON.stringify(JSON.stringify(resultClips))}); });\n`);
  await chmod(executable, 0o700);
  const middleware = createStudentVoiceMiddleware({ ...paths, pythonPath: executable });
  const result = await request(middleware, { body: JSON.stringify({ name }) });
  assert.equal(result.status, 200);
  assert.deepEqual(result.json, resultClips);
});

test("Python helper tests preserve final phones, reject unsafe cuts, and cover fallback", async (t) => {
  const localPython = fileURLToPath(new URL(
    process.platform === "win32" ? "../.venv/Scripts/python.exe" : "../.venv/bin/python",
    import.meta.url,
  ));
  const python = [localPython, "python3"].find((candidate) =>
    spawnSync(candidate, ["-c", "import numpy"], { encoding: "utf8" }).status === 0,
  );
  if (!python) return t.skip("Run npm run voice:setup to enable the Python helper tests");
  const result = spawnSync(python, [fileURLToPath(new URL("./test_piper_voice.py", import.meta.url))], {
    encoding: "utf8", env: { ...process.env, ORT_DISABLE_TELEMETRY: "0" },
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, /Ran 7 tests/);
  const source = await readFile(new URL("./studentVoice.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(source, /\bfetch\s*\(|https:\/\/api\./);
});
