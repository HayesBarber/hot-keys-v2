import { invoke } from "@tauri-apps/api/tauri";

class Ipc {
  public hide = async () => {
    await invoke("hide");
  };

  public quit = async () => {
    await invoke("quit");
  };

  public getToggleUiAccelerator = async () => {
    const accelerator: string = await invoke("get_toggle_ui_accelerator");
    return accelerator;
  };

  public getTheme = async () => {
    const theme: string = await invoke("get_theme");
    return theme;
  };

  public getCommands = () => {};

  public commandSelected = () => {};
}

export default Ipc;
