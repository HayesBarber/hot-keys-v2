import { invoke } from "@tauri-apps/api/tauri";
import ClientCommand from "./clientCommand";

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
    const commands: ClientCommand[] = await invoke("get_commands");
    return commands;
  },

  commandSelected: async (
    command: ClientCommand,
    pathMode: boolean
  ): Promise<void> => {
    if (pathMode) {
      Ipc.onPathSelected(command.displayName);
    } else {
      invoke("command_selected", { i: command.index });
    }
    Ipc.hide();
  },

  onPathSelected: async (path: string): Promise<void> => {
    await invoke("on_path_selected", { path });
  },

  matchFilePaths: async (base: string): Promise<string[]> => {
    const matches: string[] = await invoke("match_file_paths", { base });
    return matches;
  },

  mapPathsToClientCommands: (paths: string[]): ClientCommand[] => {
    return paths.map((element, i) => ({
      hotKey: "",
      index: i,
      displayName: element,
    }));
  },
};

export default Ipc;
