import { ItemCombobox } from "@/components/item-combobox";
import { PseudoFormDescription, PseudoFormItem, PseudoFormLabel } from "@/components/pseudo-form";
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
      </div>
    </div>
  );
}
