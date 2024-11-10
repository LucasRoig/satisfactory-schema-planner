import { db } from "@/database/database";
import { GlobalConfigRepository } from "@/database/repositories/global-config-repository";
import { ProfileRepository } from "@/database/repositories/profile-repository";

export async function fetchAllProfilesAndDefaultProfile() {
  const profileRepository = new ProfileRepository(db);
  const globalConfigRepository = new GlobalConfigRepository(db);

  const profiles = await profileRepository.getAllProfiles();
  const config = await globalConfigRepository.getGlobalConfig();

  return {
    profiles,
    defaultProfileId: config.selectedProfileId,
  };
}
