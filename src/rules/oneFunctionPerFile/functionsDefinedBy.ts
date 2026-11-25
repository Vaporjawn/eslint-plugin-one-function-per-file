import type { Node } from "estree";
import type { FunctionDefinition } from "./types.js";
import { isFunctionValue } from "./isFunctionValue.js";

/**
 * The module-level functions one top-level statement defines.
 *
 * Counted: a function declaration; `const` / `let` / `var` bindings initialised with an arrow or
 * function expression; and a default export of an arrow or function expression. Exported
 * statements are unwrapped first. Not counted: anything nested inside a function, class methods,
 * object-literal methods, calls such as `memo(() => ...)`, overload signatures and `declare`d
 * functions.
 *
 * @param statement - A statement from `Program.body`.
 * @returns One entry per function, with the node to report on and its name.
 */
export const functionsDefinedBy = (statement: Node): readonly FunctionDefinition[] => {
  // `export default function () {}` has no `id` at runtime, which the ESTree types do not model.
  const declaration = (
    statement.type === "ExportNamedDeclaration" || statement.type === "ExportDefaultDeclaration"
      ? statement.declaration
      : statement
  ) as Node | null | undefined;
  if (!declaration) return [];

  if (declaration.type === "FunctionDeclaration") {
    const { id } = declaration as { id: { name: string } | null };
    return [{ node: declaration, name: id?.name ?? "default export" }];
  }

  if (declaration.type === "VariableDeclaration") {
    return declaration.declarations
      .filter((declarator) => isFunctionValue(declarator.init))
      .map((declarator) => ({
        node: declarator,
        name: declarator.id.type === "Identifier" ? declarator.id.name : "anonymous",
      }));
  }

  if (statement.type === "ExportDefaultDeclaration" && isFunctionValue(declaration)) {
    return [{ node: declaration, name: "default export" }];
  }

  return [];
};
