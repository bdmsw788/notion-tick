import React from 'react';
import { Task, TaskList } from '../types';
import { formatDisplayDate, getTodayString } from '../lib/storage';
import {
  Calendar,
  Check,
  CheckSquare,
  FileText,
  Clock,
  AlertCircle,
  Flag,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  list?: TaskList;
  isSelected: boolean;
  isDragging?: boolean;
  onSelect: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
  onPointerDownDrag?: (e: React.PointerEvent) => void;
}

const PRIORITY_COLORS = {
  high: { border: 'border-l-red-500', dot: 'bg-red-500', text: 'text-red-600', ring: 'ring-red-400' },
  medium: { border: 'border-l-amber-500', dot: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-400' },
  low: { border: 'border-l-blue-500', dot: 'bg-blue-500', text: 'text-blue-600', ring: 'ring-blue-400' },
  none: { border: 'border-l-transparent', dot: 'bg-neutral-300', text: 'text-neutral-400', ring: 'ring-neutral-300' },
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  list,
  isSelected,
  isDragging = false,
  onSelect,
  onToggleComplete,
  onDelete,
  onPointerDownDrag,
}) => {
  const today = getTodayString();
  const isOverdue = !task.completed && task.dueDate && task.dueDate < today;
  const isToday = task.dueDate === today;

  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const hasNotionBlocks = task.notionBlocks.some((b) => b.content.trim().length > 0);

  const priorityStyle = PRIORITY_COLORS[task.priority];

  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl border transition-all cursor-pointer select-none ${
        priorityStyle.border
      } border-l-4 ${
        isDragging
          ? 'opacity-40 border-dashed border-blue-400 scale-[0.98]'
          : isSelected
          ? 'bg-blue-50/70 border-blue-200 shadow-sm ring-1 ring-blue-300/60'
          : task.completed
          ? 'bg-neutral-50/50 border-neutral-200/60 opacity-60 hover:opacity-90'
          : 'bg-white border-neutral-200/70 hover:border-neutral-300 hover:shadow-xs'
      }`}
    >
      {/* Drag Handle for iPhone / Touch & Desktop */}
      {onPointerDownDrag && (
        <div
          onPointerDown={onPointerDownDrag}
          className="touch-none flex items-center justify-center p-1 -ml-1 text-neutral-300 hover:text-neutral-600 active:text-blue-600 cursor-grab active:cursor-grabbing transition-colors"
          title="長押し・ドラッグで移動"
        >
          <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
            <circle cx="3" cy="3" r="1.5" />
            <circle cx="9" cy="3" r="1.5" />
            <circle cx="3" cy="8" r="1.5" />
            <circle cx="9" cy="8" r="1.5" />
            <circle cx="3" cy="13" r="1.5" />
            <circle cx="9" cy="13" r="1.5" />
          </svg>
        </div>
      )}
      {/* Checkbox */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete();
        }}
        className={`mt-0.5 w-4.5 h-4.5 rounded-md flex items-center justify-center border transition-all duration-200 ${
          task.completed
            ? 'bg-emerald-500 border-emerald-500 text-white scale-100'
            : task.priority === 'high'
            ? 'border-red-400 hover:bg-red-50 text-transparent'
            : task.priority === 'medium'
            ? 'border-amber-400 hover:bg-amber-50 text-transparent'
            : task.priority === 'low'
            ? 'border-blue-400 hover:bg-blue-50 text-transparent'
            : 'border-neutral-300 hover:border-neutral-400 text-transparent'
        }`}
        title={task.completed ? '未完了に戻す' : '完了にする'}
      >
        <Check size={12} strokeWidth={3} className={task.completed ? 'block' : 'hidden group-hover:block text-neutral-400'} />
      </button>

      {/* Main Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium leading-snug transition-colors ${
              task.completed ? 'line-through text-neutral-400' : 'text-neutral-800'
            }`}
          >
            {task.title || '無題のタスク'}
          </span>
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-neutral-500">
          {/* Status Badge */}
          {task.status && task.status !== 'completed' && task.status !== 'not_started' && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded font-bold text-[10px] border ${
                task.status === 'Inbox'
                  ? 'bg-neutral-100 text-neutral-600 border-neutral-200'
                  : task.status === '次にやる'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : task.status === 'スケジュール'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : task.status === '連絡待ち'
                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                  : task.status === 'いつかやる'
                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200'
              }`}
            >
              {task.status}
            </span>
          )}

          {/* Project (PARA) Badge */}
          {task.projectName && (
            <span
              className="inline-flex items-center gap-1 text-blue-700 bg-blue-50/80 border border-blue-200 px-1.5 py-0.5 rounded text-[10px] font-bold truncate max-w-[160px]"
              title={`プロジェクト: ${task.projectName}`}
            >
              <span>📁</span>
              <span className="truncate">{task.projectName.replace(/^【[PAR]】/, '')}</span>
            </span>
          )}

          {/* Start Time Badge */}
          {task.startTime && (
            <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono text-[10px]">
              <Clock size={11} />
              <span>{task.startTime}</span>
            </span>
          )}

          {/* Due Date Badge */}
          {task.dueDate && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-medium ${
                isOverdue
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : isToday
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {isOverdue && <AlertCircle size={11} />}
              <Calendar size={11} />
              <span>{formatDisplayDate(task.dueDate, task.dueTime)}</span>
            </span>
          )}

          {/* Subtask progress */}
          {totalSubtasks > 0 && (
            <span className="inline-flex items-center gap-1 text-neutral-400 bg-neutral-100/70 px-1.5 py-0.5 rounded">
              <CheckSquare size={11} />
              <span>
                {completedSubtasks}/{totalSubtasks}
              </span>
            </span>
          )}

          {/* Notion Synced Badge */}
          {task.notionPageId && (
            <span
              className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 border border-purple-200/70 px-1.5 py-0.5 rounded font-medium text-[10px]"
              title="Notionデータベースと同期中"
            >
              <span>⚡ Notion</span>
            </span>
          )}

          {/* Notion Page/Block indicator */}
          {hasNotionBlocks && !task.notionPageId && (
            <span
              className="inline-flex items-center gap-1 text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded"
              title="Notionドキュメントあり"
            >
              <FileText size={11} />
              <span>Note</span>
            </span>
          )}

          {/* Pomodoro badge */}
          {(task.estimatedPomodoros > 0 || task.completedPomodoros > 0) && (
            <span className="inline-flex items-center gap-1 text-red-600 bg-red-50/80 px-1.5 py-0.5 rounded">
              <span>🍅</span>
              <span>
                {task.completedPomodoros}/{task.estimatedPomodoros || 1}
              </span>
            </span>
          )}

          {/* Tags */}
          {task.tags.map((tag) => (
            <span key={tag} className="text-neutral-400 hover:text-neutral-600">
              #{tag}
            </span>
          ))}

          {/* List badge if in Smart List View */}
          {list && (
            <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400 ml-auto">
              <span>{list.icon}</span>
              <span>{list.name}</span>
            </span>
          )}
        </div>
      </div>

      {/* Delete on Hover */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 text-neutral-300 hover:text-red-500 p-1 rounded-md transition-opacity"
        title="削除"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};
