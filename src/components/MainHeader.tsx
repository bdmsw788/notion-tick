import React, { useState } from 'react';
import { ActiveView, TaskList } from '../types';
import {
  List,
  Kanban,
  Calendar,
  Grid,
  Clock,
  Sparkles,
  Search,
  Filter,
  ArrowUpDown,
  Menu,
  CheckCircle2,
  FolderKanban,
} from 'lucide-react';

interface MainHeaderProps {
  currentList: TaskList | undefined;
  activeView: ActiveView;
  activeTaskCount: number;
  totalTaskCount: number;
  searchQuery: string;
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  onViewChange: (view: ActiveView) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: 'dueDate' | 'priority' | 'createdAt' | 'title') => void;
  onToggleSidebar: () => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  currentList,
  activeView,
  activeTaskCount,
  totalTaskCount,
  searchQuery,
  sortBy,
  onViewChange,
  onSearchChange,
  onSortChange,
  onToggleSidebar,
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);

  const views: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    { id: 'timeline', label: 'タイムライン', icon: <Clock size={15} /> },
    { id: 'projects', label: 'プロジェクト', icon: <FolderKanban size={15} /> },
    { id: 'list', label: 'リスト', icon: <List size={15} /> },
    { id: 'kanban', label: 'カンバン', icon: <Kanban size={15} /> },
    { id: 'calendar', label: 'カレンダー', icon: <Calendar size={15} /> },
    { id: 'pomodoro', label: 'ポモドーロ', icon: <Clock size={15} /> },
  ];

  return (
    <div className="flex flex-col gap-3 pb-3 border-b border-neutral-200/80">
      {/* Top Row: Title, Task Count, Search, Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeView === 'projects' ? '📁' : currentList?.icon || '📋'}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-neutral-900 tracking-tight">
                  {activeView === 'projects' ? 'プロジェクト (PARA)' : currentList?.name || 'タスク一覧'}
                </h1>
                <span className="bg-neutral-100 text-neutral-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                  {activeTaskCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Search & Sort */}
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="タスクを検索..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-xs rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none w-36 sm:w-48 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2 text-neutral-400 hover:text-neutral-600 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="p-2 rounded-xl bg-neutral-100/80 hover:bg-neutral-100 text-neutral-600 border border-transparent transition-colors"
              title="並び替え"
            >
              <ArrowUpDown size={15} />
            </button>

            {showSortMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-30 text-xs">
                <div className="px-3 py-1 text-[10px] text-neutral-400 uppercase font-semibold">並び替え</div>
                {[
                  { id: 'dueDate', label: '期日順' },
                  { id: 'priority', label: '優先度順' },
                  { id: 'createdAt', label: '作成日順' },
                  { id: 'title', label: 'タイトル順' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onSortChange(s.id as 'dueDate' | 'priority' | 'createdAt' | 'title');
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-neutral-50 transition-colors ${
                      sortBy === s.id ? 'font-bold text-blue-600' : 'text-neutral-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: View switcher tab bar (Visible on desktop, handled by bottom nav on mobile) */}
      <div className="hidden md:flex items-center gap-1 bg-neutral-100/70 p-1 rounded-xl w-fit overflow-x-auto">
        {views.map((v) => {
          const isActive = activeView === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onViewChange(v.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-blue-600 shadow-2xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
              }`}
            >
              {v.icon}
              <span>{v.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
