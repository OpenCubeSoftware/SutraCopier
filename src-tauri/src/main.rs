#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::fs;
use std::ffi::OsStr;
use std::os::unix::ffi::OsStrExt;
use std::format;
use std::io::Write;
use directories::ProjectDirs;
use serde::{Deserialize, Serialize};

#[tauri::command]
fn get_files() -> Vec<String>{
  let mut file_list = Vec::new();
  let files = fs::read_dir("./sutras").unwrap();
  files.filter_map(Result::ok)
      .filter(|d| d.path().extension() == Some(OsStr::from_bytes(b"sutra")))
      .for_each(|f| {
        let contents = fs::read_to_string(f.path()).expect("Something went wrong reading the file");
        file_list.push(contents);
      });
  file_list
}

#[tauri::command]
fn persist_settings(settings: String) {
    let project_dirs = ProjectDirs::from("tk", "opencube", "sutracopy").unwrap();
    let conf_dir = project_dirs.config_dir();
    if !conf_dir.exists() {
        fs::create_dir_all(&conf_dir);
    }
    let mut file =
        std::fs::File::create(&conf_dir.join("settings.json")).expect("File creating failed");
    file.write_all(settings.as_bytes()).expect("Write failed");
}

fn main() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![get_files, persist_settings])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
