import { db } from "@/database/database";
import { type InsertItem, ItemRepository } from "@/database/repositories/item-repository";

export async function createItem(item: InsertItem) {
  const repo = new ItemRepository(db);
  const i = await repo.insert(item);
  return i;
}
