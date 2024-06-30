import ClientCommand from "@/lib/clientCommand";
import Ipc from "@/lib/ipc";

const useSearchInput = (
  value: string,
  pathMode: boolean,
  setPathMode: (pathMode: boolean) => void,
  setCommands: (commands: ClientCommand[]) => void
) => {
  if (value.startsWith("~") || value.startsWith("/")) {
    if (!pathMode) {
      setPathMode(true);
    }

    if (value.endsWith("/") || value === "~") {
      Ipc.matchFilePaths(value, setCommands);
    }
  } else {
    if (pathMode) {
      setPathMode(false);
      Ipc.getCommands().then((value) => setCommands(value));
    }
  }
};

export default useSearchInput;
