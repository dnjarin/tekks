use dotenv::dotenv;
use mysql_async::prelude::*;
use std::env;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let opts = mysql_async::OptsBuilder::new()
        .user(env::var("DB_USER").unwrap())
        .pass(env::var("DB_PASSWORD").unwrap())
        .ip_or_hostname(env::var("DB_HOST").unwrap())
        .tcp_port(env::var("DB_PORT").unwrap().parse::<u16>().unwrap())
        .db_name(env::var("DB_NAME").unwrap());

    let pool = mysql_async::Pool::new(opts);
    let mut conn = pool.get_conn().await.unwrap();

    // Consulta async
    let users: Vec<(i32, String)> = conn.query("SELECT id, name FROM users").await.unwrap();
    for user in users {
        println!("Usuario: ID={}, Nombre={}", user.0, user.1);
    }
}