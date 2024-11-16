import type { DexieDbType, Recipe } from "../database";
import { BuildingRepository } from "./building-repository";
import { ItemRepository } from "./item-repository";
import { ProfileRepository } from "./profile-repository";

export type InsertRecipe = Omit<Recipe, "id">;

export class RecipeRepository {
  constructor(private db: DexieDbType) {}

  public async findByProfileId(profileId: number) {
    const recipes = await this.db.recipes.where("profileId").equals(profileId).toArray();
    return recipes;
  }

  public async insert(recipe: InsertRecipe) {
    const profileId = recipe.profileId;
    const profileRepo = new ProfileRepository(this.db);
    const profile = await profileRepo.findById(profileId);
    if (profile === undefined) {
      throw new Error("Constraint violation: profile not found");
    }
    const buildingRepo = new BuildingRepository(this.db);
    const building = await buildingRepo.findById(recipe.buildingId);
    if (building === undefined) {
      throw new Error("Constraint violation: building not found");
    }
    if (building.profileId !== profileId) {
      throw new Error("Constraint violation: building profileId does not match recipe profileId");
    }
    if (recipe.inputs.length !== building.inputCount) {
      throw new Error("Constraint violation: recipe inputs count does not match building input count");
    }
    if (recipe.outputs.length !== building.outputCount) {
      throw new Error("Constraint violation: recipe outputs count does not match building output count");
    }
    const itemRepo = new ItemRepository(this.db);
    for (const input of recipe.inputs) {
      const item = await itemRepo.findById(input.itemId);
      if (item === undefined) {
        throw new Error("Constraint violation: input item not found");
      }
      if (item.profileId !== profileId) {
        throw new Error("Constraint violation: input item profileId does not match recipe profileId");
      }
    }
    const id = await this.db.recipes.add(recipe);
    return {
      ...recipe,
      id,
    };
  }
}
