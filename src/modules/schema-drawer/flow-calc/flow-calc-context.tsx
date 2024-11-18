import React, { useContext } from "react";
import type { FlowInfoMap } from "./flow-calc";

type FlowCalcContextType = {
  flowInfoMap: FlowInfoMap;
  setFlowInfoMap: (flowInfoMap: FlowInfoMap) => void;
};

export type FlowCalcContextProviderProps = {
  children: React.ReactNode;
};

const FlowCalcContext = React.createContext<FlowCalcContextType | undefined>(undefined);

export const FlowCalcContextProvider: React.FC<FlowCalcContextProviderProps> = (props) => {
  const [flowInfoMap, setFlowInfoMap] = React.useState<FlowInfoMap>(new Map());
  const value: FlowCalcContextType = {
    flowInfoMap,
    setFlowInfoMap,
  };
  return <FlowCalcContext.Provider value={value}>{props.children}</FlowCalcContext.Provider>;
};

export const useFlowCalcContext = () => {
  const context = useContext(FlowCalcContext);
  if (context === undefined) {
    throw new Error("useFlowCalcContext must be used within a FlowCalcContextProvider");
  }
  return context;
};
