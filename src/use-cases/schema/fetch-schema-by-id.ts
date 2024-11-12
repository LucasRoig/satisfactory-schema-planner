import { db } from "@/database/database";
import { SchemaRepository } from "@/database/repositories/schema-repository";

export function fetchSchemaById(id: number) {
  const schemaRepo = new SchemaRepository(db);
  const schema = schemaRepo.findById(id);
  return schema;
}
