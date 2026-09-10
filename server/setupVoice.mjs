import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { access, mkdir, readFile, rename, rm } from "node:fs/promises";
import { join } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const manifest = JSON.parse(
  await readFile(new URL("./raluca-model.json", import.meta.url), "utf8"),
);
const modelDirectory = join(root, "models", "raluca");
const python = join(
  root,
  ".venv",
  process.platform === "win32" ? "Scripts/python.exe" : "bin/python",
);

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      shell: false,
      env: { ...process.env, ORT_DISABLE_TELEMETRY: "1" },
    });
    child.once("error", reject);
    child.once("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${command} exited with ${code}.`)),
    );
  });
}

async function sha256(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex");
}

async function installModelFile(file) {
  const target = join(modelDirectory, file.name);
  if ((await sha256(target).catch(() => null)) === file.sha256) {
    console.log(`${file.name} is already verified.`);
    return;
  }
  const temporary = `${target}.${process.pid}.part`;
  try {
    console.log(`Downloading ${file.name}…`);
    const response = await fetch(
      `${manifest.source}/resolve/${manifest.revision}/voices/raluca/${file.name}`,
      {
        signal: AbortSignal.timeout(600_000),
      },
    );
    if (!response.ok || !response.body)
      throw new Error(`Model download failed (${response.status}).`);
    await pipeline(
      Readable.fromWeb(response.body),
      createWriteStream(temporary, { flags: "wx" }),
    );
    if ((await sha256(temporary)) !== file.sha256)
      throw new Error(`Checksum mismatch for ${file.name}.`);
    await rename(temporary, target);
    console.log(`Verified ${file.name}.`);
  } finally {
    await rm(temporary, { force: true });
  }
}

try {
  if (
    !(await access(python).then(
      () => true,
      () => false,
    ))
  ) {
    console.log(
      "Creating the project's Python environment (Python 3.9+ required)…",
    );
    await run(process.platform === "win32" ? "python" : "python3", [
      "-m",
      "venv",
      join(root, ".venv"),
    ]);
  }
  await run(python, [
    "-m",
    "pip",
    "install",
    "--no-cache-dir",
    "--disable-pip-version-check",
    "-r",
    "server/requirements-voice.txt",
  ]);
  await mkdir(modelDirectory, { recursive: true });
  for (const file of manifest.files) await installModelFile(file);
  await run(python, [
    "-c",
    "import onnx; from piper import PiperVoice; print('Piper and phoneme timing support are installed.')",
  ]);
  console.log(
    "Raluca High is ready. Run npm start; voice preparation works offline after this setup.",
  );
} catch (error) {
  console.error(`Voice setup failed: ${error.message}`);
  process.exitCode = 1;
}
