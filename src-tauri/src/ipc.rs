use std::{path::Path, sync::Mutex};
use glob::{glob, Paths};
use once_cell::sync::Lazy;
use crate::{models::ClientCommand, utils::*, HOT_KEYS};

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
    let command = HOT_KEYS.commands.get(i);

    match command {
        Some(c) => spawn_command(&c.command),
        None => return,
    };
}

static PATHS: Lazy<Mutex<Vec<String>>> = Lazy::new(|| Mutex::new(vec![]));

#[tauri::command]
pub fn on_path_selected(i: usize) {
    if HOT_KEYS.on_path_selected.is_empty() {
        return;
    }

    let selected_path = {
        let lock = PATHS.lock();
        
        match lock {
            Ok(vec) => vec.get(i).map(|p| p.clone()),
            Err(_) => return,
        }
    };

    let path = match selected_path {
        Some(p) => p,
        None => return,
    };

    let exists = Path::new(&path).try_exists().unwrap_or(false);
    if !exists {
        return;
    }

    let command = HOT_KEYS.on_path_selected.replace("$PATH", &path);
    spawn_command(&command);
}

#[tauri::command]
pub fn match_file_paths(path: &str) -> Vec<ClientCommand> {
    let home = match get_home_dir() {
        Some(dir) => dir,
        None => return vec![],
    };

    let sanitized_base = match sanitize_path(path, &home.0) {
        Some(path) => path,
        None => return vec![],
    };

    let base_dir = sanitized_base.to_string_lossy().to_string();

    let pattern = base_dir + "/*";

    let entries = glob(pattern.as_str());

    match entries {
        Ok(paths) => client_commands_from_paths(paths, &home.1),
        Err(_) => vec![],
    }
}

fn client_commands_from_paths(paths: Paths, home_dir: &String) -> Vec<ClientCommand> {
    let mut suggestions: Vec<ClientCommand> = vec![];

    let mut cached = match PATHS.lock() {
        Ok(v) => v,
        Err(_) => return suggestions,
    };

    cached.clear();

    let mut i = 0;

    for entry in paths {
        if let Ok(path) = entry {
            let as_string = path.to_str();

            let value = match as_string {
                Some(v) => {
                    let absolute = v.to_string() + if path.is_dir() {"/"} else {""};
                    cached.push(absolute.clone());
                    replace_home_dir_with_alias(home_dir, &absolute)
                },
                None => continue,
            };

            let client_command = ClientCommand {
                hot_key: String::new(),
                display_name: value,
                index: i,
            };

            suggestions.push(client_command);

            i += 1;
        }
    }

    suggestions
}
