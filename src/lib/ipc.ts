import { invoke } from "@tauri-apps/api/tauri";
import ClientCommand from "./clientCommand";

let commands: ClientCommand[] = [];

const Ipc = {
  hide: async (): Promise<void> => {
    await invoke("hide");
  },

  quit: async (): Promise<void> => {
    await invoke("quit");
  },

  getToggleUiAccelerator: async (): Promise<string> => {
    const accelerator: string = await invoke("get_toggle_ui_accelerator");
    return accelerator;
  },

  getTheme: async (): Promise<string> => {
    const theme: string = await invoke("get_theme");
    return theme;
  },

  getCommands: async (): Promise<ClientCommand[]> => {
    if (!commands.length) {
      const result: ClientCommand[] = await invoke("get_commands");
      commands = result;
    }

    return commands;
  },

  commandSelected: async (
    command: ClientCommand,
    pathMode: boolean
  ): Promise<void> => {
    if (pathMode) {
      Ipc.onPathSelected(command);
    } else {
      invoke("command_selected", { i: command.index });
    }
    Ipc.hide();
  },

  onPathSelected: async (command: ClientCommand): Promise<void> => {
    await invoke("on_path_selected", { i: command.index });
  },

  matchFilePaths: async (
    base: string,
    setCommands: (commands: ClientCommand[]) => void
  ): Promise<void> => {
    const matches: ClientCommand[] = await invoke("match_file_paths", { base });
    setCommands(matches);
  },
};

export default Ipc;
