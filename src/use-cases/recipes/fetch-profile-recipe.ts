import { db } from "@/database/database";
import { ProfileRepository } from "@/database/repositories/profile-repository";
import { RecipeRepository } from "@/database/repositories/recipe-repository";

export async function fetchProfileRecipes(profileId: number) {
  const profileRepo = new ProfileRepository(db);
  const recipesRepo = new RecipeRepository(db);

  const profile = await profileRepo.findById(profileId);
  if (profile === undefined) {
    throw new Error(`Profile not found: ${profileId}`);
  }

  const recipes = await recipesRepo.findByProfileId(profileId);
  return recipes;
}
