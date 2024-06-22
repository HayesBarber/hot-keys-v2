use std::process::Command;

pub fn toggle(w: tauri::Window) {
    let visible = w.is_visible().unwrap_or(false);
    if visible {
      let _ = w.hide();
    } else {
      let _ = w.set_focus();
    }
}

pub fn quit_app() {
    std::process::exit(0);
}

pub fn spawn_command(command: &str) {
    let _ = Command::new("sh").arg("-c").arg(command).spawn();
}
