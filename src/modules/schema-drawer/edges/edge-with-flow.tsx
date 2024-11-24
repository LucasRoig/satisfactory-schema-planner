import { useProfileContext } from "@/modules/profile/profile-context";
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath } from "@xyflow/react";
import { useFlowCalcContext } from "../flow-calc/flow-calc-context";

export function EdgeWithFlow(props: EdgeProps) {
  const { flowInfoMap } = useFlowCalcContext();
  const { items } = useProfileContext();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
  });

  const flowInfo = flowInfoMap.get(props.id);
  let label = "";
  let hasError = false;
  let hasWarning = false;

  if (flowInfo && flowInfo.kind === "edgeFlow") {
    const inputItem = items.get(flowInfo.input.itemId);
    const inputQuantity = flowInfo.input.quantity;
    const outputItem = items.get(flowInfo.output.itemId);
    const outputQuantity = flowInfo.output.quantity;
    if (inputItem !== outputItem) {
      hasError = true;
    }
    if (inputQuantity !== outputQuantity) {
      hasWarning = true;
    }
    label = `${outputQuantity} ${outputItem?.name}`;
  }

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        markerStart={props.markerStart}
        style={{
          stroke: hasError ? "hsl(0 84.2% 60.2%)" : hasWarning ? "hsl(47.9 95.8% 53.1%)" : undefined,
          strokeWidth: hasError ? 3 : hasWarning ? 2 : 1,
        }}
        className={"color-red-800"}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            // pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
