import { db } from "@/database/database";
import { ProfileRepository } from "@/database/repositories/profile-repository";

export async function profileToJson(profileId: number) {
  const repo = new ProfileRepository(db);
  const profile = await repo.findById(profileId);

  if (profile === undefined) {
    throw new Error("Profile not found");
  }

  return JSON.stringify({
    name: profile.name,
    id: profile.id,
  });
}
