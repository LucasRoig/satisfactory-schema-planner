import { OrDivider } from "@/components/or-divider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FolderOpen, PlusCircle, Settings } from "lucide-react";
import React from "react";
import { useProfileContext } from "../profile/profile-context";
import { useSettingsContext } from "../settings/settings-context";
import { CreateSchemaModal } from "./create-schema-modal";
import { Flow } from "./flow/flow";
import { OpenSchemaCommandDialog } from "./open-schema-command-dialog";
import { useSchemaDrawerContext } from "./schema-drawer-context";
import { SchemaTabs } from "./schema-tabs";

export function SchemaDrawer() {
  const { openenedSchemaIds, focusedSchemaId, setIsOpenSchemaDialogOpen } = useSchemaDrawerContext();
  const [isCreateSchemaModalOpen, setIsCreateSchemaModalOpen] = React.useState(false);
  const { selectedProfile, profiles, status: profileStatus, openCreateProfileModal, schemas } = useProfileContext();
  const { openSettingsModal } = useSettingsContext();

  if (profileStatus === "pending") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Skeleton className="w-[100px] h-[100px] rounded-full" />
      </div>
    );
  }
  if (profiles?.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Button onClick={openCreateProfileModal}>
          <PlusCircle className="h-5 w-5" />
          Create a profile
        </Button>
      </div>
    );
  }
  if (selectedProfile === undefined) {
    return <div className="w-full h-full flex items-center justify-center">Please select a profile</div>;
  }
  return (
    <div className="w-full h-full  flex flex-col">
      <OpenSchemaCommandDialog />
      {openenedSchemaIds.length > 0 ? <SchemaTabs /> : null}
      <div className="w-full h-full flex items-center justify-center grow relative">
        <SettingsButton className="absolute top-2 left-2 z-10" onClick={openSettingsModal} />
        {focusedSchemaId === undefined ? (
          <div className="flex flex-col">
            <CreateSchemaModal isOpen={isCreateSchemaModalOpen} setIsOpen={setIsCreateSchemaModalOpen} />
            <Button onClick={() => setIsCreateSchemaModalOpen(true)}>
              <PlusCircle className="h-5 w-5" />
              Create a schema
            </Button>
            <OrDivider />
            <Button onClick={() => setIsOpenSchemaDialogOpen(true)} disabled={schemas.size === 0}>
              <FolderOpen className="h-5 w-5" />
              Open a schema
            </Button>
          </div>
        ) : (
          <Flow />
        )}
      </div>
    </div>
  );
}

function SettingsButton({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Button variant="outline" className={cn("rounded-full", className)} size="icon" onClick={onClick}>
      <Settings className="h-5 w-5" />
    </Button>
  );
}
