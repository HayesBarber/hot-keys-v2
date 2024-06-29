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
  const commands = useAsyncEffect(Ipc.getCommands, []);
  const toggleUi = useAsyncEffect(Ipc.getToggleUiAccelerator, "");

  const value: GlobalState = {
    commands,
    toggleUi,
    pathMode: false,
  };

  return (
    <GlobalProviderContext.Provider value={value}>
      <Commands />
    </GlobalProviderContext.Provider>
  );
};

export default App;
