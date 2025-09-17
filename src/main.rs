use std::net::SocketAddr;
use axum::{routing::{get, post, put, delete}, Router};
use tower_http::{cors::{Any, CorsLayer}, trace::TraceLayer};
use tracing_subscriber::{fmt, EnvFilter};

mod news;
use news::*;
mod users;
use users::*;
mod logs;
use logs::*;
mod dashboard;
use dashboard::*;
mod settings;
use settings::*;
mod terminal;
use terminal::*;
mod files;
use files::*;

#[tokio::main]
async fn main() {
    // Логи
    let _ = fmt()
        .with_env_filter(EnvFilter::from_default_env().add_directive("info".parse().unwrap()))
        .try_init();

    let news_store = NewsStore::new_with_mock();
    let users_store = UsersStore::new_with_mock();
    let logs_store = LogsStore::new_mock();
    let settings_store = SettingsStore::new_default();
    let term_store = TerminalStore::new_welcome();
    let fs_store = FsStore::new_mock();

    let api = Router::new()
        // Новости
        .route("/news", get(list_news).post(create_news))
        .route("/news/stats", get(news_stats))
        .route("/news/:id", get(get_news).put(update_news).delete(delete_news))
        .with_state(news_store)
        // Пользователи
        .route("/users", get(list_users).post(create_user))
        .route("/users/:id", delete(delete_user).put(update_user))
        .with_state(users_store)
        // Логи
        .route("/logs", get(list_logs).post(push_log))
        .route("/logs/stats", get(logs_stats))
        .with_state(logs_store)
        // Дашборд
        .route("/dashboard", get(get_dashboard))
        // Настройки
        .route("/settings", get(get_settings).put(update_settings))
        .with_state(settings_store)
        // Терминал
        .route("/terminal/history", get(get_history))
        .route("/terminal/exec", post(exec_command))
        .with_state(term_store)
        // Файлы
        .route("/files", get(list).post(create))
        .route("/files/:id", put(save).delete(remove))
        .with_state(fs_store);

    let app = Router::new()
        .nest("/api", api)
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        )
        .layer(TraceLayer::new_for_http());

    let addr: SocketAddr = "0.0.0.0:8080".parse().unwrap();
    tracing::info!(%addr, "Starting server");
    axum::serve(tokio::net::TcpListener::bind(addr).await.unwrap(), app)
        .await
        .unwrap();
}
