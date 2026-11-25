import { createRequire } from "node:module";
import defaultExport, { PLUGIN_NAME, oneFunctionPerFile, plugin } from "../src/index.js";

const packageJson = createRequire(import.meta.url)("../package.json") as { version: string };

describe("plugin object", () => {
  it("is the default export and a named export", () => {
    expect(defaultExport).toBe(plugin);
  });

  it("registers the rule under the plugin name", () => {
    expect(plugin.rules?.[PLUGIN_NAME]).toBe(oneFunctionPerFile);
    expect(PLUGIN_NAME).toBe("one-function-per-file");
  });

  it("reports the package name and version in meta", () => {
    expect(plugin.meta).toEqual({
      name: "eslint-plugin-one-function-per-file",
      version: packageJson.version,
    });
  });

  it("registers itself in both configs under its own namespace", () => {
    for (const name of ["recommended", "minimal"] as const) {
      expect(plugin.configs[name].plugins?.[PLUGIN_NAME]).toBe(plugin);
    }
  });

  it("gives every config a name for the config inspector", () => {
    expect(plugin.configs.recommended.name).toBe("one-function-per-file/recommended");
    expect(plugin.configs.minimal.name).toBe("one-function-per-file/minimal");
  });

  it("documents the rule", () => {
    expect(oneFunctionPerFile.meta?.docs?.url).toContain("docs/rules/one-function-per-file.md");
  });
});
