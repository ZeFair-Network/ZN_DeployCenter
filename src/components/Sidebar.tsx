import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  LayoutDashboard,
  Terminal,
  FolderOpen,
  Newspaper,
  Users,
  Settings,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'Дашбоард',
    icon: LayoutDashboard,
    description: 'Обзор системы'
  },
  {
    id: 'terminal',
    label: 'Терминал',
    icon: Terminal,
    description: 'Командная строка'
  },
  {
    id: 'files',
    label: 'Файлы',
    icon: FolderOpen,
    description: 'Файловый менеджер'
  },
  {
    id: 'news',
    label: 'Новости',
    icon: Newspaper,
    description: 'Управление новостями'
  },
  {
    id: 'users',
    label: 'Пользователи',
    icon: Users,
    description: 'Управление пользователями'
  },
  {
    id: 'settings',
    label: 'Настройки',
    icon: Settings,
    description: 'Настройки сервера'
  },
  {
    id: 'logs',
    label: 'Логи',
    icon: FileText,
    description: 'Просмотр логов'
  }
];

export function Sidebar({ activeTab, onTabChange, collapsed, onToggleCollapse, isDarkMode, toggleTheme }: SidebarProps) {
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl border-r border-white/10 dark:border-white/5 shadow-2xl flex flex-col relative"
      style={{
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
      }}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent pointer-events-none" />
      {/* Заголовок */}
      <motion.div 
        className="relative p-6 border-b border-white/10 dark:border-white/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-xl font-medium text-gray-900 dark:text-white">
                ZeFair Network
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Deploy Center v0.1.0b</p>
            </motion.div>
          )}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-8 h-8 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-white/20 rounded-full flex-shrink-0"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

          </div>
        </div>
      </motion.div>

      {/* Навигационное меню */}
      <div className="flex-1 p-6 space-y-3 relative overflow-hidden">
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <motion.button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full text-left transition-all duration-300 group relative overflow-hidden rounded-2xl ${
                    collapsed ? 'p-3' : 'p-4'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Активный фон */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-indigo-600/80 rounded-2xl shadow-xl"
                      style={{
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      }}
                      transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Hover фон */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/20 dark:bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  
                  <div className="relative flex items-center space-x-4 z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 text-white shadow-lg' 
                        : 'bg-white/30 dark:bg-white/20 text-gray-700 dark:text-gray-300 group-hover:bg-white/40 dark:group-hover:bg-white/30'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1"
                      >
                        <div className={`font-medium transition-colors ${
                          isActive ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}>
                          {item.label}
                        </div>
                        <div className={`text-sm transition-colors ${
                          isActive ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {item.description}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Статус система и выход */}
      <motion.div 
        className="relative p-6 border-t border-white/10 dark:border-white/5 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
            collapsed ? 'p-3' : 'p-4'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-red-500/10 dark:bg-red-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100/80 dark:bg-red-900/30 flex items-center justify-center">
              <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            {!collapsed && (
              <span className="text-red-600 dark:text-red-400 font-medium">Выйти</span>
            )}
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}