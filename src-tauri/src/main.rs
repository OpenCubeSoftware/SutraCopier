#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::fs;
use std::ffi::OsStr;
use std::os::unix::ffi::OsStrExt;
use std::format;

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

fn main() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![get_files])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
