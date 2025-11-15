pub mod database;
pub use database::{initialize_database}


// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    let conn = initialize_database().map_err(|e| e.to_string())?;
    tauriappdemo_lib::run(&conn)
}
