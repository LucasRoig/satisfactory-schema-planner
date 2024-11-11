import { db } from "@/database/database";
import { type InsertSchema, SchemaRepository } from "@/database/repositories/schema-repository";

export async function insertSchema(schema: InsertSchema) {
  const repo = new SchemaRepository(db);
  const s = await repo.insertSchema(schema);
  return s;
}
