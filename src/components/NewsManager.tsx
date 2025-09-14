import { motion } from 'motion/react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  Users,
  TrendingUp,
  MessageSquare,
  Heart,
  Share2,
  MoreHorizontal,
  Code,
  FileText,
  Save
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  markdownContent: string;
  excerpt: string;
  author: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  publishDate: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  featured: boolean;
}

const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Обновление системы безопасности',
    content: 'Подробное описание обновления системы безопасности...',
    markdownContent: `# Обновление системы безопасности

## Основные изменения

- **Улучшенная аутентификация**: Двухфакторная аутентификация для всех пользователей
- **Шифрование данных**: Новые алгоритмы шифрования AES-256
- **Мониторинг безопасности**: Система реального времени для отслеживания угроз

## Технические детали

\`\`\`bash
# Обновление системы
sudo apt update && sudo apt upgrade
\`\`\`

> **Важно**: Все пользователи должны обновить свои пароли после установки обновления.

### Что дальше?

1. Установка патчей безопасности
2. Обучение пользователей
3. Тестирование системы`,
    excerpt: 'Важные улучшения в системе безопасности нашего проекта',
    author: 'Администратор',
    category: 'Безопасность',
    status: 'published',
    publishDate: '2024-01-15',
    views: 1250,
    likes: 89,
    comments: 23,
    tags: ['безопасность', 'обновление'],
    featured: true
  },
  {
    id: '2',
    title: 'Новые функции в API v2.0',
    content: 'Описание новых функций API...',
    markdownContent: `# API v2.0 - Новые возможности

## Что нового?

### GraphQL поддержка
Теперь вы можете использовать GraphQL для более гибких запросов:

\`\`\`graphql
query GetUser($id: ID!) {
  user(id: $id) {
    name
    email
    posts {
      title
      content
    }
  }
}
\`\`\`

### Websockets
Реальное время стало еще проще!

\`\`\`javascript
const ws = new WebSocket('wss://api.example.com/ws');
ws.on('message', (data) => {
  console.log('New message:', data);
});
\`\`\``,
    excerpt: 'Представляем новые возможности нашего API',
    author: 'Разработчик',
    category: 'Разработка',
    status: 'published',
    publishDate: '2024-01-12',
    views: 890,
    likes: 67,
    comments: 15,
    tags: ['api', 'разработка'],
    featured: false
  },
  {
    id: '3',
    title: 'Планы на 2024 год',
    content: 'Наши планы развития на следующий год...',
    markdownContent: `# Roadmap 2024

## Q1 2024
- [ ] Обновление UI/UX
- [ ] Мобильное приложение
- [ ] Интеграция с AI

## Q2 2024
- [ ] Новая архитектура
- [ ] Производительность
- [ ] Аналитика

## Цели на год
> Сделать продукт еще лучше и удобнее для пользователей`,
    excerpt: 'Рассказываем о планах развития проекта в 2024 году',
    author: 'Менеджер проекта',
    category: 'Общее',
    status: 'draft',
    publishDate: '2024-01-20',
    views: 0,
    likes: 0,
    comments: 0,
    tags: ['планы', '2024'],
    featured: false
  }
];

const categories = ['Общее', 'Разработка', 'Безопасность', 'Обновления', 'События'];
const statuses = [
  { value: 'draft', label: 'Черновик', color: 'bg-gray-500' },
  { value: 'published', label: 'Опубликовано', color: 'bg-green-500' },
  { value: 'archived', label: 'Архив', color: 'bg-orange-500' }
];

export function NewsManager() {
  const [articles, setArticles] = useState<NewsArticle[]>(mockNews);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<NewsArticle>>({});
  const [filter, setFilter] = useState<string>('all');

  const [newArticle, setNewArticle] = useState<Partial<NewsArticle>>({
    title: '',
    content: '',
    markdownContent: '',
    excerpt: '',
    author: 'Администратор',
    category: 'Общее',
    status: 'draft',
    tags: [],
    featured: false
  });
  const [isMarkdownMode, setIsMarkdownMode] = useState(true);

  const filteredArticles = articles.filter(article => {
    if (filter === 'all') return true;
    return article.status === filter;
  });

  const handleCreateArticle = () => {
    if (newArticle.title && (newArticle.content || newArticle.markdownContent)) {
      const article: NewsArticle = {
        id: Date.now().toString(),
        title: newArticle.title!,
        content: newArticle.content || '',
        markdownContent: newArticle.markdownContent || '',
        excerpt: newArticle.excerpt || (newArticle.markdownContent || newArticle.content || '').substring(0, 100) + '...',
        author: newArticle.author!,
        category: newArticle.category!,
        status: newArticle.status as 'draft' | 'published' | 'archived',
        publishDate: new Date().toISOString().split('T')[0],
        views: 0,
        likes: 0,
        comments: 0,
        tags: newArticle.tags || [],
        featured: newArticle.featured || false
      };
      
      setArticles([article, ...articles]);
      setNewArticle({
        title: '',
        content: '',
        markdownContent: '',
        excerpt: '',
        author: 'Администратор',
        category: 'Общее',
        status: 'draft',
        tags: [],
        featured: false
      });
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle(article);
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    if (editingArticle.id) {
      setArticles(articles.map(a => 
        a.id === editingArticle.id 
          ? { ...a, ...editingArticle } as NewsArticle
          : a
      ));
      setIsEditMode(false);
      setEditingArticle({});
      if (selectedArticle?.id === editingArticle.id) {
        setSelectedArticle({ ...selectedArticle, ...editingArticle } as NewsArticle);
      }
    }
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter(a => a.id !== id));
    if (selectedArticle?.id === id) {
      setSelectedArticle(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusInfo = statuses.find(s => s.value === status);
    return (
      <Badge className={`${statusInfo?.color} text-white`}>
        {statusInfo?.label}
      </Badge>
    );
  };

  // Функция для рендера Markdown
  const renderMarkdown = (content: string) => {
    // Простой рендеринг markdown (можно заменить на более продвинутую библиотеку)
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/```([^`]+)```/gim, '<pre class="bg-black/20 p-4 rounded-lg font-mono text-sm overflow-x-auto"><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code class="bg-black/10 px-2 py-1 rounded font-mono text-sm">$1</code>')
      .replace(/> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400">$1</blockquote>')
      .replace(/- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n/gim, '<br>');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 h-full overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Список статей */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2 bg-white/50 dark:bg-white/10 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden"
          style={{
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          }}
        >
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent pointer-events-none" />
          
          {/* Заголовок и фильтры */}
          <div className="relative p-6 border-b border-white/20 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Управление новостями</h2>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/90 hover:to-pink-600/90 text-white rounded-2xl shadow-lg backdrop-blur-xl border border-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4 mr-2 inline" />
                    Создать статью
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="backdrop-blur-2xl bg-white/70 dark:bg-slate-900/70 border-white/30 dark:border-white/20 max-w-4xl max-h-[90vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 dark:text-white">Создать новую статью</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4 scrollbar-glass">
                    <div className="space-y-4">
                      <Input
                        placeholder="Заголовок статьи"
                        value={newArticle.title}
                        onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                        className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                      />
                      <Textarea
                        placeholder="Краткое описание"
                        value={newArticle.excerpt}
                        onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})}
                        className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                        rows={2}
                      />
                      
                      {/* Markdown Editor */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-gray-900 dark:text-white font-medium">Содержание</label>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              variant={isMarkdownMode ? "default" : "outline"}
                              size="sm"
                              onClick={() => setIsMarkdownMode(true)}
                              className="h-8"
                            >
                              <Code className="w-4 h-4 mr-1" />
                              Markdown
                            </Button>
                            <Button
                              type="button"
                              variant={!isMarkdownMode ? "default" : "outline"}
                              size="sm"
                              onClick={() => setIsMarkdownMode(false)}
                              className="h-8"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Превью
                            </Button>
                          </div>
                        </div>
                        
                        {isMarkdownMode ? (
                          <Textarea
                            placeholder="# Заголовок&#10;&#10;Ваш контент в формате **Markdown**...&#10;&#10;## Подзаголовок&#10;&#10;- Список&#10;- Элементов&#10;&#10;```javascript&#10;console.log('Код');&#10;```"
                            value={newArticle.markdownContent}
                            onChange={(e) => setNewArticle({...newArticle, markdownContent: e.target.value})}
                            className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white min-h-[300px] font-mono text-sm"
                            rows={15}
                          />
                        ) : (
                          <div className="min-h-[300px] p-4 bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg">
                            <div 
                              className="prose prose-gray dark:prose-invert max-w-none text-gray-900 dark:text-white"
                              dangerouslySetInnerHTML={{ 
                                __html: renderMarkdown(newArticle.markdownContent || '') 
                              }}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Select value={newArticle.category} onValueChange={(value) => setNewArticle({...newArticle, category: value})}>
                          <SelectTrigger className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white">
                            <SelectValue placeholder="Категория" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={newArticle.status} onValueChange={(value) => setNewArticle({...newArticle, status: value as any})}>
                          <SelectTrigger className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white">
                            <SelectValue placeholder="Статус" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map(status => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newArticle.featured}
                          onCheckedChange={(checked) => setNewArticle({...newArticle, featured: checked})}
                        />
                        <label className="text-gray-900 dark:text-white">Рекомендуемая статья</label>
                      </div>
                      <Button onClick={handleCreateArticle} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Save className="w-4 h-4 mr-2" />
                        Создать статью
                      </Button>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>

            {/* Фильтры */}
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'Все' },
                ...statuses
              ].map(status => (
                <Button
                  key={status.value}
                  variant={filter === status.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(status.value)}
                  className={filter === status.value 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-300 bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20'}
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Список статей */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full scrollbar-glass">
              <div className="p-6 space-y-4">
                {filteredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => setSelectedArticle(article)}
                    className={`group p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden ${
                      selectedArticle?.id === article.id
                        ? 'bg-white/60 dark:bg-white/20 border-white/50 dark:border-white/30 shadow-xl'
                        : 'bg-white/30 dark:bg-white/10 border-white/20 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/15'
                    }`}
                    style={{
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    }}
                  >
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 pointer-events-none" />
                    
                    <div className="relative flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-3">
                          <h3 className="text-gray-900 dark:text-white font-medium text-lg">{article.title}</h3>
                          {article.featured && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Рекомендуемое
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                            <span className="flex items-center bg-white/20 dark:bg-white/10 px-2 py-1 rounded-lg">
                              <Calendar className="w-3 h-3 mr-1" />
                              {article.publishDate}
                            </span>
                            <span className="flex items-center bg-white/20 dark:bg-white/10 px-2 py-1 rounded-lg">
                              <Eye className="w-3 h-3 mr-1" />
                              {article.views}
                            </span>
                            <span className="flex items-center bg-white/20 dark:bg-white/10 px-2 py-1 rounded-lg">
                              <Heart className="w-3 h-3 mr-1" />
                              {article.likes}
                            </span>
                            <span className="flex items-center bg-white/20 dark:bg-white/10 px-2 py-1 rounded-lg">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              {article.comments}
                            </span>
                          </div>
                          {getStatusBadge(article.status)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditArticle(article);
                          }}
                          className="w-10 h-10 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/20 rounded-xl"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteArticle(article.id);
                          }}
                          className="w-10 h-10 p-0 text-red-500 hover:text-red-600 hover:bg-red-100/50 dark:hover:bg-red-900/30 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </motion.div>

        {/* Панель просмотра/редактирования */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/50 dark:bg-white/10 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col relative overflow-hidden"
          style={{
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          }}
        >
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent pointer-events-none" />
          
          <div className="relative p-6 border-b border-white/20 dark:border-white/10">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {isEditMode ? 'Редактирование статьи' : selectedArticle ? 'Просмотр статьи' : 'Выберите статью'}
            </h3>
            {(selectedArticle || isEditMode) && (
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary" className="bg-white/40 dark:bg-white/20 text-gray-900 dark:text-white">
                  {selectedArticle?.category || editingArticle.category}
                </Badge>
                {!isEditMode && selectedArticle && (
                  <Button
                    size="sm"
                    onClick={() => handleEditArticle(selectedArticle)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Редактировать
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full scrollbar-glass">
              <div className="p-6">
                {isEditMode ? (
                  <div className="space-y-6">
                    <Input
                      value={editingArticle.title}
                      onChange={(e) => setEditingArticle({...editingArticle, title: e.target.value})}
                      className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white backdrop-blur-sm"
                      placeholder="Заголовок"
                    />
                    <Textarea
                      value={editingArticle.excerpt}
                      onChange={(e) => setEditingArticle({...editingArticle, excerpt: e.target.value})}
                      className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white backdrop-blur-sm"
                      placeholder="Краткое описание"
                      rows={3}
                    />
                    
                    {/* Markdown Editor для редактирования */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-gray-900 dark:text-white font-medium">Содержание</label>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant={isMarkdownMode ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsMarkdownMode(true)}
                            className="h-8"
                          >
                            <Code className="w-4 h-4 mr-1" />
                            Markdown
                          </Button>
                          <Button
                            type="button"
                            variant={!isMarkdownMode ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsMarkdownMode(false)}
                            className="h-8"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Превью
                          </Button>
                        </div>
                      </div>
                      
                      {isMarkdownMode ? (
                        <Textarea
                          value={editingArticle.markdownContent}
                          onChange={(e) => setEditingArticle({...editingArticle, markdownContent: e.target.value})}
                          className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white min-h-[300px] font-mono text-sm backdrop-blur-sm"
                          placeholder="# Заголовок в Markdown..."
                          rows={15}
                        />
                      ) : (
                        <div className="min-h-[300px] p-4 bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg backdrop-blur-sm">
                          <div 
                            className="prose prose-gray dark:prose-invert max-w-none text-gray-900 dark:text-white"
                            dangerouslySetInnerHTML={{ 
                              __html: renderMarkdown(editingArticle.markdownContent || '') 
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button onClick={handleSaveEdit} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditMode(false)}
                        className="border-white/30 dark:border-white/20 text-gray-900 dark:text-white bg-white/30 dark:bg-white/10"
                      >
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : selectedArticle ? (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">{selectedArticle.title}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {selectedArticle.publishDate}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {selectedArticle.author}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {selectedArticle.views} просмотров
                        </span>
                      </div>
                    </div>

                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <div 
                        className="text-gray-900 dark:text-white"
                        dangerouslySetInnerHTML={{ 
                          __html: renderMarkdown(selectedArticle.markdownContent || selectedArticle.content) 
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/20 dark:border-white/10">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/30 dark:border-white/20 text-gray-900 dark:text-white bg-white/30 dark:bg-white/10"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          {selectedArticle.likes}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/30 dark:border-white/20 text-gray-900 dark:text-white bg-white/30 dark:bg-white/10"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {selectedArticle.comments}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/30 dark:border-white/20 text-gray-900 dark:text-white bg-white/30 dark:bg-white/10"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Поделиться
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        {selectedArticle.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="bg-white/40 dark:bg-white/20 text-gray-700 dark:text-gray-300">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500 opacity-50" />
                    <p className="text-gray-600 dark:text-gray-400">Выберите статью для просмотра или создайте новую</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}