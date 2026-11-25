import { plugin } from "../../src/index.js";
import { lintRuleIds } from "./helpers.js";

const minimal = plugin.configs.minimal;

describe("minimal preset", () => {
  it("enforces only the one-function-per-file rule", async () => {
    expect(await lintRuleIds("function a() {}\nfunction b() {}\n", minimal)).toEqual([
      "one-function-per-file/one-function-per-file",
    ]);
  });

  it("does not require TSDoc or arrow functions", async () => {
    expect(await lintRuleIds("export function run(): void {}\n", minimal)).toEqual([]);
  });
});
