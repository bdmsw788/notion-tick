import { Task, TaskList, Habit, PomodoroSession, AppSettings } from '../types';

const STORAGE_KEYS = {
  TASKS: 'notion_tick_tasks_v1',
  LISTS: 'notion_tick_lists_v1',
  HABITS: 'notion_tick_habits_v1',
  POMODORO: 'notion_tick_pomodoro_v1',
  SETTINGS: 'notion_tick_settings_v1',
};

// Date Helpers
export const getTodayString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getOffsetDateString = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateStr?: string, timeStr?: string): string => {
  if (!dateStr) return '';
  const today = getTodayString();
  const tomorrow = getOffsetDateString(1);
  const yesterday = getOffsetDateString(-1);

  let datePrefix = dateStr;
  if (dateStr === today) {
    datePrefix = '今日';
  } else if (dateStr === tomorrow) {
    datePrefix = '明日';
  } else if (dateStr === yesterday) {
    datePrefix = '昨日';
  } else {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      datePrefix = `${parseInt(parts[1], 10)}月${parseInt(parts[2], 10)}日`;
    }
  }

  return timeStr ? `${datePrefix} ${timeStr}` : datePrefix;
};

// Default Initial Lists
export const DEFAULT_LISTS: TaskList[] = [
  { id: 'inbox', name: '受信箱', color: '#3B82F6', icon: '📥' },
  { id: 'work', name: 'プロジェクト / 仕事', color: '#10B981', icon: '💼' },
  { id: 'personal', name: 'プライベート', color: '#8B5CF6', icon: '🌟' },
  { id: 'study', name: '学習 & 読書', color: '#F59E0B', icon: '📚' },
  { id: 'shopping', name: '買い物リスト', color: '#EC4899', icon: '🛒' },
];

// Default Initial Tasks with rich Notion-style blocks
export const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Notion × TickTick タスク管理アプリの仕様書を完成させる',
    completed: false,
    status: 'in_progress',
    priority: 'high',
    dueDate: getTodayString(),
    dueTime: '15:00',
    listId: 'work',
    tags: ['開発', '重要', 'Notion'],
    estimatedPomodoros: 4,
    completedPomodoros: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-1', title: '3ペインUIレイアウトの設計', completed: true },
      { id: 'sub-2', title: 'Notionブロックエディタのコマンド実装', completed: true },
      { id: 'sub-3', title: 'ポモドーロと環境音シンセの連携テスト', completed: false },
      { id: 'sub-4', title: 'アイゼンハワーマトリクスのドラッグ＆ドロップ', completed: false },
    ],
    notionBlocks: [
      {
        id: 'nb-1',
        type: 'callout',
        content: 'Notionの自由なブロック表現とTickTickの超高速タスク処理UIを完全融合させたハイブリッドシステムです。',
        calloutIcon: '💡',
      },
      {
        id: 'nb-2',
        type: 'h2',
        content: '主要なデザイン要件',
      },
      {
        id: 'nb-3',
        type: 'bullet',
        content: '左サイドバー: スマートリスト（今日、明日、今後7日間、マトリクス、ポモドーロ、習慣）',
      },
      {
        id: 'nb-4',
        type: 'bullet',
        content: '中央ペイン: リスト・カンバン・カレンダー・マトリクス・ポモドーロのマルチビュー',
      },
      {
        id: 'nb-5',
        type: 'bullet',
        content: '右ペイン: Notionライクなスラッシュコマンド付きドキュメントエディタ',
      },
      {
        id: 'nb-6',
        type: 'h3',
        content: 'コードブロックのサンプル',
      },
      {
        id: 'nb-7',
        type: 'code',
        content: '// ショートカット: Cmd+Kでコマンドパレット, Nでタスク追加\nconst quickAdd = (input) => parseNaturalDate(input);',
      },
      {
        id: 'nb-8',
        type: 'quote',
        content: '「良い道具は、思考の速度で操作できるものである。」',
      },
    ],
  },
  {
    id: 'task-2',
    title: 'プロダクトデザインのフィードバックミーティング',
    completed: false,
    status: 'not_started',
    priority: 'medium',
    dueDate: getTodayString(),
    dueTime: '17:30',
    listId: 'work',
    tags: ['会議', 'UIUX'],
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-2-1', title: 'アジェンダの作成', completed: true },
      { id: 'sub-2-2', title: '画面キャプチャの共有', completed: false },
    ],
    notionBlocks: [
      {
        id: 'nb-201',
        type: 'callout',
        content: '参加者: 開発チーム、デザインリード。Google Meetリンクはカレンダー参照。',
        calloutIcon: '👥',
      },
      {
        id: 'nb-202',
        type: 'h2',
        content: '確認事項',
      },
      {
        id: 'nb-203',
        type: 'todo',
        content: 'ダークモード時のコントラスト比がTickTick/Notion基準を満たしているか',
        checked: false,
      },
      {
        id: 'nb-204',
        type: 'todo',
        content: 'ポモドーロ完了時のWeb Audioサウンドの音量調整',
        checked: false,
      },
    ],
  },
  {
    id: 'task-3',
    title: 'TypeScript & Next-gen State Managementの学習ドキュメントまとめ',
    completed: false,
    status: 'in_progress',
    priority: 'medium',
    dueDate: getOffsetDateString(1),
    dueTime: '10:00',
    listId: 'study',
    tags: ['学習', 'TypeScript'],
    estimatedPomodoros: 3,
    completedPomodoros: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-3-1', title: 'Chapter 1: Generic State Types', completed: true },
      { id: 'sub-3-2', title: 'Chapter 2: Optimistic UI Updates', completed: false },
    ],
    notionBlocks: [
      {
        id: 'nb-301',
        type: 'h2',
        content: '読書メモ & ベストプラクティス',
      },
      {
        id: 'nb-302',
        type: 'text',
        content: 'ローカルファーストなアーキテクチャでは、即時フィードバックとバックグラウンド同期が最も重要。',
      },
    ],
  },
  {
    id: 'task-4',
    title: '週末の食料品とオーガニックコーヒー豆の買い出し',
    completed: false,
    status: 'not_started',
    priority: 'low',
    dueDate: getOffsetDateString(2),
    listId: 'shopping',
    tags: ['買い物', '週末'],
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-4-1', title: 'エチオピア イルガチェフェ豆 200g', completed: false },
      { id: 'sub-4-2', title: '無調整豆乳 2パック', completed: false },
      { id: 'sub-4-3', title: '新鮮なアボカドと卵', completed: false },
    ],
    notionBlocks: [
      {
        id: 'nb-401',
        type: 'text',
        content: '商店街のロースタリーカフェに立ち寄る。15:00以降が空いている。',
      },
    ],
  },
  {
    id: 'task-5',
    title: '毎日の30分ランニング & ストレッチルーティン',
    completed: true,
    completedAt: new Date().toISOString(),
    status: 'completed',
    priority: 'high',
    dueDate: getTodayString(),
    listId: 'personal',
    tags: ['健康', '運動'],
    estimatedPomodoros: 2,
    completedPomodoros: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      { id: 'sub-5-1', title: '5kmジョギング', completed: true },
      { id: 'sub-5-2', title: '10分間クールダウンストレッチ', completed: true },
    ],
    notionBlocks: [
      {
        id: 'nb-501',
        type: 'callout',
        content: '本日ペース: 5分20秒/km。心拍数ゾーン2をキープできて良好。',
        calloutIcon: '🏃',
      },
    ],
  },
  {
    id: 'task-6',
    title: '四半期目標 (OKR) の振り返りとレビュー資料作成',
    completed: false,
    status: 'not_started',
    priority: 'high',
    dueDate: getOffsetDateString(4),
    listId: 'work',
    tags: ['マネジメント', 'OKR'],
    estimatedPomodoros: 5,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [],
    notionBlocks: [
      {
        id: 'nb-601',
        type: 'h2',
        content: 'Q3 ゴール達成状況',
      },
      {
        id: 'nb-602',
        type: 'bullet',
        content: '目標1: タスク処理効率の30%向上 -> 達成率 120%',
      },
      {
        id: 'nb-603',
        type: 'bullet',
        content: '目標2: Notion連携機能のローンチ -> 順調に進行中',
      },
    ],
  },
];

// Default Habits
export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: '朝のモーニング瞑想 10分',
    icon: '🧘',
    color: '#8B5CF6',
    frequency: 'daily',
    completedDates: [getTodayString(), getOffsetDateString(-1), getOffsetDateString(-2), getOffsetDateString(-3)],
    streak: 4,
    bestStreak: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-2',
    name: '水分補給 2L',
    icon: '💧',
    color: '#3B82F6',
    frequency: 'daily',
    completedDates: [getTodayString(), getOffsetDateString(-1), getOffsetDateString(-2)],
    streak: 3,
    bestStreak: 18,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-3',
    name: 'プログラミング / 読書 45分',
    icon: '📖',
    color: '#10B981',
    frequency: 'weekdays',
    completedDates: [getTodayString(), getOffsetDateString(-1)],
    streak: 2,
    bestStreak: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'habit-4',
    name: '寝る前1時間のスクリーンオフ',
    icon: '🌙',
    color: '#F59E0B',
    frequency: 'daily',
    completedDates: [getOffsetDateString(-1), getOffsetDateString(-2)],
    streak: 0,
    bestStreak: 5,
    createdAt: new Date().toISOString(),
  },
];

// Default Pomodoro Sessions
export const DEFAULT_POMODOROS: PomodoroSession[] = [
  {
    id: 'pomo-1',
    taskId: 'task-1',
    taskTitle: 'Notion × TickTick タスク管理アプリの仕様書を完成させる',
    durationMinutes: 25,
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    type: 'work',
  },
  {
    id: 'pomo-2',
    taskId: 'task-1',
    taskTitle: 'Notion × TickTick タスク管理アプリの仕様書を完成させる',
    durationMinutes: 25,
    completedAt: new Date(Date.now() - 3600000).toISOString(),
    type: 'work',
  },
  {
    id: 'pomo-3',
    taskId: 'task-5',
    taskTitle: '毎日の30分ランニング & ストレッチルーティン',
    durationMinutes: 25,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    type: 'work',
  },
];

// Default Settings
export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'ticktick_blue',
  soundEnabled: true,
  confettiEnabled: true,
  pomodoroWorkDuration: 25,
  pomodoroShortBreak: 5,
  pomodoroLongBreak: 15,
  pomodoroLongBreakInterval: 4,
  ambientSound: 'none',
  ambientVolume: 0.5,
  notionAutoSync: false,
};

// Storage Service
export const storageService = {
  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  },

  saveTasks(tasks: Task[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  },

  getLists(): TaskList[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LISTS);
      return data ? JSON.parse(data) : DEFAULT_LISTS;
    } catch {
      return DEFAULT_LISTS;
    }
  },

  saveLists(lists: TaskList[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
    } catch {
      // ignore
    }
  },

  getHabits(): Habit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HABITS);
      return data ? JSON.parse(data) : DEFAULT_HABITS;
    } catch {
      return DEFAULT_HABITS;
    }
  },

  saveHabits(habits: Habit[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch {
      // ignore
    }
  },

  getPomodoroSessions(): PomodoroSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POMODORO);
      return data ? JSON.parse(data) : DEFAULT_POMODOROS;
    } catch {
      return DEFAULT_POMODOROS;
    }
  },

  savePomodoroSessions(sessions: PomodoroSession[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.POMODORO, JSON.stringify(sessions));
    } catch {
      // ignore
    }
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  },

  exportAllData(): string {
    const data = {
      tasks: this.getTasks(),
      lists: this.getLists(),
      habits: this.getHabits(),
      pomodoros: this.getPomodoroSessions(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.tasks && Array.isArray(parsed.tasks)) {
        this.saveTasks(parsed.tasks);
      }
      if (parsed.lists && Array.isArray(parsed.lists)) {
        this.saveLists(parsed.lists);
      }
      if (parsed.habits && Array.isArray(parsed.habits)) {
        this.saveHabits(parsed.habits);
      }
      if (parsed.pomodoros && Array.isArray(parsed.pomodoros)) {
        this.savePomodoroSessions(parsed.pomodoros);
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        this.saveSettings(parsed.settings);
      }
      return true;
    } catch {
      return false;
    }
  },
};
