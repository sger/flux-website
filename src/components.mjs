// HTML building blocks. Each returns a string; `highlight` is injected by the build.

export const escape = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const width = "mx-auto w-[min(760px,calc(100%-32px))] sm:w-[min(760px,calc(100%-48px))]";

export function layout({ base, canonical, body }) {
  const home = `${base}/`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Flux is an experimental pure functional language with type inference and algebraic effects. Syntax examples, compiler pipeline, and installation." />
    <meta name="theme-color" content="#f6f3ec" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#141516" media="(prefers-color-scheme: dark)" />
    <link rel="icon" type="image/svg+xml" href="${base}/favicon.svg" />
    <link rel="stylesheet" href="${base}/styles.css" />
    <link rel="canonical" href="${canonical}" />
    <title>Flux programming language</title>
  </head>
  <body class="bg-paper font-sans text-ink antialiased">
    <a class="fixed -top-24 left-3 z-10 bg-ink p-3 text-paper focus:top-3" href="#main">Skip to content</a>
    <header class="${width} flex flex-wrap items-center justify-between gap-4 py-5 sm:py-7">
      <a class="inline-flex items-center gap-2.5 text-[26px] font-[550] tracking-[-1.4px] no-underline hover:text-accent" href="${home}" aria-label="Flux home">
        <span class="relative mr-1 text-[34px] leading-none font-normal" aria-hidden="true">λ<span class="absolute -top-1 -right-2 text-xl text-orange">•</span></span>
        flux
      </a>
      <nav class="flex flex-wrap gap-4 text-[13px] font-medium text-muted sm:gap-6 sm:text-sm [&_a]:no-underline [&_a:hover]:text-accent" aria-label="Main navigation">
        <a href="#syntax">Syntax</a>
        <a href="#pipeline">Compiler</a>
        <a href="#get-started">Install</a>
        <a href="#docs">Docs</a>
        <a href="https://github.com/sger/flux">GitHub <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
    <main id="main" class="${width}">
${body}
    </main>
    <footer class="${width} mt-18 flex flex-wrap items-center gap-5 border-t border-line pt-7 pb-12 sm:gap-8">
      <a class="inline-flex items-center gap-1.5 text-[22px] font-[550] tracking-[-1.4px] no-underline" href="${home}">
        flux<span class="inline-block size-[7px] rounded-full bg-orange" aria-hidden="true"></span>
      </a>
      <div class="flex flex-wrap gap-5 text-[13px] text-muted sm:ml-auto sm:gap-6 [&_a:hover]:text-accent">
        <a href="https://github.com/sger/flux">Repository ↗</a>
        <a href="https://github.com/sger/flux/blob/main/LICENSE">MIT license ↗</a>
      </div>
    </footer>
  </body>
</html>
`;
}

export function section({ id, title }, content) {
  return `<section id="${id}" class="scroll-mt-4 pt-11 sm:pt-14" aria-labelledby="${id}-title">
  <h2 id="${id}-title" class="mb-8 border-b border-line pb-3 text-[13px] font-semibold tracking-widest text-muted uppercase">${escape(title)}</h2>
  <div class="min-w-0">
${content}
  </div>
</section>`;
}

export function codeBlock(highlight, { code, label, lang = "flux", flush = false }) {
  const corners = flush ? "rounded-t-md" : "rounded-md";
  return `<div class="overflow-hidden ${corners} bg-code text-code-ink">
  <div class="border-b border-code-line px-4 py-3 font-mono text-xs text-[#b5b6b2] sm:px-5">${escape(label)}</div>
  <div class="code-scroll max-w-full overflow-x-auto p-4 sm:p-5" tabindex="0" role="region" aria-label="${escape(label)}">${highlight(code, lang)}</div>
</div>`;
}

const stripParityHeader = (code) =>
  code
    .replace(/^\/\/ parity-expected-stdout-begin[\s\S]*?\/\/ parity-expected-stdout-end\s*/, "")
    .trimEnd();

export function example(highlight, { id, title, code, output, source, error = false }, note) {
  const marker = error
    ? `<div class="mb-2 font-mono text-[11px] tracking-wider text-accent uppercase">Does not compile</div>`
    : `<span class="font-mono text-accent" aria-hidden="true">→ </span>`;
  return `<article class="min-w-0 scroll-mt-4 [&+&]:mt-14" id="${id}" aria-labelledby="${id}-title">
  <h3 id="${id}-title" class="mb-1.5 text-lg font-[550] tracking-tight">${escape(title)}</h3>
  <div class="note mb-[18px]">${note}</div>
  ${codeBlock(highlight, { code: stripParityHeader(code), label: `${id}.flx`, flush: true })}
  <div class="overflow-x-auto rounded-b-md border border-t-0 border-line bg-output px-4 py-3 sm:px-5" aria-label="${error ? "Compiler output" : "Output"}">
    ${marker}<samp class="inline-block align-top font-mono text-[13px] whitespace-pre">${escape(output)}</samp>
  </div>
  <a class="mt-2.5 inline-block text-xs text-muted hover:text-accent" href="${source}">Source ↗</a>
</article>`;
}
