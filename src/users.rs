use std::sync::Arc;
use axum::{extract::{Path, State}, http::StatusCode, response::IntoResponse, Json};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum UserRole { Admin, Moderator, User, Banned }

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum UserStatus { Active, Inactive, Suspended }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub full_name: String,
    pub role: UserRole,
    pub status: UserStatus,
    pub join_date: DateTime<Utc>,
    pub last_activity: String,
    pub posts: u32,
    pub reputation: i32,
    pub permissions: Vec<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct UpsertUser {
    pub username: String,
    pub email: String,
    pub full_name: Option<String>,
    pub role: UserRole,
    pub status: UserStatus,
    pub permissions: Vec<String>,
}

#[derive(Debug, Default, Clone)]
pub struct UsersStore { inner: Arc<RwLock<Vec<User>>> }

impl UsersStore {
    pub fn new_with_mock() -> Self {
        let now = Utc::now();
        let users = vec![
            User { id: Uuid::new_v4(), username: "admin".into(), email: "admin@example.com".into(), full_name: "Главный администратор".into(), role: UserRole::Admin, status: UserStatus::Active, join_date: now, last_activity: "2 минуты назад".into(), posts: 156, reputation: 9850, permissions: vec!["all".into()] },
            User { id: Uuid::new_v4(), username: "moderator1".into(), email: "mod1@example.com".into(), full_name: "Модератор Иван".into(), role: UserRole::Moderator, status: UserStatus::Active, join_date: now, last_activity: "1 час назад".into(), posts: 89, reputation: 4520, permissions: vec!["moderate".into(), "edit".into(), "delete".into()] },
        ];
        Self { inner: Arc::new(RwLock::new(users)) }
    }
}

pub async fn list_users(State(store): State<UsersStore>) -> impl IntoResponse {
    Json(store.inner.read().await.clone())
}

pub async fn create_user(State(store): State<UsersStore>, Json(payload): Json<UpsertUser>) -> impl IntoResponse {
    let mut data = store.inner.write().await;
    let user = User {
        id: Uuid::new_v4(),
        username: payload.username.clone(),
        email: payload.email.clone(),
        full_name: payload.full_name.clone().unwrap_or_else(|| payload.username.clone()),
        role: payload.role,
        status: payload.status,
        join_date: Utc::now(),
        last_activity: "только что".into(),
        posts: 0,
        reputation: 0,
        permissions: payload.permissions,
    };
    data.insert(0, user.clone());
    (StatusCode::CREATED, Json(user))
}

pub async fn update_user(State(store): State<UsersStore>, Path(id): Path<Uuid>, Json(payload): Json<UpsertUser>) -> impl IntoResponse {
    let mut data = store.inner.write().await;
    if let Some(u) = data.iter_mut().find(|u| u.id == id) {
        u.username = payload.username;
        u.email = payload.email;
        u.full_name = payload.full_name.unwrap_or_else(|| u.username.clone());
        u.role = payload.role;
        u.status = payload.status;
        u.permissions = payload.permissions;
        return Json(u.clone()).into_response();
    }
    (StatusCode::NOT_FOUND, "Not found").into_response()
}

pub async fn delete_user(State(store): State<UsersStore>, Path(id): Path<Uuid>) -> impl IntoResponse {
    let mut data = store.inner.write().await;
    let before = data.len();
    data.retain(|u| u.id != id);
    if data.len() != before { return StatusCode::NO_CONTENT.into_response(); }
    (StatusCode::NOT_FOUND, "Not found").into_response()
}



