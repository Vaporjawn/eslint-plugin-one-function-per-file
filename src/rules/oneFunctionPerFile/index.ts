import type { Rule } from "eslint";
import { functionsDefinedBy } from "./functionsDefinedBy.js";

/**
 * Rule `one-function-per-file`: a file defines at most ONE function at module level.
 *
 * Counted: function declarations, `const` / `let` / `var` bindings initialised with an arrow or
 * function expression (exported or not), and a default export of an arrow or function expression.
 * Not counted: functions nested inside that function (callbacks, closures), class methods, test
 * callbacks passed to `describe` / `it`, calls such as `memo(() => ...)`, types, and constants.
 */
export const oneFunctionPerFile: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Allow at most one module-level function per file.",
      recommended: false,
      url: "https://github.com/Vaporjawn/eslint-plugin-one-function-per-file/blob/main/docs/rules/one-function-per-file.md",
    },
    schema: [],
    messages: {
      tooMany:
        "'{{name}}' is a second function in this file (first: '{{first}}'). Put each function in its own file.",
    },
  },
  create: (context) => ({
    Program: (program) => {
      const [first, ...extras] = program.body.flatMap(functionsDefinedBy);
      if (!first) return;
      for (const extra of extras) {
        context.report({
          node: extra.node,
          messageId: "tooMany",
          data: { name: extra.name, first: first.name },
        });
      }
    },
  }),
};
