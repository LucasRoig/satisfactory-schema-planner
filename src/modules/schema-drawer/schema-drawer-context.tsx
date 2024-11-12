import React, { useContext, useEffect } from "react";
import { useProfileContext } from "../profile/profile-context";

type SchemaDrawerContextType = {
  openenedSchemaIds: number[];
  focusedSchemaId: number | undefined;
  focusSchema: (schemaId: number) => void;
  openSchema: (schemaId: number) => void;
  closeSchema: (schemaId: number) => void;
  isOpenSchemaDialogOpen: boolean;
  setIsOpenSchemaDialogOpen: (isOpen: boolean) => void;
};

export type SchemaDrawerContextProviderProps = {
  children: React.ReactNode;
};

const SchemaDrawerContext = React.createContext<SchemaDrawerContextType | undefined>(undefined);

export const SchemaDrawerContextProvider: React.FC<SchemaDrawerContextProviderProps> = (props) => {
  const { selectedProfile } = useProfileContext();
  const [openenedSchemaIds, setOpenenedSchemaIds] = React.useState<number[]>([]);
  const [focusedSchemaId, setFocusedSchemaId] = React.useState<number>();
  const [isOpenSchemaDialogOpen, setIsOpenSchemaDialogOpen] = React.useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setOpenenedSchemaIds([]);
    setFocusedSchemaId(undefined);
  }, [selectedProfile]);

  const value: SchemaDrawerContextType = {
    openenedSchemaIds,
    focusedSchemaId,
    focusSchema: (schemaId: number) => {
      if (openenedSchemaIds.includes(schemaId)) {
        setFocusedSchemaId(schemaId);
      } else {
        throw new Error("Schema not found");
      }
    },
    openSchema: (schemaId: number) => {
      if (!openenedSchemaIds.includes(schemaId)) {
        setOpenenedSchemaIds((ids) => [...ids, schemaId]);
      }
      setFocusedSchemaId(schemaId);
    },
    closeSchema: (schemaId: number) => {
      const index = openenedSchemaIds.indexOf(schemaId);
      if (index === -1) {
        throw new Error("Schema not found");
      }
      const isCurrentlyFocused = schemaId === focusedSchemaId;

      const nextFocus =
        openenedSchemaIds.length === 1 ? undefined : (openenedSchemaIds[index + 1] ?? openenedSchemaIds[index - 1]);
      setOpenenedSchemaIds((ids) => ids.filter((id) => id !== schemaId));
      if (isCurrentlyFocused) {
        setFocusedSchemaId(nextFocus);
      }
    },
    isOpenSchemaDialogOpen,
    setIsOpenSchemaDialogOpen,
  };
  return <SchemaDrawerContext.Provider value={value}>{props.children}</SchemaDrawerContext.Provider>;
};

export const useSchemaDrawerContext = () => {
  const context = useContext(SchemaDrawerContext);
  if (context === undefined) {
    throw new Error("useSchemaDrawerContext must be used within a SchemaDrawerContextProvider");
  }
  return context;
};
