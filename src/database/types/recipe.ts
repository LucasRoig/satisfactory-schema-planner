import type { EntityTable } from "dexie";

export type Recipe = {
  id: number;
  name: string;
  icon: string | undefined;
  profileId: number;
  buildingId: number;
  inputs: {
    itemId: number;
    quantity: number;
  }[];
  outputs: {
    itemId: number;
    quantity: number;
  }[];
};

export type RecipeTable = EntityTable<
  Recipe,
  "id" // primary key "id" (for the typings only)
>;

export const recipeStrDef = "++id, name, icon, profileId, buildingId, inputs, outputs";
