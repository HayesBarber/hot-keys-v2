const useSearchInput = (
  value: string,
  pathMode: boolean,
  setPathMode: (pathMode: boolean) => void
) => {
  if (value.startsWith("~") || value.startsWith("/")) {
    if (!pathMode) setPathMode(true);
  } else {
    if (pathMode) setPathMode(false);
  }
};

export default useSearchInput;
