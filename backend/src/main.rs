// backend/src/main.rs
use actix_cors::Cors;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use std::env;

use actix_multipart::Multipart;
use futures_util::StreamExt;

// Structs from previous steps remain the same
#[derive(Serialize, Deserialize)]
struct IdeaRequest { prompt: String }
#[derive(Serialize, Deserialize)]
struct IdeaResponse { name: String, symbol: String, description: String }
#[derive(Serialize)]
struct GeminiPart { text: String }
#[derive(Serialize)]
struct GeminiContent { role: String, parts: Vec<GeminiPart> }
#[derive(Serialize)]
struct GeminiPayload { contents: Vec<GeminiContent> }

#[get("/api/health")]
async fn health_check() -> impl Responder {
    HttpResponse::Ok().json("{\"status\": \"ok\", \"message\": \"API is running\"}")
}

#[post("/api/generate-ideas")]
async fn generate_ideas(req_body: web::Json<IdeaRequest>) -> impl Responder {
    // This function remains the same as before
    let api_key = match env::var("GEMINI_API_KEY") { Ok(key) => key, Err(_) => return HttpResponse::InternalServerError().json("GEMINI_API_KEY not set in environment"), };
    if req_body.prompt.trim().is_empty() { return HttpResponse::BadRequest().json("Prompt cannot be empty"); }
    let full_prompt = format!("Based on the following concept, generate a creative token name, a 3-5 character stock market-style ticker symbol, and a short, compelling description for a Solana SPL token. The entire response must be ONLY the raw JSON object, with no extra text, explanations, or markdown formatting. Concept: \"{}\"", req_body.prompt);
    let payload = GeminiPayload { contents: vec![GeminiContent { role: "user".to_string(), parts: vec![GeminiPart { text: full_prompt }] }] };
    let client = reqwest::Client::new();
    let url = format!("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={}", api_key);
    match client.post(&url).json(&payload).send().await {
        Ok(response) => { if response.status().is_success() { match response.text().await { Ok(text_body) => { let Ok(json_body): Result<serde_json::Value, _> = serde_json::from_str(&text_body) else { return HttpResponse::InternalServerError().json("Failed to parse Gemini response"); }; let Some(text) = json_body["candidates"][0]["content"]["parts"][0]["text"].as_str() else { return HttpResponse::InternalServerError().json("Unexpected response structure from Gemini"); }; match serde_json::from_str::<IdeaResponse>(text) { Ok(idea) => HttpResponse::Ok().json(idea), Err(_) => HttpResponse::InternalServerError().json("Gemini returned malformed JSON content"), } } Err(_) => HttpResponse::InternalServerError().json("Failed to read Gemini response body"), } } else { HttpResponse::InternalServerError().json(format!("Gemini API returned an error: {}", response.status())) } }
        Err(_) => HttpResponse::InternalServerError().json("Failed to send request to Gemini API"),
    }
}

// --- UPDATED: The handler for creating the token with the borrow checker fix ---
#[post("/api/create-token")]
async fn create_token(mut payload: Multipart) -> impl Responder {
    let mut token_name = String::new();
    let mut image_filename = String::new();

    // Iterate over multipart stream
    while let Some(item) = payload.next().await {
        let mut field = match item {
            Ok(field) => field,
            Err(_) => return HttpResponse::InternalServerError().finish(),
        };

        // Get the field name from the headers first and store it as an owned String
        let field_name = match field.content_disposition().and_then(|d| d.get_name().map(|s| s.to_string())) {
            Some(name) => name,
            None => continue, // Skip fields without a name
        };

        // Now that we are done with the headers for the name, we can consume the field data
        let mut field_data = Vec::new();
        while let Some(chunk) = field.next().await {
            match chunk {
                Ok(data) => field_data.extend_from_slice(&data),
                Err(_) => return HttpResponse::InternalServerError().json("Error reading chunk data"),
            }
        }

        // Process the collected data based on the field name
        if field_name == "tokenImage" {
             if let Some(filename) = field.content_disposition().and_then(|d| d.get_filename()) {
                image_filename = filename.to_string();
             }
             // In the next step, we will use the `field_data` (the image bytes)
        } else if field_name == "tokenName" {
             if let Ok(value) = String::from_utf8(field_data) {
                token_name = value;
             }
        }
        // Add other `else if` blocks here for other fields...
    }

    println!("✅ Received token creation request for '{}' with image '{}'", token_name, image_filename);
    println!("✅ This is where the on-chain logic will go.");

    HttpResponse::Ok().json("Received data successfully. On-chain creation coming soon!")
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let port_str = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let port = port_str.parse::<u16>().expect("PORT must be a valid number");
    println!("🚀 Rust Backend starting on http://127.0.0.1:{}", port);

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .service(health_check)
            .service(generate_ideas)
            .service(create_token)
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}