import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { match } from "ts-pattern";
import { useSettingsContext } from "./settings-context";

export function SettingsBreadcrumbs() {
  const { screen } = useSettingsContext();
  if (screen.screen === "HOME") {
    return null;
  }

  const component = match(screen)
    .with({ screen: "ITEM_DETAILS" }, (s) => <ItemDetailsBreadcrumbs itemId={s.itemId} />)
    .with({ screen: "CREATE_ITEM" }, () => <CreateItemBreadcrumbs />)
    .with({ screen: "BUILDING_DETAILS" }, (s) => <BuildindDetailsBreadcrumbs buildingId={s.buildingId} />)
    .with({ screen: "CREATE_BUILDING" }, () => <CreateBuildingBreadcrumbs />)
    .exhaustive();

  return (
    <Breadcrumb>
      <BreadcrumbList>{component}</BreadcrumbList>
    </Breadcrumb>
  );
}

const ItemDetailsBreadcrumbs = (props: { itemId: number }) => {
  return (
    <>
      <HomeItem />
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Item: {props.itemId}</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
};

const CreateItemBreadcrumbs = () => {
  return (
    <>
      <HomeItem />
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Create Item</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
};

const BuildindDetailsBreadcrumbs = (props: { buildingId: number }) => {
  return (
    <>
      <>
        <HomeItem />
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Building: {props.buildingId}</BreadcrumbPage>
        </BreadcrumbItem>
      </>
    </>
  );
};

const CreateBuildingBreadcrumbs = () => {
  return (
    <>
      <HomeItem />
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Create Building</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
};

const HomeItem = () => {
  const { openHome } = useSettingsContext();
  return (
    <BreadcrumbItem>
      <BreadcrumbLink onClick={openHome} href="#">
        Home
      </BreadcrumbLink>
    </BreadcrumbItem>
  );
};
