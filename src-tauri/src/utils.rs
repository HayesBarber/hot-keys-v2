pub fn toggle(w: tauri::Window) {
    let visible = w.is_visible().unwrap_or(false);
    if visible {
      let _ = w.hide();
    } else {
      let _ = w.show();
    }
}

pub fn quit_app() {
    std::process::exit(0);
}
