import { createContext, useContext } from "react";
import ClientCommand from "@/lib/clientCommand";

export type GlobalState = {
  toggleUi: string;
  commands: ClientCommand[];
  pathMode: boolean;
  setPathMode: (pathMode: boolean) => void;
  paths: string[];
  setPaths: (paths: string[]) => void;
};

export const defaultGlobalState: GlobalState = {
  toggleUi: "",
  commands: [],
  pathMode: false,
  setPathMode: () => null,
  paths: [],
  setPaths: () => null,
};

export const GlobalProviderContext =
  createContext<GlobalState>(defaultGlobalState);

export const useGlobalState = () => {
  const context = useContext(GlobalProviderContext);

  return context;
};
