import { motion } from 'motion/react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { 
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Shield,
  Crown,
  User,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  Activity,
  Settings,
  MoreHorizontal
} from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'moderator' | 'user' | 'banned';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastActivity: string;
  avatar?: string;
  posts: number;
  reputation: number;
  permissions: string[];
}

const mockUsers: UserData[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    fullName: 'Главный администратор',
    role: 'admin',
    status: 'active',
    joinDate: '2023-01-15',
    lastActivity: '2 минуты назад',
    posts: 156,
    reputation: 9850,
    permissions: ['all']
  },
  {
    id: '2',
    username: 'moderator1',
    email: 'mod1@example.com',
    fullName: 'Модератор Иван',
    role: 'moderator',
    status: 'active',
    joinDate: '2023-03-22',
    lastActivity: '1 час назад',
    posts: 89,
    reputation: 4520,
    permissions: ['moderate', 'edit', 'delete']
  },
  {
    id: '3',
    username: 'user123',
    email: 'user123@example.com',
    fullName: 'Пользователь Петров',
    role: 'user',
    status: 'active',
    joinDate: '2023-08-10',
    lastActivity: '5 минут назад',
    posts: 23,
    reputation: 340,
    permissions: ['read', 'write']
  },
  {
    id: '4',
    username: 'inactive_user',
    email: 'inactive@example.com',
    fullName: 'Неактивный пользователь',
    role: 'user',
    status: 'inactive',
    joinDate: '2023-05-15',
    lastActivity: '2 месяца назад',
    posts: 5,
    reputation: 50,
    permissions: ['read']
  },
  {
    id: '5',
    username: 'banned_user',
    email: 'banned@example.com',
    fullName: 'Заблокированный пользователь',
    role: 'banned',
    status: 'suspended',
    joinDate: '2023-07-01',
    lastActivity: '1 месяц назад',
    posts: 67,
    reputation: -150,
    permissions: []
  }
];

const roleConfig = {
  admin: { 
    label: 'Администратор', 
    icon: Crown, 
    color: 'bg-purple-500 text-white',
    description: 'Полный доступ ко всем функциям'
  },
  moderator: { 
    label: 'Модератор', 
    icon: Shield, 
    color: 'bg-blue-500 text-white',
    description: 'Модерация контента и пользователей'
  },
  user: { 
    label: 'Пользователь', 
    icon: User, 
    color: 'bg-green-500 text-white',
    description: 'Базовые права пользователя'
  },
  banned: { 
    label: 'Заблокирован', 
    icon: Ban, 
    color: 'bg-red-500 text-white',
    description: 'Доступ ограничен'
  }
};

const statusConfig = {
  active: { label: 'Активен', icon: CheckCircle, color: 'text-green-400' },
  inactive: { label: 'Неактивен', icon: XCircle, color: 'text-gray-400' },
  suspended: { label: 'Заблокирован', icon: Ban, color: 'text-red-400' }
};

export function UserManager() {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<UserData>>({});

  const [newUser, setNewUser] = useState<Partial<UserData>>({
    username: '',
    email: '',
    fullName: '',
    role: 'user',
    status: 'active',
    permissions: ['read', 'write']
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = () => {
    if (newUser.username && newUser.email) {
      const user: UserData = {
        id: Date.now().toString(),
        username: newUser.username!,
        email: newUser.email!,
        fullName: newUser.fullName || newUser.username!,
        role: newUser.role as any,
        status: newUser.status as any,
        joinDate: new Date().toISOString().split('T')[0],
        lastActivity: 'только что',
        posts: 0,
        reputation: 0,
        permissions: newUser.permissions || ['read']
      };
      
      setUsers([user, ...users]);
      setNewUser({
        username: '',
        email: '',
        fullName: '',
        role: 'user',
        status: 'active',
        permissions: ['read', 'write']
      });
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    if (editingUser.id) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...editingUser } as UserData
          : u
      ));
      setIsEditMode(false);
      setEditingUser({});
      if (selectedUser?.id === editingUser.id) {
        setSelectedUser({ ...selectedUser, ...editingUser } as UserData);
      }
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    if (selectedUser?.id === id) {
      setSelectedUser(null);
    }
  };

  const getUserStats = () => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const banned = users.filter(u => u.role === 'banned').length;
    
    return { total, active, admins, banned };
  };

  const stats = getUserStats();

  return (
    <div className="p-6 h-full overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Статистика пользователей */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          {[
            { title: 'Всего пользователей', value: stats.total, icon: Users, color: 'from-blue-500 to-cyan-500' },
            { title: 'Активных', value: stats.active, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
            { title: 'Администраторов', value: stats.admins, icon: Crown, color: 'from-purple-500 to-pink-500' },
            { title: 'Заблокированных', value: stats.banned, icon: Ban, color: 'from-red-500 to-orange-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="bg-white/50 dark:bg-white/10 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-4 shadow-2xl relative overflow-hidden"
              style={{
                backdropFilter: 'blur(40px) saturate(200%)',
                WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              }}
            >
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/10 pointer-events-none" />
              <div className="relative flex items-center justify-between">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-xl`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-medium text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{stat.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Список пользователей */}
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
                <h2 className="text-2xl font-medium text-gray-900 dark:text-white">Управление пользователями</h2>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <motion.button
                      className="px-6 py-3 bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-600/90 hover:to-emerald-600/90 text-white rounded-2xl shadow-lg backdrop-blur-xl border border-white/20 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-4 h-4 mr-2 inline" />
                      Добавить пользователя
                    </motion.button>
                  </DialogTrigger>
                  <DialogContent className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-white/30 dark:border-white/20">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-white">Создать нового пользователя</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Имя пользователя"
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                      />
                      <Input
                        placeholder="Полное имя"
                        value={newUser.fullName}
                        onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                        className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value as any})}>
                          <SelectTrigger className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white">
                            <SelectValue placeholder="Роль" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(roleConfig).map(([key, config]) => (
                              <SelectItem key={key} value={key}>
                                {config.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={newUser.status} onValueChange={(value) => setNewUser({...newUser, status: value as any})}>
                          <SelectTrigger className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white">
                            <SelectValue placeholder="Статус" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusConfig).map(([key, config]) => (
                              <SelectItem key={key} value={key}>
                                {config.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleCreateUser} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Создать пользователя
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Поиск и фильтры */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    placeholder="Поиск пользователей..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>
                <div className="flex space-x-2">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px] bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все роли</SelectItem>
                      {Object.entries(roleConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Список пользователей */}
            <ScrollArea className="flex-1 p-6 scrollbar-glass">
              <div className="space-y-4">
                {filteredUsers.map((user) => {
                  const roleInfo = roleConfig[user.role];
                  const statusInfo = statusConfig[user.status];
                  const RoleIcon = roleInfo.icon;
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => setSelectedUser(user)}
                      className={`group p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden ${
                        selectedUser?.id === user.id
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
                      
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500">
                            <div className="w-full h-full flex items-center justify-center text-white font-medium">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-gray-900 dark:text-white font-medium">{user.username}</h3>
                              <Badge className={roleInfo.color}>
                                <RoleIcon className="w-3 h-3 mr-1" />
                                {roleInfo.label}
                              </Badge>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{user.email}</p>
                            <div className="flex items-center space-x-3 mt-1 text-xs text-gray-600 dark:text-gray-400">
                              <span className="flex items-center bg-white/20 dark:bg-white/10 px-2 py-1 rounded-lg">
                                <StatusIcon className={`w-3 h-3 mr-1 ${statusInfo.color}`} />
                                {statusInfo.label}
                              </span>
                              <span className="bg-white/20 dark:bg-white/10 px-2 py-1 rounded-lg">Постов: {user.posts}</span>
                              <span className="bg-white/20 dark:bg-white/10 px-2 py-1 rounded-lg">Репутация: {user.reputation}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUser(user);
                            }}
                            className="w-10 h-10 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/20 rounded-xl"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.role !== 'admin' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user.id);
                              }}
                              className="w-10 h-10 p-0 text-red-500 hover:text-red-600 hover:bg-red-100/50 dark:hover:bg-red-900/30 rounded-xl"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </motion.div>

          {/* Панель детальной информации */}
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
                {isEditMode ? 'Редактирование пользователя' : selectedUser ? 'Информация о пользователе' : 'Выберите пользователя'}
              </h3>
            </div>

            <ScrollArea className="flex-1 p-6 relative scrollbar-glass">
              {isEditMode ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Имя пользователя"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                    className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white backdrop-blur-sm"
                  />
                  <Input
                    placeholder="Email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white backdrop-blur-sm"
                  />
                  <Input
                    placeholder="Полное имя"
                    value={editingUser.fullName}
                    onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value})}
                    className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white backdrop-blur-sm"
                  />
                  <Select value={editingUser.role} onValueChange={(value) => setEditingUser({...editingUser, role: value as any})}>
                    <SelectTrigger className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white backdrop-blur-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={editingUser.status} onValueChange={(value) => setEditingUser({...editingUser, status: value as any})}>
                    <SelectTrigger className="bg-white/60 dark:bg-white/10 border-white/30 dark:border-white/20 text-gray-900 dark:text-white backdrop-blur-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex space-x-3">
                    <Button onClick={handleSaveEdit} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
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
              ) : selectedUser ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <Avatar className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500">
                      <div className="w-full h-full flex items-center justify-center text-white text-2xl font-medium">
                        {selectedUser.username.charAt(0).toUpperCase()}
                      </div>
                    </Avatar>
                    <h2 className="text-xl font-medium text-gray-900 dark:text-white">{selectedUser.fullName}</h2>
                    <p className="text-gray-700 dark:text-gray-300">@{selectedUser.username}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/20 rounded-2xl backdrop-blur-sm">
                      <span className="text-gray-700 dark:text-gray-300">Email:</span>
                      <span className="text-gray-900 dark:text-white">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/20 rounded-2xl backdrop-blur-sm">
                      <span className="text-gray-700 dark:text-gray-300">Роль:</span>
                      <Badge className={roleConfig[selectedUser.role].color}>
                        {roleConfig[selectedUser.role].label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/20 rounded-2xl backdrop-blur-sm">
                      <span className="text-gray-700 dark:text-gray-300">Статус:</span>
                      <span className={`flex items-center ${statusConfig[selectedUser.status].color}`}>
                        {(() => {
                          const StatusIcon = statusConfig[selectedUser.status].icon;
                          return <StatusIcon className="w-4 h-4 mr-1" />;
                        })()}
                        {statusConfig[selectedUser.status].label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/20 rounded-2xl backdrop-blur-sm">
                      <span className="text-gray-700 dark:text-gray-300">Дата регистрации:</span>
                      <span className="text-gray-900 dark:text-white">{selectedUser.joinDate}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/20 rounded-2xl backdrop-blur-sm">
                      <span className="text-gray-700 dark:text-gray-300">Последняя активность:</span>
                      <span className="text-gray-900 dark:text-white">{selectedUser.lastActivity}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/40 dark:bg-white/20 rounded-2xl backdrop-blur-sm">
                      <div className="text-xl font-medium text-gray-900 dark:text-white">{selectedUser.posts}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Посты</div>
                    </div>
                    <div className="text-center p-4 bg-white/40 dark:bg-white/20 rounded-2xl backdrop-blur-sm">
                      <div className="text-xl font-medium text-gray-900 dark:text-white">{selectedUser.reputation}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Репутация</div>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-3">Права доступа:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="border-white/30 dark:border-white/20 text-gray-700 dark:text-gray-300 bg-white/30 dark:bg-white/20 backdrop-blur-sm">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Выберите пользователя для просмотра</p>
                  <p className="text-sm mt-2">Управляйте пользователями и их правами</p>
                </div>
              )}
            </ScrollArea>
          </motion.div>
        </div>
      </div>
    </div>
  );
}