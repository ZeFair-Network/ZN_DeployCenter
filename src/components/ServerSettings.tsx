import { motion } from 'motion/react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { 
  Server,
  Database,
  Shield,
  Globe,
  Mail,
  Bell,
  Users,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Save,
  RotateCcw,
  Download,
  Upload,
  Wifi,
  Link,
  MonitorSpeaker
} from 'lucide-react';

interface ServerConfig {
  general: {
    serverName: string;
    description: string;
    adminEmail: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
  };
  connection: {
    host: string;
    port: number;
    protocol: string;
    sslEnabled: boolean;
    apiEndpoint: string;
    connectionTimeout: number;
    retryAttempts: number;
    keepAlive: boolean;
  };
  database: {
    host: string;
    port: number;
    name: string;
    maxConnections: number;
    timeout: number;
    autoBackup: boolean;
    backupInterval: number;
  };
  security: {
    enableSSL: boolean;
    requireTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    ipWhitelist: boolean;
    allowedIPs: string[];
  };
  performance: {
    maxCpuUsage: number;
    maxMemoryUsage: number;
    cacheEnabled: boolean;
    cacheSize: number;
    compressionEnabled: boolean;
    rateLimitEnabled: boolean;
    maxRequestsPerMinute: number;
  };
  notifications: {
    emailNotifications: boolean;
    systemAlerts: boolean;
    userRegistration: boolean;
    errorReports: boolean;
    backupReports: boolean;
    securityEvents: boolean;
  };
  api: {
    enabled: boolean;
    version: string;
    rateLimit: number;
    requireAuth: boolean;
    allowCors: boolean;
    logRequests: boolean;
  };
}

const defaultConfig: ServerConfig = {
  general: {
    serverName: 'Мой Проект',
    description: 'Описание проекта',
    adminEmail: 'admin@example.com',
    timezone: 'Europe/Moscow',
    language: 'ru',
    maintenanceMode: false,
  },
  connection: {
    host: 'localhost',
    port: 3000,
    protocol: 'https',
    sslEnabled: true,
    apiEndpoint: '/api/v1',
    connectionTimeout: 30,
    retryAttempts: 3,
    keepAlive: true,
  },
  database: {
    host: 'localhost',
    port: 5432,
    name: 'project_db',
    maxConnections: 100,
    timeout: 30,
    autoBackup: true,
    backupInterval: 24,
  },
  security: {
    enableSSL: true,
    requireTwoFactor: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    ipWhitelist: false,
    allowedIPs: [],
  },
  performance: {
    maxCpuUsage: 80,
    maxMemoryUsage: 85,
    cacheEnabled: true,
    cacheSize: 256,
    compressionEnabled: true,
    rateLimitEnabled: true,
    maxRequestsPerMinute: 1000,
  },
  notifications: {
    emailNotifications: true,
    systemAlerts: true,
    userRegistration: true,
    errorReports: true,
    backupReports: true,
    securityEvents: true,
  },
  api: {
    enabled: true,
    version: 'v2.0',
    rateLimit: 100,
    requireAuth: true,
    allowCors: false,
    logRequests: true,
  },
};

export function ServerSettings() {
  const [config, setConfig] = useState<ServerConfig>(defaultConfig);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateConfig = (section: keyof ServerConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    // Имитация сохранения настроек
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setHasChanges(false);
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    setHasChanges(false);
  };

  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'server-config.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 h-full min-h-0 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        {/* Заголовок и панель управления */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/40 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-2xl p-6 shadow-xl mb-6"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-medium text-gray-900 dark:text-white">
                Настройки сервера
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mt-2">Конфигурация и управление параметрами сервера</p>
            </div>
            <div className="flex items-center space-x-3">
              {hasChanges && (
                <Badge className="bg-orange-500 text-white">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Есть несохраненные изменения
                </Badge>
              )}
              <Button
                variant="outline"
                onClick={exportConfig}
                className="border-white/30 dark:border-white/20 text-gray-900 dark:text-white bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!hasChanges}
                className="border-white/30 dark:border-white/20 text-gray-900 dark:text-white bg-white/30 dark:bg-white/10 hover:bg-white/50 dark:hover:bg-white/20 disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Сброс
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Вкладки настроек */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="backdrop-blur-xl bg-white/40 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-2xl shadow-xl flex-1 min-h-0 overflow-hidden"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <Tabs defaultValue="general" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-7 bg-white/20 dark:bg-white/5 m-6 mb-0 backdrop-blur-sm">
              <TabsTrigger value="general" className="data-[state=active]:bg-white/40 dark:data-[state=active]:bg-white/20 text-gray-700 dark:text-gray-300">
                <Server className="w-4 h-4 mr-2" />
                Общие
              </TabsTrigger>
              <TabsTrigger value="connection" className="data-[state=active]:bg-white/40 dark:data-[state=active]:bg-white/20 text-gray-700 dark:text-gray-300">
                <Wifi className="w-4 h-4 mr-2" />
                Подключение
              </TabsTrigger>
              <TabsTrigger value="database" className="data-[state=active]:bg-white/40 dark:data-[state=active]:bg-white/20 text-gray-700 dark:text-gray-300">
                <Database className="w-4 h-4 mr-2" />
                База данных
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-white/40 dark:data-[state=active]:bg-white/20 text-gray-700 dark:text-gray-300">
                <Shield className="w-4 h-4 mr-2" />
                Безопасность
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-white/40 dark:data-[state=active]:bg-white/20 text-gray-700 dark:text-gray-300">
                <Cpu className="w-4 h-4 mr-2" />
                Производительность
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-white/40 dark:data-[state=active]:bg-white/20 text-gray-700 dark:text-gray-300">
                <Bell className="w-4 h-4 mr-2" />
                Уведомления
              </TabsTrigger>
              <TabsTrigger value="api" className="data-[state=active]:bg-white/40 dark:data-[state=active]:bg-white/20 text-gray-700 dark:text-gray-300">
                <Globe className="w-4 h-4 mr-2" />
                API
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 min-h-0 overflow-hidden">
              <ScrollArea className="h-full scrollbar-glass">
                <div className="p-6">
                  {/* Общие настройки */}
                  <TabsContent value="general" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Название сервера</label>
                          <Input
                            value={config.general.serverName}
                            onChange={(e) => updateConfig('general', 'serverName', e.target.value)}
                            className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Описание</label>
                          <Textarea
                            value={config.general.description}
                            onChange={(e) => updateConfig('general', 'description', e.target.value)}
                            className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Email администратора</label>
                          <Input
                            type="email"
                            value={config.general.adminEmail}
                            onChange={(e) => updateConfig('general', 'adminEmail', e.target.value)}
                            className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Часовой пояс</label>
                          <Select value={config.general.timezone} onValueChange={(value) => updateConfig('general', 'timezone', value)}>
                            <SelectTrigger className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Europe/Moscow">Europe/Moscow</SelectItem>
                              <SelectItem value="Europe/London">Europe/London</SelectItem>
                              <SelectItem value="America/New_York">America/New_York</SelectItem>
                              <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Язык</label>
                          <Select value={config.general.language} onValueChange={(value) => updateConfig('general', 'language', value)}>
                            <SelectTrigger className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ru">Русский</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="de">Deutsch</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Режим обслуживания</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Временно отключить доступ к серверу</p>
                          </div>
                          <Switch
                            checked={config.general.maintenanceMode}
                            onCheckedChange={(checked) => updateConfig('general', 'maintenanceMode', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Настройки подключения */}
                  <TabsContent value="connection" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Хост сервера</label>
                          <Input
                            value={config.connection.host}
                            onChange={(e) => updateConfig('connection', 'host', e.target.value)}
                            className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                            placeholder="localhost или IP адрес"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Порт</label>
                          <Input
                            type="number"
                            value={config.connection.port}
                            onChange={(e) => updateConfig('connection', 'port', parseInt(e.target.value))}
                            className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Протокол</label>
                          <Select value={config.connection.protocol} onValueChange={(value) => updateConfig('connection', 'protocol', value)}>
                            <SelectTrigger className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="http">HTTP</SelectItem>
                              <SelectItem value="https">HTTPS</SelectItem>
                              <SelectItem value="ws">WebSocket</SelectItem>
                              <SelectItem value="wss">WebSocket Secure</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">API Endpoint</label>
                          <Input
                            value={config.connection.apiEndpoint}
                            onChange={(e) => updateConfig('connection', 'apiEndpoint', e.target.value)}
                            className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                            placeholder="/api/v1"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Тайм-аут подключения (сек): {config.connection.connectionTimeout}</label>
                          <Slider
                            value={[config.connection.connectionTimeout]}
                            onValueChange={([value]) => updateConfig('connection', 'connectionTimeout', value)}
                            max={120}
                            min={5}
                            step={5}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Попытки переподключения: {config.connection.retryAttempts}</label>
                          <Slider
                            value={[config.connection.retryAttempts]}
                            onValueChange={([value]) => updateConfig('connection', 'retryAttempts', value)}
                            max={10}
                            min={1}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">SSL шифрование</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Использовать защищенное соединение</p>
                          </div>
                          <Switch
                            checked={config.connection.sslEnabled}
                            onCheckedChange={(checked) => updateConfig('connection', 'sslEnabled', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Keep-Alive</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Поддерживать постоянное соединение</p>
                          </div>
                          <Switch
                            checked={config.connection.keepAlive}
                            onCheckedChange={(checked) => updateConfig('connection', 'keepAlive', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Настройки базы данных */}
                  <TabsContent value="database" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Хост базы данных</label>
                          <Input
                            value={config.database.host}
                            onChange={(e) => updateConfig('database', 'host', e.target.value)}
                            className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Порт</label>
                          <Input
                            type="number"
                            value={config.database.port}
                            onChange={(e) => updateConfig('database', 'port', parseInt(e.target.value))}
                            className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Название базы данных</label>
                          <Input
                            value={config.database.name}
                            onChange={(e) => updateConfig('database', 'name', e.target.value)}
                            className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Максимум соединений: {config.database.maxConnections}</label>
                          <Slider
                            value={[config.database.maxConnections]}
                            onValueChange={([value]) => updateConfig('database', 'maxConnections', value)}
                            max={500}
                            min={10}
                            step={10}
                            className="mt-2"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Тайм-аут (сек): {config.database.timeout}</label>
                          <Slider
                            value={[config.database.timeout]}
                            onValueChange={([value]) => updateConfig('database', 'timeout', value)}
                            max={120}
                            min={5}
                            step={5}
                            className="mt-2"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Автоматические бэкапы</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Регулярное создание резервных копий</p>
                          </div>
                          <Switch
                            checked={config.database.autoBackup}
                            onCheckedChange={(checked) => updateConfig('database', 'autoBackup', checked)}
                          />
                        </div>
                        {config.database.autoBackup && (
                          <div>
                            <label className="block text-gray-900 dark:text-white mb-2">Интервал бэкапов (часы): {config.database.backupInterval}</label>
                            <Slider
                              value={[config.database.backupInterval]}
                              onValueChange={([value]) => updateConfig('database', 'backupInterval', value)}
                              max={168}
                              min={1}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Остальные вкладки */}
                  <TabsContent value="security" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">SSL/TLS шифрование</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Защищенное соединение HTTPS</p>
                          </div>
                          <Switch
                            checked={config.security.enableSSL}
                            onCheckedChange={(checked) => updateConfig('security', 'enableSSL', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Двухфакторная аутентификация</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Требовать 2FA для всех пользователей</p>
                          </div>
                          <Switch
                            checked={config.security.requireTwoFactor}
                            onCheckedChange={(checked) => updateConfig('security', 'requireTwoFactor', checked)}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Тайм-аут сессии (часы): {config.security.sessionTimeout}</label>
                          <Slider
                            value={[config.security.sessionTimeout]}
                            onValueChange={([value]) => updateConfig('security', 'sessionTimeout', value)}
                            max={168}
                            min={1}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Максимум попыток входа: {config.security.maxLoginAttempts}</label>
                          <Slider
                            value={[config.security.maxLoginAttempts]}
                            onValueChange={([value]) => updateConfig('security', 'maxLoginAttempts', value)}
                            max={20}
                            min={3}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Белый список IP</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Разрешить доступ только с указанных IP</p>
                          </div>
                          <Switch
                            checked={config.security.ipWhitelist}
                            onCheckedChange={(checked) => updateConfig('security', 'ipWhitelist', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Максимальная загрузка CPU (%): {config.performance.maxCpuUsage}</label>
                          <Slider
                            value={[config.performance.maxCpuUsage]}
                            onValueChange={([value]) => updateConfig('performance', 'maxCpuUsage', value)}
                            max={100}
                            min={10}
                            step={5}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Максимальное использование памяти (%): {config.performance.maxMemoryUsage}</label>
                          <Slider
                            value={[config.performance.maxMemoryUsage]}
                            onValueChange={([value]) => updateConfig('performance', 'maxMemoryUsage', value)}
                            max={100}
                            min={10}
                            step={5}
                            className="mt-2"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Кэширование</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Включить кэширование для ускорения</p>
                          </div>
                          <Switch
                            checked={config.performance.cacheEnabled}
                            onCheckedChange={(checked) => updateConfig('performance', 'cacheEnabled', checked)}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Размер кэша (МБ): {config.performance.cacheSize}</label>
                          <Slider
                            value={[config.performance.cacheSize]}
                            onValueChange={([value]) => updateConfig('performance', 'cacheSize', value)}
                            max={2048}
                            min={64}
                            step={64}
                            className="mt-2"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Сжатие</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Сжимать ответы сервера</p>
                          </div>
                          <Switch
                            checked={config.performance.compressionEnabled}
                            onCheckedChange={(checked) => updateConfig('performance', 'compressionEnabled', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Ограничение скорости</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Ограничить количество запросов</p>
                          </div>
                          <Switch
                            checked={config.performance.rateLimitEnabled}
                            onCheckedChange={(checked) => updateConfig('performance', 'rateLimitEnabled', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notifications" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Email уведомления</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Отправлять уведомления на email</p>
                          </div>
                          <Switch
                            checked={config.notifications.emailNotifications}
                            onCheckedChange={(checked) => updateConfig('notifications', 'emailNotifications', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Системные оповещения</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Уведомления о состоянии системы</p>
                          </div>
                          <Switch
                            checked={config.notifications.systemAlerts}
                            onCheckedChange={(checked) => updateConfig('notifications', 'systemAlerts', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Регистрация пользователей</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Уведомления о новых пользователях</p>
                          </div>
                          <Switch
                            checked={config.notifications.userRegistration}
                            onCheckedChange={(checked) => updateConfig('notifications', 'userRegistration', checked)}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Отчеты об ошибках</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Уведомления о системных ошибках</p>
                          </div>
                          <Switch
                            checked={config.notifications.errorReports}
                            onCheckedChange={(checked) => updateConfig('notifications', 'errorReports', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Отчеты о бэкапах</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Уведомления о резервном копировании</p>
                          </div>
                          <Switch
                            checked={config.notifications.backupReports}
                            onCheckedChange={(checked) => updateConfig('notifications', 'backupReports', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">События безопасности</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Уведомления о нарушениях безопасности</p>
                          </div>
                          <Switch
                            checked={config.notifications.securityEvents}
                            onCheckedChange={(checked) => updateConfig('notifications', 'securityEvents', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="api" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">API включен</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Разрешить доступ к API</p>
                          </div>
                          <Switch
                            checked={config.api.enabled}
                            onCheckedChange={(checked) => updateConfig('api', 'enabled', checked)}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Версия API</label>
                          <Input
                            value={config.api.version}
                            onChange={(e) => updateConfig('api', 'version', e.target.value)}
                            className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-900 dark:text-white mb-2">Лимит запросов: {config.api.rateLimit}</label>
                          <Slider
                            value={[config.api.rateLimit]}
                            onValueChange={([value]) => updateConfig('api', 'rateLimit', value)}
                            max={1000}
                            min={10}
                            step={10}
                            className="mt-2"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Требовать аутентификацию</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">API требует токен доступа</p>
                          </div>
                          <Switch
                            checked={config.api.requireAuth}
                            onCheckedChange={(checked) => updateConfig('api', 'requireAuth', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Разрешить CORS</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Кросс-доменные запросы</p>
                          </div>
                          <Switch
                            checked={config.api.allowCors}
                            onCheckedChange={(checked) => updateConfig('api', 'allowCors', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-white/10 rounded-lg backdrop-blur-sm">
                          <div>
                            <label className="text-gray-900 dark:text-white font-medium">Логировать запросы</label>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Записывать все API запросы</p>
                          </div>
                          <Switch
                            checked={config.api.logRequests}
                            onCheckedChange={(checked) => updateConfig('api', 'logRequests', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
}