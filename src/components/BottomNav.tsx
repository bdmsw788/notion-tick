import React, { useState } from 'react';
import { ActiveView } from '../types';
import {
  CheckSquare,
  Kanban,
  Calendar,
  Layers,
  Timer,
  Sparkles,
  Menu,
  Plus,
  MoreHorizontal,
  X,
  Settings,
} from 'lucide-react';

interface BottomNavProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  onToggleSidebar: () => void;
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
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  const mainTabs = [
    { id: 'list' as ActiveView, label: 'タスク', icon: CheckSquare },
    { id: 'kanban' as ActiveView, label: 'カンバン', icon: Kanban },
    { id: 'calendar' as ActiveView, label: 'カレンダー', icon: Calendar },
    { id: 'pomodoro' as ActiveView, label: '集中', icon: Timer },
  ];

  const moreItems = [
    { id: 'matrix' as ActiveView, label: '4象限マトリクス', desc: '重要度×緊急度で優先順位を整理', icon: Layers, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'habits' as ActiveView, label: '習慣トラッカー', desc: '毎日の継続記録とストリーク', icon: Sparkles, color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <>
      {/* More Views Bottom Sheet (Mobile Overlay) */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fadeIn">
          <div
            onClick={() => setIsMoreMenuOpen(false)}
            className="flex-1"
          />
          <div className="bg-white rounded-t-3xl p-5 shadow-2xl border-t border-neutral-200 animate-scaleIn pb-10">
            <div className="w-10 h-1 rounded-full bg-neutral-300 mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-neutral-800">ビュー & 機能の切り替え</h3>
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-full hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic();
                      onSelectView(item.id);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-200 text-blue-900'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${item.color}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{item.label}</div>
                      <div className="text-xs text-neutral-400 truncate">{item.desc}</div>
                    </div>
                  </button>
                );
              })}

              {/* Notion Settings in Bottom Sheet */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setIsMoreMenuOpen(false);
                  onOpenNotionSettings();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-left transition-all"
              >
                <div className="p-2.5 rounded-xl text-neutral-700 bg-neutral-200/70">
                  <Settings size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">Notion 連携 & 設定</div>
                  <div className="text-xs text-neutral-400">データベース同期・トークン設定</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/95 backdrop-blur-xl border-t border-neutral-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] select-none transition-all duration-300"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
        }}
      >
        <div className="flex items-center justify-around px-2 pt-2">
          {/* 1. Sidebar Menu Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              onToggleSidebar();
            }}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-neutral-500 hover:text-neutral-800 active:scale-95 transition-all"
          >
            <Menu size={20} className="stroke-[1.9]" />
            <span className="text-[10px] font-medium mt-1">リスト</span>
          </button>

          {/* 2. Tasks (List) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              onSelectView('list');
            }}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all active:scale-95 ${
              activeView === 'list'
                ? 'text-blue-600 font-bold'
                : 'text-neutral-500 hover:text-neutral-800 font-medium'
            }`}
          >
            <div className="relative">
              <CheckSquare size={20} className={activeView === 'list' ? 'stroke-[2.4]' : 'stroke-[1.9]'} />
              {activeTaskCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-blue-500 text-white text-[9px] font-bold px-1 min-w-[15px] h-[15px] rounded-full flex items-center justify-center ring-2 ring-white">
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
            className="relative -top-2.5 w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/35 flex items-center justify-center active:scale-90 transition-transform ring-4 ring-white"
            title="新規タスク追加"
          >
            <Plus size={24} strokeWidth={2.6} />
          </button>

          {/* 4. Kanban */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              onSelectView('kanban');
            }}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all active:scale-95 ${
              activeView === 'kanban'
                ? 'text-blue-600 font-bold'
                : 'text-neutral-500 hover:text-neutral-800 font-medium'
            }`}
          >
            <Kanban size={20} className={activeView === 'kanban' ? 'stroke-[2.4]' : 'stroke-[1.9]'} />
            <span className="text-[10px] mt-1">カンバン</span>
            {activeView === 'kanban' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-600" />
            )}
          </button>

          {/* 5. Calendar */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              onSelectView('calendar');
            }}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all active:scale-95 ${
              activeView === 'calendar'
                ? 'text-blue-600 font-bold'
                : 'text-neutral-500 hover:text-neutral-800 font-medium'
            }`}
          >
            <Calendar size={20} className={activeView === 'calendar' ? 'stroke-[2.4]' : 'stroke-[1.9]'} />
            <span className="text-[10px] mt-1">カレンダー</span>
            {activeView === 'calendar' && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-600" />
            )}
          </button>

          {/* 6. More Views Button (...) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              setIsMoreMenuOpen(true);
            }}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all active:scale-95 ${
              ['matrix', 'pomodoro', 'habits'].includes(activeView)
                ? 'text-blue-600 font-bold'
                : 'text-neutral-500 hover:text-neutral-800 font-medium'
            }`}
          >
            <MoreHorizontal size={20} className={['matrix', 'pomodoro', 'habits'].includes(activeView) ? 'stroke-[2.4]' : 'stroke-[1.9]'} />
            <span className="text-[10px] mt-1">その他</span>
            {['matrix', 'pomodoro', 'habits'].includes(activeView) && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-600" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
