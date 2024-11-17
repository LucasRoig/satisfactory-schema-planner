import { useProfileContext } from "@/modules/profile/profile-context";
import { type NodeProps, Position } from "@xyflow/react";
import { BaseNode } from "./base-node";
import { CustomHandle } from "./custom-handle";
import type { BuildingNode as BuildingNodeType } from "./nodes-types";

export function BuildingNode(props: NodeProps<BuildingNodeType>) {
  const { buildings } = useProfileContext();
  const building = buildings.get(props.data.buildingId);
  if (building === undefined) {
    throw new Error(`Building ${props.data.buildingId} not found`);
  }
  return (
    <BaseNode className="flex flex-col p-0" selected={props.selected}>
      <div className="border-b px-5 py-2 text-center font-medium">{building.name}</div>
      <div className="flex justify-between text-sm">
        <div className="flex flex-col border-r">
          <div className="border-b  px-5 py-2">Inputs</div>
          <Input nodeId={props.id} id="input0" label="Input 0" />
          <Input nodeId={props.id} id="input1" label="Input 1" />
          <Input nodeId={props.id} id="input2" label="Input 2" />
        </div>
        <div className="flex flex-col">
          <div className="border-b  px-5 py-2">Outputs</div>
          <Output nodeId={props.id} id="output0" label="Output 0" />
          <Output nodeId={props.id} id="output1" label="Output 1" />
          <Output nodeId={props.id} id="output2" label="Output 2" />
        </div>
      </div>
    </BaseNode>
  );
}

export function Input(props: { id: string; label: string; nodeId: string }) {
  return (
    <div className="border-b  px-5 py-2 relative">
      <CustomHandle type="target" position={Position.Left} id={`${props.nodeId}-${props.id}`} />
      {props.label}
    </div>
  );
}

export function Output(props: { id: string; label: string; nodeId: string }) {
  return (
    <div className="border-b  px-5 py-2">
      <CustomHandle type="source" position={Position.Right} id={`${props.nodeId}-${props.id}`} />
      {props.label}
    </div>
  );
}
