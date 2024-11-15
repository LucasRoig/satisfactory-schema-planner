import { SettingsBreadcrumbs } from "./settings-breadcrumbs";
import { useSettingsContext } from "./settings-context";

export function BuildingDetails() {
  const { screen } = useSettingsContext();
  if (screen.screen !== "ITEM_DETAILS") {
    return <div>{`screen is ${screen.screen} what are you doing here?`}</div>;
  }

  return (
    <div className="w-full flex flex-col overflow-auto max-h-full h-full my-4">
      <SettingsBreadcrumbs />
      <div className="grow">{`building id is ${screen.itemId}`}</div>
    </div>
  );
}
