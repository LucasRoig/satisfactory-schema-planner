import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import React from "react";

export function CreateProfileModal(props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit?: (args: { name: string }) => void;
}) {
  const [name, setName] = React.useState("Default");
  const canValidate = name && name.length > 0;

  const onSubmit = () => {
    if (props.onSubmit) {
      props.onSubmit({ name });
    }
  };
  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new profile</DialogTitle>
          <DialogDescription>Create a new profile. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} id="name" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" disabled={!canValidate} onClick={onSubmit}>
              Create profile
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
