use std::sync::Arc;
use axum::{extract::{Path, Query, State}, http::StatusCode, response::IntoResponse, Json};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;
use uuid::Uuid;

// Модель статьи
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewsArticle {
    pub id: Uuid,
    pub title: String,
    pub content: String,
    pub markdown_content: String,
    pub excerpt: String,
    pub author: String,
    pub category: String,
    pub status: ArticleStatus,
    pub publish_date: DateTime<Utc>,
    pub views: u64,
    pub likes: u64,
    pub comments: u64,
    pub tags: Vec<String>,
    pub featured: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum ArticleStatus {
    Draft,
    Published,
    Archived,
}

// Ввод для создания/обновления
#[derive(Debug, Clone, Deserialize)]
pub struct UpsertArticle {
    pub title: String,
    #[serde(default)]
    pub content: String,
    #[serde(default)]
    pub markdown_content: String,
    #[serde(default)]
    pub excerpt: String,
    pub author: String,
    pub category: String,
    pub status: ArticleStatus,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub featured: bool,
}

#[derive(Debug, Default, Clone)]
pub struct NewsStore {
    inner: Arc<RwLock<Vec<NewsArticle>>>,
}

impl NewsStore {
    pub fn new_with_mock() -> Self {
        let mut initial: Vec<NewsArticle> = Vec::new();
        initial.push(NewsArticle {
            id: Uuid::new_v4(),
            title: "Обновление системы безопасности".into(),
            content: "Подробное описание обновления системы безопасности...".into(),
            markdown_content: "# Обновление системы безопасности".into(),
            excerpt: "Важные улучшения в системе безопасности нашего проекта".into(),
            author: "Администратор".into(),
            category: "Безопасность".into(),
            status: ArticleStatus::Published,
            publish_date: Utc::now(),
            views: 1250,
            likes: 89,
            comments: 23,
            tags: vec!["безопасность".into(), "обновление".into()],
            featured: true,
        });
        initial.push(NewsArticle {
            id: Uuid::new_v4(),
            title: "Новые функции в API v2.0".into(),
            content: "Описание новых функций API...".into(),
            markdown_content: "# API v2.0 - Новые возможности".into(),
            excerpt: "Представляем новые возможности нашего API".into(),
            author: "Разработчик".into(),
            category: "Разработка".into(),
            status: ArticleStatus::Published,
            publish_date: Utc::now(),
            views: 890,
            likes: 67,
            comments: 15,
            tags: vec!["api".into(), "разработка".into()],
            featured: false,
        });
        Self { inner: Arc::new(RwLock::new(initial)) }
    }

    pub fn layer(self) -> axum::extract::State<Self> { State(self) }
}

#[derive(Debug, Deserialize)]
pub struct ListParams {
    #[serde(default)]
    pub q: Option<String>,
    #[serde(default)]
    pub status: Option<ArticleStatus>,
    #[serde(default)]
    pub category: Option<String>,
    #[serde(default)]
    pub limit: Option<usize>,
    #[serde(default)]
    pub offset: Option<usize>,
}

pub async fn list_news(State(store): State<NewsStore>, Query(params): Query<ListParams>) -> impl IntoResponse {
    let data = store.inner.read().await;
    let mut items = data.clone();

    if let Some(q) = params.q.as_ref().map(|s| s.to_lowercase()) {
        items.retain(|a| a.title.to_lowercase().contains(&q) || a.excerpt.to_lowercase().contains(&q));
    }
    if let Some(st) = &params.status {
        items.retain(|a| &a.status == st);
    }
    if let Some(cat) = params.category.as_ref() {
        items.retain(|a| &a.category == cat);
    }

    let offset = params.offset.unwrap_or(0);
    let limit = params.limit.unwrap_or(100).min(1000);
    let end = (offset + limit).min(items.len());
    let sliced = if offset < items.len() { items[offset..end].to_vec() } else { Vec::new() };

    Json(sliced)
}

pub async fn get_news(State(store): State<NewsStore>, Path(id): Path<Uuid>) -> impl IntoResponse {
    let data = store.inner.read().await;
    if let Some(found) = data.iter().find(|a| a.id == id) {
        return Json(found).into_response();
    }
    (StatusCode::NOT_FOUND, "Not found").into_response()
}

pub async fn create_news(State(store): State<NewsStore>, Json(payload): Json<UpsertArticle>) -> impl IntoResponse {
    let mut data = store.inner.write().await;
    let article = NewsArticle {
        id: Uuid::new_v4(),
        title: payload.title,
        content: payload.content,
        markdown_content: payload.markdown_content.clone(),
        excerpt: if payload.excerpt.is_empty() {
            payload.markdown_content.chars().take(120).collect::<String>()
        } else { payload.excerpt }
            ,
        author: payload.author,
        category: payload.category,
        status: payload.status,
        publish_date: Utc::now(),
        views: 0,
        likes: 0,
        comments: 0,
        tags: payload.tags,
        featured: payload.featured,
    };
    data.insert(0, article.clone());
    (StatusCode::CREATED, Json(article))
}

pub async fn update_news(State(store): State<NewsStore>, Path(id): Path<Uuid>, Json(payload): Json<UpsertArticle>) -> impl IntoResponse {
    let mut data = store.inner.write().await;
    if let Some(item) = data.iter_mut().find(|a| a.id == id) {
        item.title = payload.title;
        item.content = payload.content;
        item.markdown_content = payload.markdown_content;
        item.excerpt = payload.excerpt;
        item.author = payload.author;
        item.category = payload.category;
        item.status = payload.status;
        item.tags = payload.tags;
        item.featured = payload.featured;
        return Json(item.clone()).into_response();
    }
    (StatusCode::NOT_FOUND, "Not found").into_response()
}

pub async fn delete_news(State(store): State<NewsStore>, Path(id): Path<Uuid>) -> impl IntoResponse {
    let mut data = store.inner.write().await;
    let before = data.len();
    data.retain(|a| a.id != id);
    if data.len() != before { return StatusCode::NO_CONTENT.into_response(); }
    (StatusCode::NOT_FOUND, "Not found").into_response()
}

#[derive(Debug, Serialize)]
pub struct Stats {
    pub total: usize,
    pub drafts: usize,
    pub published: usize,
    pub archived: usize,
}

pub async fn news_stats(State(store): State<NewsStore>) -> impl IntoResponse {
    let data = store.inner.read().await;
    let total = data.len();
    let drafts = data.iter().filter(|a| a.status == ArticleStatus::Draft).count();
    let published = data.iter().filter(|a| a.status == ArticleStatus::Published).count();
    let archived = data.iter().filter(|a| a.status == ArticleStatus::Archived).count();
    Json(Stats { total, drafts, published, archived })
}



