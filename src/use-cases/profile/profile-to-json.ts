import { db } from "@/database/database";
import { BuildingRepository } from "@/database/repositories/building-repository";
import { ItemRepository } from "@/database/repositories/item-repository";
import { ProfileRepository } from "@/database/repositories/profile-repository";
import { RecipeRepository } from "@/database/repositories/recipe-repository";
import { SchemaRepository } from "@/database/repositories/schema-repository";
import { z } from "zod";

const exportSchema = z.object({
  name: z.string(),
  id: z.number(),
  items: z.array(z.object({
    id: z.number(),
    name: z.string(),
    icon: z.string().optional(),
  })),
  buildings: z.array(z.object({
    id: z.number(),
    name: z.string(),
    icon: z.string().optional(),
    inputCount: z.number(),
    outputCount: z.number(),
  })),
  recipes: z.array(z.object({
    id: z.number(),
    name: z.string(),
    icon: z.string().optional(),
    buildingId: z.number(),
    inputs: z.array(z.object({
      itemId: z.number(),
      quantity: z.number(),
    })),
    outputs: z.array(z.object({
      itemId: z.number(),
      quantity: z.number(),
    })),
  })),
  schemas: z.array(z.object({
    id: z.number(),
    name: z.string(),
    icon: z.string().optional(),
    path: z.string(),
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
  })),
})

export async function profileToJson(profileId: number) {
  const profileRepo = new ProfileRepository(db);
  const buildinRepo = new BuildingRepository(db);
  const itemRepo = new ItemRepository(db);
  const recipesRepo = new RecipeRepository(db);
  const schemaRepo = new SchemaRepository(db);

  const profile = await profileRepo.findById(profileId);

  if (profile === undefined) {
    throw new Error("Profile not found");
  }

  const buildings = await buildinRepo.findByProfileId(profileId);
  const items = await itemRepo.findByProfileId(profileId);
  const recipes = await recipesRepo.findByProfileId(profileId);
  const schemas = await schemaRepo.findByProfileId(profileId);

  const parsed = exportSchema.safeParse({
    name: profile.name,
    id: profile.id,
    buildings,
    items,
    recipes,
    schemas,
  })
  if (!parsed.success) {
    throw new Error("Invalid profile");
  }

  return JSON.stringify(parsed.data);
}
