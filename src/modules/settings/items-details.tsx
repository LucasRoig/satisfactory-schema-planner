import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSettingsContext } from "./settings-context";

export function ItemsDetails() {
  const { screen, openHome } = useSettingsContext();
  if (screen.screen !== "ITEM_DETAILS") {
    return <div>{`screen is ${screen.screen} what are you doing here?`}</div>;
  }

  return (
    <div className="w-full flex flex-col overflow-auto max-h-full h-full my-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={openHome} href="#">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Item: {screen.itemId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grow">{`item id is ${screen.itemId}`}</div>
    </div>
  );
}
