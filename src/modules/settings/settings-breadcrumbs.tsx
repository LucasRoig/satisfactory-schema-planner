import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { match } from "ts-pattern";
import { useProfileContext } from "../profile/profile-context";
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
    .with({ screen: "CREATE_RECIPE" }, (s) => <CreateRecipeBreadcrumbs buildingId={s.buildingId} />)
    .exhaustive();

  return (
    <Breadcrumb>
      <BreadcrumbList>{component}</BreadcrumbList>
    </Breadcrumb>
  );
}

const ItemDetailsBreadcrumbs = (props: { itemId: number }) => {
  const { items } = useProfileContext();
  const item = items.get(props.itemId);
  return (
    <>
      <HomeItem />
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="text-muted-foreground">Items</BreadcrumbPage>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>{item?.name ?? props.itemId}</BreadcrumbPage>
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
  const { buildings } = useProfileContext();
  const building = buildings.get(props.buildingId);
  return (
    <>
      <HomeItem />
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="text-muted-foreground">Buildings</BreadcrumbPage>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>{building?.name ?? props.buildingId}</BreadcrumbPage>
      </BreadcrumbItem>
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

const CreateRecipeBreadcrumbs = (props: { buildingId: number }) => {
  const { buildings } = useProfileContext();
  const { openBuildingDetails } = useSettingsContext();
  const building = buildings.get(props.buildingId);
  return (
    <>
      <HomeItem />
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="text-muted-foreground">Buildings</BreadcrumbPage>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink onClick={() => openBuildingDetails(props.buildingId)} href="#">
          {building?.name ?? props.buildingId}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Add Recipe</BreadcrumbPage>
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
