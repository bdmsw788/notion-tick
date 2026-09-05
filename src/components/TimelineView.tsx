import React, { useState, useEffect } from 'react';
import { Task, TaskList, Priority } from '../types';
import { getTodayString } from '../lib/storage';
import {
  Play,
  Pause,
  Check,
  Clock,
  Calendar as CalendarIcon,
  Plus,
  ChevronRight,
  Flame,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface TimelineViewProps {
  tasks: Task[];
  lists: TaskList[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onAddTask: (taskData: Partial<Task>) => void;
  onStartPomodoro?: (task: Task) => void;
}

const HOURS = Array.from({ length: 17 }, (_, i) => i + 7); // 7:00 to 23:00

export const TimelineView: React.FC<TimelineViewProps> = ({
  tasks,
  lists,
  selectedTaskId,
  onSelectTask,
  onToggleComplete,
  onUpdateTask,
  onAddTask,
}) => {
  const today = getTodayString();
  const [currentTime, setCurrentTime] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  // Update current time indicator every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter tasks for Today (or tasks with startTime)
  const todayTasks = tasks.filter((t) => {
    if (t.isDeleted) return false;
    return t.dueDate === today || (!t.dueDate && !t.completed);
  });

  // Calculate summary metrics
  const totalPlannedMinutes = todayTasks.reduce(
    (acc, t) => acc + (t.durationMinutes || 45),
    0
  );
  const totalActualMinutes = todayTasks.reduce(
    (acc, t) => acc + (t.actualMinutes || 0),
    0
  );
  const completedTasksCount = todayTasks.filter((t) => t.completed).length;
  const progressPercent =
    todayTasks.length > 0
      ? Math.round((completedTasksCount / todayTasks.length) * 100)
      : 0;

  // Toggle task timer
  const handleToggleTimer = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();

    if (task.isRunning) {
      // Stop timer and calculate actual minutes
      const elapsedMinutes = task.timerStartedAt
        ? Math.max(1, Math.round((now - task.timerStartedAt) / 60000))
        : 0;
      onUpdateTask({
        ...task,
        isRunning: false,
        timerStartedAt: undefined,
        actualMinutes: (task.actualMinutes || 0) + elapsedMinutes,
        status: 'in_progress',
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Stop all other running tasks first
      tasks.forEach((t) => {
        if (t.isRunning && t.id !== task.id) {
          const elapsed = t.timerStartedAt
            ? Math.max(1, Math.round((now - t.timerStartedAt) / 60000))
            : 0;
          onUpdateTask({
            ...t,
            isRunning: false,
            timerStartedAt: undefined,
            actualMinutes: (t.actualMinutes || 0) + elapsed,
          });
        }
      });

      // Start timer on this task
      onUpdateTask({
        ...task,
        isRunning: true,
        timerStartedAt: now,
        status: 'in_progress',
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Quick set time for a task
  const handleSetStartTime = (task: Task, timeStr: string) => {
    onUpdateTask({
      ...task,
      dueDate: today,
      startTime: timeStr,
      durationMinutes: task.durationMinutes || 60,
      updatedAt: new Date().toISOString(),
    });
  };

  // Adjust duration
  const handleAdjustDuration = (task: Task, deltaMinutes: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = task.durationMinutes || 45;
    const next = Math.max(15, current + deltaMinutes);
    onUpdateTask({
      ...task,
      durationMinutes: next,
      updatedAt: new Date().toISOString(),
    });
  };

  // Tasks scheduled on timeline
  const scheduledTasks = todayTasks.filter((t) => !!t.startTime);
  // Tasks not yet assigned to a time slot
  const unassignedTasks = todayTasks.filter((t) => !t.startTime && !t.completed);

  // Current time position in pixels (7:00 is 0px, 1 hour = 80px)
  const currentHour = parseInt(currentTime.split(':')[0], 10);
  const currentMinute = parseInt(currentTime.split(':')[1], 10);
  const timeIndicatorTop = (currentHour - 7) * 80 + (currentMinute / 60) * 80;

  return (
    <div className="flex flex-col gap-5 pb-24 max-w-3xl mx-auto select-none">
      {/* 1. Daily Time Summary Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 text-white shadow-xl shadow-blue-500/15">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs">
                本日のタイムマネジメント
              </span>
              <span className="text-xs text-blue-100">
                {new Date().toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', weekday: 'short' })}
              </span>
            </div>
            <h2 className="text-xl font-bold mt-1 tracking-tight">今日の時間とタスク</h2>
          </div>

          <button
            type="button"
            onClick={() => {
              onAddTask({
                title: '新規タスク',
                dueDate: today,
                startTime: `${String(new Date().getHours()).padStart(2, '0')}:00`,
                durationMinutes: 45,
                priority: 'none',
              });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-blue-600 font-bold text-xs shadow-md active:scale-95 transition-transform"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>予定を追加</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/15">
          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-blue-100 font-medium flex items-center gap-1">
              <Clock size={12} /> 実績時間
            </span>
            <div className="text-lg font-bold mt-0.5">
              {Math.floor(totalActualMinutes / 60)}h {totalActualMinutes % 60}m
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-blue-100 font-medium flex items-center gap-1">
              <CalendarIcon size={12} /> 予定時間
            </span>
            <div className="text-lg font-bold mt-0.5">
              {Math.floor(totalPlannedMinutes / 60)}h {totalPlannedMinutes % 60}m
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-blue-100 font-medium flex items-center gap-1">
              <Check size={12} /> 完了タスク
            </span>
            <div className="text-lg font-bold mt-0.5">
              {completedTasksCount} / {todayTasks.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-blue-100 font-medium mb-1.5">
            <span>タスク達成率</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Unassigned Tasks (Waiting to be scheduled) */}
      {unassignedTasks.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              未スケジュールのタスク ({unassignedTasks.length}件)
            </span>
            <span className="text-[11px] text-amber-700">タップして時間にセット</span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {unassignedTasks.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTask(t.id)}
                className="shrink-0 bg-white border border-amber-200/90 rounded-xl p-2.5 shadow-2xs w-48 flex flex-col justify-between hover:border-amber-400 transition-colors cursor-pointer"
              >
                <div className="text-xs font-semibold text-neutral-800 truncate">
                  {t.title}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                  <span className="text-[10px] text-neutral-400">⏱ {t.durationMinutes || 45}分</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentH = new Date().getHours();
                      handleSetStartTime(t, `${String(Math.max(8, currentH)).padStart(2, '0')}:00`);
                    }}
                    className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md"
                  >
                    今すぐセット
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Daily Vertical Timeline (7:00 - 23:00) */}
      <div className="bg-white border border-neutral-200/90 rounded-3xl p-4 md:p-6 shadow-sm relative">
        <h3 className="text-sm font-bold text-neutral-800 mb-4 flex items-center gap-2">
          <Clock size={16} className="text-blue-500" />
          タイムライン (時間割)
        </h3>

        <div className="relative">
          {/* Red line for Current Time Indicator */}
          {currentHour >= 7 && currentHour <= 23 && (
            <div
              className="absolute left-10 right-0 z-20 flex items-center pointer-events-none transition-all duration-500"
              style={{ top: `${timeIndicatorTop}px` }}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.25 ring-2 ring-white shadow-xs" />
              <div className="flex-1 h-0.5 bg-red-500/80" />
              <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-full shadow-2xs ml-1">
                {currentTime}
              </span>
            </div>
          )}

          {/* Hour Rows */}
          <div className="space-y-0">
            {HOURS.map((hour) => {
              const hourStr = `${String(hour).padStart(2, '0')}:00`;
              // Tasks scheduled in this hour
              const tasksInHour = scheduledTasks.filter((t) => {
                if (!t.startTime) return false;
                const taskHour = parseInt(t.startTime.split(':')[0], 10);
                return taskHour === hour;
              });

              return (
                <div
                  key={hour}
                  className="flex items-start min-h-[80px] border-t border-neutral-100/90 group relative"
                >
                  {/* Hour Label */}
                  <div className="w-12 shrink-0 text-xs font-semibold text-neutral-400 pt-1 select-none">
                    {hourStr}
                  </div>

                  {/* Hour Content Area */}
                  <div className="flex-1 min-h-[76px] pl-3 py-1 flex flex-col gap-2 relative">
                    {tasksInHour.map((task) => {
                      const isSelected = selectedTaskId === task.id;
                      const isRunning = !!task.isRunning;

                      return (
                        <div
                          key={task.id}
                          onClick={() => onSelectTask(task.id)}
                          className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                            isRunning
                              ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-300 shadow-md animate-pulse'
                              : isSelected
                              ? 'bg-blue-50/60 border-blue-300 shadow-xs'
                              : task.completed
                              ? 'bg-neutral-50 border-neutral-200 opacity-60'
                              : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-2xs'
                          }`}
                        >
                          {/* Left: Complete Checkbox + Title */}
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleComplete(task);
                              }}
                              className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                                task.completed
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-neutral-300 hover:border-neutral-400 text-transparent'
                              }`}
                            >
                              <Check size={12} strokeWidth={3} className={task.completed ? 'block' : 'hidden'} />
                            </button>

                            <div className="min-w-0">
                              <span
                                className={`text-sm font-semibold truncate block ${
                                  task.completed
                                    ? 'line-through text-neutral-400'
                                    : 'text-neutral-800'
                                }`}
                              >
                                {task.title}
                              </span>
                              <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                                <span className="font-medium text-neutral-500">
                                  {task.startTime} ({task.durationMinutes || 45}分)
                                </span>
                                {task.actualMinutes ? (
                                  <span className="text-blue-600 bg-blue-50 px-1.5 rounded">
                                    実績: {task.actualMinutes}分
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          {/* Right: Timer Toggle & Duration Controls */}
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {/* Adjust Duration */}
                            <button
                              type="button"
                              onClick={(e) => handleAdjustDuration(task, 15, e)}
                              className="text-[10px] text-neutral-400 hover:text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-1.5 py-1 rounded-md transition-colors"
                              title="+15分延長"
                            >
                              +15m
                            </button>

                            {/* Play / Pause Timer */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleTimer(task, e)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                isRunning
                                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                              }`}
                              title={isRunning ? '一時停止' : '作業開始（計測）'}
                            >
                              {isRunning ? (
                                <Pause size={14} fill="currentColor" />
                              ) : (
                                <Play size={14} fill="currentColor" className="ml-0.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Quick Add at this hour when empty */}
                    {tasksInHour.length === 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          onAddTask({
                            title: '新しいタスク',
                            dueDate: today,
                            startTime: hourStr,
                            durationMinutes: 60,
                            priority: 'none',
                          });
                        }}
                        className="opacity-0 group-hover:opacity-100 text-xs text-neutral-400 hover:text-blue-600 hover:bg-blue-50/50 py-1.5 px-3 rounded-xl border border-dashed border-neutral-200 flex items-center gap-1.5 w-fit transition-all"
                      >
                        <Plus size={14} />
                        <span>{hourStr} にタスクを追加</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
