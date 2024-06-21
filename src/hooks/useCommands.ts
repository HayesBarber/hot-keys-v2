import ClientCommand from "@/lib/clientCommand";
import { useEffect, useState } from "react";
import Ipc from "@/lib/ipc";

const useCommands = () => {
  const [commands, setCommands] = useState<ClientCommand[]>([]);

  useEffect(() => {
    async function fetchCommands() {
      try {
        let response = await Ipc.getCommands();
        setCommands(response);
      } catch {
        console.error("Failed to get commands");
      }
    }

    fetchCommands();
  }, []);

  return commands;
};

export default useCommands;
