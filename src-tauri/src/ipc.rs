use crate::utils::{toggle, quit_app};

#[tauri::command]
pub fn toggle_ui(w: tauri::Window) {
    toggle(w);
}

#[tauri::command]
pub fn quit() {
    quit_app();
}
