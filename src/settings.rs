use axum::{extract::State, http::StatusCode, response::IntoResponse, Json};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    pub general: General,
    pub connection: Connection,
    pub database: Database,
    pub security: Security,
    pub performance: Performance,
    pub notifications: Notifications,
    pub api: Api,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct General { pub server_name: String, pub description: String, pub admin_email: String, pub timezone: String, pub language: String, pub maintenance_mode: bool }
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Connection { pub host: String, pub port: u16, pub protocol: String, pub ssl_enabled: bool, pub api_endpoint: String, pub connection_timeout: u16, pub retry_attempts: u8, pub keep_alive: bool }
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Database { pub host: String, pub port: u16, pub name: String, pub max_connections: u32, pub timeout: u16, pub auto_backup: bool, pub backup_interval: u16 }
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Security { pub enable_ssl: bool, pub require_two_factor: bool, pub session_timeout: u16, pub max_login_attempts: u8, pub ip_whitelist: bool, pub allowed_ips: Vec<String> }
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Performance { pub max_cpu_usage: u8, pub max_memory_usage: u8, pub cache_enabled: bool, pub cache_size: u32, pub compression_enabled: bool, pub rate_limit_enabled: bool, pub max_requests_per_minute: u32 }
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Notifications { pub email_notifications: bool, pub system_alerts: bool, pub user_registration: bool, pub error_reports: bool, pub backup_reports: bool, pub security_events: bool }
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Api { pub enabled: bool, pub version: String, pub rate_limit: u32, pub require_auth: bool, pub allow_cors: bool, pub log_requests: bool }

#[derive(Debug, Default, Clone)]
pub struct SettingsStore { pub inner: Arc<RwLock<ServerConfig>> }

impl SettingsStore {
    pub fn new_default() -> Self {
        let cfg = ServerConfig {
            general: General { server_name: "Мой Проект".into(), description: "Описание проекта".into(), admin_email: "admin@example.com".into(), timezone: "Europe/Moscow".into(), language: "ru".into(), maintenance_mode: false },
            connection: Connection { host: "localhost".into(), port: 3000, protocol: "https".into(), ssl_enabled: true, api_endpoint: "/api/v1".into(), connection_timeout: 30, retry_attempts: 3, keep_alive: true },
            database: Database { host: "localhost".into(), port: 5432, name: "project_db".into(), max_connections: 100, timeout: 30, auto_backup: true, backup_interval: 24 },
            security: Security { enable_ssl: true, require_two_factor: false, session_timeout: 24, max_login_attempts: 5, ip_whitelist: false, allowed_ips: vec![] },
            performance: Performance { max_cpu_usage: 80, max_memory_usage: 85, cache_enabled: true, cache_size: 256, compression_enabled: true, rate_limit_enabled: true, max_requests_per_minute: 1000 },
            notifications: Notifications { email_notifications: true, system_alerts: true, user_registration: true, error_reports: true, backup_reports: true, security_events: true },
            api: Api { enabled: true, version: "v2.0".into(), rate_limit: 100, require_auth: true, allow_cors: false, log_requests: true },
        };
        Self { inner: Arc::new(RwLock::new(cfg)) }
    }
}

pub async fn get_settings(State(store): State<SettingsStore>) -> Json<ServerConfig> {
    Json(store.inner.read().await.clone())
}

pub async fn update_settings(State(store): State<SettingsStore>, Json(cfg): Json<ServerConfig>) -> impl IntoResponse {
    *store.inner.write().await = cfg.clone();
    (StatusCode::OK, Json(cfg))
}



