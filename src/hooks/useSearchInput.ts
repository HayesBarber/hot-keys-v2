import ClientCommand from "@/lib/clientCommand";
import Ipc from "@/lib/ipc";

let lastValue = "";

const wentBackADirectory = (value: string): boolean => {
  return (
    value.length > 0 &&
    lastValue.length > 0 &&
    value.length < lastValue.length &&
    !value.endsWith("/") &&
    lastValue.endsWith("/")
  );
};

const onSearchInput = (
  value: string,
  pathMode: boolean,
  setPathMode: (pathMode: boolean) => void,
  setCommands: (commands: ClientCommand[]) => void
) => {
  const valueIsPath: boolean = value.startsWith("~") || value.startsWith("/");

  if (!valueIsPath && pathMode) {
    setPathMode(false);
    Ipc.getCommands().then((value) => setCommands(value));
    return;
  }

  if (!valueIsPath) return;

  if (!pathMode) {
    setPathMode(true);
  }

  if (value.endsWith("/") || value === "~") {
    Ipc.matchFilePaths(value, setCommands);
  } else if (wentBackADirectory(value)) {
    Ipc.matchFilePaths(value.split("/")[0] ?? "", setCommands);
  }
};

const useSearchInput = (
  value: string,
  pathMode: boolean,
  setPathMode: (pathMode: boolean) => void,
  setCommands: (commands: ClientCommand[]) => void
) => {
  onSearchInput(value, pathMode, setPathMode, setCommands);
  lastValue = value;
};

export default useSearchInput;
