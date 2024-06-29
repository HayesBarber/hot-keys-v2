use std::path::Path;
use glob::{glob, Paths};

use crate::{models::ClientCommand, utils::{quit_app, spawn_command, get_home_dir}, HOT_KEYS};

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

#[tauri::command]
pub fn on_path_selected(path: &str) {
    if HOT_KEYS.on_path_selected.is_empty() {
        return;
    }

    if !path.starts_with("~/") {
        return;
    }

    let home = match get_home_dir() {
        Some(s) => s,
        None => return,
    };

    let actual_path = path.replacen("~/", &home,  1);

    let exists = Path::new(&actual_path).try_exists().unwrap_or(false);
    if !exists {
        return;
    }

    let command = HOT_KEYS.on_path_selected.replace("$PATH", &actual_path);
    spawn_command(&command);
}

#[tauri::command]
pub fn match_file_paths(base: &str) -> Vec<String> {
    let start = base.chars().nth(0).unwrap_or_default();
    if start != '~' && start != '/' {
        return vec![];
    }

    let home: String = match get_home_dir() {
        Some(dir) => dir,
        None => return vec![],
    };

    // remove the ~ or / to be replaced with home dir
    let mut chars = base.chars();
    chars.next();

    let base_dir: String = home.to_string() + chars.as_str();

    let pattern = match base_dir.ends_with("/") {
        true => base_dir + "*",
        false => base_dir + "/*",
    };

    let entries = glob(pattern.as_str());

    match entries {
        Ok(paths) => string_array_from_paths(paths, &home),
        Err(_) => vec![],
    }
}

fn string_array_from_paths(paths: Paths, home_dir: &String) -> Vec<String> {
    let mut suggestions: Vec<String> = Vec::new();

    for entry in paths {
        if let Ok(path) = entry {
            let as_string = path.to_str();

            let value = match as_string {
                Some(v) => v.to_string().replacen(home_dir, "~/", 1) + if path.is_dir() {"/"} else {""},
                None => continue,
            }; 

            suggestions.push(value);
        }
    }

    suggestions
}
