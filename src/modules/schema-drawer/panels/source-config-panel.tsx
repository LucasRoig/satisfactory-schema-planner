import { ItemCombobox } from "@/components/item-combobox";
import { PseudoFormDescription, PseudoFormItem, PseudoFormLabel } from "@/components/pseudo-form";
import { Input } from "@/components/ui/input";
import { useReactFlow } from "@xyflow/react";
import type { SourceNode } from "../nodes/nodes-types";

export function SourceConfigPanel(props: { node: SourceNode }) {
  const { updateNodeData } = useReactFlow();
  return (
    <div className="w-full h-full max-h-full flex flex-col overflow-auto gap-4">
      <div className="text-lg">Source Node </div>
      <div className="space-y-6">
        <PseudoFormItem>
          <PseudoFormLabel>Item</PseudoFormLabel>
          <PseudoFormDescription>The produced by this source.</PseudoFormDescription>
          <ItemCombobox
            selectedItemId={props.node.data.itemId}
            onSelect={(itemId) => updateNodeData(props.node.id, { itemId })}
          />
        </PseudoFormItem>
        <PseudoFormItem>
          <PseudoFormLabel>Quantity</PseudoFormLabel>
          <PseudoFormDescription>The quantity of items produced each minute.</PseudoFormDescription>
          <Input
            type="number"
            value={props.node.data.quantity}
            onChange={(e) => updateNodeData(props.node.id, { quantity: e.target.valueAsNumber })}
          />
        </PseudoFormItem>
      </div>
    </div>
  );
}
