import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

type ProfileSwitcherProps = PopoverTriggerProps;

export function ProfileSwitcher({ className }: ProfileSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedProfile, setSelectedProfile] = React.useState("Default");
  const profiles = [
    "Default",
    "Custom",
    "Custom 2",
    "Custom 3",
    "Custom 4",
    "Custom 5",
    "Custom 6",
    "Custom 7",
    "Custom 8",
  ];
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className={cn("w-[200px] justify-between", className)}
        >
          {selectedProfile}
          <ChevronsUpDown className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No profile found.</CommandEmpty>
            {profiles.map((p) => (
              <CommandItem
                key={p}
                onSelect={() => {
                  setSelectedProfile(p);
                  setOpen(false);
                }}
                className="text-sm"
              >
                {p}
                <Check className={cn("ml-auto", selectedProfile === p ? "opacity-100" : "opacity-0")} />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
