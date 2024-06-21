import { createContext, useContext } from "react";
import ClientCommand from "@/lib/clientCommand";

export type GlobalState = {
  toggleUi: string;
  commands: ClientCommand[];
};

export const defaultGlobalState: GlobalState = {
  toggleUi: "",
  commands: [],
};

export const GlobalProviderContext =
  createContext<GlobalState>(defaultGlobalState);

export const useGlobalState = () => {
  const context = useContext(GlobalProviderContext);

  return context;
};
