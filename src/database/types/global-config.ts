import type { EntityTable } from "dexie";

export type GlobalConfig = {
  id: number;
  selectedProfileId: number | undefined;
};

export type GlobalConfigTable = EntityTable<
  GlobalConfig,
  "id" // primary key "id" (for the typings only)
>;

export const globalConfigStrDef = "++id, selectedProfileId";
