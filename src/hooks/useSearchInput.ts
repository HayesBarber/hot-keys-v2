import Ipc from "@/lib/ipc";

const useSearchInput = (
  value: string,
  pathMode: boolean,
  setPathMode: (pathMode: boolean) => void,
  setPaths: (paths: string[]) => void
) => {
  if (value.startsWith("~") || value.startsWith("/")) {
    if (!pathMode) {
      setPathMode(true);
    }

    if (value.endsWith("/") || value === "~") {
      Ipc.matchFilePaths(value).then((v) => setPaths(v));
    }
  } else {
    if (pathMode) {
      setPathMode(false);
      setPaths([]);
    }
  }
};

export default useSearchInput;
