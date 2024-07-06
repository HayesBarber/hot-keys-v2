import ClientCommand from "@/lib/clientCommand";
import Ipc from "@/lib/ipc";

let lastValue = "";

const wentBackADirectory = (value: string): boolean => {
  return (
    value.length < lastValue.length &&
    !value.endsWith("/") &&
    lastValue.endsWith("/")
  );
};

const getPreviousDirectory = (str: string) => {
  const lastIndex = str.lastIndexOf("/");

  if (lastIndex === -1) {
    return str;
  }

  return str.substring(0, lastIndex + 1);
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
    Ipc.matchFilePaths(getPreviousDirectory(value), setCommands);
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
