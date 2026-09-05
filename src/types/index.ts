export type Priority = 'none' | 'low' | 'medium' | 'high';

// Notion-aligned Task Statuses (GTD / PARA workflow)
export type TaskStatus = 
  | 'Inbox'        // 受信箱 / 未整理（タスクの初期状態）
  | '次にやる'     // Next Actions（直近実行するタスク）
  | 'スケジュール' // Scheduled（日時指定・タイムライン配置）
  | 'プロジェクト' // Project Task（プロジェクト本体）
  | '連絡待ち'     // Waiting For（相手の返答・連絡待ち）
  | 'いつかやる'   // Someday / Maybe（保留・アイデア）
  | '完了'         // Completed
  // 互換性エイリアス
  | 'not_started' 
  | 'in_progress' 
  | 'completed' 
  | 'archived';

// Notion PARA Project model
export interface Project {
  id: string; // Notion page ID (UUID) or local ID
  name: string; // e.g. "【P】教会で遊ぼうスペシャルを行う"
  category: 'プロジェクト' | 'エリア' | 'リソース' | 'アーカイブ' | string;
  status: 'アクティブ' | '未着手' | '完了' | 'アーカイブ' | string;
  targetDate?: string | null; // YYYY-MM-DD
  color?: string;
  icon?: string;
  description?: string;
  taskCount?: number;
  completedTaskCount?: number;
}

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
  projectId?: string; // Linked PARA Project ID
  projectName?: string; // Display name of Project
  tags: string[];
  subtasks: Subtask[];
  notionBlocks: NotionBlock[];
  estimatedPomodoros: number;
  completedPomodoros: number;
  // Time Management Properties
  startTime?: string; // e.g. "09:00", "14:30"
  durationMinutes?: number; // estimated duration in minutes e.g. 30, 60, 90
  actualMinutes?: number; // actual tracked time in minutes
  isRunning?: boolean; // currently tracking time
  timerStartedAt?: number; // Date.now() timestamp when timer started
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
  | 'timeline'
  | 'list' 
  | 'projects'
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
