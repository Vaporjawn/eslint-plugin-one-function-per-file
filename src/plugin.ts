import type { ESLint, Linter } from "eslint";
import { createMinimalConfig } from "./configs/createMinimalConfig.js";
import { createRecommendedConfig } from "./configs/createRecommendedConfig.js";
import { PLUGIN_META, PLUGIN_NAME } from "./meta.js";
import { oneFunctionPerFile } from "./rules/oneFunctionPerFile/index.js";

/**
 * The two flat configs the plugin ships: `recommended` (one function per file, `const` arrow
 * functions, and a TSDoc comment on every named function) and `minimal` (only the rule).
 */
export type PluginConfigs = Record<"recommended" | "minimal", Linter.Config>;

const configs = {} as PluginConfigs;

/**
 * The ESLint plugin: the `one-function-per-file` rule plus two flat configs, `recommended` and
 * `minimal`. The configs reference the plugin itself, so they are filled in after it exists.
 */
export const plugin: ESLint.Plugin & { configs: PluginConfigs } = {
  meta: PLUGIN_META,
  rules: { [PLUGIN_NAME]: oneFunctionPerFile },
  configs,
};

configs.recommended = createRecommendedConfig(plugin);
configs.minimal = createMinimalConfig(plugin);
