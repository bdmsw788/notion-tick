import React, { useState } from 'react';
import { Subtask } from '../types';
import { Check, Plus, Trash2, GripVertical } from 'lucide-react';

interface SubtaskListProps {
  subtasks: Subtask[];
  onChange: (subtasks: Subtask[]) => void;
  onCompleteSound?: () => void;
}

export const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks,
  onChange,
  onCompleteSound,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const handleToggle = (id: string) => {
    const updated = subtasks.map((st) => {
      if (st.id === id) {
        const nextCompleted = !st.completed;
        if (nextCompleted && onCompleteSound) {
          onCompleteSound();
        }
        return { ...st, completed: nextCompleted };
      }
      return st;
    });
    onChange(updated);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newSubtask: Subtask = {
      id: `sub-${Date.now()}`,
      title: newTitle.trim(),
      completed: false,
    };
    onChange([...subtasks, newSubtask]);
    setNewTitle('');
  };

  const handleDelete = (id: string) => {
    onChange(subtasks.filter((st) => st.id !== id));
  };

  const handleTitleChange = (id: string, title: string) => {
    onChange(
      subtasks.map((st) => (st.id === id ? { ...st, title } : st))
    );
  };

  const completedCount = subtasks.filter((st) => st.completed).length;
  const totalCount = subtasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Header & Progress */}
      <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="font-semibold text-neutral-700">サブタスク</span>
          {totalCount > 0 && (
            <span className="bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded-full text-[11px]">
              {completedCount}/{totalCount}
            </span>
          )}
        </span>
        {totalCount > 0 && (
          <span className="text-[11px] text-neutral-400">{progressPercent}% 完了</span>
        )}
      </div>

      {totalCount > 0 && (
        <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Subtask items */}
      <div className="space-y-1.5">
        {subtasks.map((st) => (
          <div
            key={st.id}
            className="group flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-colors"
          >
            <GripVertical size={14} className="text-neutral-300 opacity-0 group-hover:opacity-100 cursor-grab transition-opacity" />

            <button
              type="button"
              onClick={() => handleToggle(st.id)}
              className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                st.completed
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-neutral-300 hover:border-neutral-400 bg-white'
              }`}
            >
              {st.completed && <Check size={11} strokeWidth={3} />}
            </button>

            <input
              type="text"
              value={st.title}
              onChange={(e) => handleTitleChange(st.id, e.target.value)}
              className={`flex-1 bg-transparent text-sm focus:outline-none ${
                st.completed ? 'line-through text-neutral-400' : 'text-neutral-800'
              }`}
            />

            <button
              type="button"
              onClick={() => handleDelete(st.id)}
              className="text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
              title="削除"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Subtask Input */}
      <form onSubmit={handleAdd} className="flex items-center gap-2 pt-1">
        <Plus size={15} className="text-neutral-400 ml-1" />
        <input
          type="text"
          placeholder="サブタスクを追加 (Enterで確定)..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 bg-transparent text-xs text-neutral-700 placeholder:text-neutral-400 focus:outline-none py-1 px-1 border-b border-transparent focus:border-blue-400 transition-colors"
        />
      </form>
    </div>
  );
};
