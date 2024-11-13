import { type Node, Position, type XYPosition } from "@xyflow/react";
import { v4 as uuid } from "uuid";

export const isSourceNode = (node: Node): node is SourceNode => node.type === "source";

export type SourceNode = Node<{
  orientation: Position;
  itemId: number | undefined;
  quantity: number;
}>;

export const newSourceNode = (position: XYPosition): SourceNode => ({
  id: uuid(),
  type: "source",
  position,
  data: {
    orientation: Position.Right,
    itemId: undefined,
    quantity: 30,
  },
});
