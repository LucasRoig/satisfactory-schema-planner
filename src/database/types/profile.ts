import type { EntityTable } from "dexie";

export type Profile = {
  id: number;
  name: string;
};

export type ProfileTable = EntityTable<
  Profile,
  "id" // primary key "id" (for the typings only)
>;

export const profileStrDef = "++id, name";
