import React, { useContext } from "react";
import { SettingsModal } from "./settings-modal";

type SettingsContextType = {
  openSettingsModal: () => void;
};

export type SettingsContextProviderProps = {
  children: React.ReactNode;
};

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

export const SettingsContextProvider: React.FC<SettingsContextProviderProps> = (props) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);

  const value: SettingsContextType = {
    openSettingsModal: () => setIsSettingsModalOpen(true),
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
