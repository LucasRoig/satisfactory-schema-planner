import { db } from "@/database/database";
import { type InsertRecipe, RecipeRepository } from "@/database/repositories/recipe-repository";

export async function createRecipe(recipe: InsertRecipe) {
  const repo = new RecipeRepository(db);
  const i = await repo.insert(recipe);
  return i;
}
