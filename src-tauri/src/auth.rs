use bcrypt::{hash, verify, DEFAULT_COST};
use mysql_async::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: u32,
    pub usuario: String,
    pub correo: String,
}

#[derive(Debug, Deserialize)]
pub struct AuthData {
    pub usuario: String,
    pub contrasena: String,
}

#[tauri::command]
pub async fn register_user(
    state: tauri::State<'_, super::commands::AppState>,
    usuario: String,
    correo: String,
    contrasena: String,
) -> Result<User, String> {
    // Hashear contraseña
    let hashed = hash(&contrasena, DEFAULT_COST)
        .map_err(|e| format!("Error de seguridad: {}", e))?;

    // Obtener conexión
    let db = state.db.lock().await;
    let mut conn = db.get_conn().await
        .map_err(|e| format!("Error de conexión: {}", e))?;

    // Insertar usuario
    conn.exec_drop(
        "INSERT INTO users (usuario, correo, contrasena) VALUES (?, ?, ?)",
        (&usuario, &correo, &hashed),
    )
    .await
    .map_err(|e| format!("Error al registrar: {}", e))?;

    // Obtener usuario creado
    let (id, usuario, correo): (u32, String, String) = conn.exec_first(
        "SELECT id, usuario, correo FROM users WHERE usuario = ? LIMIT 1",
        (&usuario,),
    )
    .await
    .map_err(|e| format!("Error al obtener usuario: {}", e))?
    .ok_or("Usuario no encontrado después de registro")?;

    Ok(User { id, usuario, correo })
}

#[tauri::command]
pub async fn login_user(
    state: tauri::State<'_, super::commands::AppState>,
    data: AuthData,
) -> Result<User, String> {
    // Obtener conexión
    let db = state.db.lock().await;
    let mut conn = db.get_conn().await
        .map_err(|e| format!("Error de conexión: {}", e))?;

    // Buscar usuario
    let user: Option<(u32, String, String, String)> = conn.exec_first(
        "SELECT id, usuario, correo, contrasena FROM users WHERE usuario = ? LIMIT 1",
        (&data.usuario,),
    )
    .await
    .map_err(|e| format!("Error de búsqueda: {}", e))?;

    match user {
        Some((id, usuario, correo, hashed_password)) => {
            // Verificar contraseña
            if verify(&data.contrasena, &hashed_password)
                .map_err(|e| format!("Error de verificación: {}", e))?
            {
                Ok(User { id, usuario, correo })
            } else {
                Err("Credenciales incorrectas".into())
            }
        }
        None => Err("Usuario no existe".into()),
    }
}

#[tauri::command]
pub async fn verify_access(
    state: tauri::State<'_, super::commands::AppState>,
    user_id: u32,
) -> Result<User, String> {
    let db = state.db.lock().await;
    let mut conn = db.get_conn().await
        .map_err(|e| format!("Error de conexión: {}", e))?;

    let user: Option<(u32, String, String)> = conn.exec_first(
        "SELECT id, usuario, correo FROM users WHERE id = ? LIMIT 1",
        (user_id,),
    )
    .await
    .map_err(|e| format!("Error de verificación: {}", e))?;

    match user {
        Some((id, usuario, correo)) => Ok(User { id, usuario, correo }),
        None => Err("Usuario no autorizado".into()),
    }
}