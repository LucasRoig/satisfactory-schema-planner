import { db } from "@/database/database";
import { type InsertProfile, ProfileRepository } from "@/database/repositories/profile-repository";

export async function createProfile(profile: InsertProfile) {
  const repository = new ProfileRepository(db);
  const p = await repository.insertProfile(profile);
  return p;
}
