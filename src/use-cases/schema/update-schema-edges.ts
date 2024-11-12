import { db } from "@/database/database";
import { SchemaRepository } from "@/database/repositories/schema-repository";
import type { Edge } from "@xyflow/react";

export function updateSchemaEdges(schemaId: number, edges: Edge[]) {
  const schemaRepo = new SchemaRepository(db);
  return schemaRepo.updateSchemaEdges(schemaId, edges);
}
