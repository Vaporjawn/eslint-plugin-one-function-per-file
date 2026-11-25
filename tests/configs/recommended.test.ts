import { plugin } from "../../src/index.js";
import { lintRuleIds } from "./helpers.js";

const recommended = plugin.configs.recommended;

const CLEAN = `/**
 * Doubles a number.
 *
 * @param value - The number to double.
 * @returns Twice the input.
 */
export const double = (value: number): number => value * 2;
`;

describe("recommended preset", () => {
  it("accepts one documented const arrow function", async () => {
    expect(await lintRuleIds(CLEAN, recommended)).toEqual([]);
  });

  it("accepts a file with no functions at all", async () => {
    expect(
      await lintRuleIds("export const A = 1;\nexport type B = string;\n", recommended),
    ).toEqual([]);
  });

  it("rejects a second function in the same file", async () => {
    const code = `${CLEAN}
/**
 * Triples a number.
 *
 * @param value - The number to triple.
 * @returns Three times the input.
 */
export const triple = (value: number): number => value * 3;
`;
    expect(await lintRuleIds(code, recommended)).toEqual([
      "one-function-per-file/one-function-per-file",
    ]);
  });

  it("rejects a function declaration", async () => {
    const code = "/**\n * Does a thing.\n */\nexport function run(): void {}\n";
    expect(await lintRuleIds(code, recommended)).toContain("func-style");
  });

  it("rejects a function expression bound to a const", async () => {
    const code = "/**\n * Does a thing.\n */\nexport const run = function (): void {};\n";
    expect(await lintRuleIds(code, recommended)).toEqual(["no-restricted-syntax"]);
  });

  it("rejects a function with no TSDoc comment", async () => {
    expect(await lintRuleIds("export const run = (): void => {};\n", recommended)).toEqual([
      "jsdoc/require-jsdoc",
    ]);
  });

  it("rejects a default-exported arrow with no TSDoc comment", async () => {
    expect(await lintRuleIds("export default (): void => {};\n", recommended)).toEqual([
      "jsdoc/require-jsdoc",
    ]);
  });

  it("rejects a TSDoc comment that has no description", async () => {
    const code = "/**\n * @returns Nothing.\n */\nexport const run = (): void => {};\n";
    expect(await lintRuleIds(code, recommended)).toContain("jsdoc/require-description");
  });

  it("rejects types written in the comment, since TSDoc reads them from the signature", async () => {
    const code =
      "/**\n * Does a thing.\n *\n * @param {number} value - A number.\n */\nexport const run = (value: number): number => value;\n";
    expect(await lintRuleIds(code, recommended)).toContain("jsdoc/no-types");
  });

  it("rejects invalid TSDoc syntax", async () => {
    const code = "/**\n * Does a thing with {@link .\n */\nexport const run = (): void => {};\n";
    expect(await lintRuleIds(code, recommended)).toContain("tsdoc/syntax");
  });

  it("accepts the TSDoc tags that plain JSDoc does not know", async () => {
    const code = `/**
 * Identity.
 *
 * @remarks
 * Exists to prove the tag list.
 *
 * @typeParam T - The value type.
 * @param value - The value.
 * @returns The same value.
 * @example
 * \`\`\`ts
 * identity(1);
 * \`\`\`
 */
export const identity = <T>(value: T): T => value;
`;
    expect(await lintRuleIds(code, recommended)).toEqual([]);
  });

  it("leaves declaration files alone", async () => {
    // The same code is rejected in a `.ts` file, so a pass here proves the file was skipped.
    const code = "export const a = () => 1;\nexport const b = () => 2;\n";
    expect(await lintRuleIds(code, recommended, "src/example.ts")).not.toEqual([]);
    expect(await lintRuleIds(code, recommended, "src/types.d.ts")).toEqual([]);
  });

  it("only applies to source files", async () => {
    const code = "function a() {}\nfunction b() {}\n";
    // ESLint reports files no config block matches as ignored; none of this preset's rules ran.
    expect(await lintRuleIds(code, recommended, "notes/readme.txt")).toEqual(["(none)"]);
  });
});
