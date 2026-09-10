import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

import { createStudentVoiceMiddleware } from "./studentVoice.mjs";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const inheritedEnvironment = { ...process.env };
try {
  process.loadEnvFile(resolve(projectRoot, ".env.local"));
} catch (error) {
  if (error.code !== "ENOENT") {
    console.error("Unable to read .env.local. Check its format and permissions.");
    process.exit(1);
  }
} finally {
  Object.assign(process.env, inheritedEnvironment);
}

let distRoot;
try {
  distRoot = await realpath(resolve(projectRoot, "dist"));
  if (!(await stat(resolve(distRoot, "index.html"))).isFile()) throw new Error();
} catch {
  console.error("Production build unavailable. Run npm run build before starting the server.");
  process.exit(1);
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function respond(req, res, status, message) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(req.method === "HEAD" ? undefined : message);
}

async function findFile(candidate) {
  const filename = await realpath(candidate);
  const location = relative(distRoot, filename);
  if (location.startsWith("..") || isAbsolute(location)) return null;
  const info = await stat(filename);
  return info.isFile() ? { filename, size: info.size } : null;
}

async function serveStatic(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return respond(req, res, 405, "Method not allowed.");
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (pathname.includes("\0") || pathname.includes("\\")) throw new Error();
  } catch {
    return respond(req, res, 400, "Invalid request path.");
  }
  if (pathname === "/api" || pathname.startsWith("/api/")) {
    return respond(req, res, 404, "API route not found.");
  }
  if (pathname.split("/").some((segment) => segment.startsWith("."))) {
    return respond(req, res, 404, "Not found.");
  }
  let file;
  try {
    file = await findFile(resolve(distRoot, `.${pathname}`));
  } catch (error) {
    if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error;
  }
  if (!file && !extname(pathname)) file = await findFile(resolve(distRoot, "index.html"));
  if (!file) return respond(req, res, 404, "Not found.");
  res.writeHead(200, {
    "Content-Type": mimeTypes[extname(file.filename).toLowerCase()] || "application/octet-stream",
    "Content-Length": file.size,
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": extname(file.filename) === ".html" ? "no-cache" : "public, max-age=3600",
  });
  if (req.method === "HEAD") return res.end();
  await pipeline(createReadStream(file.filename), res);
}

const voice = createStudentVoiceMiddleware();
const server = createServer((req, res) => {
  const onError = () => {
    if (res.headersSent) res.destroy();
    else respond(req, res, 500, "Unable to complete the request.");
  };
  Promise.resolve(voice(req, res, () => serveStatic(req, res).catch(onError))).catch(onError);
});
server.requestTimeout = 90_000;
server.on("error", (error) => {
  console.error(`Unable to start server (${error.code || "server error"}).`);
  process.exit(1);
});
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  console.error("PORT must be a number from 0 to 65535.");
  process.exit(1);
}
server.listen(port, host, () => {
  console.log(`Buburuzele is available at http://${host}:${server.address().port}`);
});
