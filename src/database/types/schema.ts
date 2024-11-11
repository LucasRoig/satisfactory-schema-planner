import type { EntityTable } from "dexie";
import { z } from "zod";

export type Schema = {
  id: number;
  name: string;
  icon: string | undefined;
  profileId: number;
  path: string;
};

const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_/";
export const pathSchema = z
  .string()
  .min(1)
  .startsWith("/")
  .refine((path) => path.split("").every((char) => allowedChars.includes(char)), `Allowed chars: ${allowedChars}`);

export const isSchemaValid = (schema: Omit<Schema, "id">) => {
  return pathSchema.safeParse(schema.path);
};

export type SchemaTable = EntityTable<
  Schema,
  "id" // primary key "id" (for the typings only)
>;

export const schemaStrDef = "++id, name, icon, profileId, path";
