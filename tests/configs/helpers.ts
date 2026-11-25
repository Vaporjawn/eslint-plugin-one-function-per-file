import { ESLint, type Linter } from "eslint";
import tseslint from "typescript-eslint";

/**
 * Lints a snippet with a TypeScript parser plus the given preset and returns the rule ids that fired.
 *
 * @param code - The source text to lint.
 * @param config - The preset under test, e.g. `plugin.configs.recommended`.
 * @param filePath - A virtual file path; it decides which config blocks match.
 * @returns The sorted, de-duplicated rule ids of every reported message.
 */
export const lintRuleIds = async (
  code: string,
  config: Linter.Config,
  filePath = "src/example.ts",
): Promise<string[]> => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [{ files: ["**/*.ts"], languageOptions: { parser: tseslint.parser } }, config],
  });
  const [result] = await eslint.lintText(code, { filePath });
  const fatal = result?.messages.find((message) => message.fatal);
  if (fatal) throw new Error(`Parse error: ${fatal.message}`);
  return [...new Set((result?.messages ?? []).map((message) => message.ruleId ?? "(none)"))].sort();
};
