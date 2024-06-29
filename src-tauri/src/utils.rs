use std::process::Command;
use dirs::home_dir;

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

pub fn get_home_dir() -> Option<String> {
  let mut home: String = match home_dir() {
    Some(dir) => dir.to_str().unwrap_or("").to_string(),
    None => "".to_string(),
  };

  if home.is_empty() {
    return None;
  } else {
    if !home.ends_with("/") {
      home.push('/');
    }
    return Some(home);
  }
}
