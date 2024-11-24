import { useProfileContext } from "@/modules/profile/profile-context";
import type { FlowInfoMap } from "../flow-calc/flow-calc";
import type { SplitterNode } from "../nodes/nodes-types";

export function SplitterPanel(props: { flowInfoMap: FlowInfoMap; node: SplitterNode }) {
  const { items } = useProfileContext();
  const flowInfo = props.flowInfoMap.get(props.node.id);

  let component: React.ReactNode = null;
  if (flowInfo === undefined) {
    component = <div>Flow Info is undefined !!!</div>;
  } else if (flowInfo.kind === "noInfo") {
    component = <div>No info</div>;
  } else if (flowInfo.kind === "splitterFlow") {
    const inputItem = flowInfo.input ? items.get(flowInfo.input.itemId) : undefined;
    const outputItem0 = flowInfo.outputs.output0 ? items.get(flowInfo.outputs.output0.itemId) : undefined;
    const outputItem1 = flowInfo.outputs.output1 ? items.get(flowInfo.outputs.output1.itemId) : undefined;
    const outputItem2 = flowInfo.outputs.output2 ? items.get(flowInfo.outputs.output2.itemId) : undefined;

    component = (
      <div>
        <div>Input</div>
        <div>
          i: {flowInfo.input?.quantity} {inputItem?.name}
        </div>
        <div>Outputs</div>
        <div>
          o0: {flowInfo.outputs.output0?.quantity} {outputItem0?.name}
        </div>
        <div>
          o1: {flowInfo.outputs.output1?.quantity} {outputItem1?.name}
        </div>
        <div>
          o2: {flowInfo.outputs.output2?.quantity} {outputItem2?.name}
        </div>
      </div>
    );
  } else {
    component = <div>Flow info kind is {flowInfo.kind} !!!!</div>;
  }

  return (
    <div className="w-full h-full max-h-full flex flex-col overflow-auto gap-4">
      <div className="text-lg">Splitter</div>
      <div className="space-y-6">{component}</div>
    </div>
  );
}
