import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Node, type NodeProps, type Position, useReactFlow } from "@xyflow/react";
import { CornerLeftDown, CornerRightDown } from "lucide-react";
import { OrientationUtils } from "./orientation-utils";

type OrientedNode = Node<{
  orientation: Position;
}>;

export function RotationControls(
  props: NodeProps<OrientedNode> & {
    position?: "near" | "far";
  },
) {
  const { updateNodeData } = useReactFlow();

  const onRotateRight = () =>
    updateNodeData(props.id, { orientation: OrientationUtils.rotate(props.data.orientation, 1) });
  const onRotateLeft = () =>
    updateNodeData(props.id, { orientation: OrientationUtils.rotate(props.data.orientation, -1) });

  return (
    <>
      <Button
        onClick={onRotateLeft}
        size="icon"
        variant="ghost"
        className={cn(
          "h-5 w-5 absolute top-1 left-1 -translate-x-1/2 -translate-y-1/2",
          props.position === "far" && "top-0 -left-1",
        )}
      >
        <CornerLeftDown />
      </Button>
      <Button
        onClick={onRotateRight}
        size="icon"
        variant="ghost"
        className={cn(
          "h-5 w-5 absolute top-1 right-1 translate-x-1/2 -translate-y-1/2",
          props.position === "far" && "top-0 -right-1",
        )}
      >
        <CornerRightDown />
      </Button>
    </>
  );
}
