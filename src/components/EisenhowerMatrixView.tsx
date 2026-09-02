import React from 'react';
import { Task, TaskList, Priority } from '../types';
import { TaskCard } from './TaskCard';
import { getTodayString } from '../lib/storage';
import { Flame, Target, Users, Coffee, Plus } from 'lucide-react';

interface EisenhowerMatrixViewProps {
  tasks: Task[];
  lists: TaskList[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskPriority: (taskId: string, priority: Priority) => void;
  onQuickAddTask: (quadrant: 1 | 2 | 3 | 4) => void;
}

export const EisenhowerMatrixView: React.FC<EisenhowerMatrixViewProps> = ({
  tasks,
  lists,
  selectedTaskId,
  onSelectTask,
  onToggleComplete,
  onDeleteTask,
  onUpdateTaskPriority,
  onQuickAddTask,
}) => {
  const today = getTodayString();

  // Categorize tasks into 4 quadrants
  // Q1: Urgent & Important (High Priority + Due soon/today)
  // Q2: Not Urgent & Important (High/Med Priority + Future/No Date)
  // Q3: Urgent & Not Important (Low/None Priority + Due soon/today)
  // Q4: Not Urgent & Not Important (Low/None Priority + No date/future)

  const activeTasks = tasks.filter((t) => !t.completed);

  const q1Tasks = activeTasks.filter(
    (t) => (t.priority === 'high' || t.priority === 'medium') && t.dueDate && t.dueDate <= today
  );

  const q2Tasks = activeTasks.filter(
    (t) => (t.priority === 'high' || t.priority === 'medium') && (!t.dueDate || t.dueDate > today)
  );

  const q3Tasks = activeTasks.filter(
    (t) => (t.priority === 'low' || t.priority === 'none') && t.dueDate && t.dueDate <= today
  );

  const q4Tasks = activeTasks.filter(
    (t) => (t.priority === 'low' || t.priority === 'none') && (!t.dueDate || t.dueDate > today)
  );

  const quadrants = [
    {
      id: 1,
      title: '第1象限: 今すぐやる (Do First)',
      subtitle: '緊急 かつ 重要 (Urgent & Important)',
      icon: <Flame size={16} className="text-red-500" />,
      headerBg: 'bg-red-50 text-red-800 border-red-200',
      badgeBg: 'bg-red-100 text-red-700',
      tasks: q1Tasks,
    },
    {
      id: 2,
      title: '第2象限: 計画して実行 (Schedule)',
      subtitle: '緊急ではない が 重要 (Not Urgent & Important)',
      icon: <Target size={16} className="text-blue-500" />,
      headerBg: 'bg-blue-50 text-blue-800 border-blue-200',
      badgeBg: 'bg-blue-100 text-blue-700',
      tasks: q2Tasks,
    },
    {
      id: 3,
      title: '第3象限: 任せる / 効率化 (Delegate)',
      subtitle: '緊急 だが 重要ではない (Urgent & Not Important)',
      icon: <Users size={16} className="text-amber-500" />,
      headerBg: 'bg-amber-50 text-amber-800 border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-700',
      tasks: q3Tasks,
    },
    {
      id: 4,
      title: '第4象限: 削除 / 削減 (Eliminate)',
      subtitle: '緊急でも 重要でもない (Not Urgent & Not Important)',
      icon: <Coffee size={16} className="text-neutral-500" />,
      headerBg: 'bg-neutral-100 text-neutral-800 border-neutral-200',
      badgeBg: 'bg-neutral-200 text-neutral-700',
      tasks: q4Tasks,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full pb-6 overflow-y-auto">
      {quadrants.map((q) => (
        <div
          key={q.id}
          className="flex flex-col bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-4 min-h-[280px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              {q.icon}
              <div>
                <h3 className="text-xs font-bold text-neutral-800">{q.title}</h3>
                <p className="text-[10px] text-neutral-400">{q.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${q.badgeBg}`}>
                {q.tasks.length}
              </span>
              <button
                type="button"
                onClick={() => onQuickAddTask(q.id as 1 | 2 | 3 | 4)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
                title="タスクを追加"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Task list inside Quadrant */}
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px] pr-1">
            {q.tasks.map((t) => {
              const taskList = lists.find((l) => l.id === t.listId);
              return (
                <TaskCard
                  key={t.id}
                  task={t}
                  list={taskList}
                  isSelected={selectedTaskId === t.id}
                  onSelect={() => onSelectTask(t.id)}
                  onToggleComplete={() => onToggleComplete(t)}
                  onDelete={() => onDeleteTask(t.id)}
                />
              );
            })}

            {q.tasks.length === 0 && (
              <div className="flex items-center justify-center h-28 text-xs text-neutral-300 border border-dashed border-neutral-200 rounded-xl">
                タスクがありません
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
