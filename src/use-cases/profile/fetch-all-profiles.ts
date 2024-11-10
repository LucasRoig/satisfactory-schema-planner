import { db } from "@/database/database";
import { ProfileRepository } from "@/database/repositories/profile-repository";

export async function fetchAllProfiles() {
  const profileRepository = new ProfileRepository(db);
  const profiles = await profileRepository.getAllProfiles();
  return profiles;
}
