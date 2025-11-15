use rusqlite::{params, Connection, Result};
use std::collections::HashMap;

#[derive(Debug)]
struct software{
    name: String,
    color: String,
}

pub fn initialize_database() -> Result<Connection> {
    let conn = Connection::open("software_info.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS software (
                  id INTEGER PRIMARY KEY,
                  name TEXT NOT NULL,
                  clearance BOOLEAN,
                  description TEXT,
                  vendor_reputation TEXT,
                  cve_history TEXT,
                  incidents TEXT,
                  datahandling_and_compliance TEXT,
                  trust_score INTEGER,
                  confidence_rating INTEGER,
                  alternative TEXT
                  )",
        [],
    )?;
    Ok(conn)
}

pub fn load_all() -> Result<Vec<Entry>, String> {
    get_all_entries(&conn).map_err(|e| e.to_string())
}


