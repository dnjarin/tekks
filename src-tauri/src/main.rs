#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod auth;
mod commands;
mod db;

use commands::AppState;
use std::sync::Arc;
use tokio::sync::Mutex;

#[tokio::main]
async fn main() {
    // Configuración de la base de datos
    let db = match db::Database::new().await {
        Ok(db) => db,
        Err(e) => {
            eprintln!("Error al conectar a la BD: {}", e);
            std::process::exit(1);
        }
    };

    // Configuración de Tauri
    tauri::Builder::default()
        .manage(AppState {
            db: Arc::new(Mutex::new(db)),
        })
        .invoke_handler(tauri::generate_handler![
            auth::register_user,
            auth::login_user,
            auth::verify_access,
            commands::add_treat,
            commands::update_treat,
            commands::fetch_treats,
            commands::delete_treat
        ])
        .run(tauri::generate_context!())
        .expect("Error al iniciar la aplicación Tauri");
}