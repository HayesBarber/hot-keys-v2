import { useEffect, useRef } from "react";

const useFocus = () => {
  const inputRef = useRef<any>(null);

  useEffect(() => {
    const handleFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    handleFocus();

    if (inputRef.current) {
      window.addEventListener("focus", handleFocus);
      inputRef.current.addEventListener("blur", handleFocus);
    }

    return () => {
      if (inputRef.current) {
        window.removeEventListener("focus", handleFocus);
        inputRef.current.removeEventListener("blur", handleFocus);
      }
    };
  }, []);

  return inputRef;
};

export default useFocus;
