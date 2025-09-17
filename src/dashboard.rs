use axum::Json;
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct DashboardStats {
    pub cpu: u8,
    pub memory: u8,
    pub disk: u8,
    pub network: u8,
    pub uptime: String,
    pub active_users: u32,
    pub requests: u64,
    pub errors: u32,
}

pub async fn get_dashboard() -> Json<DashboardStats> {
    // Здесь можно подключить sysinfo, пока — мок-данные
    Json(DashboardStats {
        cpu: 65,
        memory: 78,
        disk: 45,
        network: 23,
        uptime: "15d 4h 32m".into(),
        active_users: 1247,
        requests: 89432,
        errors: 12,
    })
}



