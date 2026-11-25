import type { Node } from "estree";

/** One module-level function found in a file: the node to report on, and a name for the message. */
export interface FunctionDefinition {
  /** The AST node the rule reports on when this function is a second (or later) one. */
  readonly node: Node;
  /** The binding name, `"default export"` for an unnamed default export, or `"anonymous"`. */
  readonly name: string;
}
