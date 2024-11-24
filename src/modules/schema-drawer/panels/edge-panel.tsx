import { PseudoFormItem, PseudoFormLabel } from "@/components/pseudo-form";
import { useProfileContext } from "@/modules/profile/profile-context";
import type { Edge } from "@xyflow/react";
import type { FlowInfoMap } from "../flow-calc/flow-calc";

export function EdgePanel(props: { flowInfoMap: FlowInfoMap; edge: Edge }) {
  const { items } = useProfileContext();
  let component: React.ReactNode = null;
  const flowInfo = props.flowInfoMap.get(props.edge.id);
  if (flowInfo === undefined) {
    component = <div>Flow Info is undefined !!!</div>;
  } else if (flowInfo.kind === "noInfo") {
    component = <div>No info</div>;
  } else if (flowInfo.kind === "edgeFlow") {
    const inputItem = items.get(flowInfo.input.itemId);
    const outputItem = items.get(flowInfo.output.itemId);
    component = (
      <>
        {flowInfo.message ? <div className="text-red-800">{flowInfo.message}</div> : null}
        <PseudoFormItem>
          <PseudoFormLabel>Input</PseudoFormLabel>
          <div>
            {flowInfo.input.quantity} {inputItem?.name}
          </div>
        </PseudoFormItem>
        <PseudoFormItem>
          <PseudoFormLabel>Ouput</PseudoFormLabel>
          <div>
            {flowInfo.output.quantity} {outputItem?.name}
          </div>
        </PseudoFormItem>
      </>
    );
  } else {
    component = <div>Flow info kind is {flowInfo.kind} !!!!</div>;
  }
  return (
    <div className="w-full h-full max-h-full flex flex-col overflow-auto gap-4">
      <div className="text-lg">Conveyor</div>
      <div className="space-y-6">{component}</div>
    </div>
  );
}
