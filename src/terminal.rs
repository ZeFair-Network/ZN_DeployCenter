use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Debug, Clone, Serialize)]
pub struct TerminalLine { pub id: String, pub kind: String, pub content: String, pub timestamp: i64 }

#[derive(Debug, Default, Clone)]
pub struct TerminalStore { pub lines: Arc<RwLock<Vec<TerminalLine>>> }

impl TerminalStore {
    pub fn new_welcome() -> Self {
        let mut v = Vec::new();
        v.push(TerminalLine { id: "1".into(), kind: "output".into(), content: "Добро пожаловать в терминал панели управления v2.1.0".into(), timestamp: chrono::Utc::now().timestamp_millis() });
        v.push(TerminalLine { id: "2".into(), kind: "output".into(), content: "Введите \"help\" для получения списка доступных команд.".into(), timestamp: chrono::Utc::now().timestamp_millis() });
        Self { lines: Arc::new(RwLock::new(v)) }
    }
}

#[derive(Debug, Deserialize)]
pub struct ExecRequest { pub command: String }

pub async fn get_history(State(store): State<TerminalStore>) -> Json<Vec<TerminalLine>> {
    Json(store.lines.read().await.clone())
}

pub async fn exec_command(State(store): State<TerminalStore>, Json(req): Json<ExecRequest>) -> impl IntoResponse {
    let mut lines = store.lines.write().await;
    let now = chrono::Utc::now().timestamp_millis();
    let id_cmd = format!("{}", now);
    lines.push(TerminalLine { id: id_cmd.clone(), kind: "command".into(), content: format!("$ {}", req.command), timestamp: now });

    let (output, kind) = match req.command.trim() {
        "pwd" => ("/home/user/project".into(), "output".into()),
        "whoami" => ("admin".into(), "output".into()),
        "help" => ("Доступные команды: ls, pwd, whoami, date, clear, help".into(), "output".into()),
        "clear" => { lines.clear(); return StatusCode::NO_CONTENT.into_response(); }
        other => (format!("Команда не найдена: {}", other), "error".into()),
    };
    let id_out = format!("{}", chrono::Utc::now().timestamp_millis());
    lines.push(TerminalLine { id: id_out, kind, content: output, timestamp: chrono::Utc::now().timestamp_millis() });
    StatusCode::OK.into_response()
}



