import type { DexieDbType, Item } from "../database";
import { ProfileRepository } from "./profile-repository";

export type InsertItem = Omit<Item, "id">;

export class ItemRepository {
  constructor(private db: DexieDbType) {}

  public async findByProfileId(profileId: number) {
    const items = await this.db.items.where("profileId").equals(profileId).toArray();
    return items;
  }

  public async insert(item: InsertItem) {
    const profileId = item.profileId;
    const profileRepo = new ProfileRepository(this.db);
    const profile = await profileRepo.findById(profileId);
    if (profile === undefined) {
      throw new Error("Constraint violation: profile not found");
    }
    const id = await this.db.items.add(item);
    return {
      ...item,
      id,
    };
  }
}
