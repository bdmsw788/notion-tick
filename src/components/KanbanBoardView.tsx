import React from 'react';
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

const COLUMNS: { id: TaskStatus; title: string; icon: React.ReactNode; color: string; bg: string }[] = [
  {
    id: 'not_started',
    title: '未着手 (To Do)',
    icon: <Circle size={14} className="text-neutral-400" />,
    color: 'text-neutral-700',
    bg: 'bg-neutral-50/80',
  },
  {
    id: 'in_progress',
    title: '進行中 (In Progress)',
    icon: <Clock size={14} className="text-blue-500" />,
    color: 'text-blue-700',
    bg: 'bg-blue-50/40',
  },
  {
    id: 'completed',
    title: '完了 (Done)',
    icon: <CheckCircle size={14} className="text-emerald-500" />,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50/30',
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
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onUpdateTaskStatus(taskId, status);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 h-full items-start overflow-x-auto">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => {
          if (col.id === 'completed') return t.completed || t.status === 'completed';
          if (t.completed) return false;
          return (t.status || 'not_started') === col.id;
        });

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col rounded-2xl border border-neutral-200/80 ${col.bg} p-3.5 min-h-[480px] shadow-xs`}
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
                return (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', t.id)}
                    className="cursor-grab active:cursor-grabbing transition-transform"
                  >
                    <TaskCard
                      task={t}
                      list={taskList}
                      isSelected={selectedTaskId === t.id}
                      onSelect={() => onSelectTask(t.id)}
                      onToggleComplete={() => onToggleComplete(t)}
                      onDelete={() => onDeleteTask(t.id)}
                    />
                  </div>
                );
              })}

              {colTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-neutral-300 text-xs border border-dashed border-neutral-200 rounded-xl">
                  <span>タスクをここにドラッグ</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
