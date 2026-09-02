import React, { useState } from 'react';
import { Habit } from '../types';
import { getTodayString, getOffsetDateString } from '../lib/storage';
import {
  Flame,
  Check,
  Plus,
  Trash2,
  Award,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface HabitTrackerViewProps {
  habits: Habit[];
  onToggleHabitDate: (habitId: string, dateStr: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedDates' | 'createdAt'>) => void;
  onDeleteHabit: (habitId: string) => void;
  onCompleteSound?: () => void;
}

const HABIT_ICONS = ['🧘', '💧', '📖', '🏃', '🌙', '💪', '🥗', '🎯', '✍️', '🌱'];
const HABIT_COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#6366F1'];

export const HabitTrackerView: React.FC<HabitTrackerViewProps> = ({
  habits,
  onToggleHabitDate,
  onAddHabit,
  onDeleteHabit,
  onCompleteSound,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🎯');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [frequency, setFrequency] = useState<Habit['frequency']>('daily');

  const today = getTodayString();

  // Generate last 7 days list
  const recentDays = [-6, -5, -4, -3, -2, -1, 0].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const dateStr = getOffsetDateString(offset);
    const dayName = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
    const dayNum = d.getDate();
    return { offset, dateStr, dayName, dayNum, isToday: offset === 0 };
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddHabit({
      name: newName.trim(),
      icon: selectedIcon,
      color: selectedColor,
      frequency,
    });

    setNewName('');
    setShowAddForm(false);
  };

  const handleCheck = (habitId: string, dateStr: string, isCompleted: boolean) => {
    if (!isCompleted && onCompleteSound) {
      onCompleteSound();
    }
    onToggleHabitDate(habitId, dateStr);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto py-2 space-y-6 overflow-y-auto">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <h2 className="text-xl font-bold">習慣トラッカー (Habits)</h2>
          </div>
          <p className="text-xs text-blue-100 mt-1 max-w-md">
            小さな積み重ねが大きな成果を作ります。毎日チェックインしてストリークを伸ばしましょう！
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-white text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50 shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus size={16} />
          <span>新しい習慣</span>
        </button>
      </div>

      {/* Add Habit Modal / Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateHabit}
          className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-4 animate-fadeIn"
        >
          <h3 className="text-sm font-bold text-neutral-800">新しい習慣を作成</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-500 mb-1 font-medium">習慣名</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="例: 朝のウォーキング 20分"
                autoFocus
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-500 mb-1 font-medium">頻度</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Habit['frequency'])}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none bg-white"
              >
                <option value="daily">毎日 (Everyday)</option>
                <option value="weekdays">平日 (月〜金)</option>
                <option value="weekends">週末 (土・日)</option>
                <option value="weekly">週1回</option>
              </select>
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs text-neutral-500 mb-1 font-medium">アイコン</label>
            <div className="flex gap-2">
              {HABIT_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setSelectedIcon(ic)}
                  className={`text-lg p-2 rounded-lg border transition-all ${
                    selectedIcon === ic
                      ? 'border-blue-500 bg-blue-50 scale-110 shadow-xs'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-1.5 text-xs text-neutral-500 hover:bg-neutral-100 rounded-lg"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!newName.trim()}
              className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              保存する
            </button>
          </div>
        </form>
      )}

      {/* Habit List with 7-day checks */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-6 py-3.5 border-b border-neutral-100 bg-neutral-50/70 text-xs font-bold text-neutral-500">
          <div className="col-span-6">習慣名 / ストリーク</div>
          <div className="col-span-6 grid grid-cols-7 text-center">
            {recentDays.map((d) => (
              <div key={d.dateStr} className={`flex flex-col ${d.isToday ? 'text-blue-600 font-bold' : ''}`}>
                <span>{d.dayName}</span>
                <span className="text-[10px] text-neutral-400 font-normal">{d.dayNum}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Habit Rows */}
        <div className="divide-y divide-neutral-100">
          {habits.map((h) => {
            const isCompletedToday = h.completedDates.includes(today);

            return (
              <div key={h.id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-neutral-50/50 transition-colors group">
                {/* Left info */}
                <div className="col-span-6 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-2xs"
                    style={{ backgroundColor: `${h.color}15`, color: h.color }}
                  >
                    {h.icon}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-neutral-800">{h.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1 text-orange-500 font-semibold">
                        <Flame size={12} className="fill-orange-500" />
                        <span>{h.streak} 日連続</span>
                      </span>
                      <span>•</span>
                      <span>最高: {h.bestStreak}日</span>
                    </div>
                  </div>
                </div>

                {/* Right 7-day checkboxes */}
                <div className="col-span-6 grid grid-cols-7 items-center justify-items-center">
                  {recentDays.map((d) => {
                    const done = h.completedDates.includes(d.dateStr);

                    return (
                      <button
                        key={d.dateStr}
                        type="button"
                        onClick={() => handleCheck(h.id, d.dateStr, done)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all ${
                          done
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs scale-105'
                            : d.isToday
                            ? 'border-neutral-300 hover:border-emerald-400 bg-white'
                            : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                        }`}
                        title={`${d.dateStr} ${done ? '完了済み' : 'クリックして完了'}`}
                      >
                        {done && <Check size={14} strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {habits.length === 0 && (
            <div className="py-12 text-center text-xs text-neutral-400">
              まだ習慣が登録されていません。「新しい習慣」ボタンから登録してみましょう！
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
