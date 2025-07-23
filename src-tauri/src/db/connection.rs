use mysql_async::{Opts, Pool, Conn};
use dotenv::dotenv;
use std::env;

pub struct Database {
    pool: Pool,
}

impl Database {
    pub async fn new() -> Result<Self, String> {
        dotenv().ok();
        
        let db_url = format!(
            "mysql://{}:{}@{}:{}/{}",
            env::var("DB_USER").unwrap_or_else(|_| "root".to_string()),
            env::var("DB_PASSWORD").unwrap_or_default(),
            env::var("DB_HOST").unwrap_or_else(|_| "localhost".to_string()),
            env::var("DB_PORT").unwrap_or_else(|_| "3306".to_string()),
            env::var("DB_NAME").unwrap_or_default()
        );

        let opts = Opts::from_url(&db_url)
            .map_err(|e| format!("Error parsing database URL: {}", e))?;

        Ok(Database {
            pool: Pool::new(opts)
        })
    }

    pub async fn get_conn(&self) -> Result<Conn, String> {
        self.pool.get_conn().await
            .map_err(|e| format!("Failed to get database connection: {}", e))
    }
}