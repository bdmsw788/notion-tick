import React from 'react';
import { ActiveView } from '../types';
import {
  Clock,
  CheckSquare,
  Timer,
  Plus,
  Settings,
  Kanban,
  FolderKanban,
} from 'lucide-react';

interface BottomNavProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  onToggleSidebar?: () => void;
  onQuickAdd: () => void;
  onOpenNotionSettings: () => void;
  activeTaskCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  onSelectView,
  onToggleSidebar,
  onQuickAdd,
  onOpenNotionSettings,
  activeTaskCount,
}) => {
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t border-neutral-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] select-none transition-all duration-300"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
      }}
    >
      <div className="flex items-center justify-around px-3 pt-2 max-w-lg mx-auto">
        {/* 1. タイムライン (Time Management) */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onSelectView('timeline');
          }}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-95 ${
            activeView === 'timeline'
              ? 'text-blue-600 font-bold'
              : 'text-neutral-500 hover:text-neutral-800 font-medium'
          }`}
        >
          <Clock size={22} className={activeView === 'timeline' ? 'stroke-[2.5]' : 'stroke-[1.9]'} />
          <span className="text-[10px] mt-1">タイムライン</span>
          {activeView === 'timeline' && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-600" />
          )}
        </button>

        {/* 2. タスク一覧 (Tasks / List) */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onSelectView('list');
          }}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-95 ${
            activeView === 'list'
              ? 'text-blue-600 font-bold'
              : 'text-neutral-500 hover:text-neutral-800 font-medium'
          }`}
        >
          <div className="relative">
            <CheckSquare size={22} className={activeView === 'list' ? 'stroke-[2.5]' : 'stroke-[1.9]'} />
            {activeTaskCount > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-blue-500 text-white text-[9px] font-bold px-1 min-w-[15px] h-[15px] rounded-full flex items-center justify-center ring-2 ring-white">
                {activeTaskCount > 99 ? '99+' : activeTaskCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">タスク</span>
          {activeView === 'list' && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-600" />
          )}
        </button>

        {/* 3. Center Quick Add Button (Floating Style) */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onQuickAdd();
          }}
          className="relative -top-2.5 w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/35 flex items-center justify-center active:scale-90 transition-transform ring-4 ring-white"
          title="新規タスク追加"
        >
          <Plus size={26} strokeWidth={2.6} />
        </button>

        {/* 4. プロジェクト (Projects / PARA) */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onSelectView('projects');
          }}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-95 ${
            activeView === 'projects'
              ? 'text-blue-600 font-bold'
              : 'text-neutral-500 hover:text-neutral-800 font-medium'
          }`}
        >
          <FolderKanban size={22} className={activeView === 'projects' ? 'stroke-[2.5]' : 'stroke-[1.9]'} />
          <span className="text-[10px] mt-1">プロジェクト</span>
          {activeView === 'projects' && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-600" />
          )}
        </button>

        {/* 5. Notion 連携 & 設定 */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            onOpenNotionSettings();
          }}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-xl text-neutral-500 hover:text-neutral-800 font-medium transition-all active:scale-95"
        >
          <Settings size={22} className="stroke-[1.9]" />
          <span className="text-[10px] mt-1">設定</span>
        </button>
      </div>
    </nav>
  );
};
