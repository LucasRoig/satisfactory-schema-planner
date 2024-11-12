import { fetchProfileSchema } from "./fetch-profile-schema";
import { fetchSchemaById } from "./fetch-schema-by-id";
import { insertSchema } from "./insert-schema";
import { updateSchemaEdges } from "./update-schema-edges";
import { updateSchemaNodes } from "./update-schema-nodes";

export const SchemaUseCases = {
  fetchProfileSchema,
  insertSchema,
  fetchSchemaById,
  updateSchemaNodes,
  updateSchemaEdges,
};
