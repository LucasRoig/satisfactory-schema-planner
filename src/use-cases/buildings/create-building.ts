import { db } from "@/database/database";
import { BuildingRepository, type InsertBuilding } from "@/database/repositories/building-repository";

export async function createBuilding(building: InsertBuilding) {
  const repo = new BuildingRepository(db);
  const i = await repo.insert(building);
  return i;
}
