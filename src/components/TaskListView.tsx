import React, { useState } from 'react';
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
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  lists,
  selectedTaskId,
  onSelectTask,
  onToggleComplete,
  onDeleteTask,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    completed: true,
  });

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

  const renderSection = (
    key: string,
    title: string,
    sectionTasks: Task[],
    badgeColor: string,
    isAlert = false
  ) => {
    if (sectionTasks.length === 0) return null;
    const isCollapsed = collapsedSections[key];

    return (
      <div key={key} className="space-y-2 mb-6">
        <button
          type="button"
          onClick={() => toggleSection(key)}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors w-full group py-1"
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
        </button>

        {!isCollapsed && (
          <div className="space-y-2 pl-1">
            {sectionTasks.map((t) => {
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
        <p className="text-sm font-medium text-neutral-600">タスクがありません</p>
        <p className="text-xs text-neutral-400 mt-1 max-w-xs">
          上の入力バーから新しいタスクを追加するか、自然言語ショートカットをお試しください。
        </p>
      </div>
    );
  }

  if (totalActive === 0 && completedTasks.length > 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400 bg-emerald-50/40 rounded-2xl border border-emerald-100 p-6">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
            <CheckCircle2 size={24} />
          </div>
          <p className="text-sm font-semibold text-emerald-800">すべてのタスクが完了しました！</p>
          <p className="text-xs text-emerald-600 mt-0.5">素晴らしい一日を！新しいタスクがあればいつでも追加できます。</p>
        </div>

        {renderSection('completed', '完了済みタスク', completedTasks, 'bg-emerald-100 text-emerald-700')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {renderSection('overdue', '期限切れ', overdueTasks, 'bg-red-100 text-red-700', true)}
      {renderSection('today', '今日', todayTasks, 'bg-blue-100 text-blue-700')}
      {renderSection('tomorrow', '明日', tomorrowTasks, 'bg-amber-100 text-amber-700')}
      {renderSection('upcoming', '今後', upcomingTasks, 'bg-neutral-100 text-neutral-700')}
      {renderSection('noDate', '期日未設定', noDateTasks, 'bg-neutral-100 text-neutral-600')}
      {renderSection('completed', '完了済み', completedTasks, 'bg-emerald-100 text-emerald-700')}
    </div>
  );
};
