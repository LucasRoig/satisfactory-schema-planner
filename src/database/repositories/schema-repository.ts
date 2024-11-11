import type { DexieDbType, Schema } from "../database";
import { isSchemaValid } from "../types/schema";
import { ProfileRepository } from "./profile-repository";

export type InsertSchema = Omit<Schema, "id">;

export class SchemaRepository {
  constructor(private db: DexieDbType) {}

  public async findByProfileId(profileId: number) {
    const schemas = await this.db.schemas.where("profileId").equals(profileId).toArray();
    return schemas;
  }

  public async insertSchema(schema: Omit<Schema, "id">) {
    const profileId = schema.profileId;
    const profileRepo = new ProfileRepository(this.db);
    const profile = await profileRepo.findById(profileId);
    if (profile === undefined) {
      throw new Error("Constraint violation: profile not found");
    }
    const isValid = isSchemaValid(schema);

    if (!isValid.success) {
      throw new Error(`Invalid schema: ${isValid.error.flatten()}`);
    }
    const id = await this.db.schemas.add(schema);
    return {
      ...schema,
      id,
    };
  }
}