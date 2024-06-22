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

    let mut i = 0;

    for c in &HOT_KEYS.commands {
        commands.push(ClientCommand{
            hot_key: c.hot_key.clone(),
            display_name: c.display_name.clone(),
            index: i,
        });

        i += 1;
    }

    commands
}

#[tauri::command]
pub fn command_selected(i: usize) {
    let command = &HOT_KEYS.commands.get(i);

    match command {
        Some(c) => spawn_command(&c.command),
        None => return,
    };
}
