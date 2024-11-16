import { PseudoFormDescription, PseudoFormItem, PseudoFormLabel } from "@/components/pseudo-form";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useProfileContext } from "@/modules/profile/profile-context";
import type { NodeType } from "../nodes/nodes-types";

type NodeItem = {
  name: string;
  type: NodeType;
  description: string;
};

const basicNodes: NodeItem[] = [
  {
    name: "Source",
    type: "source",
    description: "Produces items.",
  },
  {
    name: "Splitter",
    type: "splitter",
    description: "Splits an input into three outputs.",
  },
  {
    name: "Merger",
    type: "merger",
    description: "Merges three inputs into one output.",
  },
];

export function NodeCommandPicker(props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSelect?: (name: NodeType, args?: { buildingId?: number }) => void;
}) {
  const { buildings } = useProfileContext();

  return (
    <CommandDialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <CommandInput placeholder="Insert a node..." />
      <CommandList>
        <CommandEmpty>No node found.</CommandEmpty>
        <CommandGroup heading="Basic Nodes">
          {basicNodes.map((n) => (
            <CommandItem
              onSelect={() => {
                props.onSelect?.(n.type);
                props.setIsOpen(false);
              }}
              key={n.type}
            >
              <PseudoFormItem>
                <PseudoFormItem>
                  <PseudoFormLabel>{n.name}</PseudoFormLabel>
                  <PseudoFormDescription>{n.description}</PseudoFormDescription>
                </PseudoFormItem>
              </PseudoFormItem>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Buildings">
          {[...buildings.values()].map((b) => (
            <CommandItem
              onSelect={() => {
                props.onSelect?.("building", { buildingId: b.id });
                props.setIsOpen(false);
              }}
              key={b.id}
            >
              <PseudoFormItem>
                <PseudoFormItem>
                  <PseudoFormLabel>{b.name}</PseudoFormLabel>
                  <PseudoFormDescription>
                    {b.outputCount} outputs, {b.inputCount} inputs
                  </PseudoFormDescription>
                </PseudoFormItem>
              </PseudoFormItem>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
