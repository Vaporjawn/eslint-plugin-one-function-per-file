import type { Node } from "estree";
import { unwrapTypeWrappers } from "./unwrapTypeWrappers.js";

/**
 * Whether an expression is an arrow function or a function expression, ignoring any TypeScript
 * `as` / `satisfies` / `!` wrapper around it.
 *
 * @param node - Any ESTree expression node, or a missing initialiser.
 * @returns `true` for `() => {}` and `function () {}` values.
 */
export const isFunctionValue = (node: Node | null | undefined): boolean => {
  const value = unwrapTypeWrappers(node);
  return value?.type === "ArrowFunctionExpression" || value?.type === "FunctionExpression";
};
