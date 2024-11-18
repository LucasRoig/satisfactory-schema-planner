import { useProfileContext } from "@/modules/profile/profile-context";
import type { FlowInfoMap } from "../flow-calc/flow-calc";
import type { MergerNode } from "../nodes/nodes-types";

export function MergerConfigPanel(props: { flowInfoMap: FlowInfoMap; node: MergerNode }) {
  const { items } = useProfileContext();
  const flowInfo = props.flowInfoMap.get(props.node.id);
  let component: React.ReactNode = null;
  if (flowInfo === undefined) {
    component = <div>Flow Info is undefined !!!</div>;
  } else if (flowInfo.kind === "noInfo") {
    component = <div>No info</div>;
  } else if (flowInfo.kind === "mergerFlow") {
    const item0 = flowInfo.inputs.input0 ? items.get(flowInfo.inputs.input0.itemId) : undefined;
    const item1 = flowInfo.inputs.input1 ? items.get(flowInfo.inputs.input1.itemId) : undefined;
    const item2 = flowInfo.inputs.input2 ? items.get(flowInfo.inputs.input2.itemId) : undefined;
    const outputItem = flowInfo.output ? items.get(flowInfo.output.itemId) : undefined;
    component = (
      <div>
        <div>Inputs</div>
        <div>
          i0: {item0?.name} {flowInfo.inputs.input0?.quantity}
        </div>
        <div>
          i1: {item1?.name} {flowInfo.inputs.input1?.quantity}
        </div>
        <div>
          i2: {item2?.name} {flowInfo.inputs.input2?.quantity}
        </div>
        <div>Outputs</div>
        <div>
          o: {outputItem?.name} {flowInfo.output?.quantity}
        </div>
      </div>
    );
  } else {
    component = <div>Flow info kind is {flowInfo.kind} !!!!</div>;
  }

  return (
    <div className="w-full h-full max-h-full flex flex-col overflow-auto gap-4">
      <div className="text-lg">Merger</div>
      <div className="space-y-6">{component}</div>
    </div>
  );
}
