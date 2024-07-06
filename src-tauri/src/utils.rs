use std::{path::{Path, PathBuf}, process::Command};
use dirs::home_dir;
use once_cell::sync::Lazy;

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

static HOME_DIR: Lazy<Option<(PathBuf, String)>> = Lazy::new(init_home_dir);

pub fn get_home_dir() -> &'static Option<(PathBuf, String)> {
  &HOME_DIR
}

fn init_home_dir() -> Option<(PathBuf, String)> {
  let home = match home_dir() {
    Some(dir) => dir,
    None => return None,
  };

  let mut home_as_string = match home.to_str() {
    Some(s) => s.to_string(),
    None => return None,
  };

  if home_as_string.is_empty() {
    return None;
  }

  if !home_as_string.ends_with("/") {
    home_as_string.push('/');
  }
  
  Some((home, home_as_string))
}

pub fn replace_home_dir_with_alias(home_dir: &String, path: &str) -> String {
  path.replacen(home_dir, "~/", 1)
}

pub fn strip_home_alias(path: &str) -> &str {
  let mut chars = path.chars();
  if path.starts_with("~/") {
      chars.next();
      chars.next();
  } else if path.starts_with("/") ||  path.starts_with("~") {
      chars.next();
  }

  chars.as_str()
}

pub fn sanitize_path(input: &str, base_dir: &Path) -> Option<PathBuf> {
  let combined_path = base_dir.join(strip_home_alias(input));

  match combined_path.canonicalize() {
      Ok(canonical_path) => {
          if canonical_path.starts_with(base_dir) {
              Some(canonical_path)
          } else {
              None
          }
      }
      Err(_) => None,
  }
}
