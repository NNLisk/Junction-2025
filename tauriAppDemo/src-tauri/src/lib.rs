// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn load_data() {
    // Placeholder for data loading logic
}

#[tauri::command]
fn request_software_info(software_name: &str) {
    // Placeholder for requesting software information logic
}

#[tauri::command]
fn update_software_clearance(software_name: &str, clearance: bool) {
    // Placeholder for updating software clearance logic
}

