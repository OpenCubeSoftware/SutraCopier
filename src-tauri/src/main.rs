#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::fs;
use std::ffi::OsStr;
use std::os::unix::ffi::OsStrExt;
use tauri_plugin_store::PluginBuilder;
use std::time::{SystemTime, UNIX_EPOCH};
use std::format;
use std::io::Write;

fn get_time() -> u64 {
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    since_the_epoch
}

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
fn tesst_close() {
    let time = get_time();
    let mut file = std::fs::File::create(format!("./{filename}.meow", filename=time)).expect("File creating failed");
    file.write_all("Meow meow meow ".as_bytes()).expect("write failed");
    file.write_all(time.to_string().as_bytes()).expect("second write failed");
    println!("data written to file");
}

fn main() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![get_files, tesst_close])
      .plugin(PluginBuilder::default().build())
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
