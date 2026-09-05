import React, { useState, useMemo } from 'react';
import { Project, Task, TaskList, TaskStatus } from '../types';
import { isTaskDone, STATUS_CONFIG } from '../lib/storage';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Calendar,
  Plus,
  Search,
  ChevronRight,
  ArrowLeft,
  Filter,
  Check,
  MoreVertical,
  Layers,
  Sparkles,
  Inbox,
  AlertCircle,
  Tag,
  Target,
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  lists: TaskList[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onToggleComplete: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onAddTask: (taskData: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddProject?: (projectData: Partial<Project>) => void;
  onUpdateProject?: (project: Project) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  tasks,
  lists,
  selectedTaskId,
  onSelectTask,
  onToggleComplete,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
  onAddProject,
  onUpdateProject,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'プロジェクト' | 'エリア' | 'リソース' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState('プロジェクト');
  const [newProjectTargetDate, setNewProjectTargetDate] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('Inbox');

  // Compute tasks per project & progress
  const projectStats = useMemo(() => {
    const map: Record<string, { total: number; completed: number; tasks: Task[] }> = {};
    projects.forEach((p) => {
      map[p.id] = { total: 0, completed: 0, tasks: [] };
    });

    tasks.forEach((t) => {
      if (t.isDeleted) return;
      if (t.projectId && map[t.projectId]) {
        map[t.projectId].total += 1;
        if (isTaskDone(t)) {
          map[t.projectId].completed += 1;
        }
        map[t.projectId].tasks.push(t);
      }
    });

    return map;
  }, [projects, tasks]);

  // Tasks in Inbox (not linked to any project)
  const unlinkedInboxTasks = useMemo(() => {
    return tasks.filter((t) => !t.isDeleted && !t.projectId && !isTaskDone(t));
  }, [tasks]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Search
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Category filter
      if (filterCategory === 'all') return true;
      if (filterCategory === 'completed') return p.status === '完了';
      if (filterCategory === 'プロジェクト') return p.name.startsWith('【P】') || p.category === 'プロジェクト';
      if (filterCategory === 'エリア') return p.name.startsWith('【A】') || p.category === 'エリア';
      if (filterCategory === 'リソース') return p.name.startsWith('【R】') || p.category === 'リソース';
      return true;
    });
  }, [projects, searchQuery, filterCategory]);

  const activeProject = projects.find((p) => p.id === selectedProjectId);
  const activeProjectTasks = activeProject ? projectStats[activeProject.id]?.tasks || [] : [];

  // Group active project's tasks by status
  const projectTasksByStatus = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {
      'Inbox': [],
      '次にやる': [],
      'スケジュール': [],
      'プロジェクト': [],
      '連絡待ち': [],
      'いつかやる': [],
      '完了': [],
      'not_started': [],
      'in_progress': [],
      'completed': [],
      'archived': [],
    };

    activeProjectTasks.forEach((t) => {
      const st = t.status || 'Inbox';
      if (groups[st]) {
        groups[st].push(t);
      } else {
        groups['Inbox'].push(t);
      }
    });

    return groups;
  }, [activeProjectTasks]);

  // Handle Quick Add Task in Project
  const handleCreateTaskInProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activeProject) return;

    onAddTask({
      title: newTaskTitle.trim(),
      projectId: activeProject.id,
      projectName: activeProject.name,
      status: newTaskStatus, // 'Inbox' or selected
      listId: activeProject.id,
      priority: 'none',
      tags: [activeProject.name.replace(/^【[PAR]】/, '')],
    });

    setNewTaskTitle('');
  };

  // Handle Create New Project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const prefix = newProjectCategory === 'プロジェクト' ? '【P】' : newProjectCategory === 'エリア' ? '【A】' : '【R】';
    const fullName = newProjectName.startsWith('【') ? newProjectName : `${prefix}${newProjectName}`;

    if (onAddProject) {
      onAddProject({
        name: fullName,
        category: newProjectCategory,
        status: 'アクティブ',
        targetDate: newProjectTargetDate || null,
        color: newProjectCategory === 'プロジェクト' ? '#3B82F6' : '#10B981',
      });
    }

    setNewProjectName('');
    setNewProjectTargetDate('');
    setIsCreatingProject(false);
  };

  // 1. DETAIL VIEW: Viewing tasks of a single project
  if (activeProject) {
    const stats = projectStats[activeProject.id] || { total: 0, completed: 0, tasks: [] };
    const progressPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    return (
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm max-w-5xl mx-auto overflow-hidden pb-24 animate-fadeIn">
        {/* Detail Top Navigation */}
        <div className="p-4 md:p-6 pb-4 border-b border-neutral-200 flex items-center justify-between gap-3 bg-neutral-50/50">
          <button
            type="button"
            onClick={() => setSelectedProjectId(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-xs font-bold text-neutral-700 shadow-2xs active:scale-95 transition-all"
          >
            <ArrowLeft size={15} />
            <span>プロジェクト一覧に戻る</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                activeProject.status === '完了'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {activeProject.status}
            </span>
          </div>
        </div>

        {/* Project Header Banner */}
        <div className="p-6 border-b border-neutral-200/80 bg-gradient-to-b from-blue-50/30 to-white">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeProject.icon || '🎪'}</span>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  {activeProject.category}
                </span>
                {activeProject.targetDate && (
                  <span className="text-xs font-medium text-neutral-500 flex items-center gap-1">
                    <Calendar size={13} />
                    <span>目標: {activeProject.targetDate}</span>
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
                {activeProject.name}
              </h1>
            </div>

            {/* Progress Circle / Badge */}
            <div className="text-right shrink-0">
              <div className="text-2xl font-black text-blue-600">{progressPercent}%</div>
              <div className="text-xs font-medium text-neutral-500">
                {stats.completed} / {stats.total} 完了
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-neutral-200 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Inline Task Add for this Project */}
        <div className="p-4 md:p-6 pb-2">
          <form
            onSubmit={handleCreateTaskInProject}
            className="flex items-center gap-2 p-2 rounded-2xl border border-neutral-200 bg-neutral-50/70 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-xs"
          >
            {/* Status Select for New Task */}
            <select
              value={newTaskStatus}
              onChange={(e) => setNewTaskStatus(e.target.value as TaskStatus)}
              className="text-xs font-bold bg-white px-2 py-1 rounded-xl border border-neutral-200 text-neutral-700 outline-none cursor-pointer"
            >
              <option value="Inbox">📥 Inbox</option>
              <option value="次にやる">⚡ 次にやる</option>
              <option value="スケジュール">📅 スケジュール</option>
              <option value="連絡待ち">⏳ 連絡待ち</option>
              <option value="いつかやる">💡 いつかやる</option>
            </select>

            <input
              type="text"
              placeholder={`「${activeProject.name.replace(/^【[PAR]】/, '')}」のタスクを追加...`}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />

            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
            >
              <Plus size={15} />
              <span>追加</span>
            </button>
          </form>
        </div>

        {/* Task Sections by Status */}
        <div className="p-4 md:p-6 space-y-6">
          {(['Inbox', '次にやる', 'スケジュール', '連絡待ち', 'いつかやる', '完了'] as TaskStatus[]).map(
            (statusKey) => {
              const statusTasks = projectTasksByStatus[statusKey] || [];
              if (statusTasks.length === 0 && statusKey !== 'Inbox' && statusKey !== '次にやる') {
                return null;
              }
              const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG['Inbox'];

              return (
                <div key={statusKey} className="space-y-2">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        {statusKey}
                      </span>
                      <span className="text-xs text-neutral-400 font-bold">
                        {statusTasks.length}件
                      </span>
                    </div>
                  </div>

                  {statusTasks.length === 0 ? (
                    <div className="text-xs text-neutral-400 py-2 italic">タスクはありません</div>
                  ) : (
                    <div className="space-y-1.5">
                      {statusTasks.map((t) => {
                        const isDone = isTaskDone(t);
                        return (
                          <div
                            key={t.id}
                            onClick={() => onSelectTask(t.id)}
                            className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer group ${
                              selectedTaskId === t.id
                                ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-200'
                                : 'bg-white border-neutral-200/80 hover:border-neutral-300 hover:shadow-xs'
                            } ${isDone ? 'opacity-60 bg-neutral-50/40' : ''}`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleComplete(t);
                                }}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                  isDone
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'border-neutral-300 hover:border-emerald-500'
                                }`}
                              >
                                {isDone && <Check size={12} strokeWidth={3} />}
                              </button>

                              <div className="min-w-0 flex-1">
                                <span className={`text-sm font-semibold truncate block ${isDone ? 'line-through text-neutral-400' : 'text-neutral-800'}`}>
                                  {t.title}
                                </span>
                                <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                                  {t.dueDate && (
                                    <span className="flex items-center gap-1 font-mono">
                                      <Calendar size={11} />
                                      <span>{t.dueDate}</span>
                                    </span>
                                  )}
                                  {t.startTime && (
                                    <span className="flex items-center gap-1 font-mono text-blue-600">
                                      <Clock size={11} />
                                      <span>{t.startTime}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Status Quick Changer */}
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="shrink-0 ml-2"
                            >
                              <select
                                value={t.status || 'Inbox'}
                                onChange={(e) => {
                                  const newSt = e.target.value as TaskStatus;
                                  const done = newSt === '完了';
                                  onUpdateTask({
                                    ...t,
                                    status: newSt,
                                    completed: done,
                                    completedAt: done ? new Date().toISOString() : undefined,
                                    updatedAt: new Date().toISOString(),
                                  });
                                }}
                                className="text-[10px] font-bold px-2 py-1 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 outline-none cursor-pointer hover:bg-white"
                              >
                                <option value="Inbox">Inbox</option>
                                <option value="次にやる">次にやる</option>
                                <option value="スケジュール">スケジュール</option>
                                <option value="連絡待ち">連絡待ち</option>
                                <option value="いつかやる">いつかやる</option>
                                <option value="完了">完了</option>
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  }

  // 2. OVERVIEW: All Projects List
  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm max-w-5xl mx-auto overflow-hidden pb-24 animate-fadeIn">
      {/* Header */}
      <div className="p-4 md:p-6 pb-4 border-b border-neutral-200/80 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban size={24} className="text-blue-600" />
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              プロジェクト管理 (PARA)
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Notionデータベースのプロジェクト・エリア・リソースと連動して進捗を管理します
          </p>
        </div>

        {/* Add Project Button */}
        <button
          type="button"
          onClick={() => setIsCreatingProject(!isCreatingProject)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>プロジェクト作成</span>
        </button>
      </div>

      {/* New Project Form Modal / Drawer */}
      {isCreatingProject && (
        <form
          onSubmit={handleCreateProject}
          className="p-4 md:p-6 bg-blue-50/40 border-b border-blue-200 space-y-3 animate-fadeIn"
        >
          <div className="font-bold text-xs text-blue-900">新しいプロジェクト / エリアを作成</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="プロジェクト名 (例: 教会向けモデル事業)"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              autoFocus
              className="col-span-2 px-3 py-2 text-xs bg-white border border-neutral-200 rounded-xl outline-none focus:border-blue-500"
            />
            <select
              value={newProjectCategory}
              onChange={(e) => setNewProjectCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-neutral-200 rounded-xl outline-none focus:border-blue-500 font-bold"
            >
              <option value="プロジェクト">【P】プロジェクト</option>
              <option value="エリア">【A】エリア</option>
              <option value="リソース">【R】リソース</option>
            </select>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">目標期限:</span>
              <input
                type="date"
                value={newProjectTargetDate}
                onChange={(e) => setNewProjectTargetDate(e.target.value)}
                className="px-2 py-1 text-xs bg-white border border-neutral-200 rounded-xl outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingProject(false)}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-200/60 rounded-xl font-semibold"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={!newProjectName.trim()}
                className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded-xl font-bold disabled:opacity-40"
              >
                作成
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 md:p-6 pb-2 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="プロジェクトを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-200/80 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'すべて' },
            { id: 'プロジェクト', label: '🎯 プロジェクト (P)' },
            { id: 'エリア', label: '🏛️ エリア (A)' },
            { id: 'リソース', label: '🧠 リソース (R)' },
            { id: 'completed', label: '✅ 完了済み' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                filterCategory === tab.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Unlinked Inbox Alert Banner (Inboxから入る考え方) */}
      {unlinkedInboxTasks.length > 0 && (
        <div className="mx-4 md:mx-6 mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Inbox size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">
                プロジェクト未設定のInboxタスクが {unlinkedInboxTasks.length}件 あります
              </div>
              <div className="text-[11px] text-amber-700">
                受信箱に入ったタスクにプロジェクトを割り当てて整理（トリアージ）しましょう
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => {
          const stats = projectStats[project.id] || { total: 0, completed: 0, tasks: [] };
          const progressPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
          const isDone = project.status === '完了';

          return (
            <div
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className="p-5 rounded-3xl border border-neutral-200/90 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-99"
            >
              <div>
                {/* Card Top: Category and Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{project.icon || '🎪'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200/60">
                      {project.category}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : project.status === 'アクティブ'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Project Title */}
                <h2 className="text-base font-bold text-neutral-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                  {project.name}
                </h2>

                {/* Target Date if present */}
                {project.targetDate && (
                  <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1 mt-1.5 font-mono">
                    <Calendar size={12} />
                    <span>目標: {project.targetDate}</span>
                  </div>
                )}
              </div>

              {/* Progress & Task Counts */}
              <div className="mt-4 pt-3 border-t border-neutral-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-neutral-500">
                  <span>タスク進捗</span>
                  <span className="font-bold text-neutral-800">
                    {stats.completed} / {stats.total} 完了 ({progressPercent}%)
                  </span>
                </div>

                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      progressPercent === 100
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-blue-600 font-bold">
                  <span>タスクを開く</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
