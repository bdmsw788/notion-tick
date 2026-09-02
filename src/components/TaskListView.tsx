import React, { useState, useRef } from 'react';
import { Task, TaskList } from '../types';
import { TaskCard } from './TaskCard';
import { getTodayString, getOffsetDateString } from '../lib/storage';
import { ChevronDown, ChevronRight, CheckCircle2, Inbox } from 'lucide-react';

interface TaskListViewProps {
  tasks: Task[];
  lists: TaskList[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTaskToSection?: (taskId: string, targetSection: 'today' | 'tomorrow' | 'nodate' | 'completed') => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  lists,
  selectedTaskId,
  onSelectTask,
  onToggleComplete,
  onDeleteTask,
  onMoveTaskToSection,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    completed: true,
  });

  // Touch & Pointer Drag and Drop for iPhone & Desktop
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredSection, setHoveredSection] = useState<'today' | 'tomorrow' | 'nodate' | 'completed' | null>(null);
  const dragPointerIdRef = useRef<number | null>(null);

  const activeTask = draggingTaskId ? tasks.find((t) => t.id === draggingTaskId) : null;

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const today = getTodayString();
  const tomorrow = getOffsetDateString(1);

  // Group tasks into logical sections
  const overdueTasks: Task[] = [];
  const todayTasks: Task[] = [];
  const tomorrowTasks: Task[] = [];
  const upcomingTasks: Task[] = [];
  const noDateTasks: Task[] = [];
  const completedTasks: Task[] = [];

  tasks.forEach((t) => {
    if (t.completed) {
      completedTasks.push(t);
    } else if (t.dueDate) {
      if (t.dueDate < today) {
        overdueTasks.push(t);
      } else if (t.dueDate === today) {
        todayTasks.push(t);
      } else if (t.dueDate === tomorrow) {
        tomorrowTasks.push(t);
      } else {
        upcomingTasks.push(t);
      }
    } else {
      noDateTasks.push(t);
    }
  });

  // Touch drag handlers
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

    // Detect section under finger position
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const secEl = el?.closest('[data-section-id]');
    if (secEl) {
      const secId = secEl.getAttribute('data-section-id') as 'today' | 'tomorrow' | 'nodate' | 'completed';
      if (secId && ['today', 'tomorrow', 'nodate', 'completed'].includes(secId)) {
        setHoveredSection(secId);
        return;
      }
    }
    setHoveredSection(null);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingTaskId) return;

    const el = document.elementFromPoint(e.clientX, e.clientY);
    const secEl = el?.closest('[data-section-id]');
    const targetSec = secEl ? (secEl.getAttribute('data-section-id') as 'today' | 'tomorrow' | 'nodate' | 'completed') : hoveredSection;

    if (targetSec && onMoveTaskToSection) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(25);
      }
      onMoveTaskToSection(draggingTaskId, targetSec);
    }

    try {
      if (dragPointerIdRef.current !== null) {
        (e.currentTarget as HTMLElement).releasePointerCapture(dragPointerIdRef.current);
      }
    } catch {
      // ignore
    }

    setDraggingTaskId(null);
    setHoveredSection(null);
    dragPointerIdRef.current = null;
  };

  const renderSection = (
    key: string,
    title: string,
    sectionTasks: Task[],
    badgeColor: string,
    sectionDropId?: 'today' | 'tomorrow' | 'nodate' | 'completed',
    isAlert = false
  ) => {
    if (sectionTasks.length === 0 && !sectionDropId) return null;
    const isCollapsed = collapsedSections[key];
    const isHovered = hoveredSection === sectionDropId && draggingTaskId !== null;

    return (
      <div
        key={key}
        data-section-id={sectionDropId}
        className={`space-y-2 mb-5 rounded-2xl p-2 transition-all duration-200 ${
          isHovered
            ? 'bg-blue-50/70 border-2 border-dashed border-blue-400 ring-2 ring-blue-200/50 shadow-sm'
            : 'border border-transparent'
        }`}
      >
        <button
          type="button"
          onClick={() => toggleSection(key)}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors w-full group py-1 select-none"
        >
          {isCollapsed ? (
            <ChevronRight size={14} className="text-neutral-400 group-hover:text-neutral-600" />
          ) : (
            <ChevronDown size={14} className="text-neutral-400 group-hover:text-neutral-600" />
          )}
          <span className={isAlert ? 'text-red-600 font-bold' : 'text-neutral-700'}>{title}</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[11px] font-medium ${badgeColor}`}
          >
            {sectionTasks.length}
          </span>
          {isHovered && (
            <span className="text-[11px] font-bold text-blue-600 animate-pulse ml-auto">
              ここに離して移動
            </span>
          )}
        </button>

        {!isCollapsed && (
          <div className="space-y-2 pl-1">
            {sectionTasks.map((t) => {
              const taskList = lists.find((l) => l.id === t.listId);
              const isCurrentlyDragging = draggingTaskId === t.id;

              return (
                <TaskCard
                  key={t.id}
                  task={t}
                  list={taskList}
                  isSelected={selectedTaskId === t.id}
                  isDragging={isCurrentlyDragging}
                  onSelect={() => onSelectTask(t.id)}
                  onToggleComplete={() => onToggleComplete(t)}
                  onDelete={() => onDeleteTask(t.id)}
                  onPointerDownDrag={(e) => handlePointerDownDrag(t.id, e)}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const totalActive = tasks.filter((t) => !t.completed).length;

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-neutral-400">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3 shadow-inner">
          <Inbox size={28} />
        </div>
        <p className="text-base font-medium text-neutral-700">タスクがありません</p>
        <p className="text-xs text-neutral-400 mt-1">
          上の入力バーからタスクを追加するか、Notionと同期してください
        </p>
      </div>
    );
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="pb-16 select-none"
    >
      {/* 1. 期限超過 */}
      {renderSection(
        'overdue',
        '期限切れ',
        overdueTasks,
        'bg-red-100 text-red-700',
        undefined,
        true
      )}

      {/* 2. 今日 */}
      {renderSection(
        'today',
        '今日',
        todayTasks,
        'bg-blue-100 text-blue-700',
        'today'
      )}

      {/* 3. 明日 */}
      {renderSection(
        'tomorrow',
        '明日',
        tomorrowTasks,
        'bg-amber-100 text-amber-700',
        'tomorrow'
      )}

      {/* 4. 今後 */}
      {renderSection(
        'upcoming',
        '今後',
        upcomingTasks,
        'bg-neutral-100 text-neutral-600'
      )}

      {/* 5. 期限なし */}
      {renderSection(
        'nodate',
        '日付なし',
        noDateTasks,
        'bg-neutral-100 text-neutral-600',
        'nodate'
      )}

      {/* 6. 完了済み */}
      {renderSection(
        'completed',
        '完了済み',
        completedTasks,
        'bg-emerald-100 text-emerald-700',
        'completed'
      )}

      {/* Floating Ghost Card during iPhone / Mobile Touch Drag */}
      {draggingTaskId && activeTask && (
        <div
          style={{
            position: 'fixed',
            left: `${dragPos.x}px`,
            top: `${dragPos.y}px`,
            transform: 'translate(-50%, -50%) rotate(2.5deg) scale(1.04)',
            pointerEvents: 'none',
            zIndex: 9999,
            width: '280px',
          }}
          className="shadow-2xl rounded-2xl bg-white border-2 border-blue-500/90 ring-4 ring-blue-400/20 p-3 opacity-95 transition-none"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-semibold text-neutral-900 truncate">
              {activeTask.title}
            </span>
          </div>
          {hoveredSection && (
            <div className="mt-2 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
              ↳ {hoveredSection === 'today' ? '今日' : hoveredSection === 'tomorrow' ? '明日' : hoveredSection === 'nodate' ? '日付なし' : '完了'} へ移動
            </div>
          )}
        </div>
      )}
    </div>
  );
};
