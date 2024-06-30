import { useState } from "react";
import Commands from "./components/commands";
import useAsyncEffect from "./hooks/useAsyncEffect";
import { GlobalProviderContext, GlobalState } from "./hooks/useGlobalState";
import useKey from "./hooks/useKey";
import useTheme from "./hooks/useTheme";
import "./index.css";
import Ipc from "./lib/ipc";

const App: React.FC = () => {
  useTheme();
  useKey("Escape", () => Ipc.hide());
  const { value: commands, setValue: setCommands } = useAsyncEffect(
    Ipc.getCommands,
    []
  );
  const { value: toggleUi } = useAsyncEffect(Ipc.getToggleUiAccelerator, "");
  const [pathMode, setPathMode] = useState(false);
  const [commandValue, setCommandValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  const value: GlobalState = {
    commands,
    setCommands,
    toggleUi,
    pathMode,
    setPathMode,
    commandValue,
    setCommandValue,
    inputValue,
    setInputValue,
  };

  return (
    <GlobalProviderContext.Provider value={value}>
      <Commands />
    </GlobalProviderContext.Provider>
  );
};

export default App;
