import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Node, type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { CornerLeftDown, CornerRightDown } from "lucide-react";

type OrientedNode = Node<{
  orientation: Position;
}>;

const ORIENTATIONS = [Position.Right, Position.Bottom, Position.Left, Position.Top];

const rotate = (initialOrientation: Position | undefined, delta: number) => {
  if (initialOrientation === undefined) {
    return Position.Right;
  }
  const index = ORIENTATIONS.indexOf(initialOrientation);
  const nextIndex = index + delta;
  if (nextIndex < 0) {
    return ORIENTATIONS[ORIENTATIONS.length - 1];
  }
  if (nextIndex >= ORIENTATIONS.length) {
    return ORIENTATIONS[0];
  }
  return ORIENTATIONS[nextIndex];
};

export function RotationControls(
  props: NodeProps<OrientedNode> & {
    position?: "near" | "far";
  },
) {
  const { updateNodeData } = useReactFlow();

  const onRotateRight = () => updateNodeData(props.id, { orientation: rotate(props.data.orientation, 1) });
  const onRotateLeft = () => updateNodeData(props.id, { orientation: rotate(props.data.orientation, -1) });

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
