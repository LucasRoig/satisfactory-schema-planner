import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useProfileContext } from "../profile/profile-context";
import { useSchemaDrawerContext } from "./schema-drawer-context";

export function OpenSchemaCommandDialog() {
  const { isOpenSchemaDialogOpen, setIsOpenSchemaDialogOpen, openSchema } = useSchemaDrawerContext();
  const { schemas } = useProfileContext();
  return (
    <CommandDialog open={isOpenSchemaDialogOpen} onOpenChange={setIsOpenSchemaDialogOpen}>
      <CommandInput placeholder="Search a schema..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Schemas">
          {[...schemas.values()].map((s) => (
            <CommandItem
              onSelect={() => {
                openSchema(s.id);
                setIsOpenSchemaDialogOpen(false);
              }}
              key={s.id}
            >
              {s.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
