// backend/src/main.rs

use actix_cors::Cors;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};
use std::env;
use dotenv::dotenv;

// A simple health check endpoint to confirm the server is running
#[get("/api/health")]
async fn health_check() -> impl Responder {
    HttpResponse::Ok().json("{\"status\": \"ok\", \"message\": \"API is running\"}")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load environment variables from .env file for local development
    dotenv().ok();

    // Read the PORT from environment variables, defaulting to 8080 for local runs.
    // Heroku will set this PORT variable automatically.
    let port_str = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let port = port_str.parse::<u16>().expect("PORT must be a valid number");

    println!("🚀 Server starting on http://127.0.0.1:{}", port);

    HttpServer::new(move || {
        // Configure CORS to allow requests from our frontend
        let cors = Cors::default()
            .allow_any_origin() // For production, you would restrict this to your frontend's domain
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors) // Add CORS middleware
            .service(health_check)
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}