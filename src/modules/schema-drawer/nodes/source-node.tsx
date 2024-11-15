import { cn } from "@/lib/utils";
import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "./base-node";
import { CustomHandle } from "./custom-handle";
import type { SourceNode as SourceNodeType } from "./nodes-types";
import { RotationControls } from "./rotation-controls";

export function SourceNode(props: NodeProps<SourceNodeType>) {
  return (
    <BaseNode
      className={cn("aspect-square rounded-full flex flex-col items-center justify-center relative")}
      selected={props.selected}
    >
      {props.selected && <RotationControls {...props} />}
      Source
      <CustomHandle type="source" position={props.data.orientation} />
    </BaseNode>
  );
}
