import type { ESLint, Linter } from "eslint";
import { PLUGIN_NAME } from "../meta.js";
import { IGNORED_FILES, MINIMAL_RULES, SOURCE_FILES } from "./rules.js";

/**
 * Builds the `minimal` flat config: only the `one-function-per-file` rule, with no other plugin.
 *
 * @param plugin - The plugin object to register under the `one-function-per-file` namespace.
 * @returns A flat config object ready to spread into `eslint.config.js`.
 */
export const createMinimalConfig = (plugin: ESLint.Plugin): Linter.Config => ({
  name: `${PLUGIN_NAME}/minimal`,
  files: SOURCE_FILES,
  ignores: IGNORED_FILES,
  plugins: { [PLUGIN_NAME]: plugin },
  rules: MINIMAL_RULES,
});
