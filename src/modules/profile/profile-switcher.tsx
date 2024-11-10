import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import React from "react";
import { useProfileContext } from "./profile-context";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

type ProfileSwitcherProps = PopoverTriggerProps;

export function ProfileSwitcher({ className }: ProfileSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const { profiles, selectedProfile, setSelectedProfile, openCreateProfileModal } = useProfileContext();
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
          {selectedProfile?.name ?? "No profile selected"}
          <ChevronsUpDown className="ml-auto opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No profile found.</CommandEmpty>
            {profiles?.map((p) => (
              <CommandItem
                key={p.id}
                onSelect={() => {
                  setSelectedProfile(p.id);
                  setOpen(false);
                }}
                className="text-sm"
              >
                {p.name}
                <Check className={cn("ml-auto", selectedProfile === p ? "opacity-100" : "opacity-0")} />
              </CommandItem>
            ))}
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  openCreateProfileModal();
                }}
              >
                <PlusCircle className="h-5 w-5" />
                Create Profile
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
