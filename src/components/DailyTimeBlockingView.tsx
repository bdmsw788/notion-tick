import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskList, Priority } from '../types';
import { getTodayString } from '../lib/storage';
import {
  Check,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Plus,
  Share2,
  SlidersHorizontal,
  MoreHorizontal,
  BookOpen,
  Calendar as CalendarIcon,
  Trash2,
  X,
} from 'lucide-react';

interface DailyTimeBlockingViewProps {
  tasks: Task[];
  lists: TaskList[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onAddTask: (taskData: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

const START_HOUR = 7;
const END_HOUR = 23;
const HOUR_HEIGHT = 72; // pixels per hour

export const DailyTimeBlockingView: React.FC<DailyTimeBlockingViewProps> = ({
  tasks,
  lists,
  selectedTaskId,
  onSelectTask,
  onToggleComplete,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
}) => {
  const today = getTodayString();
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [isAllDayExpanded, setIsAllDayExpanded] = useState<boolean>(false);
  const [editingTaskTime, setEditingTaskTime] = useState<Task | null>(null);
  const [quickAddHour, setQuickAddHour] = useState<number | null>(null);
  const [quickAddTitle, setQuickAddTitle] = useState<string>('');

  // Current real-time indicator
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeFormatted = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
  const isSelectedDateToday = selectedDate === today;

  // Filter tasks for this date
  const dateTasks = tasks.filter((t) => {
    if (t.isDeleted) return false;
    // Task scheduled on this date or without due date if selectedDate is today
    if (t.dueDate === selectedDate) return true;
    if (!t.dueDate && isSelectedDateToday) return true;
    return false;
  });

  // Split into All-Day vs Time-Scheduled
  const allDayTasks = dateTasks.filter((t) => !t.startTime);
  const scheduledTasks = dateTasks.filter((t) => !!t.startTime);

  // Total scheduled duration in hours
  const totalDurationMinutes = scheduledTasks.reduce(
    (acc, t) => acc + (t.durationMinutes || 60),
    0
  );
  const totalHours = Math.round((totalDurationMinutes / 60) * 10) / 10;

  // Calculate current time line top position
  const currentTimeTop =
    (currentHour - START_HOUR) * HOUR_HEIGHT + (currentMinute / 60) * HOUR_HEIGHT;

  // Color theme per task priority / type
  const getTaskBlockStyle = (task: Task) => {
    if (task.completed) {
      return {
        bg: 'bg-neutral-50/90 border-neutral-200 text-neutral-400 opacity-60',
        borderLeft: 'border-l-neutral-300',
        ring: '',
      };
    }
    if (task.priority === 'high') {
      return {
        bg: 'bg-red-50/70 border-red-200 text-neutral-900',
        borderLeft: 'border-l-red-500',
        ring: 'hover:border-red-300',
      };
    }
    if (task.priority === 'medium') {
      return {
        bg: 'bg-amber-50/60 border-amber-200 text-neutral-900',
        borderLeft: 'border-l-amber-500',
        ring: 'hover:border-amber-300',
      };
    }
    if (task.priority === 'low') {
      return {
        bg: 'bg-blue-50/60 border-blue-200 text-neutral-900',
        borderLeft: 'border-l-blue-500',
        ring: 'hover:border-blue-300',
      };
    }
    return {
      bg: 'bg-white border-neutral-200/90 text-neutral-900',
      borderLeft: 'border-l-blue-400',
      ring: 'hover:border-neutral-300 shadow-2xs',
    };
  };

  // Convert "HH:mm" to pixels from top
  const timeToTop = (timeStr: string) => {
    const parts = timeStr.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1] || '0', 10);
    return (h - START_HOUR) * HOUR_HEIGHT + (m / 60) * HOUR_HEIGHT;
  };

  // Quick submit task for hour
  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddTitle.trim() || quickAddHour === null) return;

    const startTimeStr = `${String(quickAddHour).padStart(2, '0')}:00`;
    onAddTask({
      title: quickAddTitle.trim(),
      dueDate: selectedDate,
      startTime: startTimeStr,
      durationMinutes: 60,
      priority: 'none',
      listId: 'inbox',
      tags: [],
    });
    setQuickAddTitle('');
    setQuickAddHour(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm max-w-2xl mx-auto overflow-hidden pb-24 select-none">
      {/* 1. Header (Exactly like the user's uploaded reference image) */}
      <div className="p-5 md:p-6 pb-4">
        {/* Action icons row */}
        <div className="flex items-center justify-end gap-3 text-neutral-500 mb-2">
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <Share2 size={16} />
            <span>共有</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <SlidersHorizontal size={16} />
            <span>表示</span>
          </button>
          <button
            type="button"
            className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-500"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Big Date Title */}
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          {isSelectedDateToday ? '今日' : selectedDate}
        </h1>

        {/* Task count & Planned Duration Row */}
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-4 text-sm font-medium text-neutral-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-neutral-500" />
              <span>{dateTasks.length} 件のタスク</span>
            </div>
            {totalHours > 0 && (
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-neutral-500" />
                <span>{totalHours}時間</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 px-3 py-1 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 bg-neutral-50/50">
            <span>予定</span>
            <BookOpen size={14} className="text-neutral-500" />
          </div>
        </div>
      </div>

      {/* 2. "All Day" (終日) Section */}
      <div className="border-t border-neutral-100 bg-neutral-50/30">
        <div className="flex items-start px-4 py-3 gap-3">
          {/* Left Label */}
          <div
            onClick={() => setIsAllDayExpanded(!isAllDayExpanded)}
            className="w-12 shrink-0 pt-0.5 flex items-center justify-between cursor-pointer select-none"
          >
            <span className="text-xs font-semibold text-neutral-500">終日</span>
            {allDayTasks.length > 2 && (
              <ChevronDown
                size={14}
                className={`text-neutral-400 transition-transform ${
                  isAllDayExpanded ? 'rotate-180' : ''
                }`}
              />
            )}
          </div>

          {/* All Day Tasks Pills */}
          <div className="flex-1 space-y-1.5">
            {(isAllDayExpanded ? allDayTasks : allDayTasks.slice(0, 2)).map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className="flex items-center justify-between bg-white/80 hover:bg-white border border-neutral-200/70 rounded-xl px-3 py-2 text-xs font-medium text-neutral-800 shadow-2xs transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(task);
                    }}
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-neutral-400 border-neutral-400 text-white'
                        : 'border-neutral-300 hover:border-neutral-500'
                    }`}
                  >
                    {task.completed && <Check size={10} strokeWidth={3} />}
                  </button>
                  <span className={`truncate ${task.completed ? 'line-through text-neutral-400' : ''}`}>
                    {task.title}
                  </span>
                </div>

                {/* Quick Schedule Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTaskTime(task);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md transition-opacity"
                >
                  時間を設定
                </button>
              </div>
            ))}

            {/* "他 X 件" expander */}
            {!isAllDayExpanded && allDayTasks.length > 2 && (
              <button
                type="button"
                onClick={() => setIsAllDayExpanded(true)}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-800 pt-0.5 pl-1"
              >
                他 {allDayTasks.length - 2} 件
              </button>
            )}

            {allDayTasks.length === 0 && (
              <div className="text-xs text-neutral-400 py-1">
                終日タスクはありません
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Timeline Grid (Hour Slots + Task Blocks) */}
      <div className="border-t border-neutral-200/80 relative">
        <div className="relative pt-2">
          {/* Current Time Indicator (Orange Line Exactly like reference image) */}
          {isSelectedDateToday && currentHour >= START_HOUR && currentHour <= END_HOUR && (
            <div
              className="absolute left-0 right-0 z-30 flex items-center pointer-events-none transition-all duration-300"
              style={{ top: `${currentTimeTop + 8}px` }}
            >
              <span className="w-14 text-right pr-2 text-xs font-bold text-amber-600">
                {currentTimeFormatted}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 -ml-1 ring-2 ring-white shadow-xs" />
              <div className="flex-1 h-0.5 bg-amber-600" />
            </div>
          )}

          {/* Hour Grid Lines */}
          {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR).map(
            (hour) => {
              const hourFormatted = `${String(hour).padStart(2, '0')}:00`;
              return (
                <div
                  key={hour}
                  style={{ height: `${HOUR_HEIGHT}px` }}
                  onClick={() => setQuickAddHour(hour)}
                  className="flex items-start border-t border-neutral-100/90 relative group hover:bg-blue-50/20 transition-colors cursor-pointer"
                >
                  {/* Hour Label on Left */}
                  <div className="w-14 shrink-0 text-right pr-3 pt-1 text-xs font-medium text-neutral-400 select-none">
                    {hourFormatted}
                  </div>

                  {/* Empty Slot Hover Guide */}
                  <div className="flex-1 h-full relative">
                    {quickAddHour === hour && (
                      <form
                        onSubmit={handleQuickAddSubmit}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-x-2 top-1 z-40 bg-white border-2 border-blue-500 rounded-xl p-2 shadow-lg flex items-center gap-2"
                      >
                        <span className="text-xs font-bold text-blue-600 shrink-0">
                          {hourFormatted}
                        </span>
                        <input
                          type="text"
                          autoFocus
                          placeholder="何をする予定ですか？"
                          value={quickAddTitle}
                          onChange={(e) => setQuickAddTitle(e.target.value)}
                          className="flex-1 text-xs outline-none bg-transparent text-neutral-900"
                        />
                        <button
                          type="submit"
                          className="text-xs font-bold text-white bg-blue-600 px-3 py-1 rounded-lg active:scale-95"
                        >
                          追加
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickAddHour(null)}
                          className="text-neutral-400 hover:text-neutral-600 p-1"
                        >
                          <X size={14} />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            }
          )}

          {/* Render Scheduled Task Blocks Absolute Overlay */}
          <div className="absolute inset-y-0 left-14 right-4 pointer-events-none pt-2">
            {scheduledTasks.map((task) => {
              if (!task.startTime) return null;
              const topPx = timeToTop(task.startTime);
              const duration = task.durationMinutes || 60;
              const heightPx = Math.max(36, (duration / 60) * HOUR_HEIGHT - 6);
              const style = getTaskBlockStyle(task);
              const isSelected = selectedTaskId === task.id;

              return (
                <div
                  key={task.id}
                  style={{
                    top: `${topPx}px`,
                    height: `${heightPx}px`,
                  }}
                  onClick={() => onSelectTask(task.id)}
                  className={`absolute inset-x-2 pointer-events-auto rounded-2xl border-2 ${
                    style.bg
                  } ${style.borderLeft} border-l-4 p-3 transition-all cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md ${
                    isSelected ? 'ring-2 ring-blue-400/60 shadow-md' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleComplete(task);
                        }}
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          task.completed
                            ? 'bg-neutral-400 border-neutral-400 text-white'
                            : 'border-neutral-300 hover:border-neutral-500'
                        }`}
                      >
                        {task.completed && <Check size={10} strokeWidth={3} />}
                      </button>

                      <span
                        className={`text-xs font-bold leading-tight truncate ${
                          task.completed ? 'line-through text-neutral-400' : 'text-neutral-900'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    {/* Time Badge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTaskTime(task);
                      }}
                      className="text-[10px] font-semibold text-neutral-500 hover:text-blue-600 bg-black/5 hover:bg-blue-50 px-2 py-0.5 rounded-md shrink-0 transition-colors"
                    >
                      {task.startTime} ({duration}分)
                    </button>
                  </div>

                  {/* Bottom details if block is tall enough */}
                  {heightPx > 50 && (
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                      <span>{task.tags?.join(' ') || ''}</span>
                      <span className="hover:text-blue-600">タップして詳細</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Time Setting Modal (何時にやるかを設定するダイアログ) */}
      {editingTaskTime && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-neutral-200 animate-scaleIn"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">
                時間のスケジュール設定
              </h3>
              <button
                type="button"
                onClick={() => setEditingTaskTime(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-full hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-medium text-neutral-400 block mb-1">タスク名</span>
                <div className="text-sm font-bold text-neutral-800 truncate">
                  {editingTaskTime.title}
                </div>
              </div>

              {/* Start Time Select */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  開始時刻
                </label>
                <input
                  type="time"
                  value={editingTaskTime.startTime || '09:00'}
                  onChange={(e) =>
                    setEditingTaskTime({
                      ...editingTaskTime,
                      startTime: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-800 outline-none focus:border-blue-500"
                />
              </div>

              {/* Duration Select */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  所要時間
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() =>
                        setEditingTaskTime({
                          ...editingTaskTime,
                          durationMinutes: mins,
                        })
                      }
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                        (editingTaskTime.durationMinutes || 60) === mins
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {mins < 60 ? `${mins}分` : `${mins / 60}時間`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset to All Day button */}
              <button
                type="button"
                onClick={() => {
                  onUpdateTask({
                    ...editingTaskTime,
                    startTime: undefined,
                    updatedAt: new Date().toISOString(),
                  });
                  setEditingTaskTime(null);
                }}
                className="w-full py-2 text-xs font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
              >
                終日タスク（時間未定）に戻す
              </button>

              {/* Save Button */}
              <button
                type="button"
                onClick={() => {
                  onUpdateTask({
                    ...editingTaskTime,
                    dueDate: selectedDate,
                    startTime: editingTaskTime.startTime || '09:00',
                    durationMinutes: editingTaskTime.durationMinutes || 60,
                    updatedAt: new Date().toISOString(),
                  });
                  setEditingTaskTime(null);
                }}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md active:scale-98 transition-all"
              >
                時間を設定して保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
