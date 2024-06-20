use crate::utils::quit_app;

#[tauri::command]
pub fn hide(w: tauri::Window) {
    let _ = w.hide();
}

#[tauri::command]
pub fn quit() {
    quit_app();
}
