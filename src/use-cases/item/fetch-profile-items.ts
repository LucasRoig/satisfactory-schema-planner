import { db } from "@/database/database";
import { ItemRepository } from "@/database/repositories/item-repository";
import { ProfileRepository } from "@/database/repositories/profile-repository";

export async function fetchProfileItems(profileId: number) {
  const profileRepo = new ProfileRepository(db);
  const itemRepo = new ItemRepository(db);
  const profile = await profileRepo.findById(profileId);
  if (profile === undefined) {
    throw new Error(`Profile not found: ${profileId}`);
  }
  const items = await itemRepo.findByProfileId(profileId);
  return items;
}
