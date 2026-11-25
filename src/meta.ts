import { createRequire } from "node:module";

/** The namespace the plugin's rules are registered under: `one-function-per-file/<rule>`. */
export const PLUGIN_NAME = "one-function-per-file";

const { version } = createRequire(import.meta.url)("../package.json") as { version: string };

/** Plugin identity, shown by ESLint's config inspector and used for cache invalidation. */
export const PLUGIN_META = { name: "eslint-plugin-one-function-per-file", version } as const;
