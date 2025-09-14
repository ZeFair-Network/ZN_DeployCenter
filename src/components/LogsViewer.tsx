import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { 
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Activity,
  Database,
  Shield,
  Users,
  Server,
  Network,
  Eye,
  EyeOff
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug' | 'success';
  category: 'system' | 'database' | 'security' | 'api' | 'user' | 'network';
  message: string;
  details?: string;
  ip?: string;
  user?: string;
  source: string;
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-15 14:32:15',
    level: 'error',
    category: 'database',
    message: 'Ошибка подключения к базе данных',
    details: 'Connection timeout after 30 seconds. Host: db.example.com:5432',
    source: 'DatabaseConnector.js:45'
  },
  {
    id: '2',
    timestamp: '2024-01-15 14:31:42',
    level: 'warning',
    category: 'security',
    message: 'Неудачная попытка входа',
    details: 'Invalid password for user: admin',
    ip: '192.168.1.100',
    user: 'admin',
    source: 'AuthService.js:120'
  },
  {
    id: '3',
    timestamp: '2024-01-15 14:30:18',
    level: 'info',
    category: 'system',
    message: 'Сервер запущен успешно',
    details: 'Server started on port 3000 with PID 12345',
    source: 'server.js:10'
  },
  {
    id: '4',
    timestamp: '2024-01-15 14:29:55',
    level: 'success',
    category: 'user',
    message: 'Новый пользователь зарегистрирован',
    details: 'User ID: 1001, Username: newuser',
    ip: '10.0.0.50',
    user: 'newuser',
    source: 'UserController.js:67'
  },
  {
    id: '5',
    timestamp: '2024-01-15 14:28:33',
    level: 'debug',
    category: 'api',
    message: 'API запрос выполнен',
    details: 'GET /api/users - 200 OK (125ms)',
    ip: '192.168.1.200',
    source: 'ApiLogger.js:25'
  },
  {
    id: '6',
    timestamp: '2024-01-15 14:27:12',
    level: 'warning',
    category: 'network',
    message: 'Высокая нагрузка на сеть',
    details: 'Network usage: 85% of available bandwidth',
    source: 'NetworkMonitor.js:88'
  },
  {
    id: '7',
    timestamp: '2024-01-15 14:25:45',
    level: 'error',
    category: 'system',
    message: 'Недостаточно места на диске',
    details: 'Disk usage: 95% on /var/log partition',
    source: 'DiskMonitor.js:34'
  },
  {
    id: '8',
    timestamp: '2024-01-15 14:24:20',
    level: 'info',
    category: 'security',
    message: 'SSL сертификат обновлен',
    details: 'Certificate renewed for domain: example.com',
    source: 'SSLManager.js:156'
  }
];

const levelConfig = {
  error: { 
    label: 'Ошибка', 
    icon: XCircle, 
    color: 'bg-red-500 text-white',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400'
  },
  warning: { 
    label: 'Предупреждение', 
    icon: AlertTriangle, 
    color: 'bg-orange-500 text-white',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400'
  },
  info: { 
    label: 'Информация', 
    icon: Info, 
    color: 'bg-blue-500 text-white',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400'
  },
  success: { 
    label: 'Успех', 
    icon: CheckCircle, 
    color: 'bg-green-500 text-white',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400'
  },
  debug: { 
    label: 'Отладка', 
    icon: Activity, 
    color: 'bg-gray-500 text-white',
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-400'
  }
};

const categoryConfig = {
  system: { label: 'Система', icon: Server, color: 'text-purple-400' },
  database: { label: 'База данных', icon: Database, color: 'text-blue-400' },
  security: { label: 'Безопасность', icon: Shield, color: 'text-red-400' },
  api: { label: 'API', icon: Network, color: 'text-green-400' },
  user: { label: 'Пользователи', icon: Users, color: 'text-cyan-400' },
  network: { label: 'Сеть', icon: Network, color: 'text-orange-400' }
};

export function LogsViewer() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(mockLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  // Автообновление логов
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Имитация новых логов
        const newLog: LogEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString('ru-RU'),
          level: ['info', 'warning', 'error', 'debug', 'success'][Math.floor(Math.random() * 5)] as any,
          category: ['system', 'database', 'security', 'api', 'user', 'network'][Math.floor(Math.random() * 6)] as any,
          message: 'Автосгенерированное событие',
          details: 'Детали автогенерированного события',
          source: 'AutoGenerator.js:1'
        };
        setLogs(prev => [newLog, ...prev].slice(0, 1000)); // Ограничиваем до 1000 записей
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Фильтрация логов
  useEffect(() => {
    let filtered = logs;

    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchQuery, levelFilter, categoryFilter]);

  const handleRefresh = () => {
    // Имитация обновления логов
    const refreshedLogs = [...logs];
    setLogs(refreshedLogs);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getLogStats = () => {
    const total = filteredLogs.length;
    const errors = filteredLogs.filter(log => log.level === 'error').length;
    const warnings = filteredLogs.filter(log => log.level === 'warning').length;
    const info = filteredLogs.filter(log => log.level === 'info').length;
    
    return { total, errors, warnings, info };
  };

  const stats = getLogStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 h-full"
    >
      <div className="flex flex-col h-full space-y-6">
        {/* Заголовок и статистика */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/40 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-2xl p-6 shadow-xl"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-medium text-gray-900 dark:text-white">
                Просмотр логов
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mt-2">Системные события за последние 48 часов</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
                <span className="text-gray-900 dark:text-white text-sm">Автообновление</span>
              </div>
              <Button
                variant="outline"
                onClick={handleRefresh}
                className="border-white/30 dark:border-white/20 text-gray-900 dark:text-white bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Обновить
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                className="border-white/30 dark:border-white/20 text-gray-900 dark:text-white bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { title: 'Всего', value: stats.total, color: 'from-blue-500 to-cyan-500' },
              { title: 'Ошибки', value: stats.errors, color: 'from-red-500 to-pink-500' },
              { title: 'Предупреждения', value: stats.warnings, color: 'from-orange-500 to-yellow-500' },
              { title: 'Информация', value: stats.info, color: 'from-green-500 to-emerald-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-4 bg-white/30 dark:bg-white/10 rounded-xl backdrop-blur-sm"
              >
                <div className={`text-2xl font-medium bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
          {/* Фильтры и настройки */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="backdrop-blur-xl bg-white/40 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-2xl p-6 shadow-xl"
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              <Filter className="w-5 h-5 inline mr-2" />
              Фильтры
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Поиск</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    placeholder="Поиск в логах..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Уровень</label>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все уровни</SelectItem>
                    {Object.entries(levelConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Категория</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-gray-700 dark:text-gray-300 text-sm">Показать детали</span>
                <Switch
                  checked={showDetails}
                  onCheckedChange={setShowDetails}
                />
              </div>
            </div>
          </motion.div>

          {/* Список логов */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 backdrop-blur-xl bg-white/40 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-2xl shadow-xl flex flex-col"
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
          >
            <div className="p-6 border-b border-white/20 dark:border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Журнал событий ({filteredLogs.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="border-white/30 dark:border-white/20 text-gray-900 dark:text-white bg-white/30 dark:bg-white/10"
                >
                  {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full scrollbar-glass">
                <div className="p-6 space-y-3">
                {filteredLogs.map((log) => {
                  const levelInfo = levelConfig[log.level];
                  const categoryInfo = categoryConfig[log.category];
                  const LevelIcon = levelInfo.icon;
                  const CategoryIcon = categoryInfo.icon;
                  
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        selectedLog?.id === log.id
                          ? 'bg-white/60 dark:bg-white/20 border-white/50 dark:border-white/30 shadow-lg'
                          : `${levelInfo.bgColor} border-white/10 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10`
                      }`}
                      style={{
                        backdropFilter: 'blur(12px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(12px) saturate(150%)',
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${levelInfo.color} flex-shrink-0`}>
                          <LevelIcon className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge className={levelInfo.color}>
                                {levelInfo.label}
                              </Badge>
                              <Badge variant="outline" className="border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-300 bg-white/20 dark:bg-white/10">
                                <CategoryIcon className="w-3 h-3 mr-1" />
                                {categoryInfo.label}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                              <Calendar className="w-3 h-3" />
                              <span>{log.timestamp}</span>
                            </div>
                          </div>
                          
                          <h4 className="text-gray-900 dark:text-white font-medium mb-1">{log.message}</h4>
                          
                          {showDetails && log.details && (
                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 font-mono bg-black/10 dark:bg-black/20 p-2 rounded">
                              {log.details}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                            <span>Источник: {log.source}</span>
                            <div className="flex items-center space-x-3">
                              {log.ip && <span>IP: {log.ip}</span>}
                              {log.user && <span>Пользователь: {log.user}</span>}
                            </div>
                          </div>
                          
                          {selectedLog?.id === log.id && log.details && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 p-3 bg-black/10 dark:bg-black/30 rounded-lg"
                            >
                              <h5 className="text-gray-900 dark:text-white font-medium mb-2">Подробности:</h5>
                              <pre className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap overflow-x-auto">
                                {log.details}
                              </pre>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                
                {filteredLogs.length === 0 && (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500 opacity-50" />
                    <p className="text-gray-500 dark:text-gray-400">Нет записей, соответствующих фильтрам</p>
                  </div>
                )}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}