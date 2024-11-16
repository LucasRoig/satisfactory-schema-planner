import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProfileContext } from "@/modules/profile/profile-context";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";
import React from "react";
import { useMemo } from "react";
import { useSettingsContext } from "../settings-context";

type MapValue<T> = T extends Map<infer _K, infer V> ? V : never;
type Recipe = MapValue<ReturnType<typeof useProfileContext>["recipes"]>;

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    header: "Inputs",
    cell: ({ row }) => {
      const recipe = row.original;
      return recipe.inputs.map((input) => input.itemId).join(", ");
    },
  },
  {
    header: "Outputs",
    cell: ({ row }) => {
      const recipe = row.original;
      return recipe.outputs.map((output) => output.itemId).join(", ");
    },
  },
] as const satisfies ColumnDef<Recipe, unknown>[];

export function RecipesTable(props: { buildingId: number }) {
  const { recipes: allRecipes } = useProfileContext();
  const { openCreateRecipe } = useSettingsContext();

  const recipes = useMemo(() => {
    return [...allRecipes.values()].filter((recipe) => recipe.buildingId === props.buildingId);
  }, [allRecipes, props.buildingId]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: recipes,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full flex flex-col overflow-auto max-h-full h-full">
      <div className="flex flex-col py-4 gap-4">
        <div className="text-xl">Recipes</div>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter recipes..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" className="ml-auto" onClick={() => openCreateRecipe(props.buildingId)}>
            <PlusCircle className="h-5 w-5" />
            Add recipe
          </Button>
        </div>
      </div>
      <div className="rounded-md border overflow-auto grow max-h-full flex flex-col">
        <Table className="max-h-full overflow-auto bg-background">
          <TableHeader className="sticky -top-px z-10 bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {}}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
