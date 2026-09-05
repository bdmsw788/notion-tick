import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskList, Priority } from '../types';
import { getTodayString, getOffsetDateString } from '../lib/storage';
import {
  Check,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Share2,
  SlidersHorizontal,
  MoreHorizontal,
  BookOpen,
  Calendar as CalendarIcon,
  GripVertical,
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
const HOUR_HEIGHT = 74; // pixels per hour

// Color palette matching the user's reference image exactly
const BLOCK_COLORS = [
  { bg: 'bg-blue-100/80 border-blue-200 text-blue-950', badge: 'bg-blue-200 text-blue-800' },
  { bg: 'bg-emerald-100/70 border-emerald-200 text-emerald-950', badge: 'bg-emerald-200 text-emerald-800' },
  { bg: 'bg-pink-100/80 border-pink-200 text-pink-950', badge: 'bg-pink-200 text-pink-800' },
  { bg: 'bg-indigo-100/75 border-indigo-200 text-indigo-950', badge: 'bg-indigo-200 text-indigo-800' },
  { bg: 'bg-amber-100/75 border-amber-200 text-amber-950', badge: 'bg-amber-200 text-amber-800' },
  { bg: 'bg-teal-100/75 border-teal-200 text-teal-950', badge: 'bg-teal-200 text-teal-800' },
];

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
  const [startDate, setStartDate] = useState<string>(today);
  const [viewDays, setViewDays] = useState<1 | 3 | 7>(3); // Default 3-day view matching reference image!
  const [isViewDaysMenuOpen, setIsViewDaysMenuOpen] = useState(false);
  const [isAllDayExpanded, setIsAllDayExpanded] = useState<boolean>(false);
  const [editingTaskTime, setEditingTaskTime] = useState<Task | null>(null);
  const [quickAddSlot, setQuickAddSlot] = useState<{ date: string; hour: number } | null>(null);
  const [quickAddTitle, setQuickAddTitle] = useState<string>('');

  // Drag and Drop State for Touch & Pointer / Mouse
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredDropTarget, setHoveredDropTarget] = useState<{
    date: string;
    type: 'allday' | 'hour';
    hour?: number;
  } | null>(null);
  const dragPointerIdRef = useRef<number | null>(null);

  // Current real-time indicator
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeFormatted = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

  // Generate days array for the selected view
  const daysArray = React.useMemo(() => {
    const days: { dateStr: string; dayOfWeek: string; dayNumber: number; isToday: boolean; monthStr: string }[] = [];
    const base = new Date(startDate + 'T00:00:00');
    const weekDays = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];

    for (let i = 0; i < viewDays; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      days.push({
        dateStr,
        dayOfWeek: weekDays[d.getDay()],
        dayNumber: d.getDate(),
        isToday: dateStr === today,
        monthStr: `${d.getMonth() + 1}月`,
      });
    }
    return days;
  }, [startDate, viewDays, today]);

  // Current month title from first day in view
  const currentMonthDisplay = daysArray[0]?.monthStr || `${new Date().getMonth() + 1}月`;

  // ISO Week Number calculation
  const getWeekNumber = (dStr: string) => {
    const date = new Date(dStr);
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };
  const weekNumberDisplay = `W${getWeekNumber(daysArray[0]?.dateStr || today)}`;

  // Navigate dates
  const handlePrevPeriod = () => {
    const d = new Date(startDate + 'T00:00:00');
    d.setDate(d.getDate() - viewDays);
    setStartDate(d.toISOString().split('T')[0]);
  };

  const handleNextPeriod = () => {
    const d = new Date(startDate + 'T00:00:00');
    d.setDate(d.getDate() + viewDays);
    setStartDate(d.toISOString().split('T')[0]);
  };

  const handleJumpToToday = () => {
    setStartDate(today);
  };

  const activeDragTask = draggingTaskId ? tasks.find((t) => t.id === draggingTaskId) : null;

  // Touch & Pointer Drag Handlers
  const handlePointerDownDrag = (taskId: string, e: React.PointerEvent) => {
    if (e.button !== 0) return;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(35);
    }

    setDraggingTaskId(taskId);
    setDragPos({ x: e.clientX, y: e.clientY });
    dragPointerIdRef.current = e.pointerId;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingTaskId) return;

    setDragPos({ x: e.clientX, y: e.clientY });

    const el = document.elementFromPoint(e.clientX, e.clientY);
    const dropZone = el?.closest('[data-drop-zone]');
    if (dropZone) {
      const zoneType = dropZone.getAttribute('data-drop-zone') as 'allday' | 'hour';
      const targetDate = dropZone.getAttribute('data-drop-date') || today;
      if (zoneType === 'allday') {
        setHoveredDropTarget({ date: targetDate, type: 'allday' });
        return;
      }
      if (zoneType === 'hour') {
        const hour = parseInt(dropZone.getAttribute('data-drop-hour') || '', 10);
        if (!isNaN(hour)) {
          setHoveredDropTarget({ date: targetDate, type: 'hour', hour });
          return;
        }
      }
    }
    setHoveredDropTarget(null);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingTaskId) return;

    const el = document.elementFromPoint(e.clientX, e.clientY);
    const dropZone = el?.closest('[data-drop-zone]');
    const targetDate = dropZone?.getAttribute('data-drop-date') || hoveredDropTarget?.date;
    const zoneType = dropZone?.getAttribute('data-drop-zone') || hoveredDropTarget?.type;
    const taskToUpdate = tasks.find((t) => t.id === draggingTaskId);

    if (taskToUpdate && targetDate) {
      if (zoneType === 'allday') {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);
        onUpdateTask({
          ...taskToUpdate,
          dueDate: targetDate,
          startTime: undefined,
          updatedAt: new Date().toISOString(),
        });
      } else if (zoneType === 'hour') {
        const targetHour = dropZone?.getAttribute('data-drop-hour')
          ? parseInt(dropZone.getAttribute('data-drop-hour') || '', 10)
          : hoveredDropTarget?.hour;

        if (targetHour !== undefined && !isNaN(targetHour)) {
          if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);
          const newStartTime = `${String(targetHour).padStart(2, '0')}:00`;
          onUpdateTask({
            ...taskToUpdate,
            dueDate: targetDate,
            startTime: newStartTime,
            status: taskToUpdate.completed ? '完了' : 'スケジュール',
            durationMinutes: taskToUpdate.durationMinutes || 60,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }

    try {
      if (dragPointerIdRef.current !== null) {
        (e.currentTarget as HTMLElement).releasePointerCapture(dragPointerIdRef.current);
      }
    } catch {
      // ignore
    }

    setDraggingTaskId(null);
    setHoveredDropTarget(null);
    dragPointerIdRef.current = null;
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
    if (!quickAddTitle.trim() || !quickAddSlot) return;

    const startTimeStr = `${String(quickAddSlot.hour).padStart(2, '0')}:00`;
    onAddTask({
      title: quickAddTitle.trim(),
      dueDate: quickAddSlot.date,
      startTime: startTimeStr,
      durationMinutes: 60,
      status: 'スケジュール',
      priority: 'none',
      listId: 'inbox',
      tags: [],
    });
    setQuickAddTitle('');
    setQuickAddSlot(null);
  };

  // Task color block selector by task id hash
  const getTaskColorStyle = (task: Task) => {
    if (task.completed) {
      return { bg: 'bg-neutral-100/90 border-neutral-200 text-neutral-400 opacity-60' };
    }
    // Pick pastel color deterministically from title
    let hash = 0;
    for (let i = 0; i < task.title.length; i++) {
      hash = task.title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % BLOCK_COLORS.length;
    return BLOCK_COLORS[colorIndex];
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm max-w-5xl mx-auto overflow-hidden pb-24 select-none"
    >
      {/* 1. Header (Reference Image Exact Match: 9月, +, 3日⌄, < 今日 >, ...) */}
      <div className="p-4 md:p-6 pb-3 border-b border-neutral-200/80 flex items-center justify-between gap-2 flex-wrap">
        {/* Left: Month Title */}
        <div className="flex items-center gap-2">
          <CalendarIcon size={22} className="text-neutral-700" />
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            {currentMonthDisplay}
          </h1>
        </div>

        {/* Right Controls: +, View Mode Selector (3日 ⌄), Navigation (< 今日 >), More (...) */}
        <div className="flex items-center gap-2">
          {/* Quick Add Button (+) */}
          <button
            type="button"
            onClick={() => {
              onAddTask({
                title: '新規タスク',
                dueDate: startDate,
                startTime: '09:00',
                durationMinutes: 60,
                priority: 'none',
              });
            }}
            className="w-8 h-8 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 active:scale-95 transition-all shadow-2xs"
            title="新規タスクを追加"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>

          {/* View Mode Selector Dropdown: 1日 / 3日 / 7日 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsViewDaysMenuOpen(!isViewDaysMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-800 active:scale-95 transition-all shadow-2xs"
            >
              <span>{viewDays === 1 ? '1日' : viewDays === 3 ? '3日' : '週間 (7日)'}</span>
              <ChevronDown size={14} className="text-neutral-500" />
            </button>

            {isViewDaysMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-32 bg-white rounded-2xl shadow-xl border border-neutral-200 p-1 z-50 animate-scaleIn">
                <button
                  type="button"
                  onClick={() => {
                    setViewDays(1);
                    setIsViewDaysMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    viewDays === 1 ? 'bg-blue-50 text-blue-600 font-bold' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  1日 (今日)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewDays(3);
                    setIsViewDaysMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    viewDays === 3 ? 'bg-blue-50 text-blue-600 font-bold' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  3日 (推奨)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewDays(7);
                    setIsViewDaysMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    viewDays === 7 ? 'bg-blue-50 text-blue-600 font-bold' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  週間 (7日)
                </button>
              </div>
            )}
          </div>

          {/* Date Navigation (< 今日 >) */}
          <div className="flex items-center rounded-xl border border-neutral-200 bg-white p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handlePrevPeriod}
              className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-600 active:scale-95"
              title="前へ"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleJumpToToday}
              className="px-2.5 py-0.5 text-xs font-bold text-neutral-800 hover:text-blue-600 transition-colors"
            >
              今日
            </button>
            <button
              type="button"
              onClick={handleNextPeriod}
              className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-600 active:scale-95"
              title="次へ"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* More (...) */}
          <button
            type="button"
            className="p-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 active:scale-95 transition-all shadow-2xs"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* 2. Column Headers (W36 | 火曜日 5 | 水曜日 6 | 木曜日 7 ...) */}
      <div className="border-b border-neutral-200 flex items-center bg-neutral-50/40 text-neutral-500 text-xs font-semibold">
        {/* Leftmost Column for Week number and Hour labels */}
        <div className="w-14 shrink-0 px-2 py-3 text-center text-neutral-400 font-mono text-[11px] border-r border-neutral-200/60">
          {weekNumberDisplay}
        </div>

        {/* Days Columns Header */}
        <div className="flex-1 grid grid-flow-col auto-cols-fr divide-x divide-neutral-200/60">
          {daysArray.map((day) => (
            <div key={day.dateStr} className="px-3 py-2 flex flex-col items-center justify-center">
              <span className="text-[11px] font-medium text-neutral-500 mb-0.5">
                {day.dayOfWeek}
              </span>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  day.isToday
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-neutral-800 hover:bg-neutral-200/60'
                }`}
              >
                {day.dayNumber}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. All-Day Row across all days */}
      <div className="border-b border-neutral-200/80 bg-neutral-50/20 flex items-start">
        <div className="w-14 shrink-0 px-2 py-2.5 text-right pr-3 text-[11px] font-bold text-neutral-400 border-r border-neutral-200/60">
          終日
        </div>
        <div className="flex-1 grid grid-flow-col auto-cols-fr divide-x divide-neutral-200/60 min-h-[44px]">
          {daysArray.map((day) => {
            const dayAllDayTasks = tasks.filter(
              (t) => !t.isDeleted && t.dueDate === day.dateStr && !t.startTime
            );
            const isHoveredAllDay =
              hoveredDropTarget?.date === day.dateStr && hoveredDropTarget.type === 'allday';

            return (
              <div
                key={day.dateStr}
                data-drop-zone="allday"
                data-drop-date={day.dateStr}
                className={`p-1.5 space-y-1 transition-colors ${
                  isHoveredAllDay ? 'bg-blue-50/80 ring-2 ring-blue-400' : ''
                }`}
              >
                {isHoveredAllDay && (
                  <div className="text-[10px] font-bold text-blue-600 bg-blue-100/90 py-1 px-1.5 rounded-lg border border-dashed border-blue-400 text-center animate-pulse">
                    終日にドロップ
                  </div>
                )}

                {dayAllDayTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t.id)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-white border border-neutral-200/80 rounded-lg text-xs font-medium text-neutral-800 shadow-2xs group cursor-pointer"
                  >
                    <div
                      onPointerDown={(e) => handlePointerDownDrag(t.id, e)}
                      className="touch-none text-neutral-300 group-hover:text-neutral-500 cursor-grab p-0.5"
                    >
                      <GripVertical size={11} />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleComplete(t);
                      }}
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        t.completed ? 'bg-neutral-400 text-white' : 'border-neutral-300'
                      }`}
                    >
                      {t.completed && <Check size={8} strokeWidth={3} />}
                    </button>
                    <span className={`truncate ${t.completed ? 'line-through text-neutral-400' : ''}`}>
                      {t.title}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Multi-Day Timeline Grid (7:00 to 23:00) */}
      <div className="relative overflow-x-auto">
        <div className="relative min-w-[320px]">
          {/* Current Real-Time Horizontal Line across today column */}
          {daysArray.some((d) => d.isToday) && currentHour >= START_HOUR && currentHour <= END_HOUR && (
            <div
              className="absolute left-14 right-0 z-20 flex items-center pointer-events-none transition-all duration-300"
              style={{
                top: `${(currentHour - START_HOUR) * HOUR_HEIGHT + (currentMinute / 60) * HOUR_HEIGHT}px`,
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-600 -ml-1.25 ring-2 ring-white shadow-xs" />
              <div className="flex-1 h-0.5 bg-amber-600" />
            </div>
          )}

          {/* Hourly Rows */}
          {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR).map((hour) => {
            const hourFormatted = `${String(hour).padStart(2, '0')}:00`;

            return (
              <div
                key={hour}
                style={{ height: `${HOUR_HEIGHT}px` }}
                className="flex items-start border-t border-neutral-100/90 relative"
              >
                {/* Time Label on Left */}
                <div className="w-14 shrink-0 text-right pr-2 pt-1 text-[11px] font-medium text-neutral-400 select-none border-r border-neutral-200/60">
                  {hourFormatted}
                </div>

                {/* Day Columns for this hour */}
                <div className="flex-1 grid grid-flow-col auto-cols-fr divide-x divide-neutral-100/80 h-full">
                  {daysArray.map((day) => {
                    const isSlotHovered =
                      hoveredDropTarget?.date === day.dateStr &&
                      hoveredDropTarget.type === 'hour' &&
                      hoveredDropTarget.hour === hour;

                    return (
                      <div
                        key={day.dateStr}
                        data-drop-zone="hour"
                        data-drop-date={day.dateStr}
                        data-drop-hour={hour}
                        onClick={() => setQuickAddSlot({ date: day.dateStr, hour })}
                        className={`h-full relative group transition-colors cursor-pointer ${
                          isSlotHovered ? 'bg-blue-50/90 border-2 border-dashed border-blue-500' : 'hover:bg-blue-50/20'
                        }`}
                      >
                        {isSlotHovered && (
                          <div className="absolute inset-1 flex items-center justify-center text-[10px] font-bold text-blue-600 bg-blue-100/70 rounded-xl animate-pulse">
                            ↳ {hourFormatted} に設定
                          </div>
                        )}

                        {/* Inline Task Add Popup */}
                        {quickAddSlot?.date === day.dateStr && quickAddSlot.hour === hour && (
                          <form
                            onSubmit={handleQuickAddSubmit}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute inset-x-1 top-1 z-40 bg-white border-2 border-blue-500 rounded-xl p-2 shadow-xl flex items-center gap-1.5"
                          >
                            <span className="text-[10px] font-bold text-blue-600 shrink-0">
                              {hourFormatted}
                            </span>
                            <input
                              type="text"
                              autoFocus
                              placeholder="予定名を入力..."
                              value={quickAddTitle}
                              onChange={(e) => setQuickAddTitle(e.target.value)}
                              className="flex-1 text-xs outline-none bg-transparent text-neutral-900"
                            />
                            <button
                              type="submit"
                              className="text-[11px] font-bold text-white bg-blue-600 px-2 py-1 rounded-lg active:scale-95"
                            >
                              追加
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuickAddSlot(null)}
                              className="text-neutral-400 hover:text-neutral-600 p-0.5"
                            >
                              <X size={13} />
                            </button>
                          </form>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Absolute Task Blocks Overlay for all Days */}
          <div className="absolute inset-y-0 left-14 right-0 pointer-events-none">
            <div className="grid grid-flow-col auto-cols-fr h-full divide-x divide-transparent">
              {daysArray.map((day) => {
                const dayTasks = tasks.filter(
                  (t) => !t.isDeleted && t.dueDate === day.dateStr && !!t.startTime
                );

                return (
                  <div key={day.dateStr} className="relative h-full">
                    {dayTasks.map((task) => {
                      if (!task.startTime) return null;
                      const topPx = timeToTop(task.startTime);
                      const duration = task.durationMinutes || 60;
                      const heightPx = Math.max(36, (duration / 60) * HOUR_HEIGHT - 6);
                      const style = getTaskColorStyle(task);
                      const isSelected = selectedTaskId === task.id;
                      const isDraggingThis = draggingTaskId === task.id;

                      return (
                        <div
                          key={task.id}
                          style={{
                            top: `${topPx}px`,
                            height: `${heightPx}px`,
                          }}
                          onClick={() => onSelectTask(task.id)}
                          className={`absolute inset-x-1 pointer-events-auto rounded-2xl border-2 ${
                            style.bg
                          } p-2.5 transition-all cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md ${
                            isSelected ? 'ring-2 ring-blue-500 shadow-md' : ''
                          } ${isDraggingThis ? 'opacity-20 border-dashed border-blue-500' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {/* Grip Handle */}
                              <div
                                onPointerDown={(e) => handlePointerDownDrag(task.id, e)}
                                className="touch-none text-neutral-400 hover:text-neutral-700 cursor-grab active:cursor-grabbing p-0.5 -ml-1 shrink-0"
                                title="ドラッグして別の時間や日付へ移動"
                              >
                                <GripVertical size={13} />
                              </div>

                              {/* Title & Start Time */}
                              <div className="min-w-0">
                                <span
                                  className={`text-xs font-bold leading-tight truncate block ${
                                    task.completed ? 'line-through opacity-60' : ''
                                  }`}
                                >
                                  {task.title}
                                </span>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[10px] opacity-75 font-mono">
                                    {task.startTime} ({duration}分)
                                  </span>
                                  {task.projectName && (
                                    <span className="text-[9px] bg-white/70 px-1 py-0.2 rounded font-bold truncate max-w-[90px] shadow-2xs">
                                      {task.projectName.replace(/^【[PAR]】/, '')}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Checkbox */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleComplete(task);
                              }}
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                task.completed
                                  ? 'bg-neutral-600 border-neutral-600 text-white'
                                  : 'border-neutral-400 hover:border-neutral-600'
                              }`}
                            >
                              {task.completed && <Check size={10} strokeWidth={3} />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Ghost Preview Card during Touch/Pointer Drag */}
      {draggingTaskId && activeDragTask && (
        <div
          style={{
            position: 'fixed',
            left: `${dragPos.x}px`,
            top: `${dragPos.y}px`,
            transform: 'translate(-50%, -50%) rotate(2deg) scale(1.04)',
            pointerEvents: 'none',
            zIndex: 9999,
            width: '260px',
          }}
          className="shadow-2xl rounded-2xl bg-white border-2 border-blue-500/90 ring-4 ring-blue-400/20 p-3 opacity-95 transition-none"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-neutral-900 truncate">
              {activeDragTask.title}
            </span>
          </div>
          {hoveredDropTarget && (
            <div className="mt-2 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
              ↳ {hoveredDropTarget.date} {hoveredDropTarget.type === 'allday' ? '終日' : `${String(hoveredDropTarget.hour).padStart(2, '0')}:00`} へ移動
            </div>
          )}
        </div>
      )}
    </div>
  );
};
