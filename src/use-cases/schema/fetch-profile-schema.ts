import { db } from "@/database/database";
import { ProfileRepository } from "@/database/repositories/profile-repository";
import { SchemaRepository } from "@/database/repositories/schema-repository";

export async function fetchProfileSchema(profileId: number) {
  const profileRepo = new ProfileRepository(db);
  const schemaRepo = new SchemaRepository(db);
  const profile = await profileRepo.findById(profileId);
  if (profile === undefined) {
    throw new Error(`Profile not found: ${profileId}`);
  }
  const items = await schemaRepo.findByProfileId(profileId);
  return items;
}
