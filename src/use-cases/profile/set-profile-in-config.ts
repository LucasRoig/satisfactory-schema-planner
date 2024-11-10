import { db } from "@/database/database";
import { GlobalConfigRepository } from "@/database/repositories/global-config-repository";
import { ProfileRepository } from "@/database/repositories/profile-repository";

export async function setProfileInConfig(profileId: number) {
  const globalConfigRepository = new GlobalConfigRepository(db);
  const profileRepository = new ProfileRepository(db);
  const profile = await profileRepository.findById(profileId);
  if (profile === undefined) {
    throw new Error("Profile not found");
  }
  await globalConfigRepository.updateGlobalConfig({ selectedProfileId: profileId });
}
