import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function SettingsModal(props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Configure this profile</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
