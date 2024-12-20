import { PseudoFormDescription, PseudoFormItem, PseudoFormLabel } from "@/components/pseudo-form";
import { RecipeCombobox } from "@/components/recipe-combobox";
import { useProfileContext } from "@/modules/profile/profile-context";
import { useReactFlow } from "@xyflow/react";
import { flushSync } from "react-dom";
import type { BuildingNode } from "../nodes/nodes-types";

export function BuildingConfigPanel(props: { node: BuildingNode; updateFlowCalc: () => void }) {
  const { updateNodeData } = useReactFlow();
  const { buildings } = useProfileContext();

  const onDataChange = (data: Partial<Record<string, unknown>>) => {
    flushSync(() => {
      updateNodeData(props.node.id, data);
    });
    props.updateFlowCalc();
  };

  const building = buildings.get(props.node.data.buildingId);
  if (building === undefined) {
    throw new Error(`Building ${props.node.data.buildingId} not found`);
  }

  return (
    <div className="w-full h-full max-h-full flex flex-col overflow-auto gap-4">
      <div className="text-lg">{building.name}</div>
      <div className="space-y-6">
        <PseudoFormItem>
          <PseudoFormLabel>Recipe</PseudoFormLabel>
          <PseudoFormDescription>The recipe to used in this building.</PseudoFormDescription>
          <RecipeCombobox
            buildingId={props.node.data.buildingId}
            selectedRecipeId={props.node.data.recipeId}
            onSelect={(recipeId) => onDataChange({ recipeId })}
          />
        </PseudoFormItem>
      </div>
    </div>
  );
}
