import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusCircle, X } from "lucide-react";
import React from "react";
import { CreateSchemaModal } from "./create-schema-modal";
import { useSchemaDrawerContext } from "./schema-drawer-context";

export function SchemaTabs() {
  const { openenedSchemaIds, focusedSchemaId, focusSchema, closeSchema } = useSchemaDrawerContext();
  const [isCreateSchemaModalOpen, setIsCreateSchemaModalOpen] = React.useState(false);
  return (
    <div className="bg-background border-b px-4 w-full h-10 flex justify-start items-center overflow-x-auto">
      <CreateSchemaModal isOpen={isCreateSchemaModalOpen} setIsOpen={setIsCreateSchemaModalOpen} />
      {openenedSchemaIds.map((id) => (
        <TabItem
          key={id}
          name={id.toString()}
          isActive={id === focusedSchemaId}
          onClick={() => focusSchema(id)}
          onClose={() => closeSchema(id)}
        />
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="ml-2 text-muted-foreground h-7 w-7 rounded-full"
        onClick={() => setIsCreateSchemaModalOpen(true)}
      >
        <PlusCircle className="h-4 w-4" />
        <span className="sr-only">Add new schema</span>
      </Button>
    </div>
  );
}

function TabItem(props: { name: string; isActive?: boolean; onClick?: () => void; onClose?: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      className={cn(
        "h-full flex items-center px-4 py-2 relative group text-muted-foreground text-sm border-r hover:bg-muted/50",
        props.isActive && "text-foreground shadow-sm bg-muted",
        !props.isActive && "hover:bg-muted/50",
      )}
      onClick={props.onClick}
    >
      <span className="mr-4">{props.name}</span>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          props.onClose?.();
        }}
        variant="ghost"
        size="sm"
        className="p-0 h-5 w-5 absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Close tab</span>
      </Button>
    </button>
  );
}
