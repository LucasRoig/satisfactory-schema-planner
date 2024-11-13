import { ItemCombobox } from "@/components/item-combobox";
import { useReactFlow } from "@xyflow/react";
import type { SourceNode } from "../nodes/nodes-types";

export function SourceConfigPanel(props: { node: SourceNode }) {
  const { updateNodeData } = useReactFlow();
  return (
    <div className="w-full h-full max-h-full flex flex-col overflow-auto">
      Source Node Config
      <ItemCombobox
        selectedItemId={props.node.data.itemId}
        onSelect={(itemId) => updateNodeData(props.node.id, { itemId })}
      />
    </div>
  );
}
