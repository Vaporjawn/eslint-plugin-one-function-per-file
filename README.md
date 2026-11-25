# eslint-plugin-one-function-per-file

[![npm](https://img.shields.io/npm/v/eslint-plugin-one-function-per-file.svg)](https://www.npmjs.com/package/eslint-plugin-one-function-per-file)
[![CI](https://github.com/Vaporjawn/eslint-plugin-one-function-per-file/actions/workflows/ci.yml/badge.svg)](https://github.com/Vaporjawn/eslint-plugin-one-function-per-file/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/eslint-plugin-one-function-per-file.svg)](LICENSE)

An ESLint flat-config plugin and preset for a strict, easy-to-navigate code style:

1. **One function per file.** A module defines at most one function at module level.
2. **`const` arrow functions only.** `const name = () => {}`, never `function name() {}`.
3. **A TSDoc comment on every named function**, with a description, no `{types}` in the comment.

Small single-purpose files are easier to find, review, test and delete. The preset makes that a rule
the linter enforces, instead of a habit people forget.

> Requires ESLint 9 or 10 (flat config) and Node.js `^20.19.0 || ^22.13.0 || >=24`.

## Install

```sh
npm install --save-dev eslint eslint-plugin-one-function-per-file
```

`eslint-plugin-jsdoc` and `eslint-plugin-tsdoc` come with it, so there is nothing else to install.

## Usage

### JavaScript

```js
// eslint.config.js
import oneFunctionPerFile from "eslint-plugin-one-function-per-file";

export default [oneFunctionPerFile.configs.recommended];
```

### TypeScript

The preset does not choose a parser. Add yours as usual:

```js
// eslint.config.js
import tseslint from "typescript-eslint";
import oneFunctionPerFile from "eslint-plugin-one-function-per-file";

export default tseslint.config(
  ...tseslint.configs.recommended,
  oneFunctionPerFile.configs.recommended,
);
```

### CommonJS config

The package is ESM-only. A CommonJS `eslint.config.cjs` can still load it on the supported Node
versions, through `require()` of an ES module. Read the plugin from `.default`:

```js
// eslint.config.cjs
const oneFunctionPerFile = require("eslint-plugin-one-function-per-file").default;

module.exports = [oneFunctionPerFile.configs.recommended];
```

### Only some folders

Both presets are plain config objects, so scope them with `files`:

```js
export default [{ ...oneFunctionPerFile.configs.recommended, files: ["src/**/*.ts"] }];
```

### Just the rule

If you only want the file-structure rule and none of the other plugins:

```js
import oneFunctionPerFile from "eslint-plugin-one-function-per-file";

export default [oneFunctionPerFile.configs.minimal];
// or, by hand:
// { plugins: { "one-function-per-file": oneFunctionPerFile },
//   rules: { "one-function-per-file/one-function-per-file": "error" } }
```

## Presets

| Preset        | What it enforces                                                               |
| ------------- | ------------------------------------------------------------------------------ |
| `recommended` | One function per file, `const` arrow functions, TSDoc on every named function. |
| `minimal`     | Only `one-function-per-file/one-function-per-file`.                            |

Both apply to `**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}` and skip `**/*.d.ts`.

### What `recommended` turns on

| Rule                                          | Setting                                           | Why                                                   |
| --------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| `one-function-per-file/one-function-per-file` | `error`                                           | One function per file.                                |
| `func-style`                                  | `["error", "expression"]`                         | No `function name() {}` declarations.                 |
| `prefer-arrow-callback`                       | `error`                                           | Callbacks are arrows too.                             |
| `no-restricted-syntax`                        | `const f = function () {}` selector               | Function expressions bound to a name are not allowed. |
| `jsdoc/require-jsdoc`                         | declarations, `const` functions, methods, classes | Every named function is documented.                   |
| `jsdoc/require-description`                   | `error`                                           | The comment must say what the function does.          |
| `jsdoc/no-types`                              | `error`                                           | TSDoc reads types from the signature.                 |
| `jsdoc/check-tag-names`                       | `error`, TSDoc tags allowed                       | Typos in tags are caught; `@remarks` etc. are fine.   |
| `jsdoc/check-param-names`                     | `error`                                           | `@param` names match the signature.                   |
| `tsdoc/syntax`                                | `error`                                           | Comments are valid TSDoc.                             |

Override any of them after the preset, as with any ESLint config:

```js
export default [
  oneFunctionPerFile.configs.recommended,
  { rules: { "jsdoc/require-description": "off" } },
];
```

## The rule: `one-function-per-file`

See [docs/rules/one-function-per-file.md](docs/rules/one-function-per-file.md) for every case.

```ts
// Reported: the second function.
export const double = (n: number) => n * 2;
export const triple = (n: number) => n * 3; // 'triple' is a second function in this file (first: 'double').
```

**Counted:** function declarations; `const` / `let` / `var` bindings initialised with an arrow or
function expression (also through `as`, `satisfies`, `!`); default exports of an arrow or function.

**Not counted:** functions nested inside the one function, class and object methods, test callbacks
passed to `describe` / `it`, calls such as `memo(() => ...)`, types, interfaces, constants, and
`declare`d functions or overload signatures.

## FAQ

**My React component file has a component and a helper.** Move the helper to its own file. That is the
point of the rule. If you would rather not apply it to a folder, scope the preset with `files`.

**Does it apply to test files?** Yes by default. Callbacks inside `describe` / `it` are not
module-level functions, so ordinary tests pass. Scope it away from `tests/` with `files` or `ignores`
if you write many helpers there.

**Can I use `function` declarations if I turn off the other rules?** Yes. Use the `minimal` preset or
turn off `func-style` and `no-restricted-syntax`; the file rule counts declarations too.

**Why not `max-classes-per-file` or `max-lines-per-function`?** They count something else.
`max-classes-per-file` only counts classes, and `max-lines-per-function` measures one function's length.

## Known advisory

`npm audit` reports a moderate `minimatch` denial-of-service advisory
([GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)) through
`eslint-plugin-tsdoc`, which pins an older `@typescript-eslint/utils`. It is a lint-time dependency
that only matches glob patterns from your own config, and `0.5.4` is the latest release of that plugin.
This package will pick up a fixed release as soon as one exists.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Changes are listed in [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE) © Victor Williams
