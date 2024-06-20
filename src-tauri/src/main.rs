// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod models;

use tauri::{api::process::restart, App, AppHandle, CustomMenuItem, GlobalShortcutManager, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};
use models::HotKeys;
use once_cell::sync::Lazy;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

static HOT_KEYS: Lazy<HotKeys> = Lazy::new(HotKeys::new);

fn build_menu() -> SystemTray {
  let quit_item = CustomMenuItem::new("quit".to_string(), "Quit");
  let restart_item = CustomMenuItem::new("restart".to_string(), "Restart");
  let tray_menu = SystemTrayMenu::new()
      .add_item(restart_item)
      .add_item(quit_item);

  let tray = SystemTray::new().with_menu(tray_menu);
  tray
}

fn on_system_tray_event(app: &AppHandle, event: SystemTrayEvent) {
  match event {
    SystemTrayEvent::MenuItemClick { id, .. } => {
      match id.as_str() {
        "quit" => {
            std::process::exit(0);
        }
        "restart" => {
            restart(&app.env());
        }
        _ => {}
      }
    }
    _ => {}
  }
}

fn register_global_shortcuts(app: &App) {
  let app_handle = app.handle();
  let mut global_shortcut_manager = app_handle.global_shortcut_manager();

  if HOT_KEYS.toggle_ui.chars().count() > 0 {
    let _ = global_shortcut_manager.register(HOT_KEYS.toggle_ui.as_str(), move || {
      let window = app_handle.get_window("main");

      match window {
        Some(w) => { 
          let visible = w.is_visible().unwrap_or(false);
          if visible {
            let _ = w.hide();
          } else {
            let _ = w.show();
          }
        },
        None => return,
      }
    });
  }

  for command in &HOT_KEYS.commands {
    let hot_key = &command.hot_key;
    if hot_key.chars().count() > 0 {
      let _ = global_shortcut_manager.register(hot_key, || {
        println!("Shortcut triggered!");
      });
    }
  }

}

fn main() {
    let tray = build_menu();

    tauri::Builder::default()
        .system_tray(tray)
        .on_system_tray_event(on_system_tray_event)
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
          register_global_shortcuts(app);
          Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
