import { db } from "@/database/database";
import { BuildingRepository } from "@/database/repositories/building-repository";
import { ProfileRepository } from "@/database/repositories/profile-repository";

export async function fetchProfileBuildings(profileId: number) {
  const profileRepo = new ProfileRepository(db);
  const buildingRepo = new BuildingRepository(db);
  const profile = await profileRepo.findById(profileId);
  if (profile === undefined) {
    throw new Error(`Profile not found: ${profileId}`);
  }
  const items = await buildingRepo.findByProfileId(profileId);
  return items;
}
