import type { ESLint, Linter } from "eslint";
import jsdoc from "eslint-plugin-jsdoc";
import tsdoc from "eslint-plugin-tsdoc";
import { PLUGIN_NAME } from "../meta.js";
import { IGNORED_FILES, RECOMMENDED_RULES, SOURCE_FILES } from "./rules.js";

/**
 * Builds the `recommended` flat config: one function per file, `const` arrow functions, and a
 * TSDoc comment on every named function. It registers `jsdoc` and `tsdoc` itself, so the consumer
 * installs nothing extra.
 *
 * @param plugin - The plugin object to register under the `one-function-per-file` namespace.
 * @returns A flat config object ready to spread into `eslint.config.js`.
 */
export const createRecommendedConfig = (plugin: ESLint.Plugin): Linter.Config => ({
  name: `${PLUGIN_NAME}/recommended`,
  files: SOURCE_FILES,
  ignores: IGNORED_FILES,
  plugins: { [PLUGIN_NAME]: plugin, jsdoc, tsdoc },
  // TSDoc spells generics `@typeParam`; `eslint-plugin-jsdoc` would otherwise insist on `@template`.
  settings: { jsdoc: { mode: "typescript", tagNamePreference: { template: "typeParam" } } },
  rules: RECOMMENDED_RULES,
});
