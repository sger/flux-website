// Static build: highlight snippets with Shiki, render src/page.mjs, compile Tailwind.
import { execFileSync } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { createHighlighter } from "shiki";
import { layout } from "../src/components.mjs";
import { page } from "../src/page.mjs";

const base = "/flux-website";
const canonical = `https://sger.github.io${base}/`;
const out = "dist";

const grammar = JSON.parse(await readFile("src/data/flux.tmLanguage.json", "utf8"));
const theme = {
  name: "flux-paper",
  type: "dark",
  colors: { "editor.background": "#17191b", "editor.foreground": "#eeeae2" },
  tokenColors: [
    { scope: ["comment"], settings: { foreground: "#a7aaa8" } },
    { scope: ["keyword", "storage"], settings: { foreground: "#ff9d70" } },
    { scope: ["string"], settings: { foreground: "#e3d1b1" } },
    {
      scope: ["constant", "entity.name.type", "support.type"],
      settings: { foreground: "#ffc6a5" },
    },
    { scope: ["entity.name.function"], settings: { foreground: "#ffffff" } },
  ],
};
const highlighter = await createHighlighter({
  themes: [theme],
  langs: [{ ...grammar, name: "flux" }, "bash"],
});
const langs = { flux: "flux", sh: "bash", text: "text" };
const highlight = (code, lang) =>
  highlighter.codeToHtml(code, { lang: langs[lang], theme: "flux-paper", tabindex: false });
const snippet = (file) => readFileSync(`src/data/${file}`, "utf8");

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp("public", out, { recursive: true });
await writeFile(
  `${out}/index.html`,
  layout({ base, canonical, body: page({ highlight, snippet }) }),
);
execFileSync(
  "node_modules/.bin/tailwindcss",
  ["-i", "src/styles/global.css", "-o", `${out}/styles.css`, "--minify"],
  { stdio: ["ignore", "ignore", "inherit"] },
);
console.log(`Built ${out}/index.html and ${out}/styles.css`);
