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
  };

  return (
    <GlobalProviderContext.Provider value={value}>
      <h1>Hot Keys V2</h1>
    </GlobalProviderContext.Provider>
  );
};

export default App;
