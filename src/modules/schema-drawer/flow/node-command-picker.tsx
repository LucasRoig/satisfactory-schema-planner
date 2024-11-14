import { PseudoFormDescription, PseudoFormItem, PseudoFormLabel } from "@/components/pseudo-form";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  }
];

export function NodeCommandPicker(props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSelect?: (name: NodeType) => void;
}) {
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
      </CommandList>
    </CommandDialog>
  );
}
