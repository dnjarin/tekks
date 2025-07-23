use crate::db::Database;
use tauri::State;
use std::sync::Arc;
use tokio::sync::Mutex;
use serde::Deserialize;

// Estado compartido
pub struct AppState {
    pub db: Arc<Mutex<Database>>,
}

#[derive(Debug, Deserialize)]
pub struct TreatForm {
    pub nombre: String,
    pub cant: i32,
    pub precio: f64,
}

// Comandos Tauri

#[tauri::command]
pub async fn fetch_treats(
    state: State<'_, AppState>
) -> Result<Vec<crate::db::queries::Treat>, String> {
    println!("[Rust] Solicitando lista de productos...");
    
    let db = state.db.lock().await;
    crate::db::queries::get_all_treats(&db).await
}

#[tauri::command]
pub async fn add_treat(
    state: State<'_, AppState>,
    form: TreatForm, // Recibe un objeto estructurado
) -> Result<u64, String> {
    println!("Recibiendo: {:?}", form);
    let db = state.db.lock().await;
    crate::db::queries::add_treat(&db, form.nombre, form.cant, form.precio).await
}

#[tauri::command]
pub async fn update_treat(
    state: State<'_, AppState>,
    id: u32,
    form: TreatForm,
) -> Result<bool, String> {
    let db = state.db.lock().await;
    crate::db::queries::update_treat(&db, id, form.nombre, form.cant, form.precio).await
}


#[tauri::command]
pub async fn delete_treat(
    state: State<'_, AppState>,
    id: u32  // Parámetro único
) -> Result<bool, String> {
    println!("[Rust] Eliminando producto ID: {}", id);
    
    let db = state.db.lock().await;
    crate::db::queries::delete_treat(&db, id).await
}
#[tauri::command]
pub async fn get_dashboard_data(
    state: State<'_, AppState>,
    token: String,
) -> Result<String, String> {
    // Convierte el token a u32 (si es un id de usuario)
    let user_id: u32 = token.parse().map_err(|_| "Token inválido")?;
    
    // Verifica solo que el usuario exista
    let _user = crate::auth::verify_access(state, user_id).await?;
    
    Ok("Datos confidenciales del dashboard".into())
}