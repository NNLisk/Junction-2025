pub mod database;

use rusqlite::{params, Connection};
use std::sync::Mutex;
use tauri::State;

pub struct DbConnection(pub Mutex<Connection>);
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    let conn = database::initialize_database()
        .expect("Failed to connect to a database");

    tauri::Builder::default()
        .manage(DbConnection(Mutex::new(conn)))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            load_data,
            request_software_info,
            update_software_clearance
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

}

#[tauri::command]
fn load_data(db: State<DbConnection>) -> Result<Vec<database::Software>, String> {
    let conn = db.0.lock().expect("Failed to acquire database lock");
    database::load_all(&conn)
}

#[tauri::command]
fn request_software_info(software_name: &str) {
    // Placeholder for requesting software information logic
}

#[tauri::command]
fn update_software_clearance(software_name: &str, clearance: bool) {
    // Placeholder for updating software clearance logic
}

