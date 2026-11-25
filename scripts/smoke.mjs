// Loads the BUILT package the way a consumer would (ESM import and CommonJS require) and lints one
// bad and one good file with the real ESLint API. Run after `npm run build`; see `verify:package`.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { ESLint } from "eslint";

const require = createRequire(import.meta.url);

const viaImport = (await import("eslint-plugin-one-function-per-file")).default;
const viaRequire = require("eslint-plugin-one-function-per-file");
assert.ok(viaImport.rules["one-function-per-file"], "ESM import exposes the rule");
assert.ok(viaImport.configs.recommended, "ESM import exposes the recommended config");
assert.ok(viaRequire.default.rules["one-function-per-file"], "require() exposes the rule");

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: [viaImport.configs.recommended],
});

const [bad] = await eslint.lintText("function a() {}\nfunction b() {}\n", { filePath: "x.js" });
assert.ok(
  bad.messages.some((m) => m.ruleId === "one-function-per-file/one-function-per-file"),
  "a second function is reported",
);

const [good] = await eslint.lintText("/**\n * Adds one.\n */\nexport const inc = (n) => n + 1;\n", {
  filePath: "x.js",
});
assert.deepEqual(good.messages, [], "a clean file has no messages");

console.log("smoke ok: ESM import, CJS require, and a real lint run all behave");
