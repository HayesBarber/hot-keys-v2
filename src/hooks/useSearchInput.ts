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
    Ipc.matchFilePaths(value).then((v) => setPaths(v));
  } else {
    if (pathMode) {
      setPathMode(false);
      setPaths([]);
    }
  }
};

export default useSearchInput;
