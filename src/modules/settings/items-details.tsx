import { Button } from "@/components/ui/button";
import { useProfileContext } from "../profile/profile-context";
import { SettingsBreadcrumbs } from "./settings-breadcrumbs";
import { useSettingsContext } from "./settings-context";

export function ItemsDetails() {
  const { screen, openHome } = useSettingsContext();
  const { items } = useProfileContext();
  if (screen.screen !== "ITEM_DETAILS") {
    return <div>{`screen is ${screen.screen} what are you doing here?`}</div>;
  }

  return (
    <div className="w-full flex flex-col overflow-auto max-h-full h-full my-4">
      <SettingsBreadcrumbs />
      <div className="grow ">
        <h2 className="text-2xl font-semibold tracking-tight">
          {items.get(screen.itemId)?.name ?? `Cannot find item ${screen.itemId}`}
        </h2>
        <p className="text-sm text-muted-foreground">Description placeholder</p>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" onClick={openHome}>
          Go back
        </Button>
      </div>
    </div>
  );
}
