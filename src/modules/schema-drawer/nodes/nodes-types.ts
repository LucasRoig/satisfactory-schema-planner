import { type Node, Position, type XYPosition } from "@xyflow/react";
import { match } from "ts-pattern";
import { v4 as uuid } from "uuid";

export type NodeType = "source" | "splitter" | "merger" | "building";

export const isSourceNode = (node: Node): node is SourceNode => node.type === "source";
export const isBuildingNode = (node: Node): node is BuildingNode => node.type === "building";
export const isMergerNode = (node: Node): node is MergerNode => node.type === "merger";
export const isSplitterNode = (node: Node): node is SplitterNode => node.type === "splitter";

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
}>;

const newSplitterNode = (position: XYPosition): SplitterNode => ({
  id: uuid(),
  type: "splitter",
  position,
  data: {
    orientation: Position.Left,
  },
});

export type MergerNode = Node<{
  orientation: Position;
}>;

const newMergerNode = (position: XYPosition): MergerNode => ({
  id: uuid(),
  type: "merger",
  position,
  data: {
    orientation: Position.Right,
  },
});

export type BuildingNode = Node<{
  buildingId: number;
  recipeId: number | undefined;
}>;

const newBuildingNode = (position: XYPosition, buildingId: number): BuildingNode => ({
  id: uuid(),
  type: "building",
  position,
  data: {
    buildingId: buildingId,
    recipeId: undefined,
  },
});

export const nodeFactory = (type: NodeType, position: XYPosition, args: { buildingId?: number } = {}) => {
  return match(type)
    .with("source", () => newSourceNode(position))
    .with("merger", () => newMergerNode(position))
    .with("splitter", () => newSplitterNode(position))
    .with("building", () => {
      if (args.buildingId === undefined) {
        throw new Error("buildingId is undefined");
      }
      return newBuildingNode(position, args.buildingId);
    })
    .exhaustive();
};
