# Upstream assets

These files come from https://github.com/sger/flux at commit
`6d499c6706b48aa3cd306ad84057b6360b882058`:

| File | Upstream source | Changes |
| --- | --- | --- |
| `shapes.flx` | `README.md` intro example | Trailing output comment removed |
| `factorial.flx` | `examples/guide/factorial.flx` | None (parity header hidden on the page) |
| `purity.flx` | `examples/compiler_errors/missing_effect_io.flx` | Rewritten around `greet(name: String) -> Unit`; expected to fail with E400 |
| `guards.flx` | `examples/patterns/match_guards.flx` | First `match` wrapped in `grade`; other cases dropped |
| `pipes.flx` | `examples/guide/pipe_operator.flx` | Reduced to the chained pipe; helpers written as lambdas |
| `records.flx` | `examples/guide/records.flx` | Comments and one `print` removed |
| `effects.flx` | `README.md` algebraic-effects block | None |
| `classes.flx` | `examples/type_classes/derived_show.flx` | Comments and one `print` removed |
| `async.flx` | `examples/guide_async/04_both_concurrent_pair.flx` | Comments removed |
| `flux.tmLanguage.json` | `editors/vscode/syntaxes/flux.tmLanguage.json` | None |
| `LICENSE.flux` | `LICENSE` | None |

Every `.flx` file was run with the Flux VM (`flux <file>`); `purity.flx` is
expected to fail to compile. The output shown
on the page is the compiler output, verbatim. Re-run them after changing a snippet.
The grammar runs only at build time. Documentation stays upstream.
