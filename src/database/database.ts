// db.ts
import Dexie from "dexie";
import { type GlobalConfig, type GlobalConfigTable, globalConfigStrDef } from "./types/global-config";
import { type Item, type ItemTable, itemStrDef } from "./types/item";
import { type Profile, type ProfileTable, profileStrDef } from "./types/profile";

const db = new Dexie("SatisfactorySchemaPlanner") as Dexie & {
  profiles: ProfileTable;
  globalConfig: GlobalConfigTable;
  items: ItemTable;
};

// Schema declaration:
db.version(1).stores({
  profiles: profileStrDef, // primary key "id" (for the runtime!)
  globalConfig: globalConfigStrDef, // primary key "id" (for the runtime!)
  items: itemStrDef, // primary key "id" (for the runtime!)
});

type DexieDbType = typeof db;

export type { Profile, Item, GlobalConfig, DexieDbType };
export { db };
