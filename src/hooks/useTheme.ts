import { useEffect } from "react";
import Ipc from "@/lib/ipc";

const useTheme = () => {
  const onTheme = (theme: string) => {
    const themes = ["light", "dark"];

    if (!themes.includes(theme)) return;

    const root = window.document.documentElement;

    root.classList.remove(...themes);

    root.classList.add(theme);
  };

  useEffect(() => {
    async function fetchTheme() {
      try {
        let response = await Ipc.getTheme();
        onTheme(response);
      } catch {
        console.error("Failed to get theme");
      }
    }

    fetchTheme();
  }, []);
};

export default useTheme;
