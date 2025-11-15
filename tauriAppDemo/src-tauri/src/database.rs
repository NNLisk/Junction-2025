use rusqlite::{params, Connection, Result};
use std::collections::HashMap;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Software{
    pub name: String,
    pub clearance: Option<bool>,
    pub description: Option<String>,
    pub vendor_reputation: Option<String>,
    pub cve_history: Option<String>,
    pub incidents: Option<String>,
    pub datahandling_and_compliance: Option<String>,
    pub trust_score: Option<i32>,
    pub confidence_rating: Option<i32>,
    pub alternative: Option<String>,
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

pub fn load_all(conn: &Connection) -> Result<Vec<Software>, String> {
    get_all_entries(&conn).map_err(|e| e.to_string())
}

fn get_all_entries(conn: &Connection) -> Result<Vec<Software>> {
    let mut stmt = conn.prepare(
        "SELECT name, clearance, description, vendor_reputation, cve_history, 
                incidents, datahandling_and_compliance, trust_score, 
                confidence_rating, alternative 
         FROM software"
    )?;
    
    let software_iter = stmt.query_map([], |row| {
        Ok(Software {
            name: row.get(0)?,
            clearance: row.get(1)?,
            description: row.get(2)?,
            vendor_reputation: row.get(3)?,
            cve_history: row.get(4)?,
            incidents: row.get(5)?,
            datahandling_and_compliance: row.get(6)?,
            trust_score: row.get(7)?,
            confidence_rating: row.get(8)?,
            alternative: row.get(9)?,
        })
    })?;
    
    let mut softwares = Vec::new();
    for software in software_iter {
        softwares.push(software?);
    }
    
    Ok(softwares)
}

