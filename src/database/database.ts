// db.ts
import Dexie from "dexie";
import { type Profile, type ProfileTable, profileStrDef } from "./types/profile";

const db = new Dexie("SatisfactorySchemaPlanner") as Dexie & {
  profiles: ProfileTable;
};

// Schema declaration:
db.version(1).stores({
  profiles: profileStrDef, // primary key "id" (for the runtime!)
});

type DexieDbType = typeof db;

export type { Profile, DexieDbType };
export { db };
