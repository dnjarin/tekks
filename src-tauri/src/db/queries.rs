use super::connection::Database;
use mysql_async::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Treat {
    pub id: u32,
    pub nombre: String,
    pub cant: i32,
    pub precio: f64,
}

pub async fn get_all_treats(db: &Database) -> Result<Vec<Treat>, String> {
    let mut conn = db.get_conn().await?;
    
    let treats = conn.query_map(
        "SELECT id, nombre, cant, precio FROM treats",
        |(id, nombre, cant, precio)| Treat { id, nombre, cant, precio },
    )
    .await
    .map_err(|e| format!("Database query error: {}", e))?;

    Ok(treats)
}

pub async fn add_treat(db: &Database, nombre: String, cant: i32, precio: f64) -> Result<u64, String> {
    let mut conn = db.get_conn().await?;
    
    conn.exec_drop(
        "INSERT INTO treats (nombre, cant, precio) VALUES (?, ?, ?)",
        (nombre, cant, precio),
    )
    .await
    .map_err(|e| format!("Failed to add treat: {}", e))?;

    Ok(conn.last_insert_id().unwrap_or(0))
}

pub async fn update_treat(db: &Database, id: u32, nombre: String, cant: i32, precio: f64) -> Result<bool, String> {
    let mut conn = db.get_conn().await?;
    
    let result = conn.exec_iter(
        "UPDATE treats SET nombre = ?, cant = ?, precio = ? WHERE id = ?",
        (nombre, cant, precio, id),
    )
    .await
    .map_err(|e| format!("Failed to update treat: {}", e))?;

    Ok(result.affected_rows() > 0)
}

pub async fn delete_treat(db: &Database, id: u32) -> Result<bool, String> {
    let mut conn = db.get_conn().await?;
    
    let result = conn.exec_iter(
        "DELETE FROM treats WHERE id = ?",
        (id,),
    )
    .await
    .map_err(|e| format!("Failed to delete treat: {}", e))?;

    Ok(result.affected_rows() > 0)
}