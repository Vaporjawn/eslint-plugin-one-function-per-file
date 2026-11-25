# one-function-per-file

Allow at most one module-level function per file.

Each function gets its own file, so a file name tells you what is inside, a diff touches one thing,
and a test file maps to one source file.

## Rule details

The rule counts the functions a file defines at module level and reports every one after the first.

Examples of **incorrect** code:

```ts
function a() {}
function b() {} // 'b' is a second function in this file (first: 'a').
```

```ts
export const double = (n: number) => n * 2;
export const triple = (n: number) => n * 3;
```

```ts
const a = () => 1,
  b = () => 2; // two declarators count as two functions
```

```ts
const a = () => 1;
export default () => 2; // a default-exported arrow is a function too
```

```ts
const a = () => 1;
const b = (() => 2) as () => number; // `as`, `satisfies` and `!` do not hide a function
```

Examples of **correct** code:

```ts
export const double = (n: number) => n * 2;
```

```ts
export const total = (items: number[]) => {
  const add = (sum: number, n: number) => sum + n; // nested helper: not counted
  return items.reduce(add, 0);
};
```

```ts
export const A = 1; // constants, types and classes are not functions
export type F = () => void;
export class Box {
  open() {} // methods are not counted
}
```

```ts
describe("x", () => {
  it("y", () => {}); // test callbacks are not module-level functions
});
```

```ts
function parse(a: string): number; // overload signatures plus one implementation: one function
function parse(a: number): number;
function parse(a: string | number) {
  return Number(a);
}
```

## What is counted

| Counted                                                       | Not counted                                           |
| ------------------------------------------------------------- | ----------------------------------------------------- |
| `function name() {}` (exported or not)                        | Functions nested inside a function                    |
| `const` / `let` / `var` = arrow or function expression        | Class methods, object-literal methods                 |
| Several declarators in one statement, one count each          | Calls that wrap a function, e.g. `memo(() => ...)`    |
| `export default () => {}` and `export default function () {}` | `export { a }`, `export * from`, imports              |
| The same through `as T`, `satisfies T`, `<T>x`, `x!`          | Types, interfaces, enums, constants                   |
|                                                               | `declare function`, overload signatures               |
|                                                               | Immediately invoked functions, `module.exports = ...` |

The first function in the file is the one that is allowed. Every later one is reported, so three
functions give two errors, which tells you how many to move.

## Options

None.

## When not to use it

Leave it off for folders where several small functions naturally belong together, such as a file of
sort comparators or a generated file. Scope the config with `files` / `ignores`, or turn the rule off
for that block.

## Related rules

- [`max-classes-per-file`](https://eslint.org/docs/latest/rules/max-classes-per-file): the same idea for classes.
- [`func-style`](https://eslint.org/docs/latest/rules/func-style): forces arrow or declaration style. The `recommended` preset uses it.
