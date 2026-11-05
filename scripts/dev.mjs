// Local preview: rebuild on changes under src/ and public/, serve dist/ at /flux-website/.
import { execFileSync } from "node:child_process";
import { watch } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const base = "/flux-website/";
const port = Number(process.env.PORT ?? 4321);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
};

function build() {
  try {
    execFileSync("node", ["scripts/build.mjs"], { stdio: "inherit" });
  } catch {
    console.error("Build failed; waiting for changes.");
  }
}

build();
let timer;
for (const dir of ["src", "public"]) {
  watch(dir, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(build, 100);
  });
}

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (path === "/") {
    res.writeHead(302, { location: base }).end();
    return;
  }
  if (!path.startsWith(base)) {
    res.writeHead(404).end("Not found");
    return;
  }
  let file = normalize(join("dist", path.slice(base.length)));
  if (!file.startsWith("dist")) {
    res.writeHead(403).end();
    return;
  }
  if (path.endsWith("/")) file = join(file, "index.html");
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(port, () => console.log(`Serving http://localhost:${port}${base}`));
