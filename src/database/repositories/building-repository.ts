import type { Building, DexieDbType } from "../database";
import { ProfileRepository } from "./profile-repository";

export type InsertBuilding = Omit<Building, "id">;

export class BuildingRepository {
  constructor(private db: DexieDbType) {}

  public async findByProfileId(profileId: number) {
    const buildings = await this.db.buildings.where("profileId").equals(profileId).toArray();
    return buildings;
  }

  public async insert(building: InsertBuilding) {
    const profileId = building.profileId;
    const profileRepo = new ProfileRepository(this.db);
    const profile = await profileRepo.findById(profileId);
    if (profile === undefined) {
      throw new Error("Constraint violation: profile not found");
    }
    const id = await this.db.buildings.add(building);
    return {
      ...building,
      id,
    };
  }
}
