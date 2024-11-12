import { db } from "@/database/database";
import { SchemaRepository } from "@/database/repositories/schema-repository";
import type { Node } from "@xyflow/react";

export function updateSchemaNodes(schemaId: number, nodes: Node[]) {
  const schemaRepo = new SchemaRepository(db);
  return schemaRepo.updateSchemaNodes(schemaId, nodes);
}
