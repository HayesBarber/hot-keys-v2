import { useCallback, useEffect } from "react";

const useKey = (key: string, onKey: () => void, deps: any[] = []) => {
  const keyFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === key) {
      event.preventDefault();
      onKey();
    }
  }, deps);

  useEffect(() => {
    window.addEventListener("keydown", keyFunction, false);

    return () => {
      window.removeEventListener("keydown", keyFunction, false);
    };
  }, [keyFunction]);
};

export default useKey;
