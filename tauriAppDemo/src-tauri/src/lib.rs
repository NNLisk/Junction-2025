pub mod database;
pub mod open_ai_manager;

use rusqlite::{params, Connection};
use std::sync::Mutex;
use tauri::State;

pub struct DbConnection(pub Mutex<Connection>);
pub struct ApiKey(pub Mutex<String>);
pub struct CsvPath(pub Mutex<String>);



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    let conn = database::initialize_database()
        .expect("Failed to connect to a database");

    let api_key = "apikey".to_string();
    
    let path = std::env::current_dir()
        .expect("Failed to get current dir")
        .join("src")
        .join("assets")
        .join("software_data.csv")
        .to_string_lossy()
        .to_string();
    

    tauri::Builder::default()
        .manage(DbConnection(Mutex::new(conn)))
        .manage(ApiKey(Mutex::new(api_key)))
        .manage(CsvPath(Mutex::new(path)))
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
fn load_data(db: State<DbConnection>, p: State<CsvPath>) -> Result<Vec<database::Software>, String> {
    let conn = db.0.lock().expect("Failed to acquire database lock");
    let csvpath = p.0.lock().expect("Failed to acquire CSV path lock");
    database::load_all(&conn, &csvpath)
}

#[tauri::command]
async fn request_software_info(
    sw_name: String,
    url: Option<String>,
    db: State<'_, DbConnection>,
    api_key: State<'_, ApiKey>,
    ) -> Result<database::Software, String> {
    let mut request = open_ai_manager::OpenAIRequest::new(sw_name.clone());
    if let Some(url) = url {
        request = request.with_url(url);
    }

    let key = {
        let key_guard = api_key.0.lock().expect("Failed to acquire API key lock");
        key_guard.clone()  // Clone the String
    };
    let response = open_ai_manager::fetch_software_info(&request, &key).await?;

    let software = database::Software {
        name: response.name,
        clearance: Some(response.clearance),
        description: Some(response.description),
        vendor_reputation: Some(response.vendor_reputation),
        cve_history: Some(response.cve_history),
        incidents: Some(response.incidents),
        datahandling_and_compliance: Some(response.datahandling_and_compliance),
        trust_score: Some(response.trust_score),
        confidence_rating: Some(response.confidence_rating),
        alternative: Some(response.alternative),
    };

    let conn = db.0.lock().expect("Failed to acquire database lock");
    database::addToDatabase(&conn, &software);

    Ok(software)
}

#[tauri::command]
fn update_software_clearance(software_name: &str, clearance: bool) {
    // Placeholder for updating software clearance logic
}

