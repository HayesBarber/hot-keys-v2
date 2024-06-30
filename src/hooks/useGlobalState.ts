import { createContext, useContext } from "react";
import ClientCommand from "@/lib/clientCommand";

export type GlobalState = {
  toggleUi: string;
  commands: ClientCommand[];
  setCommands: (commands: ClientCommand[]) => void;
  pathMode: boolean;
  setPathMode: (pathMode: boolean) => void;
  commandValue: string;
  setCommandValue: (value: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
};

export const defaultGlobalState: GlobalState = {
  toggleUi: "",
  commands: [],
  setCommands: () => null,
  pathMode: false,
  setPathMode: () => null,
  commandValue: "",
  setCommandValue: () => null,
  inputValue: "",
  setInputValue: () => null,
};

export const GlobalProviderContext =
  createContext<GlobalState>(defaultGlobalState);

export const useGlobalState = () => {
  const context = useContext(GlobalProviderContext);

  return context;
};
