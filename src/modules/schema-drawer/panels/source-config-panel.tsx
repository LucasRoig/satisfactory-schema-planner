import { ItemCombobox } from "@/components/item-combobox";
import { PseudoFormDescription, PseudoFormItem, PseudoFormLabel } from "@/components/pseudo-form";
import { Input } from "@/components/ui/input";
import { useReactFlow } from "@xyflow/react";
import { flushSync } from "react-dom";
import type { SourceNode } from "../nodes/nodes-types";

export function SourceConfigPanel(props: { node: SourceNode; updateFlowCalc: () => void }) {
  const { updateNodeData } = useReactFlow();
  const onDataChange = (data: Partial<Record<string, unknown>>) => {
    flushSync(() => {
      updateNodeData(props.node.id, data);
    });
    props.updateFlowCalc();
  };
  return (
    <div className="w-full h-full max-h-full flex flex-col overflow-auto gap-4">
      <div className="text-lg">Source Node </div>
      <div className="space-y-6">
        <PseudoFormItem>
          <PseudoFormLabel>Item</PseudoFormLabel>
          <PseudoFormDescription>The produced by this source.</PseudoFormDescription>
          <ItemCombobox selectedItemId={props.node.data.itemId} onSelect={(itemId) => onDataChange({ itemId })} />
        </PseudoFormItem>
        <PseudoFormItem>
          <PseudoFormLabel>Quantity</PseudoFormLabel>
          <PseudoFormDescription>The quantity of items produced each minute.</PseudoFormDescription>
          <Input
            type="number"
            value={props.node.data.quantity}
            onChange={(e) => onDataChange({ quantity: e.target.valueAsNumber })}
          />
        </PseudoFormItem>
      </div>
    </div>
  );
}
