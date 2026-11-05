import { codeBlock, escape, example, section } from "./components.mjs";

const repo = "https://github.com/sger/flux";
const revision = "6d499c6706b48aa3cd306ad84057b6360b882058";
const src = (path) => `${repo}/blob/${revision}/${path}`;

const purityError = `error[E400]: Missing Ambient Effect

Call to \`print\` requires effect \`Console\` in this function signature.

  purity.flx:2:5
  |
2 |     print("Hello, " + name)
  |     ^^^^^^^^^^^^^^^^^^^^^^^
  |     ----------------------- effectful call occurs here

Hint:
  Add \`with Console\` to the enclosing function.`;

// `file` names a snippet in src/data/; outputs were checked by running each one.
const examples = [
  {
    id: "factorial",
    file: "factorial.flx",
    title: "Functions",
    output: '"Result: 120"',
    source: src("examples/guide/factorial.flx"),
    note: "Parameter and return types are inferred. The recursive call is in tail position.",
  },
  {
    id: "purity",
    file: "purity.flx",
    title: "Purity",
    output: purityError,
    error: true,
    source: src("examples/compiler_errors/missing_effect_io.flx"),
    note: `Functions are pure unless their signature lists effects. <code>greet</code> declares <code>-&gt; Unit</code> but calls <code>print</code>, so it is rejected. Writing <code>-&gt; Unit with Console</code> makes it compile. Without a signature, the effect is inferred.`,
  },
  {
    id: "guards",
    file: "guards.flx",
    title: "Pattern guards",
    output: '"B"\n"N/A"',
    source: src("examples/patterns/match_guards.flx"),
    note: "Arms can destructure constructors such as <code>Some</code> and add an <code>if</code> condition. Matches are checked for exhaustiveness.",
  },
  {
    id: "pipes",
    file: "pipes.flx",
    title: "Pipes and lambdas",
    output: "42",
    source: src("examples/guide/pipe_operator.flx"),
    note: "<code>|&gt;</code> passes the left value as the first argument. <code>\\x -&gt; …</code> is a lambda.",
  },
  {
    id: "records",
    file: "records.flx",
    title: "Records",
    output: '"Alice"\n"Bob"\n31',
    source: src("examples/guide/records.flx"),
    note: "Named fields with dot access. Spread builds a new value with some fields changed; <code>alice</code> is not modified.",
  },
  {
    id: "effects",
    file: "effects.flx",
    title: "Algebraic effects",
    output: '"audit_value=8"',
    source: src("README.md#a-tour-of-the-language"),
    note: "A function lists the effects it performs after <code>with</code>. The handler decides what <code>resume</code> passes back; here, the length of the message.",
  },
  {
    id: "classes",
    file: "classes.flx",
    title: "Type classes",
    output: '"Red"\n"Green"',
    source: src("examples/type_classes/derived_show.flx"),
    note: "<code>deriving (Show)</code> generates an instance. <code>&lt;a: Show&gt;</code> constrains a type parameter.",
  },
  {
    id: "async",
    file: "async.flx",
    title: "Structured concurrency",
    output: '"left = 10"\n"right = 20"',
    source: src("examples/guide_async/04_both_concurrent_pair.flx"),
    note: "<code>both</code> runs two fibers and returns their results in source order, not finish order. <code>Async</code> is an effect like any other.",
  },
];

const pipeline = `Source → lexer, parser, module graph → AST
       → Hindley–Milner inference
       → Core IR
       → Aether (ownership / reuse)
       ├── CFG → bytecode → VM          (default)
       └── LIR → LLVM → native          (--native)`;

const commands = [
  ["flux <file>", "Compile and run on the VM"],
  ["flux run --native <file>", "Compile and run via LLVM"],
  ["flux --test <file>", "Run the test blocks in a file"],
  ["flux tokens <file>", "Dump the lexer token stream"],
  ["flux bytecode <file>", "Dump compiled VM bytecode"],
  ["flux fmt <file>", "Format source"],
  ["flux lint <file>", "Lint source"],
  ["flux parity-check <dir>", "Assert VM and LLVM output match"],
];

const docs = [
  ["Language guide", `${repo}/blob/main/docs/guide/01_getting_started.md`],
  ["Examples", `${repo}/tree/main/examples`],
  ["Architecture", `${repo}/blob/main/docs/internals/compiler_architecture.md`],
  ["Editor support (VS Code, LSP)", `${repo}/tree/main/editors/vscode`],
  ["Contributing", `${repo}/blob/main/.github/pull_request_template.md`],
];

export function page({ highlight, snippet }) {
  const intro = `<section class="pt-7 pb-4 sm:pt-12 sm:pb-6" aria-labelledby="intro-title">
  <h1 id="intro-title" class="mb-3.5 text-[34px] leading-tight font-medium tracking-[-0.04em] sm:text-[40px]">Flux</h1>
  <p class="max-w-[600px] text-base leading-relaxed text-muted sm:text-[17px]">A pure functional language with Hindley–Milner type inference, algebraic effects, and two backends — a bytecode VM and LLVM — sharing one frontend.</p>
  <p class="mt-3 mb-11 text-[13px] text-muted"><span class="text-accent">Experimental.</span> The language and APIs may change.</p>
  ${example(
    highlight,
    {
      id: "shapes",
      title: "Data types and matching",
      code: snippet("shapes.flx"),
      output: '"total area = 24.56636"',
      source: src("README.md"),
    },
    "No annotations on <code>area</code>: its type is inferred from the <code>match</code>. <code>main</code> declares <code>with IO</code> because it prints.",
  )}
</section>`;

  const syntax = section(
    { id: "syntax", title: "Syntax" },
    examples
      .map(({ file, note, ...props }) => example(highlight, { ...props, code: snippet(file) }, note))
      .join("\n"),
  );

  const compiler = section(
    { id: "pipeline", title: "Compiler" },
    `<p class="note mb-[18px]">One frontend lowers to a single Core IR, which feeds both backends. <code>parity-check</code> asserts that they produce identical output.</p>
${codeBlock(highlight, { lang: "text", label: "Pipeline", code: pipeline })}
<table class="mt-7 w-full border-collapse text-sm">
  <tbody>
${commands
  .map(
    ([cmd, what]) => `    <tr class="border-b border-line">
      <td class="w-[1%] py-2.5 pr-3.5 align-top sm:pr-8 sm:whitespace-nowrap"><code class="font-mono text-[13px]">${escape(cmd)}</code></td>
      <td class="py-2.5 align-top text-muted">${escape(what)}</td>
    </tr>`,
  )
  .join("\n")}
  </tbody>
</table>`,
  );

  const install = section(
    { id: "get-started", title: "Install" },
    `<p class="note mb-[18px] [&_a:hover]:text-accent">Requires Git and <a href="https://www.rust-lang.org/tools/install">Rust</a> 1.93.0 or newer (Edition 2024).</p>
${codeBlock(highlight, {
  lang: "sh",
  label: "Run on the VM",
  code: "git clone https://github.com/sger/flux.git\ncd flux\ncargo run -- examples/guide/factorial.flx",
})}
<p class="note mt-6 mb-3.5">To install the <code>flux</code> command:</p>
${codeBlock(highlight, {
  lang: "sh",
  label: "Install from source",
  code: "cargo install --path .\nflux examples/guide/fibonacci.flx",
})}
<details class="mt-7 border-y border-line py-[18px]">
  <summary class="cursor-pointer text-sm font-medium">LLVM backend</summary>
  <p class="note my-[18px]">Requires LLVM installed separately and the <code>llvm</code> Cargo feature. The VM is the default backend.</p>
  ${codeBlock(highlight, {
    lang: "sh",
    label: "Run with LLVM",
    code: "cargo run --features llvm -- --native examples/guide/factorial.flx",
  })}
</details>`,
  );

  const documentation = section(
    { id: "docs", title: "Documentation" },
    `<ul class="grid gap-3.5 text-[15px]">
${docs
  .map(
    ([title, href]) =>
      `  <li><a class="inline-flex gap-2.5 hover:text-accent" href="${href}">${escape(title)} <span aria-hidden="true">↗</span></a></li>`,
  )
  .join("\n")}
</ul>`,
  );

  return [intro, syntax, compiler, install, documentation].join("\n");
}
