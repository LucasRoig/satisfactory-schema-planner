import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Command } from "./ui/command";
import { cn } from "@/lib/utils";
import { useProfileContext } from "@/modules/profile/profile-context";

export function ItemCombobox(props: { selectedItemId?: number, onSelect?: (itemId: number) => void }) {
  const {selectedItemId, onSelect} = props;
  const { items } = useProfileContext();
  const [open, setOpen] = React.useState(false);

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
          {selectedItemId ? items.get(selectedItemId)?.name : "Select item..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search an item..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {[...items.values()].map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    onSelect?.(item.id);
                    setOpen(false);
                  }}
                  className="text-sm"
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedItemId === item.id ? "opacity-100" : "opacity-0")} />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
