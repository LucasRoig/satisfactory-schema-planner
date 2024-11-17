import { cn } from "@/lib/utils";
import { useProfileContext } from "@/modules/profile/profile-context";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function RecipeCombobox(props: {
  selectedRecipeId?: number;
  onSelect?: (recipeId: number) => void;
  buildingId: number;
}) {
  const { selectedRecipeId, onSelect } = props;
  const [open, setOpen] = React.useState(false);
  const { recipes } = useProfileContext();
  let selectableRecipes = [...recipes.values()];

  if (props.buildingId !== undefined) {
    selectableRecipes = selectableRecipes.filter((r) => r.buildingId === props.buildingId);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedRecipeId ? recipes.get(selectedRecipeId)?.name : "Select recipe..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search a recipe..." />
          <CommandList>
            <CommandEmpty>No recipe found.</CommandEmpty>
            <CommandGroup>
              {selectableRecipes.map((recipe) => (
                <CommandItem
                  key={recipe.id}
                  onSelect={() => {
                    onSelect?.(recipe.id);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedRecipeId === recipe.id ? "opacity-100" : "opacity-0")} />
                  {recipe.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
