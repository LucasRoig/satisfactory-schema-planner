import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { match } from "ts-pattern";
import { BuildingCreate } from "./buildings/building-create";
import { BuildingDetails } from "./buildings/building-details";
import { Home } from "./home";
import { ItemsCreate } from "./items/items-create";
import { ItemsDetails } from "./items/items-details";
import { RecipesCreate } from "./recipes/recipes-create";
import { useSettingsContext } from "./settings-context";

export function SettingsModal(props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { screen } = useSettingsContext();

  const component = match(screen)
    .with({ screen: "HOME" }, () => <Home />)
    .with({ screen: "ITEM_DETAILS" }, () => <ItemsDetails />)
    .with({ screen: "CREATE_ITEM" }, () => <ItemsCreate />)
    .with({ screen: "BUILDING_DETAILS" }, () => <BuildingDetails />)
    .with({ screen: "CREATE_BUILDING" }, () => <BuildingCreate />)
    .with({ screen: "CREATE_RECIPE" }, () => <RecipesCreate />)
    .exhaustive();

  const title = match(screen)
    .with({ screen: "HOME" }, () => "Configure this profile")
    .with({ screen: "ITEM_DETAILS" }, () => "Item details")
    .with({ screen: "CREATE_ITEM" }, () => "Create an item")
    .with({ screen: "BUILDING_DETAILS" }, () => "Building details")
    .with({ screen: "CREATE_BUILDING" }, () => "Create a building")
    .with({ screen: "CREATE_RECIPE" }, () => "Add a recipe")
    .exhaustive();

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent
        className="w-[90vw] max-w-[90vw] h-[90vh] overflow-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="w-full flex flex-col overflow-auto max-h-full h-full">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col overflow-auto max-h-full h-full grow">{component}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
