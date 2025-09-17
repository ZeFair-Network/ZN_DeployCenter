import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Terminal } from './components/Terminal';
import { FileManager } from './components/FileManager';
import { NewsManager } from './components/NewsManager';
import { UserManager } from './components/UserManager';
import { ServerSettings } from './components/ServerSettings';
import { LogsViewer } from './components/LogsViewer';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'terminal':
        return <Terminal />;
      case 'files':
        return <FileManager />;
      case 'news':
        return <NewsManager />;
      case 'users':
        return <UserManager />;
      case 'settings':
        return <ServerSettings />;
      case 'logs':
        return <LogsViewer />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      {/* Анимированный фон в стиле Apple */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              'radial-gradient(ellipse 800px 600px at 20% 30%, rgba(59, 130, 246, 0.12), transparent 50%)',
              'radial-gradient(ellipse 800px 600px at 80% 70%, rgba(168, 85, 247, 0.10), transparent 50%)',
              'radial-gradient(ellipse 800px 600px at 50% 20%, rgba(34, 197, 94, 0.08), transparent 50%)',
              'radial-gradient(ellipse 800px 600px at 20% 80%, rgba(239, 68, 68, 0.08), transparent 50%)',
              'radial-gradient(ellipse 800px 600px at 80% 30%, rgba(59, 130, 246, 0.12), transparent 50%)',
            ]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
        <motion.div
          animate={{
            background: [
              'radial-gradient(ellipse 600px 400px at 70% 80%, rgba(168, 85, 247, 0.06), transparent 60%)',
              'radial-gradient(ellipse 600px 400px at 30% 20%, rgba(34, 197, 94, 0.05), transparent 60%)',
              'radial-gradient(ellipse 600px 400px at 80% 30%, rgba(239, 68, 68, 0.05), transparent 60%)',
              'radial-gradient(ellipse 600px 400px at 20% 70%, rgba(59, 130, 246, 0.06), transparent 60%)',
              'radial-gradient(ellipse 600px 400px at 70% 80%, rgba(168, 85, 247, 0.06), transparent 60%)',
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 5 }}
          className="absolute inset-0"
        />
      </div>

      {/* Основная компоновка - Grid Layout */}
      <div className="relative z-10 h-full grid grid-cols-[auto_1fr]">
        {/* Боковая панель */}
        <motion.div
          animate={{ width: sidebarCollapsed ? 80 : 280 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="h-full flex-shrink-0"
          style={{ overflow: 'hidden' }}
        >
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
        </motion.div>

        {/* Основное содержимое */}
        <div className="h-full overflow-hidden min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ 
                duration: 0.2, 
                ease: "easeInOut"
              }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Liquid glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/[0.03] via-transparent to-white/[0.08] dark:from-black/[0.1] dark:via-transparent dark:to-black/[0.05] pointer-events-none" />
    </div>
  );
}