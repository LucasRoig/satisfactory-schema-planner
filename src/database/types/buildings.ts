import type { EntityTable } from "dexie";

export type Building = {
  id: number;
  name: string;
  icon: string | undefined;
  profileId: number;
  inputCount: number;
  outputCount: number;
};

export type BuildingTable = EntityTable<
  Building,
  "id" // primary key "id" (for the typings only)
>;

export const buildingStrDef = "++id, name, icon, profileId, inputCount, outputCount";
