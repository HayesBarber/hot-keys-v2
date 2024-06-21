import { useCallback, useEffect } from "react";

const useKey = (key: string, onKey: () => void) => {
  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === key) {
      event.preventDefault();
      onKey();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", escFunction, false);

    return () => {
      window.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);
};

export default useKey;
