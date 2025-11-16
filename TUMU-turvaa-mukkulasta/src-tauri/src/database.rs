use rusqlite::{params, Connection, Result};
use std::collections::HashMap;
use serde::{Serialize, Deserialize};
use std::path::Path;

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

pub fn load_all(conn: &Connection, csv_path: &str) -> Result<Vec<Software>, String> {
        let softwares = get_all_entries(&conn).map_err(|e| e.to_string())?;
        
        if std::path::Path::new(csv_path).exists() {
            std::fs::remove_file(csv_path)
                .map_err(|e| format!("Failed to delete old CSV: {}", e))?;
        }

        let mut writer = csv::Writer::from_path(csv_path)
            .map_err(|e| format!("Failed to create CSV: {}", e))?;

        for software in &softwares {
            writer.serialize(software)
                .map_err(|e| format!("Failed to write to CSV: {}", e))?;    
        }

        writer.flush()
            .map_err(|e| format!("Failed to save CSV: {}", e))?;
        Ok(softwares)

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

pub fn addToDatabase(conn: &Connection, software: &Software) -> Result<()> {
    conn.execute(
        "INSERT INTO software (name, clearance, description, vendor_reputation, 
                               cve_history, incidents, datahandling_and_compliance, 
                               trust_score, confidence_rating, alternative) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        params![
            software.name,
            software.clearance,
            software.description,
            software.vendor_reputation,
            software.cve_history,
            software.incidents,
            software.datahandling_and_compliance,
            software.trust_score,
            software.confidence_rating,
            software.alternative
        ],
    )?;
    Ok(())
}

fn updateSoftwareClearance(conn: &Connection, software_name: &str, clearance: bool) -> Result<()> {
    conn.execute(
        "UPDATE software SET clearance = ?1 WHERE name = ?2",
        params![clearance, software_name],
    )?;
    Ok(())
}



