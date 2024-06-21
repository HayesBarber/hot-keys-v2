import { useEffect, useState } from "react";
import Ipc from "@/lib/ipc";

const useToggleUi = () => {
  const [toggleUi, setToggleUi] = useState<string>("");

  useEffect(() => {
    async function fetchToggleUi() {
      try {
        let response = await Ipc.getToggleUiAccelerator();
        setToggleUi(response);
      } catch {
        console.error("Failed to get toggle ui accelerator");
      }
    }

    fetchToggleUi();
  }, []);

  return toggleUi;
};

export default useToggleUi;
