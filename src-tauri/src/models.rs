use serde_json::Value;
use dirs::home_dir;
use std::{fs::File, io::BufReader};

#[derive(Debug)]
pub struct HotKeys {
    pub toggle_ui: String,
    pub theme: String,
    pub commands: Vec<CommandModel>,
}

#[derive(Debug)]
pub struct CommandModel {
    pub hot_key: String,
    pub display_name: String,
    pub command: String,
}

impl HotKeys {
    fn read_hot_keys() -> Value {
        let default = Value::Null;

        let home = match home_dir() {
            Some(dir) => dir,
            None => return default,
        };
        
        let file_name = "hot-keys.json";
        let file_path = home.join(file_name);
        
        let file: File = match File::open(&file_path) {
            Ok(f) => f,
            Err(_) => return default,
        };
        
        let reader = BufReader::new(file);
        
        let json: Value = match serde_json::from_reader(reader) {
            Ok(j) => j,
            Err(_) => return default,
        };
        
        json
    }

    fn get_or_default_string(value: &Value, field: &str, default: &str) -> String {
        value.get(field)
            .and_then(|v| v.as_str())
            .unwrap_or(default)
            .to_string()
    }

    pub fn new() -> HotKeys {
        let value = Self::read_hot_keys();

        let theme = Self::get_or_default_string(&value, "theme", "light");
        let toggle_ui = Self::get_or_default_string(&value, "toggleUI", "");

        let empty_array: Vec<Value> = vec![];
        let commands = value.get("commands")
            .and_then(|v| v.as_array())
            .unwrap_or(&empty_array);

        let mut command_models: Vec<CommandModel> = vec![];

        for command_value in commands {
            if let Value::Object(map) = command_value {
                let hot_key = map.get("hotKey")
                                    .and_then(|v| v.as_str())
                                    .unwrap_or("")
                                    .to_string();
                    
                let command = map.get("command")
                                .and_then(|v| v.as_str())
                                .unwrap_or("")
                                .to_string();
                
                let display_name = map.get("displayName")
                                    .and_then(|v| v.as_str())
                                    .unwrap_or("")
                                    .to_string();

                command_models.push(CommandModel { hot_key, display_name, command });
            }
        }

        HotKeys { 
            toggle_ui,
            theme,
            commands: command_models,
        }
    }
}
