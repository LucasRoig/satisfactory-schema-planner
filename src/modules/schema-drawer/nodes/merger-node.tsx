import { cn } from "@/lib/utils";
import { type NodeProps, Position } from "@xyflow/react";
import { BaseNode } from "./base-node";
import { CustomHandle } from "./custom-handle";
import type { MergerNode as MergerNodeType } from "./nodes-types";
import { RotationControls } from "./rotation-controls";

export function MergerNode(props: NodeProps<MergerNodeType>) {
  return (
    <BaseNode
      className={cn(
        "aspect-square rounded-sm flex flex-col items-center justify-center relative",
        // props.selected && "border-red-800"
      )}
      selected={props.selected}
    >
      {props.selected && <RotationControls position="far" {...props} />}
      Merger
      <CustomHandle type={props.data.orientation === Position.Right ? "source" : "target"} position={Position.Right} />
      <CustomHandle type={props.data.orientation === Position.Top ? "source" : "target"} position={Position.Top} />
      <CustomHandle type={props.data.orientation === Position.Left ? "source" : "target"} position={Position.Left} />
      <CustomHandle
        type={props.data.orientation === Position.Bottom ? "source" : "target"}
        position={Position.Bottom}
      />
    </BaseNode>
  );
}
