import React, { useContext } from "react";
import { SettingsModal } from "./settings-modal";

type SettingScreen =
  | {
      screen: "HOME";
    }
  | {
      screen: "ITEM_DETAILS";
      itemId: number;
    }
  | {
      screen: "CREATE_ITEM";
    }
  | {
      screen: "BUILDING_DETAILS";
      buildingId: number;
    }
  | {
      screen: "CREATE_BUILDING";
    }
  | {
      screen: "CREATE_RECIPE";
      buildingId: number;
    };

type SettingsContextType = {
  openSettingsModal: () => void;
  screen: SettingScreen;
  openItemDetails: (itemId: number) => void;
  openCreateItem: () => void;
  openBuildingDetails: (buildingId: number) => void;
  openCreateBuilding: () => void;
  openCreateRecipe: (buildingId: number) => void;
  openHome: () => void;
};

export type SettingsContextProviderProps = {
  children: React.ReactNode;
};

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

export const SettingsContextProvider: React.FC<SettingsContextProviderProps> = (props) => {
  const [screen, setScreen] = React.useState<SettingScreen>({ screen: "HOME" });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);

  const value: SettingsContextType = {
    openSettingsModal: () => setIsSettingsModalOpen(true),
    screen,
    openItemDetails: (itemId: number) => setScreen({ screen: "ITEM_DETAILS", itemId }),
    openHome: () => setScreen({ screen: "HOME" }),
    openCreateItem: () => setScreen({ screen: "CREATE_ITEM" }),
    openBuildingDetails: (buildingId: number) => setScreen({ screen: "BUILDING_DETAILS", buildingId }),
    openCreateBuilding: () => setScreen({ screen: "CREATE_BUILDING" }),
    openCreateRecipe: (buildingId: number) => setScreen({ screen: "CREATE_RECIPE", buildingId }),
  };

  return (
    <SettingsContext.Provider value={value}>
      <SettingsModal isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen} />
      {props.children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettingsContext must be used within a SettingsContextProvider");
  }
  return context;
};
