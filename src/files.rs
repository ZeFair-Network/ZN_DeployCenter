use axum::{extract::{Path, State}, http::StatusCode, response::IntoResponse, Json};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Arc};
use tokio::sync::RwLock;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum NodeType { File, Folder }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileNode {
    pub id: Uuid,
    pub name: String,
    pub node_type: NodeType,
    pub size: Option<String>,
    pub modified: String,
    pub extension: Option<String>,
    pub content: Option<String>,
    pub parent: Option<Uuid>,
}

#[derive(Debug, Default, Clone)]
pub struct FsStore { pub nodes: Arc<RwLock<HashMap<Uuid, FileNode>>> }

impl FsStore {
    pub fn new_mock() -> Self {
        let mut map = HashMap::new();
        let root_public = Uuid::new_v4();
        let root_src = Uuid::new_v4();
        map.insert(root_public, FileNode { id: root_public, name: "public".into(), node_type: NodeType::Folder, size: None, modified: "2 часа назад".into(), extension: None, content: None, parent: None });
        map.insert(root_src, FileNode { id: root_src, name: "src".into(), node_type: NodeType::Folder, size: None, modified: "1 час назад".into(), extension: None, content: None, parent: None });
        let pkg = Uuid::new_v4();
        map.insert(pkg, FileNode { id: pkg, name: "package.json".into(), node_type: NodeType::File, size: Some("2.1 KB".into()), modified: "3 дня назад".into(), extension: Some("json".into()), content: Some("{\n  \"name\": \"project\"\n}".into()), parent: None });
        Self { nodes: Arc::new(RwLock::new(map)) }
    }
}

pub async fn list(State(store): State<FsStore>) -> Json<Vec<FileNode>> {
    Json(store.nodes.read().await.values().cloned().collect())
}

#[derive(Debug, Deserialize)]
pub struct CreateNode { pub name: String, pub node_type: NodeType, pub parent: Option<Uuid> }

pub async fn create(State(store): State<FsStore>, Json(req): Json<CreateNode>) -> Json<FileNode> {
    let mut map = store.nodes.write().await;
    let id = Uuid::new_v4();
    let node = FileNode { id, name: req.name, node_type: req.node_type, size: Some("0 B".into()), modified: "только что".into(), extension: None, content: Some(String::new()), parent: req.parent };
    map.insert(id, node.clone());
    Json(node)
}

#[derive(Debug, Deserialize)]
pub struct UpdateFile { pub content: String }

pub async fn save(State(store): State<FsStore>, Path(id): Path<Uuid>, Json(req): Json<UpdateFile>) -> impl IntoResponse {
    let mut map = store.nodes.write().await;
    if let Some(node) = map.get_mut(&id) { node.content = Some(req.content); node.modified = "только что".into(); return StatusCode::OK; }
    StatusCode::NOT_FOUND
}

pub async fn remove(State(store): State<FsStore>, Path(id): Path<Uuid>) -> impl IntoResponse {
    let mut map = store.nodes.write().await;
    if map.remove(&id).is_some() { return StatusCode::NO_CONTENT; }
    StatusCode::NOT_FOUND
}



