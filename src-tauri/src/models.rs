use serde_json::{Map, Value};
use serde::Serialize;
use dirs::home_dir;
use std::{fs::File, io::BufReader};

#[derive(Debug)]
pub struct HotKeys {
    pub toggle_ui: String,
    pub on_path_selected: String,
    pub theme: String,
    pub commands: Vec<CommandModel>,
}

#[derive(Debug)]
pub struct CommandModel {
    pub hot_key: String,
    pub display_name: String,
    pub command: String,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ClientCommand {
    pub hot_key: String,
    pub display_name: String,
    pub index: i32,
}

trait KeyValueAccess {
    fn get_value(&self, key: &str) -> Option<&Value>;
}

impl KeyValueAccess for &Value {
    fn get_value(&self, key: &str) -> Option<&Value> {
        self.get(key)
    }
}

impl KeyValueAccess for &Map<String, Value> {
    fn get_value(&self, key: &str) -> Option<&Value> {
        self.get(key)
    }
}

fn get_or_default_string<T: KeyValueAccess>(value: T, field: &str, default: &str) -> String {
    value.get_value(field)
        .and_then(|v| v.as_str())
        .unwrap_or(default)
        .to_string()
}

macro_rules! get_or_default_string {
    ($value:expr, $field:expr, $default:expr) => {
        get_or_default_string($value, $field, $default)
    };
    ($value:expr, $field:expr) => {
        get_or_default_string($value, $field, "")
    };
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

    pub fn new() -> HotKeys {
        let value = Self::read_hot_keys();

        let theme = get_or_default_string!(&value, "theme", "light");
        let toggle_ui = get_or_default_string!(&value, "toggleUI");
        let on_path_selected = get_or_default_string!(&value, "onPathSelected");

        let empty_array: Vec<Value> = vec![];
        let commands = value.get("commands")
            .and_then(|v| v.as_array())
            .unwrap_or(&empty_array);

        let mut command_models: Vec<CommandModel> = vec![];

        for command_value in commands {
            if let Value::Object(map) = command_value {
                let hot_key = get_or_default_string!(map, "hotKey");
                let command = get_or_default_string!(map, "command");
                let display_name = get_or_default_string!(map, "displayName");

                command_models.push(CommandModel { hot_key, display_name, command });
            }
        }

        HotKeys { 
            toggle_ui,
            theme,
            on_path_selected,
            commands: command_models,
        }
    }
}
