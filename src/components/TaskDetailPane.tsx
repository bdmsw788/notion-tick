import React, { useState } from 'react';
import { Task, TaskList, Priority, TaskStatus, Project } from '../types';
import { isTaskDone } from '../lib/storage';
import { SubtaskList } from './SubtaskList';
import { NotionBlockEditor } from './NotionBlockEditor';
import { notionService } from '../lib/notionService';
import {
  X,
  Calendar,
  Clock,
  Flag,
  Tag,
  Folder,
  Trash2,
  Share2,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  FolderKanban,
} from 'lucide-react';

interface TaskDetailPaneProps {
  task: Task | null;
  lists: TaskList[];
  projects?: Project[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onClose: () => void;
  onStartPomodoro: (task: Task) => void;
  onCompleteSound?: () => void;
}

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string; border: string }[] = [
  { value: 'high', label: '高 (High)', color: 'text-red-600 bg-red-50', border: 'border-red-200' },
  { value: 'medium', label: '中 (Med)', color: 'text-amber-600 bg-amber-50', border: 'border-amber-200' },
  { value: 'low', label: '低 (Low)', color: 'text-blue-600 bg-blue-50', border: 'border-blue-200' },
  { value: 'none', label: 'なし (None)', color: 'text-neutral-500 bg-neutral-100', border: 'border-neutral-200' },
];

const STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'Inbox', label: '📥 Inbox', color: 'bg-neutral-100 text-neutral-700' },
  { value: '次にやる', label: '⚡ 次にやる', color: 'bg-blue-100 text-blue-700' },
  { value: 'スケジュール', label: '📅 予定', color: 'bg-amber-100 text-amber-700' },
  { value: '連絡待ち', label: '⏳ 連絡待ち', color: 'bg-orange-100 text-orange-700' },
  { value: 'いつかやる', label: '💡 いつか', color: 'bg-teal-100 text-teal-700' },
  { value: '完了', label: '✅ 完了', color: 'bg-emerald-100 text-emerald-800' },
];

export const TaskDetailPane: React.FC<TaskDetailPaneProps> = ({
  task,
  lists,
  projects,
  onUpdateTask,
  onDeleteTask,
  onClose,
  onStartPomodoro,
  onCompleteSound,
}) => {
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  if (!task) {
    return null;
  }

  const currentList = lists.find((l) => l.id === task.listId) || lists[0];

  const handleToggleComplete = () => {
    const nextCompleted = !isTaskDone(task);
    if (nextCompleted && onCompleteSound) {
      onCompleteSound();
    }
    onUpdateTask({
      ...task,
      completed: nextCompleted,
      completedAt: nextCompleted ? new Date().toISOString() : undefined,
      status: nextCompleted ? '完了' : '次にやる',
      updatedAt: new Date().toISOString(),
    });
  };

  const handleTitleChange = (title: string) => {
    onUpdateTask({
      ...task,
      title,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTagInput.trim().replace(/^#/, '');
    if (tag && !task.tags.includes(tag)) {
      onUpdateTask({
        ...task,
        tags: [...task.tags, tag],
        updatedAt: new Date().toISOString(),
      });
    }
    setNewTagInput('');
    setShowTagInput(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTask({
      ...task,
      tags: task.tags.filter((t) => t !== tagToRemove),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCopyMarkdown = () => {
    const md = notionService.exportTaskAsMarkdown(task, currentList.name);
    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-neutral-200/80 shadow-sm overflow-hidden animate-fadeIn">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 bg-neutral-50/50">
        <div className="flex items-center gap-2">
          {/* Complete Checkbox */}
          <button
            type="button"
            onClick={handleToggleComplete}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              task.completed
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-white border border-neutral-300 text-neutral-700 hover:border-emerald-500 hover:text-emerald-600'
            }`}
          >
            <Check size={14} strokeWidth={task.completed ? 3 : 2} />
            <span>{task.completed ? '完了済み' : '完了にする'}</span>
          </button>

          {/* Quick Pomodoro Launch Button */}
          <button
            type="button"
            onClick={() => onStartPomodoro(task)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200/60"
            title="このタスクでポモドーロ集中タイマーを開始"
          >
            <Play size={12} className="fill-red-600" />
            <span>ポモドーロ集中</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            title="Markdownとしてコピー"
          >
            {copiedMarkdown ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
          </button>

          <button
            type="button"
            onClick={() => onDeleteTask(task.id)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="タスクを削除"
          >
            <Trash2 size={16} />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors ml-1"
            title="詳細を閉じる"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Title Editor */}
        <div>
          <textarea
            rows={2}
            value={task.title}
            placeholder="タスク名を入力..."
            onChange={(e) => handleTitleChange(e.target.value)}
            className={`w-full text-xl font-bold bg-transparent focus:outline-none resize-none leading-snug transition-colors ${
              task.completed ? 'line-through text-neutral-400' : 'text-neutral-900'
            }`}
          />
        </div>

        {/* Notion Style Properties Grid */}
        <div className="grid grid-cols-1 gap-2.5 py-3 border-y border-neutral-100 text-xs">
          {/* Project (PARA) Selector */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-neutral-500 w-28">
              <FolderKanban size={14} className="text-blue-500" />
              <span>プロジェクト</span>
            </span>
            <select
              value={task.projectId || ''}
              onChange={(e) => {
                const selectedPId = e.target.value;
                const pObj = projects?.find((p) => p.id === selectedPId);
                onUpdateTask({
                  ...task,
                  projectId: selectedPId || undefined,
                  projectName: pObj?.name || undefined,
                  listId: selectedPId || task.listId,
                  updatedAt: new Date().toISOString(),
                });
              }}
              className="flex-1 max-w-[220px] bg-neutral-50 hover:bg-neutral-100 text-neutral-800 rounded-md px-2 py-1 border border-neutral-200 focus:outline-none cursor-pointer text-xs font-semibold"
            >
              <option value="">📥 未設定 (Inbox)</option>
              {projects?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.icon || '🎪'} {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* List Selector */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-neutral-500 w-28">
              <Folder size={14} className="text-neutral-400" />
              <span>リスト</span>
            </span>
            <select
              value={task.listId}
              onChange={(e) =>
                onUpdateTask({ ...task, listId: e.target.value, updatedAt: new Date().toISOString() })
              }
              className="flex-1 max-w-[220px] bg-neutral-50 hover:bg-neutral-100 text-neutral-800 rounded-md px-2 py-1 border border-neutral-200 focus:outline-none cursor-pointer"
            >
              {lists.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.icon} {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date & Time */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-neutral-500 w-28">
              <Calendar size={14} className="text-neutral-400" />
              <span>期日</span>
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={task.dueDate || ''}
                onChange={(e) =>
                  onUpdateTask({ ...task, dueDate: e.target.value || undefined, updatedAt: new Date().toISOString() })
                }
                className="bg-neutral-50 hover:bg-neutral-100 text-neutral-800 rounded-md px-2 py-1 border border-neutral-200 text-xs focus:outline-none cursor-pointer"
              />
              <input
                type="time"
                value={task.dueTime || ''}
                onChange={(e) =>
                  onUpdateTask({ ...task, dueTime: e.target.value || undefined, updatedAt: new Date().toISOString() })
                }
                className="bg-neutral-50 hover:bg-neutral-100 text-neutral-800 rounded-md px-2 py-1 border border-neutral-200 text-xs focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-neutral-500 w-28">
              <Flag size={14} className="text-neutral-400" />
              <span>優先度</span>
            </span>
            <div className="flex items-center gap-1">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onUpdateTask({ ...task, priority: opt.value, updatedAt: new Date().toISOString() })
                  }
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-all ${
                    task.priority === opt.value
                      ? `${opt.color} ${opt.border} ring-1 ring-neutral-300 font-semibold shadow-xs`
                      : 'text-neutral-400 border-transparent hover:bg-neutral-50'
                  }`}
                >
                  {opt.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Status (Notion GTD / PARA aligned) */}
          <div className="flex items-start justify-between gap-2 pt-1">
            <span className="flex items-center gap-2 text-neutral-500 w-28 pt-1">
              <Sparkles size={14} className="text-neutral-400" />
              <span>ステータス</span>
            </span>
            <div className="flex-1 flex flex-wrap justify-end gap-1">
              {STATUS_OPTIONS.map((st) => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => {
                    const isDone = st.value === '完了';
                    onUpdateTask({
                      ...task,
                      status: st.value,
                      completed: isDone,
                      completedAt: isDone ? new Date().toISOString() : undefined,
                      updatedAt: new Date().toISOString(),
                    });
                  }}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                    task.status === st.value
                      ? `${st.color} border-current ring-1 ring-blue-300 shadow-xs scale-102`
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pomodoro Count */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-neutral-500 w-28">
              <Clock size={14} className="text-neutral-400" />
              <span>ポモドーロ</span>
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-700 font-medium">🍅 {task.completedPomodoros} 完了</span>
              <span className="text-neutral-300">/</span>
              <div className="flex items-center gap-1">
                <span className="text-neutral-400">目標:</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={task.estimatedPomodoros}
                  onChange={(e) =>
                    onUpdateTask({
                      ...task,
                      estimatedPomodoros: Math.max(0, parseInt(e.target.value, 10) || 0),
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  className="w-12 bg-neutral-50 border border-neutral-200 rounded px-1.5 py-0.5 text-center text-neutral-800 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-start justify-between pt-1">
            <span className="flex items-center gap-2 text-neutral-500 w-28 pt-1">
              <Tag size={14} className="text-neutral-400" />
              <span>タグ</span>
            </span>
            <div className="flex-1 flex flex-wrap items-center justify-end gap-1.5">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/60 px-2 py-0.5 rounded-full text-[11px] font-medium"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}

              {showTagInput ? (
                <form onSubmit={handleAddTag} className="inline-flex items-center">
                  <input
                    type="text"
                    autoFocus
                    placeholder="タグ名..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onBlur={() => setShowTagInput(false)}
                    className="w-20 text-xs px-2 py-0.5 border border-blue-400 rounded-md focus:outline-none"
                  />
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowTagInput(true)}
                  className="text-[11px] text-neutral-400 hover:text-neutral-600 bg-neutral-50 hover:bg-neutral-100 border border-dashed border-neutral-300 px-2 py-0.5 rounded-full transition-colors"
                >
                  + タグ
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Subtasks Section */}
        <div className="pt-2 border-b border-neutral-100 pb-5">
          <SubtaskList
            subtasks={task.subtasks}
            onChange={(subtasks) =>
              onUpdateTask({ ...task, subtasks, updatedAt: new Date().toISOString() })
            }
            onCompleteSound={onCompleteSound}
          />
        </div>

        {/* Notion Block Editor Document Section */}
        <div className="pt-2">
          <NotionBlockEditor
            blocks={task.notionBlocks}
            onChange={(blocks) =>
              onUpdateTask({ ...task, notionBlocks: blocks, updatedAt: new Date().toISOString() })
            }
          />
        </div>

        {/* Footer Meta Info */}
        <div className="pt-6 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
          <span>作成: {new Date(task.createdAt).toLocaleDateString('ja-JP')}</span>
          <span>更新: {new Date(task.updatedAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};
