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
      Ipc.matchFilePaths(value).then((v) => {
        const commands: ClientCommand[] = Ipc.mapPathsToClientCommands(v);

        setCommands(commands);
      });
    }
  } else {
    if (pathMode) {
      setPathMode(false);
      Ipc.getCommands().then((value) => setCommands(value));
    }
  }
};

export default useSearchInput;
