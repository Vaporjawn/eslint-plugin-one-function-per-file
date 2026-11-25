import { RuleTester } from "eslint";
import tseslint from "typescript-eslint";
import { oneFunctionPerFile } from "../../src/rules/oneFunctionPerFile/index.js";

/**
 * Builds the expected error for a function that is not the first in its file.
 *
 * @param name - The offending function's binding name.
 * @param first - The name of the first function in the file.
 * @returns A RuleTester error expectation.
 */
const tooMany = (name: string, first: string) => ({
  messageId: "tooMany" as const,
  data: { name, first },
});

new RuleTester({ languageOptions: { ecmaVersion: 2023, sourceType: "module" } }).run(
  "one-function-per-file (JavaScript)",
  oneFunctionPerFile,
  {
    valid: [
      { name: "empty file", code: "" },
      { name: "one function declaration", code: "function a() {}" },
      { name: "one const arrow", code: "export const a = () => {};" },
      { name: "one default-exported function", code: "export default function () {}" },
      { name: "one default-exported arrow", code: "export default () => 1;" },
      {
        name: "constants, objects and classes are not functions",
        code: "export const A = 1; export const B = { run() {}, go: () => 1 }; export class C { m() {} }",
      },
      {
        name: "callbacks and closures nested in the one function are not counted",
        code: "export const a = () => { const inner = () => 1; return [1].map((n) => inner() + n); };",
      },
      {
        name: "test callbacks are not module-level functions",
        code: "describe('x', () => { it('y', () => { const helper = () => 1; helper(); }); });",
      },
      {
        name: "calls that wrap a function (memo, useCallback) are not counted",
        code: "const A = memo(() => 1); const B = memo(() => 2);",
      },
      { name: "re-exports are not definitions", code: "export { a, b } from './x.js';" },
      { name: "an immediately invoked function is not a definition", code: "(() => {})();" },
    ],
    invalid: [
      {
        name: "two function declarations",
        code: "function a() {} function b() {}",
        errors: [tooMany("b", "a")],
      },
      {
        name: "arrow after declaration",
        code: "function a() {} const b = () => {};",
        errors: [tooMany("b", "a")],
      },
      {
        name: "two exported const arrows",
        code: "export const a = () => 1; export const b = () => 2;",
        errors: [tooMany("b", "a")],
      },
      {
        name: "function expression binding counts",
        code: "const a = function () {}; const b = function () {};",
        errors: [tooMany("b", "a")],
      },
      {
        name: "two declarators in one statement",
        code: "const a = () => 1, b = () => 2;",
        errors: [tooMany("b", "a")],
      },
      {
        name: "let and var bindings count",
        code: "let a = () => 1; var b = () => 2;",
        errors: [tooMany("b", "a")],
      },
      {
        name: "a default-exported arrow is a function too",
        code: "const a = () => 1; export default () => 2;",
        errors: [tooMany("default export", "a")],
      },
      {
        name: "an unnamed default export can be the first",
        code: "export default function () {} export const b = () => 1;",
        errors: [tooMany("b", "default export")],
      },
      {
        name: "every extra function is reported",
        code: "const a = () => 1; const b = () => 2; const c = () => 3;",
        errors: [tooMany("b", "a"), tooMany("c", "a")],
      },
    ],
  },
);

new RuleTester({
  languageOptions: { parser: tseslint.parser, ecmaVersion: 2023, sourceType: "module" },
}).run("one-function-per-file (TypeScript)", oneFunctionPerFile, {
  valid: [
    {
      name: "overload signatures plus one implementation are one function",
      code: "function f(a: string): void; function f(a: number): void; function f(a: unknown) { void a; }",
    },
    {
      name: "declared functions only describe a shape",
      code: "export declare function a(): void; export declare function b(): void;",
    },
    {
      name: "types and interfaces are not functions",
      code: "export type F = () => void; export interface G { m(): void }",
    },
    { name: "one typed const arrow", code: "export const a: () => void = () => {};" },
  ],
  invalid: [
    {
      name: "an `as` cast does not hide a function",
      code: "const a = () => 1; const b = (() => 2) as () => number;",
      errors: [tooMany("b", "a")],
    },
    {
      name: "a `satisfies` clause does not hide a function",
      code: "const a = () => 1; const b = (() => 2) satisfies () => number;",
      errors: [tooMany("b", "a")],
    },
    {
      name: "a non-null assertion does not hide a function",
      code: "const a = () => 1; const b = (() => 2)!;",
      errors: [tooMany("b", "a")],
    },
    {
      name: "a cast default export counts",
      code: "const a = () => 1; export default (() => 2) as () => number;",
      errors: [tooMany("default export", "a")],
    },
    {
      name: "two typed arrows",
      code: "export const a = (x: number): number => x; export const b = (x: string): string => x;",
      errors: [tooMany("b", "a")],
    },
  ],
});
