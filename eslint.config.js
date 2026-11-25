import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";
// The repo lints itself with its own preset, loaded from the build (`npm run lint` builds first).
import oneFunctionPerFile from "./dist/index.js";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "coverage"] },

  {
    files: ["**/*.ts"],
    extends: [...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
    },
  },

  // The tests build ESLint inputs from strings and read loosely typed results.
  {
    files: ["tests/**/*.ts"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unsafe-type-assertion": "off",
    },
  },

  {
    files: ["**/*.{js,mjs}"],
    extends: [js.configs.recommended, tseslint.configs.disableTypeChecked],
    languageOptions: { globals: { ...globals.node } },
  },

  // The preset under test, applied to the code that ships it.
  { ...oneFunctionPerFile.configs.recommended, files: ["src/**/*.ts", "tests/**/*.ts"] },

  eslintConfigPrettier,
);
