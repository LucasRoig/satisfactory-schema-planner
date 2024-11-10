import { createProfile } from "./create-profile";
import { fetchAllProfiles } from "./fetch-all-profiles";
import { profileToJson } from "./profile-to-json";

export const ProfileUseCases = {
  fetchAllProfiles,
  createProfile,
  profileToJson,
};
