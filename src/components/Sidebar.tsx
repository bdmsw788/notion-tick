import React, { useState } from 'react';
import { TaskList, SmartListType, ActiveView, Task, ThemeName } from '../types';
import { getTodayString, getOffsetDateString } from '../lib/storage';
import {
  Inbox,
  Calendar,
  Sun,
  CalendarDays,
  Grid,
  Clock,
  Sparkles,
  CheckCircle2,
  Trash2,
  FolderPlus,
  Tag,
  Settings,
  ChevronRight,
  ChevronDown,
  Plus,
  Command,
  Database,
  Palette,
  Check,
} from 'lucide-react';

interface SidebarProps {
  currentListId: string;
  lists: TaskList[];
  tasks: Task[];
  activeView: ActiveView;
  currentTheme: ThemeName;
  notionConnected: boolean;
  onSelectList: (listId: string) => void;
  onSelectView: (view: ActiveView) => void;
  onAddList: (name: string, color: string, icon: string) => void;
  onDeleteList: (listId: string) => void;
  onOpenCommandPalette: () => void;
  onOpenNotionSettings: () => void;
  onChangeTheme: (theme: ThemeName) => void;
  onFilterTag: (tag: string) => void;
  selectedTag: string | null;
}

const SMART_LISTS: { id: SmartListType; name: string; icon: React.ReactNode; color: string }[] = [
  { id: 'inbox', name: '受信箱', icon: <Inbox size={16} />, color: 'text-blue-500' },
  { id: 'today', name: '今日', icon: <Sun size={16} />, color: 'text-amber-500' },
  { id: 'tomorrow', name: '明日', icon: <Calendar size={16} />, color: 'text-orange-500' },
  { id: 'next7days', name: '今後7日間', icon: <CalendarDays size={16} />, color: 'text-purple-500' },
  { id: 'calendar', name: 'カレンダー', icon: <Calendar size={16} />, color: 'text-indigo-500' },
  { id: 'matrix', name: 'マトリクス', icon: <Grid size={16} />, color: 'text-rose-500' },
  { id: 'pomodoro', name: 'ポモドーロ', icon: <Clock size={16} />, color: 'text-red-500' },
  { id: 'habits', name: '習慣トラッカー', icon: <Sparkles size={16} />, color: 'text-emerald-500' },
  { id: 'completed', name: '完了済み', icon: <CheckCircle2 size={16} />, color: 'text-emerald-600' },
  { id: 'trash', name: 'ゴミ箱', icon: <Trash2 size={16} />, color: 'text-neutral-400' },
];

const THEMES: { id: ThemeName; label: string; color: string }[] = [
  { id: 'ticktick_blue', label: 'TickTick Blue', color: '#3B82F6' },
  { id: 'notion_light', label: 'Notion Minimal', color: '#FFFFFF' },
  { id: 'notion_dark', label: 'Notion Dark', color: '#1F1F1F' },
  { id: 'forest_green', label: 'Forest Green', color: '#10B981' },
  { id: 'sunset_amber', label: 'Sunset Amber', color: '#F59E0B' },
  { id: 'nordic_slate', label: 'Nordic Slate', color: '#64748B' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentListId,
  lists,
  tasks,
  activeView,
  currentTheme,
  notionConnected,
  onSelectList,
  onSelectView,
  onAddList,
  onDeleteList,
  onOpenCommandPalette,
  onOpenNotionSettings,
  onChangeTheme,
  onFilterTag,
  selectedTag,
}) => {
  const [showAddListForm, setShowAddListForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListColor, setNewListColor] = useState('#10B981');
  const [newListIcon, setNewListIcon] = useState('📁');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const today = getTodayString();
  const tomorrow = getOffsetDateString(1);
  const next7DaysEnd = getOffsetDateString(7);

  // Compute smart list badge counts
  const getSmartCount = (id: SmartListType) => {
    switch (id) {
      case 'inbox':
        return tasks.filter((t) => !t.completed && t.listId === 'inbox').length;
      case 'today':
        return tasks.filter((t) => !t.completed && t.dueDate === today).length;
      case 'tomorrow':
        return tasks.filter((t) => !t.completed && t.dueDate === tomorrow).length;
      case 'next7days':
        return tasks.filter((t) => !t.completed && t.dueDate && t.dueDate >= today && t.dueDate <= next7DaysEnd).length;
      case 'completed':
        return tasks.filter((t) => t.completed).length;
      default:
        return 0;
    }
  };

  // Get unique tags
  const allTags = Array.from(new Set(tasks.flatMap((t) => t.tags)));

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    onAddList(newListName.trim(), newListColor, newListIcon);
    setNewListName('');
    setShowAddListForm(false);
  };

  return (
    <aside className="w-64 h-full bg-[#FAFAFA] border-r border-neutral-200/90 flex flex-col justify-between select-none text-neutral-700">
      {/* Top Header & User Profile */}
      <div className="p-3.5 space-y-3">
        {/* Workspace Brand */}
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              N
            </div>
            <div>
              <span className="text-sm font-bold text-neutral-900 tracking-tight flex items-center gap-1">
                Notion<span className="text-blue-600">Tick</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenNotionSettings}
            className={`p-1.5 rounded-lg border transition-all ${
              notionConnected
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-neutral-100 text-neutral-500 hover:text-neutral-900 border-transparent'
            }`}
            title="Notion連携設定"
          >
            <Database size={15} />
          </button>
        </div>

        {/* Quick Search / Command Palette Button */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-white border border-neutral-200/80 hover:border-neutral-300 text-neutral-400 text-xs shadow-2xs transition-all group"
        >
          <span className="flex items-center gap-2 text-neutral-500 group-hover:text-neutral-700">
            <Command size={13} />
            <span>クイック検索 / アクション</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] text-neutral-500 font-mono">⌘K</kbd>
        </button>
      </div>

      {/* Main Navigation Items (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-2.5 space-y-4 text-xs font-medium">
        {/* Smart Views */}
        <div className="space-y-0.5">
          {SMART_LISTS.map((item) => {
            const isSelected =
              (item.id === 'calendar' && activeView === 'calendar') ||
              (item.id === 'matrix' && activeView === 'matrix') ||
              (item.id === 'pomodoro' && activeView === 'pomodoro') ||
              (item.id === 'habits' && activeView === 'habits') ||
              currentListId === item.id;

            const count = getSmartCount(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'calendar') onSelectView('calendar');
                  else if (item.id === 'matrix') onSelectView('matrix');
                  else if (item.id === 'pomodoro') onSelectView('pomodoro');
                  else if (item.id === 'habits') onSelectView('habits');
                  else {
                    onSelectList(item.id);
                    onSelectView('list');
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 text-blue-700 font-bold shadow-2xs'
                    : 'hover:bg-neutral-200/60 text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={item.color}>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {count > 0 && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isSelected ? 'bg-blue-200 text-blue-800' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Lists / Projects */}
        <div className="pt-2 border-t border-neutral-200/60">
          <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            <span>プロジェクト / リスト</span>
            <button
              type="button"
              onClick={() => setShowAddListForm(!showAddListForm)}
              className="hover:text-neutral-800 p-0.5 rounded hover:bg-neutral-200/60"
              title="新しいリストを作成"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add List Input form */}
          {showAddListForm && (
            <form onSubmit={handleCreateList} className="p-2 bg-white rounded-xl border border-neutral-200 shadow-xs mb-2 space-y-2">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="リスト名..."
                autoFocus
                className="w-full text-xs px-2 py-1 border border-neutral-200 rounded focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {['📁', '💼', '🚀', '🎨', '🛒', '💡'].map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewListIcon(ic)}
                      className={`p-1 text-xs rounded ${newListIcon === ic ? 'bg-blue-100' : ''}`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={!newListName.trim()}
                  className="px-2.5 py-0.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  追加
                </button>
              </div>
            </form>
          )}

          {/* List items */}
          <div className="space-y-0.5 mt-1">
            {lists
              .filter((l) => l.id !== 'inbox')
              .map((l) => {
                const isSelected = currentListId === l.id && activeView !== 'calendar' && activeView !== 'matrix' && activeView !== 'pomodoro' && activeView !== 'habits';
                const count = tasks.filter((t) => !t.completed && t.listId === l.id).length;

                return (
                  <div
                    key={l.id}
                    onClick={() => {
                      onSelectList(l.id);
                      onSelectView('list');
                    }}
                    className={`group flex items-center justify-between px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 text-blue-700 font-bold shadow-2xs'
                        : 'hover:bg-neutral-200/60 text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span>{l.icon}</span>
                      <span className="truncate">{l.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {count > 0 && (
                        <span className="text-[11px] text-neutral-400 group-hover:opacity-0 transition-opacity">
                          {count}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteList(l.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 p-0.5 rounded transition-opacity"
                        title="リスト削除"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Tags Section */}
        {allTags.length > 0 && (
          <div className="pt-2 border-t border-neutral-200/60">
            <div className="px-2 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              タグ
            </div>
            <div className="flex flex-wrap gap-1.5 px-2 mt-1">
              {allTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onFilterTag(selectedTag === t ? '' : t)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] transition-all ${
                    selectedTag === t
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-neutral-200/70 hover:bg-neutral-200 text-neutral-600'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Controls */}
      <div className="p-3 border-t border-neutral-200/90 bg-neutral-100/60 space-y-1 text-xs">
        {/* Theme Changer */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-neutral-200/60 text-neutral-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Palette size={14} />
              <span>テーマ設定</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full border border-neutral-300"
                style={{ backgroundColor: THEMES.find((th) => th.id === currentTheme)?.color }}
              />
              <ChevronRight size={12} />
            </div>
          </button>

          {showThemeMenu && (
            <div className="absolute bottom-full left-0 mb-1 w-full bg-white border border-neutral-200 rounded-xl shadow-xl p-1.5 z-40 space-y-0.5">
              <div className="px-2 py-1 text-[10px] text-neutral-400 font-bold uppercase">カラーテーマ</div>
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    onChangeTheme(th.id);
                    setShowThemeMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    currentTheme === th.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-neutral-200" style={{ backgroundColor: th.color }} />
                    <span>{th.label}</span>
                  </div>
                  {currentTheme === th.id && <Check size={12} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notion Settings trigger */}
        <button
          type="button"
          onClick={onOpenNotionSettings}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-neutral-200/60 text-neutral-600 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings size={14} />
            <span>Notion 連携 & バックアップ</span>
          </div>
          {notionConnected ? (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
          )}
        </button>
      </div>
    </aside>
  );
};
