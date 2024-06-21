import { invoke } from "@tauri-apps/api/tauri";

class Ipc {
  public hide = async (): Promise<void> => {
    await invoke("hide");
  };

  public quit = async (): Promise<void> => {
    await invoke("quit");
  };

  public getToggleUiAccelerator = async (): Promise<string> => {
    const accelerator: string = await invoke("get_toggle_ui_accelerator");
    return accelerator;
  };

  public getTheme = async (): Promise<string> => {
    const theme: string = await invoke("get_theme");
    return theme;
  };

  public getCommands = () => {};

  public commandSelected = async (i: number): Promise<void> => {
    await invoke("command_selected", { i });
  };
}

export default Ipc;
