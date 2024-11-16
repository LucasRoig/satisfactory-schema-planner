import { useProfileContext } from "@/modules/profile/profile-context";
import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "./base-node";
import type { BuildingNode as BuildingNodeType } from "./nodes-types";

export function BuildingNode(props: NodeProps<BuildingNodeType>) {
  const { buildings } = useProfileContext();
  const building = buildings.get(props.data.buildingId);
  if (building === undefined) {
    throw new Error(`Building ${props.data.buildingId} not found`);
  }
  return <BaseNode selected={props.selected}>{building.name}</BaseNode>;
}
