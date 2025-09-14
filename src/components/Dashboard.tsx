import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, Cpu, HardDrive, MemoryStick, Network, Users, Database, Zap } from 'lucide-react';

const serverStats = {
  cpu: 65,
  memory: 78,
  disk: 45,
  network: 23,
  uptime: "15d 4h 32m",
  activeUsers: 1247,
  requests: 89432,
  errors: 12
};

const chartData = [
  { name: 'Пн', cpu: 45, memory: 60, requests: 1200 },
  { name: 'Вт', cpu: 52, memory: 65, requests: 1350 },
  { name: 'Ср', cpu: 48, memory: 70, requests: 1100 },
  { name: 'Чт', cpu: 61, memory: 75, requests: 1450 },
  { name: 'Пт', cpu: 65, memory: 78, requests: 1600 },
  { name: 'Сб', cpu: 35, memory: 45, requests: 900 },
  { name: 'Вс', cpu: 28, memory: 40, requests: 750 },
];

const pieData = [
  { name: 'API', value: 45, color: '#8B5CF6' },
  { name: 'Web', value: 35, color: '#06B6D4' },
  { name: 'Mobile', value: 20, color: '#10B981' },
];

export function Dashboard() {
  return (
    <div className="p-6 h-full overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Заголовок */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/50 dark:bg-white/10 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl mb-6 relative overflow-hidden"
          style={{
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          }}
        >
          {/* Glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 pointer-events-none" />
          <div className="relative">
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white">
              Панель управления сервером
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mt-2">Обзор состояния и производительности системы</p>
          </div>
        </motion.div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-6 scrollbar-glass">

          {/* Основные метрики */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'CPU', value: `${serverStats.cpu}%`, icon: Cpu, color: 'from-blue-500 to-cyan-500', progress: serverStats.cpu },
              { title: 'Память', value: `${serverStats.memory}%`, icon: MemoryStick, color: 'from-purple-500 to-pink-500', progress: serverStats.memory },
              { title: 'Диск', value: `${serverStats.disk}%`, icon: HardDrive, color: 'from-green-500 to-emerald-500', progress: serverStats.disk },
              { title: 'Сеть', value: `${serverStats.network} Мб/с`, icon: Network, color: 'from-orange-500 to-red-500', progress: serverStats.network },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="bg-white/50 dark:bg-white/10 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group"
                style={{
                  backdropFilter: 'blur(40px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                }}
              >
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-xl`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="bg-white/30 dark:bg-white/20 text-gray-700 dark:text-gray-300 border-white/30 dark:border-white/20 backdrop-blur-sm">
                      {stat.title}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-2xl font-medium text-gray-900 dark:text-white">{stat.value}</p>
                    <Progress value={stat.progress} className="mt-3 h-2 bg-white/30 dark:bg-white/20" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Время работы', value: serverStats.uptime, icon: Activity, color: 'text-green-500' },
              { title: 'Активные пользователи', value: serverStats.activeUsers.toLocaleString(), icon: Users, color: 'text-blue-500' },
              { title: 'Запросы', value: serverStats.requests.toLocaleString(), icon: Database, color: 'text-purple-500' },
              { title: 'Ошибки', value: serverStats.errors, icon: Zap, color: 'text-red-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white/40 dark:bg-white/10 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden"
                style={{
                  backdropFilter: 'blur(30px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                }}
              >
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 pointer-events-none" />
                <div className="relative flex items-center space-x-4">
                  <div className="p-3 rounded-2xl bg-white/30 dark:bg-white/20 backdrop-blur-sm">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-2xl font-medium text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* График загрузки CPU и памяти */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/50 dark:bg-white/10 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
              style={{
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              }}
            >
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 pointer-events-none" />
              <div className="relative">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Загрузка системы</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.7 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.7 }} />
                    <Line type="monotone" dataKey="cpu" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }} />
                    <Line type="monotone" dataKey="memory" stroke="#06B6D4" strokeWidth={3} dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* График распределения трафика */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-white/50 dark:bg-white/10 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
              style={{
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              }}
            >
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 pointer-events-none" />
              <div className="relative">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Распределение трафика</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-6 mt-4">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{entry.name}: {entry.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* График запросов */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white/50 dark:bg-white/10 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            style={{
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            }}
          >
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 pointer-events-none" />
            <div className="relative">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Запросы по дням</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.7 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.7 }} />
                  <Bar dataKey="requests" fill="url(#gradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}