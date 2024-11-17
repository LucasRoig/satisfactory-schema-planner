import { useProfileContext } from "@/modules/profile/profile-context";
import { type NodeProps, Position } from "@xyflow/react";
import { BaseNode } from "./base-node";
import { CustomHandle } from "./custom-handle";
import type { BuildingNode as BuildingNodeType } from "./nodes-types";

export function BuildingNode(props: NodeProps<BuildingNodeType>) {
  const { buildings, recipes, items } = useProfileContext();
  const building = buildings.get(props.data.buildingId);
  if (building === undefined) {
    throw new Error(`Building ${props.data.buildingId} not found`);
  }
  const recipe = props.data.recipeId !== undefined ? recipes.get(props.data.recipeId) : undefined;
  return (
    <BaseNode className="flex flex-col p-0" selected={props.selected}>
      <div className="border-b px-5 py-2 text-center font-medium">{building.name}</div>
      <div className="flex justify-between text-sm">
        {props.data.recipeId === undefined ? (
          <div className="px-5 py-2">No recipe selected</div>
        ) : (
          <>
            <div className="flex flex-col border-r">
              <div className="border-b  px-5 py-2">Inputs</div>
              {recipe?.inputs.map((r, i) => {
                const item = items.get(r.itemId);
                if (item === undefined) {
                  throw new Error(`Item ${r.itemId} not found`);
                }
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                return <Input key={i} nodeId={props.id} id={`input${i}`} label={item.name} />;
              })}
            </div>
            <div className="flex flex-col">
              <div className="border-b  px-5 py-2">Outputs</div>
              {recipe?.outputs.map((r, i) => {
                const item = items.get(r.itemId);
                if (item === undefined) {
                  throw new Error(`Item ${r.itemId} not found`);
                }
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                return <Output key={i} nodeId={props.id} id={`output${i}`} label={item.name} />;
              })}
            </div>
          </>
        )}
      </div>
    </BaseNode>
  );
}

export function Input(props: { id: string; label: string; nodeId: string }) {
  return (
    <div className="border-b  px-5 py-2 relative">
      <CustomHandle type="target" position={Position.Left} id={`${props.nodeId}-${props.id}`} />
      {props.label}
    </div>
  );
}

export function Output(props: { id: string; label: string; nodeId: string }) {
  return (
    <div className="border-b  px-5 py-2 relative">
      <CustomHandle type="source" position={Position.Right} id={`${props.nodeId}-${props.id}`} />
      {props.label}
    </div>
  );
}
