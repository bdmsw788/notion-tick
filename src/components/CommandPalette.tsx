import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskList, ActiveView, ThemeName } from '../types';
import {
  Search,
  Plus,
  Calendar,
  Grid,
  Clock,
  Sparkles,
  CheckCircle2,
  Database,
  Palette,
  ArrowRight,
  Command,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  tasks: Task[];
  lists: TaskList[];
  onClose: () => void;
  onSelectTask: (taskId: string) => void;
  onSelectView: (view: ActiveView) => void;
  onSelectList: (listId: string) => void;
  onOpenNotionSettings: () => void;
  onChangeTheme: (theme: ThemeName) => void;
  onQuickAdd: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  tasks,
  lists,
  onClose,
  onSelectTask,
  onSelectView,
  onSelectList,
  onOpenNotionSettings,
  onChangeTheme,
  onQuickAdd,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Static action options
  const defaultActions = [
    {
      id: 'act-add',
      title: '新しいタスクを作成',
      category: 'アクション',
      icon: <Plus size={16} className="text-blue-500" />,
      run: () => {
        onQuickAdd();
        onClose();
      },
    },
    {
      id: 'act-today',
      title: '今日のタスク (Today)',
      category: 'ビュー',
      icon: <Calendar size={16} className="text-amber-500" />,
      run: () => {
        onSelectList('today');
        onSelectView('list');
        onClose();
      },
    },
    {
      id: 'act-cal',
      title: 'カレンダービューを開く',
      category: 'ビュー',
      icon: <Calendar size={16} className="text-indigo-500" />,
      run: () => {
        onSelectView('calendar');
        onClose();
      },
    },
    {
      id: 'act-matrix',
      title: '4象限アイゼンハワーマトリクス',
      category: 'ビュー',
      icon: <Grid size={16} className="text-rose-500" />,
      run: () => {
        onSelectView('matrix');
        onClose();
      },
    },
    {
      id: 'act-pomo',
      title: 'ポモドーロ集中タイマー',
      category: 'フォーカス',
      icon: <Clock size={16} className="text-red-500" />,
      run: () => {
        onSelectView('pomodoro');
        onClose();
      },
    },
    {
      id: 'act-habits',
      title: '習慣トラッカー',
      category: '習慣',
      icon: <Sparkles size={16} className="text-emerald-500" />,
      run: () => {
        onSelectView('habits');
        onClose();
      },
    },
    {
      id: 'act-notion',
      title: 'Notion 連携設定 & データベース同期',
      category: '設定',
      icon: <Database size={16} className="text-purple-500" />,
      run: () => {
        onOpenNotionSettings();
        onClose();
      },
    },
  ];

  // Filter tasks matching query
  const matchingTasks = query.trim()
    ? tasks
        .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
        .map((t) => ({
          id: `task-${t.id}`,
          title: t.title,
          category: 'タスク',
          icon: <CheckCircle2 size={16} className={t.completed ? 'text-emerald-500' : 'text-neutral-400'} />,
          run: () => {
            onSelectTask(t.id);
            onClose();
          },
        }))
    : [];

  const filteredActions = defaultActions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const combinedItems = [...matchingTasks, ...filteredActions];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (combinedItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (combinedItems.length || 1)) % (combinedItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = combinedItems[selectedIndex];
      if (item) item.run();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-24 px-4 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden animate-scaleIn"
      >
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3 border-b border-neutral-100 gap-3">
          <Search size={18} className="text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="タスク、ビュー、アクションを検索..."
            className="flex-1 text-sm bg-transparent text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] text-neutral-400 font-mono">ESC</kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {combinedItems.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={item.run}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                selectedIndex === idx ? 'bg-blue-50 text-blue-900' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <span className="p-1 rounded-lg bg-white border border-neutral-100 shadow-2xs">
                  {item.icon}
                </span>
                <span className="text-xs font-semibold truncate">{item.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-400 font-medium">{item.category}</span>
                {selectedIndex === idx && <ArrowRight size={14} className="text-blue-500" />}
              </div>
            </button>
          ))}

          {combinedItems.length === 0 && (
            <div className="py-8 text-center text-xs text-neutral-400">
              一致する項目が見つかりません
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span>↑↓ 移動</span>
            <span>↵ 実行</span>
          </div>
          <span>Notion × TickTick Command</span>
        </div>
      </div>
    </div>
  );
};
