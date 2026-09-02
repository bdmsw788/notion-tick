import React, { useState, useRef } from 'react';
import { Task, TaskList, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { Plus, CheckCircle, Clock, Circle } from 'lucide-react';

interface KanbanBoardViewProps {
  tasks: Task[];
  lists: TaskList[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onQuickAddTask: (status: TaskStatus) => void;
}

const COLUMNS: { id: TaskStatus; title: string; icon: React.ReactNode; color: string; bg: string; activeBorder: string }[] = [
  {
    id: 'not_started',
    title: '未着手 (To Do)',
    icon: <Circle size={14} className="text-neutral-400" />,
    color: 'text-neutral-700',
    bg: 'bg-neutral-50/80',
    activeBorder: 'border-neutral-400 ring-2 ring-neutral-300',
  },
  {
    id: 'in_progress',
    title: '進行中 (In Progress)',
    icon: <Clock size={14} className="text-blue-500" />,
    color: 'text-blue-700',
    bg: 'bg-blue-50/40',
    activeBorder: 'border-blue-500 ring-2 ring-blue-300',
  },
  {
    id: 'completed',
    title: '完了 (Done)',
    icon: <CheckCircle size={14} className="text-emerald-500" />,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50/30',
    activeBorder: 'border-emerald-500 ring-2 ring-emerald-300',
  },
];

export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({
  tasks,
  lists,
  selectedTaskId,
  onSelectTask,
  onToggleComplete,
  onDeleteTask,
  onUpdateTaskStatus,
  onQuickAddTask,
}) => {
  // Touch & Pointer Drag and Drop State for iPhone / Mobile & Desktop
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredCol, setHoveredCol] = useState<TaskStatus | null>(null);
  const dragPointerIdRef = useRef<number | null>(null);

  const activeTask = draggingTaskId ? tasks.find((t) => t.id === draggingTaskId) : null;

  // Start touch or mouse drag
  const handlePointerDownDrag = (taskId: string, e: React.PointerEvent) => {
    // Only primary touch/click
    if (e.button !== 0) return;
    
    // Haptic feedback for iPhone
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

    // Detect column under touch position
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const colEl = el?.closest('[data-column-id]');
    if (colEl) {
      const colId = colEl.getAttribute('data-column-id') as TaskStatus;
      if (colId && (colId === 'not_started' || colId === 'in_progress' || colId === 'completed')) {
        setHoveredCol(colId);
        return;
      }
    }
    setHoveredCol(null);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingTaskId) return;

    // Detect column under release position
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const colEl = el?.closest('[data-column-id]');
    const targetCol = colEl ? (colEl.getAttribute('data-column-id') as TaskStatus) : hoveredCol;

    if (targetCol && (targetCol === 'not_started' || targetCol === 'in_progress' || targetCol === 'completed')) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(25);
      }
      onUpdateTaskStatus(draggingTaskId, targetCol);
    }

    try {
      if (dragPointerIdRef.current !== null) {
        (e.currentTarget as HTMLElement).releasePointerCapture(dragPointerIdRef.current);
      }
    } catch {
      // ignore
    }

    setDraggingTaskId(null);
    setHoveredCol(null);
    dragPointerIdRef.current = null;
  };

  // HTML5 Drag fallback for Desktop browsers
  const handleHtml5DragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleHtml5Drop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onUpdateTaskStatus(taskId, status);
    }
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 h-full items-start overflow-x-auto select-none touch-none-area"
    >
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => {
          if (col.id === 'completed') return t.completed || t.status === 'completed';
          if (t.completed) return false;
          return (t.status || 'not_started') === col.id;
        });

        const isColHovered = hoveredCol === col.id && draggingTaskId !== null;

        return (
          <div
            key={col.id}
            data-column-id={col.id}
            onDragOver={handleHtml5DragOver}
            onDrop={(e) => handleHtml5Drop(e, col.id)}
            className={`flex flex-col rounded-2xl border transition-all duration-200 ${col.bg} p-3.5 min-h-[480px] shadow-xs ${
              isColHovered
                ? `${col.activeBorder} scale-[1.01] bg-blue-50/70 shadow-md`
                : 'border-neutral-200/80'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-200/60">
              <div className="flex items-center gap-2">
                {col.icon}
                <span className={`text-xs font-bold ${col.color}`}>{col.title}</span>
                <span className="text-[11px] font-semibold text-neutral-400 bg-white px-2 py-0.5 rounded-full shadow-2xs border border-neutral-200">
                  {colTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onQuickAddTask(col.id)}
                className="text-neutral-400 hover:text-neutral-700 hover:bg-white p-1 rounded-lg transition-colors"
                title="タスクを追加"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Tasks Container */}
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-0.5">
              {colTasks.map((t) => {
                const taskList = lists.find((l) => l.id === t.listId);
                const isCurrentlyDragging = draggingTaskId === t.id;

                return (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', t.id)}
                    className="transition-transform"
                  >
                    <TaskCard
                      task={t}
                      list={taskList}
                      isSelected={selectedTaskId === t.id}
                      isDragging={isCurrentlyDragging}
                      onSelect={() => onSelectTask(t.id)}
                      onToggleComplete={() => onToggleComplete(t)}
                      onDelete={() => onDeleteTask(t.id)}
                      onPointerDownDrag={(e) => handlePointerDownDrag(t.id, e)}
                    />
                  </div>
                );
              })}

              {colTasks.length === 0 && (
                <div className={`flex flex-col items-center justify-center py-12 text-xs border border-dashed rounded-xl transition-colors ${
                  isColHovered ? 'border-blue-400 text-blue-600 bg-blue-50/50 font-medium' : 'border-neutral-200 text-neutral-400'
                }`}>
                  <span>{isColHovered ? 'ここに離して移動' : 'タスクをここにドラッグ'}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

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
          {hoveredCol && (
            <div className="mt-2 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
              ↳ {hoveredCol === 'not_started' ? '未着手' : hoveredCol === 'in_progress' ? '進行中' : '完了'} へ移動
            </div>
          )}
        </div>
      )}
    </div>
  );
};
