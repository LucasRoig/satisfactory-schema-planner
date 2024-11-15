import { cn } from "@/lib/utils";
import { type NodeProps, Position } from "@xyflow/react";
import { BaseNode } from "./base-node";
import { CustomHandle } from "./custom-handle";
import type { SplitterNode as SplitterNodeType } from "./nodes-types";

export function SplitterNode(props: NodeProps<SplitterNodeType>) {
  return (
    <BaseNode
      className={cn(
        "aspect-square rounded-sm flex flex-col items-center justify-center relative",
        // props.selected && "border-red-800"
      )}
      selected={props.selected}
    >
      {/* {props.selected && <RotationControls {...props} />} */}
      Splitter
      <CustomHandle type="source" position={Position.Right} />
      <CustomHandle type="source" position={Position.Top} />
      <CustomHandle type="target" position={Position.Left} />
      <CustomHandle type="source" position={Position.Bottom} />
    </BaseNode>
  );
}
