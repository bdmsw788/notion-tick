import React, { useState } from 'react';
import { Task, TaskList } from '../types';
import { getTodayString } from '../lib/storage';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Calendar as CalendarIcon,
} from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  lists: TaskList[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onAddTaskOnDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  lists,
  selectedTaskId,
  onSelectTask,
  onToggleComplete,
  onAddTaskOnDate,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const todayStr = getTodayString();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Build grid days
  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({ day, dateStr, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ day: d, dateStr, isCurrentMonth: true });
  }

  // Next month leading days to complete 35 or 42 cells
  const remaining = 35 - calendarCells.length;
  const trailingCount = remaining < 0 ? 42 - calendarCells.length : remaining;
  for (let d = 1; d <= trailingCount; d++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ day: d, dateStr, isCurrentMonth: false });
  }

  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-neutral-100 bg-neutral-50/50">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-neutral-800">
            {year}年 {month + 1}月
          </span>
          <button
            type="button"
            onClick={handleToday}
            className="px-2.5 py-1 text-xs font-semibold bg-white border border-neutral-200 rounded-lg hover:bg-neutral-100 text-neutral-700 transition-colors shadow-2xs"
          >
            今日
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors"
            title="前月"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 transition-colors"
            title="翌月"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday Row */}
      <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50/80 text-center text-xs font-semibold text-neutral-500 py-2">
        {weekdays.map((wd, i) => (
          <div key={wd} className={i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : ''}>
            {wd}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 flex-1 divide-x divide-y divide-neutral-100 bg-neutral-50/20">
        {calendarCells.map((cell) => {
          const isToday = cell.dateStr === todayStr;
          const dayTasks = tasks.filter((t) => t.dueDate === cell.dateStr);

          return (
            <div
              key={cell.dateStr}
              onClick={() => onAddTaskOnDate(cell.dateStr)}
              className={`min-h-[100px] p-2 flex flex-col transition-colors group cursor-pointer hover:bg-neutral-50/80 ${
                !cell.isCurrentMonth ? 'bg-neutral-50/40 text-neutral-300' : 'bg-white'
              }`}
            >
              {/* Date Header */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isToday
                      ? 'bg-blue-600 text-white shadow-xs'
                      : cell.isCurrentMonth
                      ? 'text-neutral-700'
                      : 'text-neutral-300'
                  }`}
                >
                  {cell.day}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddTaskOnDate(cell.dateStr);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-blue-600 p-0.5 rounded transition-opacity"
                  title="この日にタスク追加"
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Task Chips */}
              <div className="space-y-1 flex-1 overflow-y-auto max-h-[85px] pr-0.5">
                {dayTasks.map((t) => {
                  const isSelected = selectedTaskId === t.id;
                  const taskList = lists.find((l) => l.id === t.listId);

                  return (
                    <div
                      key={t.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTask(t.id);
                      }}
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all cursor-pointer truncate ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : t.completed
                          ? 'bg-neutral-100 text-neutral-400 border-neutral-200 line-through'
                          : t.priority === 'high'
                          ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          : t.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleComplete(t);
                        }}
                        className={`w-3 h-3 rounded flex items-center justify-center border ${
                          t.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-400'
                        }`}
                      >
                        {t.completed && <Check size={8} strokeWidth={3} />}
                      </button>
                      <span className="truncate flex-1">{t.title}</span>
                      {t.dueTime && <span className="text-[9px] opacity-75">{t.dueTime}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
