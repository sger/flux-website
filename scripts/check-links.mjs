import { readFile, access } from "node:fs/promises";
import assert from "node:assert/strict";
const html = await readFile("dist/index.html", "utf8");
const origin = "https://sger.github.io";
const base = "/flux-website/";
const canonical = origin + base;
const ids = new Set(
  [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
);
const links = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(
  (match) => match[1],
);
assert(
  html.includes(`rel="canonical" href="${canonical}"`),
  "Incorrect canonical URL",
);
assert(!/<script\b/.test(html), "Landing page should ship no JavaScript");
for (const value of links) {
  const url = new URL(value, canonical);
  if (url.origin !== origin) continue;
  assert(url.pathname.startsWith(base), `Missing base path: ${value}`);
  if (url.hash)
    assert(
      ids.has(decodeURIComponent(url.hash.slice(1))),
      `Missing anchor: ${value}`,
    );
  const relative = url.pathname.slice(base.length);
  await access(`dist/${relative || "index.html"}`);
}
console.log(
  `Verified ${links.length} links/assets, fragment targets, canonical URL, base path, and zero browser scripts.`,
);
