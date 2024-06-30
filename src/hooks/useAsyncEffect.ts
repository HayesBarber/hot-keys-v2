import { useEffect, useState } from "react";

const useAsyncEffect = <T>(fetch: () => Promise<T>, initValue: T) => {
  const [value, setValue] = useState<T>(initValue);

  useEffect(() => {
    async function fetchValue() {
      try {
        let response = await fetch();
        setValue(response);
      } catch {
        console.error("Failed to use async effect");
      }
    }

    fetchValue();
  }, []);

  return { value, setValue };
};

export default useAsyncEffect;
