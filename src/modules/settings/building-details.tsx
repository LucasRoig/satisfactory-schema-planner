import { Button } from "@/components/ui/button";
import { useProfileContext } from "../profile/profile-context";
import { SettingsBreadcrumbs } from "./settings-breadcrumbs";
import { useSettingsContext } from "./settings-context";

export function BuildingDetails() {
  const { screen, openHome } = useSettingsContext();
  const { buildings } = useProfileContext();
  if (screen.screen !== "BUILDING_DETAILS") {
    return <div>{`screen is ${screen.screen} what are you doing here?`}</div>;
  }
  const building = buildings.get(screen.buildingId);

  return (
    <div className="w-full flex flex-col overflow-auto max-h-full h-full my-4">
      <SettingsBreadcrumbs />
      <div className="grow ">
        <h2 className="text-2xl font-semibold tracking-tight">
          {building?.name ?? `Cannot find item ${screen.buildingId}`}
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
