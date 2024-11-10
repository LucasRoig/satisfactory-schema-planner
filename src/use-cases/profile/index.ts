import { createProfile } from "./create-profile";
import { fetchAllProfilesAndDefaultProfile } from "./fetch-all-profiles-and-default-profile";
import { profileToJson } from "./profile-to-json";
import { setProfileInConfig } from "./set-profile-in-config";

export const ProfileUseCases = {
  fetchAllProfilesAndDefaultProfile,
  setProfileInConfig,
  createProfile,
  profileToJson,
};
