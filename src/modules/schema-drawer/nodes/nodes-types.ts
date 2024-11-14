import { type Node, Position, type XYPosition } from "@xyflow/react";
import { match } from "ts-pattern";
import { v4 as uuid } from "uuid";

export type NodeType = "source" | "splitter";

export const isSourceNode = (node: Node): node is SourceNode => node.type === "source";

export type SourceNode = Node<{
  orientation: Position;
  itemId: number | undefined;
  quantity: number;
}>;

const newSourceNode = (position: XYPosition): SourceNode => ({
  id: uuid(),
  type: "source",
  position,
  data: {
    orientation: Position.Right,
    itemId: undefined,
    quantity: 30,
  },
});

export type SplitterNode = Node<{
  orientation: Position;
}>

const newSplitterNode = (position: XYPosition): SplitterNode => ({
  id: uuid(),
  type: "splitter",
  position,
  data: {
    orientation: Position.Right,
  },
});

export const nodeFactory = (type: NodeType, position: XYPosition) => {
  return match(type)
    .with("source", () => newSourceNode(position))
    .with("splitter", () => newSplitterNode(position))
    .exhaustive();
};
