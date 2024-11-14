import { cn } from "@/lib/utils";
import { BaseNode } from "./base-node";
import { Handle, Position, type NodeProps } from "@xyflow/react";
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
    <Handle type="source" position={Position.Right} />
    <Handle type="source" position={Position.Top} />
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Bottom} />
  </BaseNode>
  )
}
