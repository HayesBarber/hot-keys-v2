use crate::{models::ClientCommand, utils::{quit_app, spawn_command}, HOT_KEYS};

#[tauri::command]
pub fn hide(w: tauri::Window) {
    let _ = w.hide();
}

#[tauri::command]
pub fn quit() {
    quit_app();
}

#[tauri::command]
pub fn get_toggle_ui_accelerator() -> String {
    HOT_KEYS.toggle_ui.clone()
}

#[tauri::command]
pub fn get_theme() -> String {
    HOT_KEYS.theme.clone()
}

#[tauri::command]
pub fn get_commands() -> Vec<ClientCommand> {
    let mut commands: Vec<ClientCommand> = vec![];

    for c in &HOT_KEYS.commands {
        commands.push(ClientCommand{
            hot_key: c.hot_key.clone(),
            display_name: c.display_name.clone(),
        });
    }

    commands
}

#[tauri::command]
pub fn command_selected(i: usize) {
    spawn_command(&HOT_KEYS.commands[i].command)
}