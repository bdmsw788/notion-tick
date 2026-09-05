import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskList, Priority } from '../types';
import { getTodayString } from '../lib/storage';
import {
  Check,
  Clock,
  CheckCircle2,
  ChevronDown,
  Plus,
  Share2,
  SlidersHorizontal,
  MoreHorizontal,
  BookOpen,
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
const HOUR_HEIGHT = 76; // pixels per hour

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

  // Drag and Drop State for Touch & Pointer / Mouse
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredDropTarget, setHoveredDropTarget] = useState<
    { type: 'allday' } | { type: 'hour'; hour: number } | null
  >(null);
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
  const isSelectedDateToday = selectedDate === today;

  // Filter tasks for this date
  const dateTasks = tasks.filter((t) => {
    if (t.isDeleted) return false;
    if (t.dueDate === selectedDate) return true;
    if (!t.dueDate && isSelectedDateToday) return true;
    return false;
  });

  // Split into All-Day vs Time-Scheduled
  const allDayTasks = dateTasks.filter((t) => !t.startTime);
  const scheduledTasks = dateTasks.filter((t) => !!t.startTime);

  const activeDragTask = draggingTaskId ? tasks.find((t) => t.id === draggingTaskId) : null;

  // Total scheduled duration in hours
  const totalDurationMinutes = scheduledTasks.reduce(
    (acc, t) => acc + (t.durationMinutes || 60),
    0
  );
  const totalHours = Math.round((totalDurationMinutes / 60) * 10) / 10;

  // Calculate current time line top position
  const currentTimeTop =
    (currentHour - START_HOUR) * HOUR_HEIGHT + (currentMinute / 60) * HOUR_HEIGHT;

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
      const zoneType = dropZone.getAttribute('data-drop-zone');
      if (zoneType === 'allday') {
        setHoveredDropTarget({ type: 'allday' });
        return;
      }
      if (zoneType === 'hour') {
        const hour = parseInt(dropZone.getAttribute('data-drop-hour') || '', 10);
        if (!isNaN(hour)) {
          setHoveredDropTarget({ type: 'hour', hour });
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
    const zoneType = dropZone?.getAttribute('data-drop-zone');
    const taskToUpdate = tasks.find((t) => t.id === draggingTaskId);

    if (taskToUpdate) {
      if (zoneType === 'allday' || hoveredDropTarget?.type === 'allday') {
        // Move to All Day (remove start time)
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);
        onUpdateTask({
          ...taskToUpdate,
          dueDate: selectedDate,
          startTime: undefined,
          updatedAt: new Date().toISOString(),
        });
      } else if (zoneType === 'hour' || hoveredDropTarget?.type === 'hour') {
        const targetHour = zoneType === 'hour' 
          ? parseInt(dropZone?.getAttribute('data-drop-hour') || '', 10)
          : (hoveredDropTarget as { type: 'hour'; hour: number }).hour;

        if (!isNaN(targetHour)) {
          if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);
          const newStartTime = `${String(targetHour).padStart(2, '0')}:00`;
          onUpdateTask({
            ...taskToUpdate,
            dueDate: selectedDate,
            startTime: newStartTime,
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

  // HTML5 Drag Fallback for Desktop
  const handleHtml5Drop = (e: React.DragEvent, target: { type: 'allday' } | { type: 'hour'; hour: number }) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;
    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (!taskToUpdate) return;

    if (target.type === 'allday') {
      onUpdateTask({
        ...taskToUpdate,
        dueDate: selectedDate,
        startTime: undefined,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const newStartTime = `${String(target.hour).padStart(2, '0')}:00`;
      onUpdateTask({
        ...taskToUpdate,
        dueDate: selectedDate,
        startTime: newStartTime,
        durationMinutes: taskToUpdate.durationMinutes || 60,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Color theme per task priority / type
  const getTaskBlockStyle = (task: Task) => {
    if (task.completed) {
      return {
        bg: 'bg-neutral-50/90 border-neutral-200 text-neutral-400 opacity-60',
        borderLeft: 'border-l-neutral-300',
      };
    }
    if (task.priority === 'high') {
      return {
        bg: 'bg-red-50/70 border-red-200 text-neutral-900',
        borderLeft: 'border-l-red-500',
      };
    }
    if (task.priority === 'medium') {
      return {
        bg: 'bg-amber-50/60 border-amber-200 text-neutral-900',
        borderLeft: 'border-l-amber-500',
      };
    }
    if (task.priority === 'low') {
      return {
        bg: 'bg-blue-50/60 border-blue-200 text-neutral-900',
        borderLeft: 'border-l-blue-500',
      };
    }
    return {
      bg: 'bg-white border-neutral-200/90 text-neutral-900',
      borderLeft: 'border-l-blue-400',
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
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm max-w-2xl mx-auto overflow-hidden pb-24 select-none"
    >
      {/* 1. Header (Reference Image Style) */}
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

      {/* 2. "All Day" (終日) Drop Zone Section */}
      <div
        data-drop-zone="allday"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleHtml5Drop(e, { type: 'allday' })}
        className={`border-t transition-colors duration-200 ${
          hoveredDropTarget?.type === 'allday'
            ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-300'
            : 'bg-neutral-50/30 border-neutral-100'
        }`}
      >
        <div className="flex items-start px-4 py-3 gap-3">
          {/* Left Label */}
          <div
            onClick={() => setIsAllDayExpanded(!isAllDayExpanded)}
            className="w-14 shrink-0 pt-0.5 flex items-center justify-between cursor-pointer select-none"
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
            {hoveredDropTarget?.type === 'allday' && (
              <div className="text-xs font-bold text-blue-600 py-1 px-2 border-2 border-dashed border-blue-400 rounded-xl bg-white/90 text-center animate-pulse">
                ここに離して終日タスク（時間未定）にする
              </div>
            )}

            {(isAllDayExpanded ? allDayTasks : allDayTasks.slice(0, 2)).map((task) => {
              const isDraggingThis = draggingTaskId === task.id;
              return (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                  onClick={() => onSelectTask(task.id)}
                  className={`flex items-center justify-between bg-white/90 hover:bg-white border border-neutral-200/80 rounded-xl px-3 py-2 text-xs font-medium text-neutral-800 shadow-2xs transition-all cursor-pointer group ${
                    isDraggingThis ? 'opacity-30 border-dashed border-blue-400' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Drag Grip Handle */}
                    <div
                      onPointerDown={(e) => handlePointerDownDrag(task.id, e)}
                      className="touch-none text-neutral-300 group-hover:text-neutral-500 cursor-grab active:cursor-grabbing p-0.5 -ml-1"
                      title="ドラッグして下の時間枠へ移動"
                    >
                      <GripVertical size={13} />
                    </div>

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
                    className="opacity-0 group-hover:opacity-100 text-[10px] text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition-all"
                  >
                    時間を設定
                  </button>
                </div>
              );
            })}

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

            {allDayTasks.length === 0 && !hoveredDropTarget && (
              <div className="text-xs text-neutral-400 py-1">
                終日タスクはありません（下のタスクをここにドラッグして終日に戻せます）
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Main Timeline Grid (Hour Slots + Drop Zones) */}
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

          {/* Hour Grid Rows (Drop Targets) */}
          {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR).map(
            (hour) => {
              const hourFormatted = `${String(hour).padStart(2, '0')}:00`;
              const isHourHovered =
                hoveredDropTarget?.type === 'hour' && hoveredDropTarget.hour === hour;

              return (
                <div
                  key={hour}
                  data-drop-zone="hour"
                  data-drop-hour={hour}
                  style={{ height: `${HOUR_HEIGHT}px` }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleHtml5Drop(e, { type: 'hour', hour })}
                  onClick={() => setQuickAddHour(hour)}
                  className={`flex items-start border-t border-neutral-100/90 relative group transition-colors cursor-pointer ${
                    isHourHovered
                      ? 'bg-blue-50/80 border-t-2 border-blue-500'
                      : 'hover:bg-blue-50/20'
                  }`}
                >
                  {/* Hour Label on Left */}
                  <div
                    className={`w-14 shrink-0 text-right pr-3 pt-1 text-xs font-medium select-none transition-colors ${
                      isHourHovered ? 'text-blue-600 font-bold' : 'text-neutral-400'
                    }`}
                  >
                    {hourFormatted}
                  </div>

                  {/* Drop indicator prompt */}
                  <div className="flex-1 h-full relative">
                    {isHourHovered && (
                      <div className="absolute inset-x-2 inset-y-1.5 border-2 border-dashed border-blue-400 rounded-xl bg-blue-50/50 flex items-center justify-center text-xs font-bold text-blue-600 z-10 animate-pulse">
                        ↳ ここに離して {hourFormatted} に設定
                      </div>
                    )}

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
              const heightPx = Math.max(38, (duration / 60) * HOUR_HEIGHT - 6);
              const style = getTaskBlockStyle(task);
              const isSelected = selectedTaskId === task.id;
              const isDraggingThis = draggingTaskId === task.id;

              return (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                  style={{
                    top: `${topPx}px`,
                    height: `${heightPx}px`,
                  }}
                  onClick={() => onSelectTask(task.id)}
                  className={`absolute inset-x-2 pointer-events-auto rounded-2xl border-2 ${
                    style.bg
                  } ${style.borderLeft} border-l-4 p-3 transition-all cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md ${
                    isSelected ? 'ring-2 ring-blue-400/60 shadow-md' : ''
                  } ${isDraggingThis ? 'opacity-30 border-dashed border-blue-400' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Drag Grip Handle for mobile & desktop */}
                      <div
                        onPointerDown={(e) => handlePointerDownDrag(task.id, e)}
                        className="touch-none text-neutral-300 hover:text-neutral-600 cursor-grab active:cursor-grabbing p-0.5 -ml-1 shrink-0"
                        title="ドラッグして別の時間へ移動"
                      >
                        <GripVertical size={14} />
                      </div>

                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleComplete(task);
                        }}
                        className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          task.completed
                            ? 'bg-neutral-400 border-neutral-400 text-white'
                            : 'border-neutral-300 hover:border-neutral-500'
                        }`}
                      >
                        {task.completed && <Check size={11} strokeWidth={3} />}
                      </button>

                      <span
                        className={`text-xs font-bold leading-tight truncate ${
                          task.completed ? 'line-through text-neutral-400' : 'text-neutral-900'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    {/* Time Badge (Tap to change) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTaskTime(task);
                      }}
                      className="text-[10px] font-semibold text-neutral-500 hover:text-blue-600 bg-black/5 hover:bg-blue-50 px-2 py-0.5 rounded-md shrink-0 transition-colors"
                      title="時間を変更"
                    >
                      {task.startTime} ({duration}分)
                    </button>
                  </div>

                  {/* Bottom details if block is tall enough */}
                  {heightPx > 50 && (
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 pl-5">
                      <span>{task.tags?.join(' ') || ''}</span>
                      <span className="text-[10px] text-neutral-400">⋮⋮ ドラッグで時間移動</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Ghost Card during Touch Drag (iPhone / Mobile) */}
      {draggingTaskId && activeDragTask && (
        <div
          style={{
            position: 'fixed',
            left: `${dragPos.x}px`,
            top: `${dragPos.y}px`,
            transform: 'translate(-50%, -50%) rotate(2deg) scale(1.03)',
            pointerEvents: 'none',
            zIndex: 9999,
            width: '280px',
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
              {hoveredDropTarget.type === 'allday'
                ? '↳ 終日（時間未定）へ戻す'
                : `↳ ${String(hoveredDropTarget.hour).padStart(2, '0')}:00 へ移動`}
            </div>
          )}
        </div>
      )}

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
                  何時からやるか（開始時刻）
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
                  何分やるか（所要時間）
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
