use std::sync::Arc;
use axum::{extract::State, Json};
use chrono::Utc;
use serde::Serialize;
use tokio::sync::RwLock;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum LogLevel { Info, Warning, Error, Debug, Success }

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum LogCategory { System, Database, Security, Api, User, Network }

#[derive(Debug, Clone, Serialize)]
pub struct LogEntry {
    pub id: String,
    pub timestamp: String,
    pub level: LogLevel,
    pub category: LogCategory,
    pub message: String,
    pub details: Option<String>,
    pub ip: Option<String>,
    pub user: Option<String>,
    pub source: String,
}

#[derive(Debug, Default, Clone)]
pub struct LogsStore { inner: Arc<RwLock<Vec<LogEntry>>> }

impl LogsStore {
    pub fn new_mock() -> Self {
        let mut v = Vec::new();
        v.push(LogEntry { id: "1".into(), timestamp: "2024-01-15 14:32:15".into(), level: LogLevel::Error, category: LogCategory::Database, message: "Ошибка подключения к базе данных".into(), details: Some("Connection timeout after 30 seconds. Host: db.example.com:5432".into()), ip: None, user: None, source: "DatabaseConnector.rs:45".into() });
        v.push(LogEntry { id: "2".into(), timestamp: "2024-01-15 14:31:42".into(), level: LogLevel::Warning, category: LogCategory::Security, message: "Неудачная попытка входа".into(), details: Some("Invalid password for user: admin".into()), ip: Some("192.168.1.100".into()), user: Some("admin".into()), source: "AuthService.rs:120".into() });
        Self { inner: Arc::new(RwLock::new(v)) }
    }
}

pub async fn list_logs(State(store): State<LogsStore>) -> Json<Vec<LogEntry>> {
    Json(store.inner.read().await.clone())
}

#[derive(Debug, Serialize)]
pub struct Stats { pub total: usize, pub errors: usize, pub warnings: usize, pub info: usize }

pub async fn logs_stats(State(store): State<LogsStore>) -> Json<Stats> {
    let data = store.inner.read().await;
    let total = data.len();
    let errors = data.iter().filter(|l| matches!(l.level, LogLevel::Error)).count();
    let warnings = data.iter().filter(|l| matches!(l.level, LogLevel::Warning)).count();
    let info = data.iter().filter(|l| matches!(l.level, LogLevel::Info)).count();
    Json(Stats { total, errors, warnings, info })
}

pub async fn push_log(State(store): State<LogsStore>, Json(mut log): Json<LogEntry>) -> Json<LogEntry> {
    log.id = format!("{}", Utc::now().timestamp_millis());
    let mut data = store.inner.write().await;
    data.insert(0, log.clone());
    Json(log)
}



