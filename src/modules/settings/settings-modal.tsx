import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ItemsTable } from "./items-table";

export function SettingsModal(props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent
        className="w-[90vw] max-w-[90vw] h-[90vh] overflow-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="w-full flex flex-col overflow-auto max-h-full h-full">
          <DialogHeader>
            <DialogTitle>Configure this profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col overflow-auto max-h-full h-full grow">
            <div className="flex items-center justify-between gap-4 max-h-full overflow-auto h-full">
              <ItemsTable />
              <ItemsTable />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}