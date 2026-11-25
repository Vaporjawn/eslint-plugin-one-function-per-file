import type { Linter } from "eslint";
import { PLUGIN_NAME } from "../meta.js";

/** Source files the preset applies to. TypeScript files also need a TypeScript parser configured. */
export const SOURCE_FILES: string[] = ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"];

/** Declaration files only declare shapes, so the preset leaves them alone. */
export const IGNORED_FILES: string[] = ["**/*.d.ts"];

/** Just the file-structure rule. */
export const MINIMAL_RULES: Linter.RulesRecord = {
  [`${PLUGIN_NAME}/${PLUGIN_NAME}`]: "error",
};

/**
 * Tags TSDoc defines that `eslint-plugin-jsdoc` does not know in `typescript` mode. Without this
 * list `jsdoc/check-tag-names` would reject a valid TSDoc comment. (`@typeParam` is handled by the
 * `tagNamePreference` setting in `createRecommendedConfig`, because jsdoc already knows it as an alias.)
 */
export const TSDOC_TAGS: string[] = [
  "alpha",
  "beta",
  "decorator",
  "defaultValue",
  "eventProperty",
  "experimental",
  "inheritDoc",
  "label",
  "packageDocumentation",
  "privateRemarks",
  "remarks",
  "sealed",
  "virtual",
];

/** The whole preset: one function per file, `const` arrow functions, and a TSDoc comment on each. */
export const RECOMMENDED_RULES: Linter.RulesRecord = {
  ...MINIMAL_RULES,

  // Always `const name = () => {}`, never `function name() {}` or `const name = function () {}`.
  "func-style": ["error", "expression"],
  "prefer-arrow-callback": "error",
  "no-restricted-syntax": [
    "error",
    {
      selector: "VariableDeclarator > FunctionExpression",
      message: "Use an arrow function: `const name = () => {}`.",
    },
  ],

  "jsdoc/require-jsdoc": [
    "error",
    {
      publicOnly: false,
      // Named functions: declarations, `const f = () => {}`, methods, classes. Anonymous callbacks
      // and lambdas inside object literals are not "functions" for this rule.
      require: {
        FunctionDeclaration: true,
        ArrowFunctionExpression: false,
        FunctionExpression: false,
        MethodDefinition: true,
        ClassDeclaration: true,
      },
      contexts: [
        "VariableDeclarator > ArrowFunctionExpression",
        "VariableDeclarator > FunctionExpression",
        "ExportDefaultDeclaration > ArrowFunctionExpression",
      ],
    },
  ],
  "jsdoc/require-description": ["error", { descriptionStyle: "body" }],
  "jsdoc/no-types": "error", // TSDoc takes types from the signature, never from `{type}`
  "jsdoc/check-tag-names": ["error", { definedTags: TSDOC_TAGS }],
  "jsdoc/check-param-names": "error",
  "tsdoc/syntax": "error",
};
