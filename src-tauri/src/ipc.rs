use dirs::home_dir;
use glob::{glob, Paths};

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

#[tauri::command]
pub fn match_file_paths(base: &str) -> Vec<String> {
    let base_dir: String = match base {
        "~" | "/" => {
            let home_dir = home_dir();
            
            match home_dir {
                Some(home) => home.to_str().unwrap_or("").to_string(),
                None => "".to_string(),
            }
        },
        _ => base.to_string()
    };

    let pattern = match base_dir.ends_with("/") {
        true => base_dir + "*",
        false => base_dir + "/*",
    };

    let entries = glob(pattern.as_str());

    match entries {
        Ok(paths) => string_array_from_paths(paths),
        Err(_) => vec![],
    }
}

fn string_array_from_paths(paths: Paths) -> Vec<String> {
    let mut suggestions: Vec<String> = Vec::new();

    for entry in paths {
        if let Ok(path) = entry {
            let as_string = path.to_str();

            let value = match as_string {
                Some(v) => v.to_string() + if path.is_dir() {"/"} else {""},
                None => continue,
            }; 

            suggestions.push(value);
        }
    }

    suggestions
}
