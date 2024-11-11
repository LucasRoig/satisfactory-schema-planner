import type { EntityTable } from "dexie";

export type Item = {
  id: number;
  name: string;
  icon: string | undefined;
  profileId: number;
};

export type ItemTable = EntityTable<
  Item,
  "id" // primary key "id" (for the typings only)
>;

export const itemStrDef = "++id, name, icon, profileId";
