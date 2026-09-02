export type Priority = 'none' | 'low' | 'medium' | 'high';

export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'archived';

export type NotionBlockType = 
  | 'text' 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'bullet' 
  | 'number' 
  | 'todo' 
  | 'quote' 
  | 'code' 
  | 'callout' 
  | 'divider';

export interface NotionBlock {
  id: string;
  type: NotionBlockType;
  content: string;
  checked?: boolean; // For todo blocks
  calloutIcon?: string; // e.g. 💡, ⚠️, 🚀
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD or YYYY-MM-DDTHH:mm
  dueTime?: string; // HH:mm
  reminder?: string;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
  listId: string;
  tags: string[];
  subtasks: Subtask[];
  notionBlocks: NotionBlock[];
  estimatedPomodoros: number;
  completedPomodoros: number;
  createdAt: string;
  updatedAt: string;
  notionPageId?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  icon: string;
  isSmartList?: boolean;
  filterType?: SmartListType;
  taskCount?: number;
}

export type SmartListType = 
  | 'inbox' 
  | 'today' 
  | 'tomorrow' 
  | 'next7days' 
  | 'all' 
  | 'calendar' 
  | 'matrix' 
  | 'pomodoro' 
  | 'habits' 
  | 'completed' 
  | 'trash';

export type ActiveView = 
  | 'list' 
  | 'kanban' 
  | 'calendar' 
  | 'matrix' 
  | 'pomodoro' 
  | 'habits';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly';
  targetDaysPerWeek?: number;
  completedDates: string[]; // ['2026-08-15', '2026-08-14', ...]
  streak: number;
  bestStreak: number;
  createdAt: string;
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  completedAt: string;
  type: 'work' | 'short_break' | 'long_break';
}

export type ThemeName = 'ticktick_blue' | 'notion_light' | 'notion_dark' | 'forest_green' | 'sunset_amber' | 'nordic_slate';

export interface AppSettings {
  theme: ThemeName;
  soundEnabled: boolean;
  confettiEnabled: boolean;
  pomodoroWorkDuration: number; // in minutes (default 25)
  pomodoroShortBreak: number; // in minutes (default 5)
  pomodoroLongBreak: number; // in minutes (default 15)
  pomodoroLongBreakInterval: number; // default 4
  ambientSound: 'none' | 'rain' | 'whitenoise' | 'cafe' | 'waves';
  ambientVolume: number; // 0 to 1
  notionApiKey?: string;
  notionDatabaseId?: string;
  notionAutoSync?: boolean;
  notionLastSynced?: string;
}
