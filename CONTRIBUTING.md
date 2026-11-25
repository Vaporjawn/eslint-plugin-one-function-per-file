# Contributing

Thanks for helping. The project lints itself with its own preset, so the code follows the rules it
ships: one function per file, `const` arrow functions, TSDoc on every named function.

## Setup

```sh
npm install
npm run check   # typecheck, lint, format check, tests, build, package checks
```

Node.js `^20.19.0 || ^22.13.0 || >=24` runs the package; developing it needs Node 22.12 or newer (Vitest).

## Workflow

- `npm test` runs the Vitest suite (rule cases with ESLint's `RuleTester`, preset cases with the real
  `ESLint` class).
- `npm run lint` builds first, because the repo lints itself with `dist/`.
- `npm run verify:package` runs `publint`, `are-the-types-wrong` and a smoke test of the built package.

## Changing the rule or presets

1. Add a failing test first, in `tests/rules/` or `tests/configs/`.
2. A new case in the rule needs a matching entry in `docs/rules/one-function-per-file.md`.
3. Prove the test can fail: change the production line it covers and confirm the suite goes red.
4. Add a line to `CHANGELOG.md` under an `Unreleased` heading.

## Releasing (maintainer)

1. Move the `Unreleased` notes under a new version heading and bump `version` in `package.json`.
2. `npm run check` (also runs on `npm publish` through `prepublishOnly`).
3. `npm publish`, then tag `vX.Y.Z` and push the tag.
