import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Folder,
  File,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Code,
  Upload,
  Download,
  Edit,
  Trash2,
  Plus,
  Search,
  Home,
  ChevronRight,
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: "folder" | "file";
  size?: string;
  modified: string;
  extension?: string;
  content?: string;
}

const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "public",
    type: "folder",
    modified: "2 часа назад",
  },
  {
    id: "2",
    name: "src",
    type: "folder",
    modified: "1 час назад",
  },
  {
    id: "3",
    name: "components",
    type: "folder",
    modified: "30 мин назад",
  },
  {
    id: "4",
    name: "styles",
    type: "folder",
    modified: "1 день назад",
  },
  {
    id: "5",
    name: "package.json",
    type: "file",
    size: "2.1 KB",
    modified: "3 дня назад",
    extension: "json",
    content:
      '{\n  "name": "project",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  }\n}',
  },
  {
    id: "6",
    name: "README.md",
    type: "file",
    size: "1.5 KB",
    modified: "5 дней назад",
    extension: "md",
    content: "# Проект\n\nОписание проекта...",
  },
  {
    id: "7",
    name: "vite.config.ts",
    type: "file",
    size: "456 B",
    modified: "1 неделю назад",
    extension: "ts",
    content:
      'import { defineConfig } from "vite";\n\nexport default defineConfig({\n  // конфигурация\n});',
  },
  {
    id: "8",
    name: "logo.png",
    type: "file",
    size: "45 KB",
    modified: "2 недели назад",
    extension: "png",
  },
  {
    id: "9",
    name: "app.css",
    type: "file",
    size: "3.2 KB",
    modified: "3 дня назад",
    extension: "css",
    content:
      "/* Основные стили */\nbody {\n  margin: 0;\n  font-family: Arial, sans-serif;\n}",
  },
];

const getFileIcon = (item: FileItem) => {
  if (item.type === "folder") return Folder;

  switch (item.extension) {
    case "txt":
    case "md":
      return FileText;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return Image;
    case "mp4":
    case "avi":
    case "mkv":
      return Video;
    case "mp3":
    case "wav":
    case "flac":
      return Music;
    case "zip":
    case "rar":
    case "7z":
      return Archive;
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
    case "html":
    case "css":
    case "json":
      return Code;
    default:
      return File;
  }
};

const getFileColor = (item: FileItem) => {
  if (item.type === "folder")
    return "text-blue-500 dark:text-blue-400";

  switch (item.extension) {
    case "txt":
    case "md":
      return "text-muted-foreground";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return "text-green-600 dark:text-green-400";
    case "mp4":
    case "avi":
    case "mkv":
      return "text-purple-600 dark:text-purple-400";
    case "mp3":
    case "wav":
    case "flac":
      return "text-pink-600 dark:text-pink-400";
    case "zip":
    case "rar":
    case "7z":
      return "text-orange-600 dark:text-orange-400";
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
      return "text-yellow-600 dark:text-yellow-400";
    case "html":
      return "text-red-600 dark:text-red-400";
    case "css":
      return "text-cyan-600 dark:text-cyan-400";
    case "json":
      return "text-amber-600 dark:text-amber-400";
    default:
      return "text-muted-foreground";
  }
};

export function FileManager() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [selectedFile, setSelectedFile] =
    useState<FileItem | null>(null);
  const [editingFile, setEditingFile] =
    useState<FileItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState(
    "/home/user/project",
  );
  const [editContent, setEditContent] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] =
    useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState<
    "file" | "folder"
  >("file");

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleFileClick = (file: FileItem) => {
    if (file.type === "folder") {
      // Переход в папку (имитация)
      setCurrentPath(currentPath + "/" + file.name);
    } else {
      setSelectedFile(file);
    }
  };

  const handleEditFile = (file: FileItem) => {
    setEditingFile(file);
    setEditContent(file.content || "");
  };

  const handleSaveFile = () => {
    if (editingFile) {
      setFiles(
        files.map((f) =>
          f.id === editingFile.id
            ? {
                ...f,
                content: editContent,
                modified: "только что",
              }
            : f,
        ),
      );
      setEditingFile(null);
      setEditContent("");
      if (selectedFile?.id === editingFile.id) {
        setSelectedFile({
          ...editingFile,
          content: editContent,
        });
      }
    }
  };

  const handleDeleteFile = (file: FileItem) => {
    setFiles(files.filter((f) => f.id !== file.id));
    if (selectedFile?.id === file.id) {
      setSelectedFile(null);
    }
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: newFileName,
        type: newFileType,
        modified: "только что",
        size: newFileType === "file" ? "0 B" : undefined,
        extension:
          newFileType === "file"
            ? newFileName.split(".").pop()
            : undefined,
        content: newFileType === "file" ? "" : undefined,
      };
      setFiles([...files, newFile]);
      setNewFileName("");
      setIsCreateDialogOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-3 sm:p-6 h-full min-h-0 overflow-hidden"
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 h-full min-h-0">
        {/* Файловый браузер */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="xl:col-span-2 bg-background/60 dark:bg-background/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl flex flex-col min-h-0"
          style={{
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          {/* Заголовок и панель инструментов */}
          <div className="p-4 sm:p-6 border-b border-border/20">
            <h2 className="text-xl sm:text-2xl text-foreground/90 mb-4">
              Файловый менеджер
            </h2>

            {/* Путь */}
            <div className="flex items-center space-x-2 mb-4 text-sm text-muted-foreground">
              <Home className="w-4 h-4" />
              <span className="truncate">{currentPath}</span>
            </div>

            {/* Панель инструментов */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск файлов..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex items-center space-x-2 justify-end">
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Создать
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="backdrop-blur-xl bg-background/80 border-border/50">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">
                        Создать новый элемент
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Button
                          variant={
                            newFileType === "file"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setNewFileType("file")}
                          className="flex-1"
                        >
                          Файл
                        </Button>
                        <Button
                          variant={
                            newFileType === "folder"
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            setNewFileType("folder")
                          }
                          className="flex-1"
                        >
                          Папка
                        </Button>
                      </div>
                      <Input
                        placeholder={`Имя ${newFileType === "file" ? "файла" : "папки"}`}
                        value={newFileName}
                        onChange={(e) =>
                          setNewFileName(e.target.value)
                        }
                        className="bg-background/50 border-border/50 text-foreground"
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          handleCreateFile()
                        }
                      />
                      <Button
                        onClick={handleCreateFile}
                        className="w-full"
                      >
                        Создать
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  className="border-border/50 text-foreground hidden sm:flex"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Загрузить
                </Button>
              </div>
            </div>
          </div>

          {/* Список файлов */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full scrollbar-glass">
              <div className="p-4 sm:p-6 space-y-2">
                {filteredFiles.map((file) => {
                  const Icon = getFileIcon(file);
                  const color = getFileColor(file);

                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleFileClick(file)}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-background/30 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <Icon
                          className={`w-5 h-5 flex-shrink-0 ${color}`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            {file.size && (
                              <span>{file.size}</span>
                            )}
                            <span className="hidden sm:inline">
                              {file.modified}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.type === "file" &&
                          file.content !== undefined && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditFile(file);
                              }}
                              className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground hover:text-foreground h-8 w-8 p-0 hidden sm:flex"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file);
                          }}
                          className="text-destructive hover:text-destructive/80 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </motion.div>

        {/* Панель предварительного просмотра/редактирования */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-xl bg-background/60 dark:bg-background/40 border border-border/50 rounded-2xl shadow-2xl flex flex-col min-h-0"
        >
          <div className="p-4 sm:p-6 border-b border-border/20 flex-shrink-0">
            <h3 className="text-lg text-foreground">
              {editingFile
                ? "Редактирование файла"
                : selectedFile
                  ? "Просмотр файла"
                  : "Выберите файл"}
            </h3>
            {(selectedFile || editingFile) && (
              <Badge
                variant="secondary"
                className="mt-2 bg-secondary/50 text-secondary-foreground"
              >
                <span className="truncate max-w-[200px]">
                  {(editingFile || selectedFile)?.name}
                </span>
              </Badge>
            )}
          </div>

          <div className="flex-1 p-4 sm:p-6 min-h-0 overflow-hidden">
            {editingFile ? (
              <div className="h-full flex flex-col space-y-4 min-h-0">
                <div className="flex-1 min-h-0">
                  <Textarea
                    value={editContent}
                    onChange={(e) =>
                      setEditContent(e.target.value)
                    }
                    className="h-full bg-background/50 border-border/50 text-foreground font-mono text-sm resize-none"
                    placeholder="Содержимое файла..."
                  />
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
                  <Button
                    onClick={handleSaveFile}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Сохранить
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingFile(null)}
                    className="border-border/50 text-foreground"
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : selectedFile ? (
              <ScrollArea className="h-full scrollbar-glass">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">
                      Размер:{" "}
                      {selectedFile.size || "Неизвестно"}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Изменен: {selectedFile.modified}
                    </p>
                    {selectedFile.extension && (
                      <p className="text-muted-foreground text-sm">
                        Тип:{" "}
                        {selectedFile.extension.toUpperCase()}
                      </p>
                    )}
                  </div>

                  {selectedFile.content !== undefined ? (
                    <div className="space-y-4">
                      <div className="bg-secondary/20 border border-border/50 rounded-xl p-4 overflow-hidden">
                        <pre className="text-foreground/90 text-sm font-mono whitespace-pre-wrap break-words">
                          {selectedFile.content}
                        </pre>
                      </div>
                      <Button
                        onClick={() =>
                          handleEditFile(selectedFile)
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Редактировать
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <File className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>
                        Предварительный просмотр недоступен для
                        этого типа файла
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>
                  Выберите файл для просмотра или редактирования
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}