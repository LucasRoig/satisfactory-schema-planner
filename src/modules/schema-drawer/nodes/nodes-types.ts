import type { Node, Position } from "@xyflow/react";

export const isSourceNode = (node: Node): node is SourceNode => node.type === "source";

export type SourceNode = Node<{
  orientation: Position;
}>;
