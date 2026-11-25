# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project follows
[Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-11-24

### Added

- `one-function-per-file` rule: at most one module-level function per file. It counts function
  declarations, `const` / `let` / `var` bindings initialised with an arrow or function expression
  (also through `as`, `satisfies`, `<T>x` and `!`), and default exports of an arrow or function.
- `recommended` flat config: the rule plus `const`-arrow-only style (`func-style`,
  `prefer-arrow-callback`, a `no-restricted-syntax` selector) and required TSDoc comments
  (`jsdoc/*` and `tsdoc/syntax`), with TSDoc tags such as `@remarks` and `@typeParam` accepted.
- `minimal` flat config: only the rule.
- Type declarations and an ESM-only build. CommonJS configs can load it with `require()` on the
  supported Node versions and read the plugin from `.default`.

[0.1.0]: https://github.com/Vaporjawn/eslint-plugin-one-function-per-file/releases/tag/v0.1.0
