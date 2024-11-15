import { cn } from "@/lib/utils";
import { useProfileContext } from "@/modules/profile/profile-context";
import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "./base-node";
import { CustomHandle } from "./custom-handle";
import type { SourceNode as SourceNodeType } from "./nodes-types";
import { RotationControls } from "./rotation-controls";

export function SourceNode(props: NodeProps<SourceNodeType>) {
  const { items } = useProfileContext();
  const item = props.data.itemId !== undefined ? items.get(props.data.itemId) : undefined;
  if (item === undefined && props.data.itemId !== undefined) {
    throw new Error(`Item ${props.data.itemId} not found`);
  }
  return (
    <BaseNode
      className={cn("aspect-square rounded-full flex flex-col items-center justify-center relative")}
      selected={props.selected}
    >
      {props.selected && <RotationControls {...props} />}
      {item ? `${props.data.quantity} ${item.name}` : "Source"}
      <CustomHandle type="source" position={props.data.orientation} />
    </BaseNode>
  );
}
