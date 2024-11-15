import { cn } from "@/lib/utils";
import { type NodeProps, Position } from "@xyflow/react";
import { BaseNode } from "./base-node";
import { CustomHandle } from "./custom-handle";
import type { SplitterNode as SplitterNodeType } from "./nodes-types";
import { RotationControls } from "./rotation-controls";

export function SplitterNode(props: NodeProps<SplitterNodeType>) {
  return (
    <BaseNode
      className={cn(
        "aspect-square rounded-sm flex flex-col items-center justify-center relative",
        // props.selected && "border-red-800"
      )}
      selected={props.selected}
    >
      {props.selected && <RotationControls position="far" {...props} />}
      Splitter
      <CustomHandle type={props.data.orientation === Position.Right ? "target" : "source"} position={Position.Right} />
      <CustomHandle type={props.data.orientation === Position.Top ? "target" : "source"} position={Position.Top} />
      <CustomHandle type={props.data.orientation === Position.Left ? "target" : "source"} position={Position.Left} />
      <CustomHandle
        type={props.data.orientation === Position.Bottom ? "target" : "source"}
        position={Position.Bottom}
      />
    </BaseNode>
  );
}
