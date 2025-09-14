import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Terminal as TerminalIcon, Play, X, Minimize2, Maximize2 } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

const mockCommands = {
  'ls': 'index.html  style.css  script.js  package.json  node_modules/',
  'pwd': '/home/user/project',
  'whoami': 'admin',
  'date': new Date().toString(),
  'ps aux': `USER       PID  %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1   0.0  0.1  225316  9072 ?        Ss   Dec01   0:04 /sbin/init
root         2   0.0  0.0      0     0 ?        S    Dec01   0:00 [kthreadd]
root         3   0.0  0.0      0     0 ?        I<   Dec01   0:00 [rcu_gp]`,
  'df -h': `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G  8.5G   11G  45% /
tmpfs           2.0G     0  2.0G   0% /dev/shm
/dev/sda2       100G   45G   50G  48% /home`,
  'free -h': `               total        used        free      shared  buff/cache   available
Mem:           7.8Gi       2.1Gi       3.2Gi       156Mi       2.5Gi       5.4Gi
Swap:          2.0Gi          0B       2.0Gi`,
  'uptime': 'up 15 days,  4:32,  3 users,  load average: 0.52, 0.58, 0.61',
  'help': `Доступные команды:
ls, pwd, whoami, date, ps aux, df -h, free -h, uptime, top, netstat, clear, help
Используйте стрелки вверх/вниз для навигации по истории команд.`
};

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: 'Добро пожаловать в терминал панели управления v2.1.0',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'output',
      content: 'Введите "help" для получения списка доступных команд.',
      timestamp: new Date()
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (inputRef.current && !isMinimized) {
      inputRef.current.focus();
    }
  }, [isMinimized]);

  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    // Добавляем команду в историю
    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);

    // Добавляем команду в терминал
    const commandLine: TerminalLine = {
      id: Date.now().toString(),
      type: 'command',
      content: `$ ${trimmedCommand}`,
      timestamp: new Date()
    };

    setLines(prev => [...prev, commandLine]);

    // Обрабатываем команду
    setTimeout(() => {
      let output = '';
      let type: 'output' | 'error' = 'output';

      if (trimmedCommand === 'clear') {
        setLines([]);
        return;
      }

      if (trimmedCommand === 'top') {
        output = `Tasks: 245 total,   2 running, 243 sleeping,   0 stopped,   0 zombie
%Cpu(s):  5.2 us,  2.1 sy,  0.0 ni, 92.1 id,  0.6 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :   7982.4 total,   3247.8 free,   2134.2 used,   2600.4 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   5468.7 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 1234 www-data  20   0  125672  12456   8932 S   2.3   0.2   1:23.45 nginx
 5678 mysql     20   0 1623456 234567  45678 S   1.7   2.9  45:67.89 mysqld
 9012 node      20   0  789123  67890  12345 S   1.2   0.8  12:34.56 node`;
      } else if (trimmedCommand === 'netstat') {
        output = `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN`;
      } else if (mockCommands[trimmedCommand as keyof typeof mockCommands]) {
        output = mockCommands[trimmedCommand as keyof typeof mockCommands];
      } else {
        output = `Команда не найдена: ${trimmedCommand}`;
        type = 'error';
      }

      const outputLine: TerminalLine = {
        id: (Date.now() + 1).toString(),
        type,
        content: output,
        timestamp: new Date()
      };

      setLines(prev => [...prev, outputLine]);
    }, Math.random() * 200 + 100); // Имитация задержки выполнения команды

    setCurrentCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 h-full"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          height: isMinimized ? 60 : 'auto'
        }}
        transition={{ duration: 0.5 }}
        className="bg-black/90 backdrop-blur-[20px] border border-black/20 rounded-2xl shadow-lg overflow-hidden h-full max-h-[calc(100vh-8rem)] flex flex-col"
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        {/* Заголовок терминала */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
              <TerminalIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">Терминал сервера</h2>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                Активен
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Содержимое терминала */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ScrollArea className="h-full scrollbar-glass">
                <div ref={scrollRef} className="p-4 space-y-1 font-mono text-sm">
                  {lines.map((line) => (
                    <motion.div
                      key={line.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`${
                        line.type === 'command' 
                          ? 'text-cyan-400' 
                          : line.type === 'error'
                          ? 'text-red-400'
                          : 'text-green-300'
                      }`}
                    >
                      <pre className="whitespace-pre-wrap break-words">{line.content}</pre>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Поле ввода команды */}
            <div className="p-4 border-t border-white/10 bg-black/30">
              <div className="flex items-center space-x-3">
                <span className="text-cyan-400 font-mono text-sm">$</span>
                <Input
                  ref={inputRef}
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Введите команду..."
                  className="flex-1 bg-transparent border-none text-white font-mono text-sm focus:ring-0 placeholder:text-white/50"
                />
                <Button
                  size="sm"
                  onClick={() => executeCommand(currentCommand)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-white/50 text-xs font-mono">
                  История команд: {commandHistory.length} | Используйте ↑↓ для навигации
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLines([])}
                  className="text-white/50 hover:text-white text-xs"
                >
                  Очистить
                </Button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}