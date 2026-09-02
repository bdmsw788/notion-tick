import React, { useState } from 'react';
import { TaskList, Priority } from '../types';
import { getTodayString, getOffsetDateString } from '../lib/storage';
import {
  Plus,
  Calendar,
  Clock,
  Flag,
  Tag,
  Folder,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface QuickTaskInputProps {
  currentListId: string;
  lists: TaskList[];
  onAddTask: (taskData: {
    title: string;
    listId: string;
    dueDate?: string;
    dueTime?: string;
    priority: Priority;
    tags: string[];
  }) => void;
}

export const QuickTaskInput: React.FC<QuickTaskInputProps> = ({
  currentListId,
  lists,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [dueTime, setDueTime] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<Priority>('none');
  const [selectedListId, setSelectedListId] = useState<string>(
    lists.some((l) => l.id === currentListId) ? currentListId : 'inbox'
  );
  const [tags, setTags] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tagInputValue, setTagInputValue] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  // Parse natural language keywords as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);

    // Auto-detect priority shortcuts: !1, !high -> high, !2, !med -> medium
    if (val.includes('!1') || val.includes('!high') || val.includes('!高')) {
      setPriority('high');
    } else if (val.includes('!2') || val.includes('!med') || val.includes('!中')) {
      setPriority('medium');
    } else if (val.includes('!3') || val.includes('!low') || val.includes('!低')) {
      setPriority('low');
    }

    // Auto-detect date shortcuts
    if (val.includes('今日')) {
      setDueDate(getTodayString());
    } else if (val.includes('明日')) {
      setDueDate(getOffsetDateString(1));
    } else if (val.includes('明後日')) {
      setDueDate(getOffsetDateString(2));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Clean up title by removing trigger keywords
    let cleanTitle = title
      .replace(/!(1|2|3|high|med|low|高|中|低)/g, '')
      .replace(/#(今日|明日|明後日)/g, '')
      .trim();

    onAddTask({
      title: cleanTitle || title.trim(),
      listId: selectedListId,
      dueDate,
      dueTime,
      priority,
      tags,
    });

    // Reset input while keeping list context
    setTitle('');
    setDueDate(undefined);
    setDueTime(undefined);
    setPriority('none');
    setTags([]);
    setIsExpanded(false);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = tagInputValue.trim().replace(/^#/, '');
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInputValue('');
    setShowTagInput(false);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs transition-all focus-within:border-blue-500 focus-within:shadow-md">
      <form onSubmit={handleSubmit} className="p-2.5">
        <div className="flex items-center gap-2.5">
          <div className="text-neutral-400 pl-1">
            <Plus size={18} />
          </div>

          <input
            type="text"
            value={title}
            onChange={handleInputChange}
            onFocus={() => setIsExpanded(true)}
            placeholder="タスクを追加 (例: 明日 15:00 企画書作成 #仕事 !high)..."
            className="flex-1 text-sm bg-transparent text-neutral-800 placeholder:text-neutral-400 focus:outline-none py-1"
          />

          <button
            type="submit"
            disabled={!title.trim()}
            className={`p-1.5 rounded-lg transition-all ${
              title.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                : 'text-neutral-300 hover:text-neutral-400 bg-neutral-100 cursor-not-allowed'
            }`}
            title="追加 (Enter)"
          >
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Extended Control Bar */}
        {isExpanded && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-2 border-t border-neutral-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Due Date Presets */}
              <button
                type="button"
                onClick={() => setDueDate(dueDate === getTodayString() ? undefined : getTodayString())}
                className={`px-2 py-1 rounded-md flex items-center gap-1 border transition-colors ${
                  dueDate === getTodayString()
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Calendar size={12} />
                <span>今日</span>
              </button>

              <button
                type="button"
                onClick={() => setDueDate(dueDate === getOffsetDateString(1) ? undefined : getOffsetDateString(1))}
                className={`px-2 py-1 rounded-md flex items-center gap-1 border transition-colors ${
                  dueDate === getOffsetDateString(1)
                    ? 'bg-amber-50 border-amber-300 text-amber-700 font-medium'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>明日</span>
              </button>

              <input
                type="date"
                value={dueDate || ''}
                onChange={(e) => setDueDate(e.target.value || undefined)}
                className="bg-neutral-50 border border-neutral-200 rounded-md px-1.5 py-0.5 text-xs text-neutral-700 focus:outline-none"
              />

              <input
                type="time"
                value={dueTime || ''}
                onChange={(e) => setDueTime(e.target.value || undefined)}
                className="bg-neutral-50 border border-neutral-200 rounded-md px-1.5 py-0.5 text-xs text-neutral-700 focus:outline-none"
              />

              {/* Priority Picker */}
              <div className="flex items-center gap-1 bg-neutral-50 border border-neutral-200 rounded-md p-0.5">
                <Flag size={12} className="text-neutral-400 ml-1" />
                {(['high', 'medium', 'low', 'none'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-red-500 text-white font-semibold shadow-xs'
                          : p === 'medium'
                          ? 'bg-amber-500 text-white font-semibold shadow-xs'
                          : p === 'low'
                          ? 'bg-blue-500 text-white font-semibold shadow-xs'
                          : 'bg-neutral-300 text-neutral-800'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    {p === 'high' ? '高' : p === 'medium' ? '中' : p === 'low' ? '低' : '無'}
                  </button>
                ))}
              </div>

              {/* List Selector */}
              <div className="flex items-center gap-1 bg-neutral-50 border border-neutral-200 rounded-md px-1.5 py-0.5">
                <Folder size={12} className="text-neutral-400" />
                <select
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="bg-transparent text-neutral-700 text-xs focus:outline-none cursor-pointer"
                >
                  {lists.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.icon} {l.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tag Pill List */}
              {tags.map((t) => (
                <span
                  key={t}
                  className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[11px]"
                >
                  #{t}
                </span>
              ))}

              {showTagInput ? (
                <form onSubmit={handleAddTag} className="inline-flex items-center">
                  <input
                    type="text"
                    autoFocus
                    placeholder="タグ..."
                    value={tagInputValue}
                    onChange={(e) => setTagInputValue(e.target.value)}
                    onBlur={() => setShowTagInput(false)}
                    className="w-16 text-xs px-1.5 py-0.5 border border-blue-400 rounded focus:outline-none"
                  />
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowTagInput(true)}
                  className="text-neutral-400 hover:text-neutral-600 px-1.5 py-0.5 rounded hover:bg-neutral-100 flex items-center gap-1"
                >
                  <Tag size={12} />
                  <span>+タグ</span>
                </button>
              )}
            </div>

            <div className="text-[11px] text-neutral-400 flex items-center gap-1">
              <Sparkles size={12} className="text-blue-500" />
              <span>Enter で即時追加</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
