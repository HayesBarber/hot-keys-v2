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

  commandSelected: async (i: number): Promise<void> => {
    await invoke("command_selected", { i });
  },
};

export default Ipc;
