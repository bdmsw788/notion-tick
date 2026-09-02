import React, { useState, useEffect, useMemo } from 'react';
import {
  Task,
  TaskList,
  Habit,
  PomodoroSession,
  AppSettings,
  ActiveView,
  Priority,
  TaskStatus,
  ThemeName,
} from './types';
import {
  storageService,
  getTodayString,
  getOffsetDateString,
} from './lib/storage';
import { soundManager } from './lib/soundEffects';

import { Sidebar } from './components/Sidebar';
import { MainHeader } from './components/MainHeader';
import { QuickTaskInput } from './components/QuickTaskInput';
import { TaskListView } from './components/TaskListView';
import { KanbanBoardView } from './components/KanbanBoardView';
import { CalendarView } from './components/CalendarView';
import { EisenhowerMatrixView } from './components/EisenhowerMatrixView';
import { PomodoroFocusView } from './components/PomodoroFocusView';
import { HabitTrackerView } from './components/HabitTrackerView';
import { TaskDetailPane } from './components/TaskDetailPane';
import { CommandPalette } from './components/CommandPalette';
import { NotionSettingsModal } from './components/NotionSettingsModal';
import { ConfettiCanvas } from './components/ConfettiCanvas';

export const App: React.FC = () => {
  // State Initialization from Persistent Storage
  const [tasks, setTasks] = useState<Task[]>(() => storageService.getTasks());
  const [lists, setLists] = useState<TaskList[]>(() => storageService.getLists());
  const [habits, setHabits] = useState<Habit[]>(() => storageService.getHabits());
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>(() =>
    storageService.getPomodoroSessions()
  );
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());

  // UI States
  const [currentListId, setCurrentListId] = useState<string>('inbox');
  const [activeView, setActiveView] = useState<ActiveView>('list');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt' | 'title'>('dueDate');

  // Modals & Drawers
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotionSettingsOpen, setIsNotionSettingsOpen] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  // Apply Theme Attribute to HTML Body
  useEffect(() => {
    document.body.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Persist Tasks
  useEffect(() => {
    storageService.saveTasks(tasks);
  }, [tasks]);

  // Persist Lists
  useEffect(() => {
    storageService.saveLists(lists);
  }, [lists]);

  // Persist Habits
  useEffect(() => {
    storageService.saveHabits(habits);
  }, [habits]);

  // Persist Pomodoros
  useEffect(() => {
    storageService.savePomodoroSessions(pomodoroSessions);
  }, [pomodoroSessions]);

  // Persist Settings
  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  // Global Keyboard Shortcuts (Cmd+K, etc.)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isCommandPaletteOpen) setIsCommandPaletteOpen(false);
        else if (isNotionSettingsOpen) setIsNotionSettingsOpen(false);
        else if (selectedTaskId) setSelectedTaskId(null);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isCommandPaletteOpen, isNotionSettingsOpen, selectedTaskId]);

  // Trigger Completion Sound & Confetti
  const triggerTaskCompletionEffects = () => {
    if (settings.soundEnabled) {
      soundManager.playTaskComplete();
    }
    if (settings.confettiEnabled) {
      setConfettiTrigger((prev) => prev + 1);
    }
  };

  // Task Handlers
  const handleAddTask = (taskData: {
    title: string;
    listId: string;
    dueDate?: string;
    dueTime?: string;
    priority: Priority;
    tags: string[];
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      completed: false,
      status: 'not_started',
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime,
      listId: taskData.listId,
      tags: taskData.tags,
      subtasks: [],
      notionBlocks: [
        {
          id: `nb-${Date.now()}`,
          type: 'text',
          content: '',
        },
      ],
      estimatedPomodoros: 2,
      completedPomodoros: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setSelectedTaskId(newTask.id);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    if (activeFocusTask?.id === updatedTask.id) {
      setActiveFocusTask(updatedTask);
    }
  };

  const handleToggleComplete = (task: Task) => {
    const nextCompleted = !task.completed;
    if (nextCompleted) {
      triggerTaskCompletionEffects();
    }

    const updatedTask: Task = {
      ...task,
      completed: nextCompleted,
      completedAt: nextCompleted ? new Date().toISOString() : undefined,
      status: nextCompleted ? 'completed' : 'in_progress',
      updatedAt: new Date().toISOString(),
    };

    handleUpdateTask(updatedTask);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
    if (activeFocusTask?.id === taskId) {
      setActiveFocusTask(null);
    }
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const isCompleted = status === 'completed';
    if (isCompleted && !task.completed) {
      triggerTaskCompletionEffects();
    }

    handleUpdateTask({
      ...task,
      status,
      completed: isCompleted,
      completedAt: isCompleted ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUpdateTaskPriority = (taskId: string, priority: Priority) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    handleUpdateTask({ ...task, priority, updatedAt: new Date().toISOString() });
  };

  // Quick Add helpers
  const handleQuickAddForQuadrant = (quadrant: 1 | 2 | 3 | 4) => {
    const today = getTodayString();
    let priority: Priority = 'none';
    let dueDate: string | undefined = undefined;

    if (quadrant === 1) {
      priority = 'high';
      dueDate = today;
    } else if (quadrant === 2) {
      priority = 'high';
      dueDate = getOffsetDateString(3);
    } else if (quadrant === 3) {
      priority = 'low';
      dueDate = today;
    } else {
      priority = 'none';
    }

    handleAddTask({
      title: '新規タスク',
      listId: currentListId === 'trash' ? 'inbox' : currentListId,
      priority,
      dueDate,
      tags: [],
    });
  };

  const handleMoveTaskToSection = (
    taskId: string,
    targetSection: 'today' | 'tomorrow' | 'nodate' | 'completed'
  ) => {
    const today = getTodayString();
    const tomorrow = getOffsetDateString(1);

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        if (targetSection === 'completed') {
          soundManager.playTaskComplete();
          return {
            ...t,
            completed: true,
            completedAt: new Date().toISOString(),
            status: 'completed' as const,
            updatedAt: new Date().toISOString(),
          };
        }
        if (targetSection === 'today') {
          return {
            ...t,
            completed: false,
            dueDate: today,
            status: t.status === 'completed' ? 'not_started' : t.status,
            updatedAt: new Date().toISOString(),
          };
        }
        if (targetSection === 'tomorrow') {
          return {
            ...t,
            completed: false,
            dueDate: tomorrow,
            status: t.status === 'completed' ? 'not_started' : t.status,
            updatedAt: new Date().toISOString(),
          };
        }
        if (targetSection === 'nodate') {
          return {
            ...t,
            completed: false,
            dueDate: undefined,
            dueTime: undefined,
            status: t.status === 'completed' ? 'not_started' : t.status,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  // Habit Handlers
  const handleToggleHabitDate = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.completedDates.includes(dateStr);
        const nextDates = exists
          ? h.completedDates.filter((d) => d !== dateStr)
          : [...h.completedDates, dateStr];

        const streak = nextDates.includes(getTodayString()) ? h.streak + 1 : Math.max(0, h.streak - 1);
        const bestStreak = Math.max(h.bestStreak, streak);

        return {
          ...h,
          completedDates: nextDates,
          streak: Math.max(0, streak),
          bestStreak,
        };
      })
    );
  };

  const handleAddHabit = (
    newHabitData: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'completedDates' | 'createdAt'>
  ) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `habit-${Date.now()}`,
      completedDates: [],
      streak: 0,
      bestStreak: 0,
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  // Pomodoro Handlers
  const handleCompletePomodoroSession = (sessionData: Omit<PomodoroSession, 'id'>) => {
    const newSession: PomodoroSession = {
      ...sessionData,
      id: `pomo-${Date.now()}`,
    };
    setPomodoroSessions((prev) => [newSession, ...prev]);
  };

  const handleIncrementTaskPomodoro = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    handleUpdateTask({
      ...task,
      completedPomodoros: (task.completedPomodoros || 0) + 1,
      updatedAt: new Date().toISOString(),
    });
  };

  // List Handlers
  const handleAddList = (name: string, color: string, icon: string) => {
    const newList: TaskList = {
      id: `list-${Date.now()}`,
      name,
      color,
      icon,
    };
    setLists((prev) => [...prev, newList]);
    setCurrentListId(newList.id);
  };

  const handleDeleteList = (listId: string) => {
    setLists((prev) => prev.filter((l) => l.id !== listId));
    if (currentListId === listId) {
      setCurrentListId('inbox');
    }
  };

  const handleDataImported = () => {
    setTasks(storageService.getTasks());
    setLists(storageService.getLists());
    setHabits(storageService.getHabits());
    setPomodoroSessions(storageService.getPomodoroSessions());
    setSettings(storageService.getSettings());
  };

  // Filter Tasks based on Current List / Smart List / Tag / Search / Sort
  const filteredTasks = useMemo(() => {
    const today = getTodayString();
    const tomorrow = getOffsetDateString(1);
    const next7DaysEnd = getOffsetDateString(7);

    return tasks
      .filter((t) => {
        if (selectedTag && !t.tags.includes(selectedTag)) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = t.title.toLowerCase().includes(q);
          const matchTag = t.tags.some((tag) => tag.toLowerCase().includes(q));
          const matchBlock = t.notionBlocks.some((b) => b.content.toLowerCase().includes(q));
          if (!matchTitle && !matchTag && !matchBlock) return false;
        }

        if (currentListId === 'inbox') {
          return t.listId === 'inbox';
        }
        if (currentListId === 'today') {
          return t.dueDate === today;
        }
        if (currentListId === 'tomorrow') {
          return t.dueDate === tomorrow;
        }
        if (currentListId === 'next7days') {
          return t.dueDate && t.dueDate >= today && t.dueDate <= next7DaysEnd;
        }
        if (currentListId === 'completed') {
          return t.completed;
        }
        if (currentListId === 'trash') {
          return false;
        }

        return t.listId === currentListId;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const priorityScore = { high: 3, medium: 2, low: 1, none: 0 };
          return priorityScore[b.priority] - priorityScore[a.priority];
        }
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tasks, currentListId, selectedTag, searchQuery, sortBy]);

  const activeTaskCount = filteredTasks.filter((t) => !t.completed).length;
  const currentListObj = lists.find((l) => l.id === currentListId) || {
    id: currentListId,
    name:
      currentListId === 'today'
        ? '今日'
        : currentListId === 'tomorrow'
        ? '明日'
        : currentListId === 'next7days'
        ? '今後7日間'
        : currentListId === 'completed'
        ? '完了済み'
        : 'タスク一覧',
    icon:
      currentListId === 'today'
        ? '☀️'
        : currentListId === 'tomorrow'
        ? '🌅'
        : currentListId === 'next7days'
        ? '🗓️'
        : currentListId === 'completed'
        ? '✅'
        : '📋',
    color: '#3B82F6',
  };

  const selectedTaskObj = tasks.find((t) => t.id === selectedTaskId) || null;

  return (
    <div className="flex h-screen w-screen bg-white text-neutral-800 overflow-hidden font-sans select-none">
      {/* Confetti Effect Layer */}
      <ConfettiCanvas trigger={confettiTrigger} />

      {/* 1. Left Navigation Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transform md:relative md:translate-x-0 transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          currentListId={currentListId}
          lists={lists}
          tasks={tasks}
          activeView={activeView}
          currentTheme={settings.theme}
          notionConnected={!!settings.notionApiKey && !!settings.notionDatabaseId}
          onSelectList={(listId) => {
            setCurrentListId(listId);
            setIsSidebarOpen(false);
          }}
          onSelectView={(view) => {
            setActiveView(view);
            setIsSidebarOpen(false);
          }}
          onAddList={handleAddList}
          onDeleteList={handleDeleteList}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenNotionSettings={() => setIsNotionSettingsOpen(true)}
          onChangeTheme={(theme) => setSettings((s) => ({ ...s, theme }))}
          onFilterTag={(tag) => setSelectedTag(tag || null)}
          selectedTag={selectedTag}
        />
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/30 md:hidden backdrop-blur-2xs"
        />
      )}

      {/* 2. Center Workspace Pane */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-white overflow-hidden">
        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden max-w-5xl mx-auto w-full">
          {/* Header */}
          <MainHeader
            currentList={currentListObj}
            activeView={activeView}
            activeTaskCount={activeTaskCount}
            totalTaskCount={filteredTasks.length}
            searchQuery={searchQuery}
            sortBy={sortBy}
            onViewChange={setActiveView}
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Quick Task Input Bar (Visible in List & Kanban views) */}
          {(activeView === 'list' || activeView === 'kanban') && (
            <div className="py-3">
              <QuickTaskInput
                currentListId={currentListId}
                lists={lists}
                onAddTask={handleAddTask}
              />
            </div>
          )}

          {/* Active View Container */}
          <div className="flex-1 overflow-y-auto pt-1 pr-1">
            {activeView === 'list' && (
              <TaskListView
                tasks={filteredTasks}
                lists={lists}
                selectedTaskId={selectedTaskId}
                onSelectTask={setSelectedTaskId}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                onMoveTaskToSection={handleMoveTaskToSection}
              />
            )}

            {activeView === 'kanban' && (
              <KanbanBoardView
                tasks={filteredTasks}
                lists={lists}
                selectedTaskId={selectedTaskId}
                onSelectTask={setSelectedTaskId}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onQuickAddTask={(status) => {
                  handleAddTask({
                    title: '新しいタスク',
                    listId: currentListId === 'trash' ? 'inbox' : currentListId,
                    priority: 'none',
                    tags: [],
                  });
                }}
              />
            )}

            {activeView === 'calendar' && (
              <CalendarView
                tasks={tasks}
                lists={lists}
                selectedTaskId={selectedTaskId}
                onSelectTask={setSelectedTaskId}
                onToggleComplete={handleToggleComplete}
                onAddTaskOnDate={(dateStr) => {
                  handleAddTask({
                    title: '新しいタスク',
                    listId: 'inbox',
                    dueDate: dateStr,
                    priority: 'none',
                    tags: [],
                  });
                }}
              />
            )}

            {activeView === 'matrix' && (
              <EisenhowerMatrixView
                tasks={tasks}
                lists={lists}
                selectedTaskId={selectedTaskId}
                onSelectTask={setSelectedTaskId}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                onUpdateTaskPriority={handleUpdateTaskPriority}
                onQuickAddTask={handleQuickAddForQuadrant}
              />
            )}

            {activeView === 'pomodoro' && (
              <PomodoroFocusView
                tasks={tasks}
                sessions={pomodoroSessions}
                settings={settings}
                activeFocusTask={activeFocusTask}
                onSelectFocusTask={setActiveFocusTask}
                onCompletePomodoroSession={handleCompletePomodoroSession}
                onIncrementTaskPomodoro={handleIncrementTaskPomodoro}
                onUpdateSettings={setSettings}
              />
            )}

            {activeView === 'habits' && (
              <HabitTrackerView
                habits={habits}
                onToggleHabitDate={handleToggleHabitDate}
                onAddHabit={handleAddHabit}
                onDeleteHabit={handleDeleteHabit}
                onCompleteSound={() => {
                  if (settings.soundEnabled) soundManager.playTaskComplete();
                  if (settings.confettiEnabled) setConfettiTrigger((p) => p + 1);
                }}
              />
            )}
          </div>
        </div>
      </main>

      {/* 3. Right Task Detail Pane (Collapsible / Dynamic width) */}
      {selectedTaskObj && (
        <aside className="w-full md:w-[420px] lg:w-[480px] h-full shrink-0 z-20">
          <TaskDetailPane
            task={selectedTaskObj}
            lists={lists}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onClose={() => setSelectedTaskId(null)}
            onStartPomodoro={(t) => {
              setActiveFocusTask(t);
              setActiveView('pomodoro');
            }}
            onCompleteSound={() => {
              if (settings.soundEnabled) soundManager.playTaskComplete();
              if (settings.confettiEnabled) setConfettiTrigger((p) => p + 1);
            }}
          />
        </aside>
      )}

      {/* Cmd+K Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        tasks={tasks}
        lists={lists}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTask={(id) => {
          setSelectedTaskId(id);
          setActiveView('list');
        }}
        onSelectView={setActiveView}
        onSelectList={setCurrentListId}
        onOpenNotionSettings={() => setIsNotionSettingsOpen(true)}
        onChangeTheme={(theme) => setSettings((s) => ({ ...s, theme }))}
        onQuickAdd={() => {
          handleAddTask({
            title: '新規タスク',
            listId: currentListId === 'trash' ? 'inbox' : currentListId,
            priority: 'none',
            tags: [],
          });
        }}
      />

      {/* Notion Settings Modal */}
      <NotionSettingsModal
        isOpen={isNotionSettingsOpen}
        settings={settings}
        tasks={tasks}
        lists={lists}
        onClose={() => setIsNotionSettingsOpen(false)}
        onUpdateSettings={setSettings}
        onTasksSynced={(syncedTasks) => {
          setTasks(syncedTasks);
        }}
        onDataImported={handleDataImported}
      />
    </div>
  );
};

export default App;
