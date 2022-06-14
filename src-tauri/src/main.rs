#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::fs;
use std::ffi::OsStr;
use std::os::unix::ffi::OsStrExt;
use std::format;
use std::path;
use std::path::PathBuf;
use directories::ProjectDirs;

#[tauri::command]
fn get_files() -> Vec<String> {
  let project_dirs = ProjectDirs::from("", "", "sutracopy").unwrap();
  let conf_dir = project_dirs.config_dir();
  let mut file_list = Vec::new();
  let files = fs::read_dir(&conf_dir.join("sutras")).unwrap();
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
