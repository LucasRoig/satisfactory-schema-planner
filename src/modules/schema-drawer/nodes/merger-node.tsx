import { cn } from "@/lib/utils";
import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "./base-node";
import { CustomHandle } from "./custom-handle";
import type { MergerNode as MergerNodeType } from "./nodes-types";
import { OrientationUtils } from "./orientation-utils";
import { RotationControls } from "./rotation-controls";

export function MergerNode(props: NodeProps<MergerNodeType>) {
  const orientationIndex = OrientationUtils.getIndex(props.data.orientation);
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
      <CustomHandle id="output0" type="source" position={props.data.orientation} />
      <CustomHandle id="input0" type="target" position={OrientationUtils.getAtIndex(orientationIndex + 1)} />
      <CustomHandle id="input1" type="target" position={OrientationUtils.getAtIndex(orientationIndex + 2)} />
      <CustomHandle id="input2" type="target" position={OrientationUtils.getAtIndex(orientationIndex + 3)} />
    </BaseNode>
  );
}