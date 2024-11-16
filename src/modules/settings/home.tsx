import { BuildingsTable } from "./buildings/building-table";
import { ItemsTable } from "./items/items-table";

export function Home() {
  return (
    <div className="flex items-center justify-between gap-4 max-h-full overflow-auto h-full">
      <ItemsTable />
      <BuildingsTable />
    </div>
  );
}
