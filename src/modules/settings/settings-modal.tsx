import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ItemsDetails } from "./items-details";
import { ItemsTable } from "./items-table";
import { useSettingsContext } from "./settings-context";

export function SettingsModal(props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { screen } = useSettingsContext();
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
            {screen.screen === "HOME" ? (
              <div className="flex items-center justify-between gap-4 max-h-full overflow-auto h-full">
                <ItemsTable />
                <ItemsTable />
              </div>
            ) : null}
            {screen.screen === "ITEM_DETAILS" ? <ItemsDetails /> : null}
            {screen.screen === "CREATE_ITEM" ? <div /> : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
