import type { DexieDbType, Profile } from "../database";

export type InsertProfile = Omit<Profile, "id">;

export class ProfileRepository {
  constructor(private db: DexieDbType) {}

  public async getAllProfiles() {
    const profiles = await this.db.profiles.toArray();
    return profiles;
  }

  public async findById(id: number) {
    const profile = await this.db.profiles.get(id);
    return profile;
  }

  public async insertProfile(profile: InsertProfile) {
    const id = await this.db.profiles.add(profile);
    return {
      ...profile,
      id,
    };
  }
}
