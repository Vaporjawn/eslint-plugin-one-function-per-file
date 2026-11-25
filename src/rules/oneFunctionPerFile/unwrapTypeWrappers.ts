import type { Node } from "estree";

/** TypeScript-only expression wrappers that do not change which value an expression produces. */
const TYPE_WRAPPERS: ReadonlySet<string> = new Set([
  "TSAsExpression",
  "TSSatisfiesExpression",
  "TSTypeAssertion",
  "TSNonNullExpression",
]);

/**
 * Strips TypeScript type wrappers (`as T`, `satisfies T`, `<T>x`, `x!`) from an expression.
 *
 * `const f = (() => {}) as Handler` defines a function exactly as `const f = () => {}` does, so the
 * rule has to see through the wrapper. Plain ESTree nodes pass through unchanged.
 *
 * @param node - Any expression node, or a missing initialiser.
 * @returns The innermost expression, or the input when it is not wrapped.
 */
export const unwrapTypeWrappers = (node: Node | null | undefined): Node | null | undefined => {
  let current = node;
  while (current && TYPE_WRAPPERS.has(current.type)) {
    current = (current as unknown as { readonly expression: Node }).expression;
  }
  return current;
};
