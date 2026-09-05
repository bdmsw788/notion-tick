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
    id: 'sample-all-day-1',
    title: '買い物',
    completed: false,
    status: 'not_started',
    priority: 'none',
    dueDate: getTodayString(),
    listId: 'inbox',
    tags: ['生活'],
    subtasks: [],
    notionBlocks: [],
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-all-day-2',
    title: '仕様書を送信',
    completed: false,
    status: 'not_started',
    priority: 'high',
    dueDate: getTodayString(),
    listId: 'inbox',
    tags: ['仕事'],
    subtasks: [],
    notionBlocks: [],
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-time-1',
    title: '1週間の計画',
    completed: false,
    status: 'in_progress',
    priority: 'medium',
    dueDate: getTodayString(),
    startTime: '12:00',
    durationMinutes: 60,
    listId: 'inbox',
    tags: ['計画'],
    subtasks: [],
    notionBlocks: [],
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Day 1 (Today)
  {
    id: 'sample-d1-1',
    title: '朝のランニング',
    completed: false,
    status: 'not_started',
    priority: 'medium',
    dueDate: getTodayString(),
    startTime: '07:00',
    durationMinutes: 60,
    listId: 'inbox',
    tags: ['健康'],
    subtasks: [],
    notionBlocks: [],
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-d1-2',
    title: '面接',
    completed: false,
    status: 'not_started',
    priority: 'high',
    dueDate: getTodayString(),
    startTime: '09:00',
    durationMinutes: 120,
    listId: 'inbox',
    tags: ['仕事'],
    subtasks: [],
    notionBlocks: [],
    estimatedPomodoros: 4,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-d1-3',
    title: '仕事報告の準備',
    completed: false,
    status: 'not_started',
    priority: 'low',
    dueDate: getTodayString(),
    startTime: '13:00',
    durationMinutes: 240,
    listId: 'inbox',
    tags: ['仕事'],
    subtasks: [],
    notionBlocks: [],
    estimatedPomodoros: 6,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Day 2 (Tomorrow)
  {
    id: 'sample-d2-1',
    title: '会議に出席',
    completed: false,
    status: 'not_started',
    priority: 'medium',
    dueDate: getOffsetDateString(1),
    startTime: '08:00',
    durationMinutes: 120,
    listId: 'inbox',
    tags: ['仕事'],
    subtasks: [],
    notionBlocks: [],
    estimatedPomodoros: 3,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-d2-2',
    title: 'スピーチを準備する',
    completed: false,
    status: 'not_started',
    priority: 'low',
    dueDate: getOffsetDateString(1),
    startTime: '10:00',
    durationMinutes: 120,
    listId: 'inbox',
    tags: ['発表'],
    subtasks: [],
    notionBlocks: [],
    estimatedPomodoros: 3,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-d2-3',
    title: '診察を受けに行く',
    completed: false,
    status: 'not_started',
    priority: 'medium',
    dueDate: getOffsetDateString(1),
    startTime: '14:00',
    durationMinutes: 120,
    listId: 'inbox',
    tags: ['健康'],
    subtasks: [],
    notionBlocks: [],
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-d2-4',
    title: '荷物を取る',
    completed: false,
    status: 'not_started',
    priority: 'none',
    dueDate: getOffsetDateString(1),
    startTime: '16:30',
    durationMinutes: 60,
    listId: 'inbox',
    tags: ['用事'],
    subtasks: [],
    notionBlocks: [],
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Day 3 (Day after tomorrow)
  {
    id: 'sample-d3-1',
    title: 'プロジェクト会議を開く',
    completed: false,
    status: 'not_started',
    priority: 'high',
    dueDate: getOffsetDateString(2),
    startTime: '09:00',
    durationMinutes: 180,
    listId: 'inbox',
    tags: ['プロジェクト'],
    subtasks: [],
    notionBlocks: [],
    estimatedPomodoros: 4,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-d3-2',
    title: 'プロジェクト提案の完成',
    completed: false,
    status: 'not_started',
    priority: 'medium',
    dueDate: getOffsetDateString(2),
    startTime: '13:30',
    durationMinutes: 150,
    listId: 'inbox',
    tags: ['プロジェクト'],
    subtasks: [],
    notionBlocks: [],
    estimatedPomodoros: 3,
    completedPomodoros: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    "id": "notion-3cd601af-1c24-816c-a750-e4e604eda0fa",
    "title": "たろうせんせいに返信する",
    "completed": true,
    "completedAt": "2026-09-01T13:14:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-09-01",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cd601af",
        "type": "callout",
        "content": "Notion同期タスク: たろうせんせいに返信する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-31T21:14:00.000Z",
    "updatedAt": "2026-09-01T13:14:00.000Z",
    "notionPageId": "3cd601af-1c24-816c-a750-e4e604eda0fa"
  },
  {
    "id": "notion-3cd601af-1c24-81b4-9bb7-ebe2c6c28269",
    "title": "教職研修会の案内を再度おくる",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-09-01",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cd601af",
        "type": "callout",
        "content": "Notion同期タスク: 教職研修会の案内を再度おくる",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-31T21:06:00.000Z",
    "updatedAt": "2026-08-31T21:06:00.000Z",
    "notionPageId": "3cd601af-1c24-81b4-9bb7-ebe2c6c28269"
  },
  {
    "id": "notion-3cd601af-1c24-8176-8651-f56ca8cbc07f",
    "title": "じぶんのiPhoneをあけて差し込みなおす",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-09-01",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cd601af",
        "type": "callout",
        "content": "Notion同期タスク: じぶんのiPhoneをあけて差し込みなおす",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-31T21:03:00.000Z",
    "updatedAt": "2026-08-31T21:03:00.000Z",
    "notionPageId": "3cd601af-1c24-8176-8651-f56ca8cbc07f"
  },
  {
    "id": "notion-3cd601af-1c24-81b4-9291-e62150be84bc",
    "title": "いえのレールを取り付ける",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-09-01",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cd601af",
        "type": "callout",
        "content": "Notion同期タスク: いえのレールを取り付ける",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-31T21:03:00.000Z",
    "updatedAt": "2026-08-31T21:03:00.000Z",
    "notionPageId": "3cd601af-1c24-81b4-9291-e62150be84bc"
  },
  {
    "id": "notion-3cd601af-1c24-81f5-a233-cee9484803cb",
    "title": "会堂のホワイだとボードをなおす",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-09-01",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cd601af",
        "type": "callout",
        "content": "Notion同期タスク: 会堂のホワイだとボードをなおす",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-31T21:03:00.000Z",
    "updatedAt": "2026-08-31T21:03:00.000Z",
    "notionPageId": "3cd601af-1c24-81f5-a233-cee9484803cb"
  },
  {
    "id": "notion-3cb601af-1c24-800e-bdde-f331f1c669e5",
    "title": "8/30【デザイン＆祈祷】スライドを見ながらの全体チェックと祈り込み",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-28",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cb601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/30【デザイン＆祈祷】スライドを見ながらの全体チェックと祈り込み",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-29T11:29:00.000Z",
    "updatedAt": "2026-08-29T11:29:00.000Z",
    "notionPageId": "3cb601af-1c24-800e-bdde-f331f1c669e5"
  },
  {
    "id": "notion-3cb601af-1c24-80ec-8538-f16ee65db35c",
    "title": "8/30【デザイン＆祈祷】スライド（タイトル・3ポイント・聖句）の作成",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-28",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cb601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/30【デザイン＆祈祷】スライド（タイトル・3ポイント・聖句）の作成",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-29T11:29:00.000Z",
    "updatedAt": "2026-08-29T11:29:00.000Z",
    "notionPageId": "3cb601af-1c24-80ec-8538-f16ee65db35c"
  },
  {
    "id": "notion-3cb601af-1c24-806f-afa8-fea4b11ea0ec",
    "title": "8/30【ライティング】導入→本論→結論→適用の流れを通した原稿の肉付け・推敲",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-27",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cb601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/30【ライティング】導入→本論→結論→適用の流れを通した原稿の肉付け・推敲",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-29T11:29:00.000Z",
    "updatedAt": "2026-08-29T11:29:00.000Z",
    "notionPageId": "3cb601af-1c24-806f-afa8-fea4b11ea0ec"
  },
  {
    "id": "notion-3cb601af-1c24-801f-803a-efdde4e1ce97",
    "title": "8/30【ライティング】結論を受けた具体的なアクション（適用）の作成",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-27",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cb601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/30【ライティング】結論を受けた具体的なアクション（適用）の作成",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-29T11:29:00.000Z",
    "updatedAt": "2026-08-29T11:29:00.000Z",
    "notionPageId": "3cb601af-1c24-801f-803a-efdde4e1ce97"
  },
  {
    "id": "notion-3cb601af-1c24-807f-a928-dbc1fda56877",
    "title": "8/30【ライティング】本論へ引き込む問いかけや例話（導入）の作成",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-27",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cb601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/30【ライティング】本論へ引き込む問いかけや例話（導入）の作成",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-29T11:29:00.000Z",
    "updatedAt": "2026-08-29T11:29:00.000Z",
    "notionPageId": "3cb601af-1c24-807f-a928-dbc1fda56877"
  },
  {
    "id": "notion-3cb601af-1c24-8026-94f3-ffcd183b0264",
    "title": "8/30【ストラクチャー】最終的な着地点（結論）の確定",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-26",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cb601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/30【ストラクチャー】最終的な着地点（結論）の確定",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-29T11:29:00.000Z",
    "updatedAt": "2026-08-29T11:29:00.000Z",
    "notionPageId": "3cb601af-1c24-8026-94f3-ffcd183b0264"
  },
  {
    "id": "notion-3cb601af-1c24-80b8-858e-de21fef4032d",
    "title": "8/30【ストラクチャー】3つのブロックそれぞれの見出し（本論3ポイント）作成",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-26",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cb601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/30【ストラクチャー】3つのブロックそれぞれの見出し（本論3ポイント）作成",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-29T11:29:00.000Z",
    "updatedAt": "2026-08-29T11:29:00.000Z",
    "notionPageId": "3cb601af-1c24-80b8-858e-de21fef4032d"
  },
  {
    "id": "notion-3cb601af-1c24-80ac-babe-c1b55e460986",
    "title": "8/30【リサーチ＆神学】聖書箇所を3つの意味のまとまりにブロック分けする",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-25",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cb601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/30【リサーチ＆神学】聖書箇所を3つの意味のまとまりにブロック分けする",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-29T11:29:00.000Z",
    "updatedAt": "2026-08-29T11:29:00.000Z",
    "notionPageId": "3cb601af-1c24-80ac-babe-c1b55e460986"
  },
  {
    "id": "notion-3cb601af-1c24-80e7-a387-d8ae66dfdf5c",
    "title": "8/30【リサーチ＆神学】聖書箇所を3つの意味のまとまりにブロック分けする",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-25",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cb601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/30【リサーチ＆神学】聖書箇所を3つの意味のまとまりにブロック分けする",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-29T11:29:00.000Z",
    "updatedAt": "2026-08-29T11:29:00.000Z",
    "notionPageId": "3cb601af-1c24-80e7-a387-d8ae66dfdf5c"
  },
  {
    "id": "notion-3cb601af-1c24-8018-9e5a-daa11014b160",
    "title": "8/30【リサーチ＆神学】キリストの十字架と復活への接続ポイントを書き留める",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-25",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cb601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/30【リサーチ＆神学】キリストの十字架と復活への接続ポイントを書き留める",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-29T11:29:00.000Z",
    "updatedAt": "2026-08-29T11:29:00.000Z",
    "notionPageId": "3cb601af-1c24-8018-9e5a-daa11014b160"
  },
  {
    "id": "notion-3cb601af-1c24-80cd-aeec-eb25f1361013",
    "title": "8/30【リサーチ＆神学】原語の意味・歴史的背景・文脈の調査",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-25",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cb601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/30【リサーチ＆神学】原語の意味・歴史的背景・文脈の調査",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-29T11:29:00.000Z",
    "updatedAt": "2026-08-29T11:29:00.000Z",
    "notionPageId": "3cb601af-1c24-80cd-aeec-eb25f1361013"
  },
  {
    "id": "notion-3cb601af-1c24-80e9-83ec-d35e4b881514",
    "title": "8/30【アナログ＆牧会】メッセージの方向性とテーマ（1文）の決定",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-24",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cb601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/30【アナログ＆牧会】メッセージの方向性とテーマ（1文）の決定",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-29T11:29:00.000Z",
    "updatedAt": "2026-08-29T11:29:00.000Z",
    "notionPageId": "3cb601af-1c24-80e9-83ec-d35e4b881514"
  },
  {
    "id": "notion-3cb601af-1c24-80c0-b64a-c87758addd18",
    "title": "8/30【アナログ＆牧会】テキスト通読と心に響いた言葉の書き出し",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-24",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cb601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/30【アナログ＆牧会】テキスト通読と心に響いた言葉の書き出し",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-29T11:29:00.000Z",
    "updatedAt": "2026-08-29T11:29:00.000Z",
    "notionPageId": "3cb601af-1c24-80c0-b64a-c87758addd18"
  },
  {
    "id": "notion-3cb601af-1c24-8059-8a0e-dc481f899e2f",
    "title": "8/30【アナログ＆牧会】会衆と状況の黙想（社会情勢・地域の状況・教会の動き）",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-24",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3cb601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/30【アナログ＆牧会】会衆と状況の黙想（社会情勢・地域の状況・教会の動き）",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-29T11:29:00.000Z",
    "updatedAt": "2026-08-29T11:29:00.000Z",
    "notionPageId": "3cb601af-1c24-8059-8a0e-dc481f899e2f"
  },
  {
    "id": "notion-3c7601af-1c24-8149-8cdb-f276c7fc9eb0",
    "title": "教区聖会のプログラムの確認",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-25",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c7601af",
        "type": "callout",
        "content": "Notion同期タスク: 教区聖会のプログラムの確認",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-25T02:19:00.000Z",
    "updatedAt": "2026-08-25T02:19:00.000Z",
    "notionPageId": "3c7601af-1c24-8149-8cdb-f276c7fc9eb0"
  },
  {
    "id": "notion-3c3601af-1c24-8019-bfb9-d318752c7fd0",
    "title": "8/23【デザイン＆祈祷】スライドを見ながらの全体チェックと祈り込み",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-21",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c3601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/23【デザイン＆祈祷】スライドを見ながらの全体チェックと祈り込み",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-21T22:56:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3c3601af-1c24-8019-bfb9-d318752c7fd0"
  },
  {
    "id": "notion-3c3601af-1c24-8011-9cbb-d2f55cccbb38",
    "title": "8/23【デザイン＆祈祷】スライド（タイトル・3ポイント・聖句）の作成",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-21",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c3601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/23【デザイン＆祈祷】スライド（タイトル・3ポイント・聖句）の作成",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-21T22:56:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3c3601af-1c24-8011-9cbb-d2f55cccbb38"
  },
  {
    "id": "notion-3c3601af-1c24-8054-b8bf-ed2b93ba5f3c",
    "title": "8/23【ライティング】導入→本論→結論→適用の流れを通した原稿の肉付け・推敲",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-20",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c3601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/23【ライティング】導入→本論→結論→適用の流れを通した原稿の肉付け・推敲",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-21T22:56:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3c3601af-1c24-8054-b8bf-ed2b93ba5f3c"
  },
  {
    "id": "notion-3c3601af-1c24-80b4-a2d3-e8b8ccb47108",
    "title": "8/23【ライティング】結論を受けた具体的なアクション（適用）の作成",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-20",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c3601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/23【ライティング】結論を受けた具体的なアクション（適用）の作成",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-21T22:56:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3c3601af-1c24-80b4-a2d3-e8b8ccb47108"
  },
  {
    "id": "notion-3c3601af-1c24-8084-9a24-c64e79f3331a",
    "title": "8/23【ライティング】本論へ引き込む問いかけや例話（導入）の作成",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-20",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c3601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/23【ライティング】本論へ引き込む問いかけや例話（導入）の作成",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-21T22:56:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3c3601af-1c24-8084-9a24-c64e79f3331a"
  },
  {
    "id": "notion-3c3601af-1c24-80fa-aec8-d14419cac2fe",
    "title": "8/23【ストラクチャー】最終的な着地点（結論）の確定",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-19",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c3601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/23【ストラクチャー】最終的な着地点（結論）の確定",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-21T22:56:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3c3601af-1c24-80fa-aec8-d14419cac2fe"
  },
  {
    "id": "notion-3c3601af-1c24-80ad-8507-e98d107ced99",
    "title": "8/23【ストラクチャー】3つのブロックそれぞれの見出し（本論3ポイント）作成",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-19",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c3601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/23【ストラクチャー】3つのブロックそれぞれの見出し（本論3ポイント）作成",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-21T22:56:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3c3601af-1c24-80ad-8507-e98d107ced99"
  },
  {
    "id": "notion-3c3601af-1c24-80f1-9502-e7d33e69e56b",
    "title": "8/23【リサーチ＆神学】聖書箇所を3つの意味のまとまりにブロック分けする",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-18",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c3601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/23【リサーチ＆神学】聖書箇所を3つの意味のまとまりにブロック分けする",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-21T22:56:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3c3601af-1c24-80f1-9502-e7d33e69e56b"
  },
  {
    "id": "notion-3c3601af-1c24-80c4-8c82-fdda9797b0ce",
    "title": "8/23【リサーチ＆神学】聖書箇所を3つの意味のまとまりにブロック分けする",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-18",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c3601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/23【リサーチ＆神学】聖書箇所を3つの意味のまとまりにブロック分けする",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-21T22:56:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3c3601af-1c24-80c4-8c82-fdda9797b0ce"
  },
  {
    "id": "notion-3c3601af-1c24-8079-b72b-c8addbcfd893",
    "title": "8/23【リサーチ＆神学】キリストの十字架と復活への接続ポイントを書き留める",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-18",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c3601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/23【リサーチ＆神学】キリストの十字架と復活への接続ポイントを書き留める",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-21T22:56:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3c3601af-1c24-8079-b72b-c8addbcfd893"
  },
  {
    "id": "notion-3c3601af-1c24-80c8-abe5-dbf4807ad018",
    "title": "8/23【リサーチ＆神学】原語の意味・歴史的背景・文脈の調査",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-18",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c3601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/23【リサーチ＆神学】原語の意味・歴史的背景・文脈の調査",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-21T22:56:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3c3601af-1c24-80c8-abe5-dbf4807ad018"
  },
  {
    "id": "notion-3c3601af-1c24-8050-b5a6-e88c50440ecb",
    "title": "8/23【アナログ＆牧会】メッセージの方向性とテーマ（1文）の決定",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-17",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c3601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/23【アナログ＆牧会】メッセージの方向性とテーマ（1文）の決定",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-21T22:56:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3c3601af-1c24-8050-b5a6-e88c50440ecb"
  },
  {
    "id": "notion-3c3601af-1c24-8064-a98b-d9cbbe744066",
    "title": "8/23【アナログ＆牧会】テキスト通読と心に響いた言葉の書き出し",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-17",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c3601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/23【アナログ＆牧会】テキスト通読と心に響いた言葉の書き出し",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-21T22:56:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3c3601af-1c24-8064-a98b-d9cbbe744066"
  },
  {
    "id": "notion-3c3601af-1c24-80e3-abe7-c1261e29e30d",
    "title": "8/23【アナログ＆牧会】会衆と状況の黙想（社会情勢・地域の状況・教会の動き）",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-17",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c3601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/23【アナログ＆牧会】会衆と状況の黙想（社会情勢・地域の状況・教会の動き）",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-21T22:56:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3c3601af-1c24-80e3-abe7-c1261e29e30d"
  },
  {
    "id": "notion-3c2601af-1c24-80d3-9af1-f6685f326ef5",
    "title": "インスタの投稿をする",
    "completed": true,
    "completedAt": "2026-08-20T20:56:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-20",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c2601af",
        "type": "callout",
        "content": "Notion同期タスク: インスタの投稿をする",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-20T01:29:00.000Z",
    "updatedAt": "2026-08-20T20:56:00.000Z",
    "notionPageId": "3c2601af-1c24-80d3-9af1-f6685f326ef5"
  },
  {
    "id": "notion-3c2601af-1c24-805f-86e9-e736948761c1",
    "title": "センサーライトを購入する",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c2601af",
        "type": "callout",
        "content": "Notion同期タスク: センサーライトを購入する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-20T01:28:00.000Z",
    "updatedAt": "2026-08-23T23:32:00.000Z",
    "notionPageId": "3c2601af-1c24-805f-86e9-e736948761c1"
  },
  {
    "id": "notion-3c2601af-1c24-801d-84ce-dbde813413f9",
    "title": "動力と電灯の契約を変更する",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-20",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3c2601af",
        "type": "callout",
        "content": "Notion同期タスク: 動力と電灯の契約を変更する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-20T01:27:00.000Z",
    "updatedAt": "2026-08-20T01:28:00.000Z",
    "notionPageId": "3c2601af-1c24-801d-84ce-dbde813413f9"
  },
  {
    "id": "notion-3bf601af-1c24-8108-ae76-c3b50b0bf6a7",
    "title": "働く妊婦のための過ごし方の目安",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3bf601af",
        "type": "callout",
        "content": "Notion同期タスク: 働く妊婦のための過ごし方の目安",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-17T21:15:00.000Z",
    "updatedAt": "2026-08-23T23:32:00.000Z",
    "notionPageId": "3bf601af-1c24-8108-ae76-c3b50b0bf6a7"
  },
  {
    "id": "notion-3bf601af-1c24-81b6-a980-d30797b268ea",
    "title": "電気料金の比較を確認する",
    "completed": true,
    "completedAt": "2026-08-18T13:00:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-18",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3bf601af",
        "type": "callout",
        "content": "Notion同期タスク: 電気料金の比較を確認する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-17T21:14:00.000Z",
    "updatedAt": "2026-08-18T13:00:00.000Z",
    "notionPageId": "3bf601af-1c24-81b6-a980-d30797b268ea"
  },
  {
    "id": "notion-3bf601af-1c24-815f-abb4-d3686bdf8565",
    "title": "あかり先生に返信する",
    "completed": true,
    "completedAt": "2026-08-18T07:45:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-17",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3bf601af",
        "type": "callout",
        "content": "Notion同期タスク: あかり先生に返信する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-17T12:00:00.000Z",
    "updatedAt": "2026-08-18T07:45:00.000Z",
    "notionPageId": "3bf601af-1c24-815f-abb4-d3686bdf8565"
  },
  {
    "id": "notion-3bc601af-1c24-80cb-8efa-d29e4065db56",
    "title": "駐車場の段差に鉄板をうちもむかゴムシートをしく",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3bc601af",
        "type": "callout",
        "content": "Notion同期タスク: 駐車場の段差に鉄板をうちもむかゴムシートをしく",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-14T21:36:00.000Z",
    "updatedAt": "2026-08-23T23:32:00.000Z",
    "notionPageId": "3bc601af-1c24-80cb-8efa-d29e4065db56"
  },
  {
    "id": "notion-3bc601af-1c24-80e4-9a2a-ffc8ee4227e2",
    "title": "CBCキャンプでお願いすることをあげる",
    "completed": true,
    "completedAt": "2026-08-18T07:45:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-15",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3bc601af",
        "type": "callout",
        "content": "Notion同期タスク: CBCキャンプでお願いすることをあげる",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-14T21:35:00.000Z",
    "updatedAt": "2026-08-18T07:45:00.000Z",
    "notionPageId": "3bc601af-1c24-80e4-9a2a-ffc8ee4227e2"
  },
  {
    "id": "notion-3bc601af-1c24-80c4-85d2-eea6a65856dd",
    "title": "CBCキャンプのお話を考える",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": "2026-08-15",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3bc601af",
        "type": "callout",
        "content": "Notion同期タスク: CBCキャンプのお話を考える",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-14T21:35:00.000Z",
    "updatedAt": "2026-08-14T21:36:00.000Z",
    "notionPageId": "3bc601af-1c24-80c4-85d2-eea6a65856dd"
  },
  {
    "id": "notion-3bc601af-1c24-8035-a04c-e51482dbb0a8",
    "title": "CBCキャンプの必要なものと買い出しのリスト作成",
    "completed": true,
    "completedAt": "2026-08-15T12:19:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-15",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3bc601af",
        "type": "callout",
        "content": "Notion同期タスク: CBCキャンプの必要なものと買い出しのリスト作成",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-14T21:35:00.000Z",
    "updatedAt": "2026-08-15T12:19:00.000Z",
    "notionPageId": "3bc601af-1c24-8035-a04c-e51482dbb0a8"
  },
  {
    "id": "notion-3bc601af-1c24-8052-87e1-eb041f22f660",
    "title": "愛さんかいの準備",
    "completed": true,
    "completedAt": "2026-08-15T01:25:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-15",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3bc601af",
        "type": "callout",
        "content": "Notion同期タスク: 愛さんかいの準備",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-14T21:34:00.000Z",
    "updatedAt": "2026-08-15T01:25:00.000Z",
    "notionPageId": "3bc601af-1c24-8052-87e1-eb041f22f660"
  },
  {
    "id": "notion-3bc601af-1c24-80d2-a2a8-d8607c7403f3",
    "title": "聖餐式の準備",
    "completed": true,
    "completedAt": "2026-08-15T12:19:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-15",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3bc601af",
        "type": "callout",
        "content": "Notion同期タスク: 聖餐式の準備",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-14T21:34:00.000Z",
    "updatedAt": "2026-08-15T12:19:00.000Z",
    "notionPageId": "3bc601af-1c24-80d2-a2a8-d8607c7403f3"
  },
  {
    "id": "notion-3bc601af-1c24-8074-9da1-fbd795e43106",
    "title": "礼拝の時の子供達の時間の準備（うちわ）",
    "completed": true,
    "completedAt": "2026-08-18T07:45:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-15",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3bc601af",
        "type": "callout",
        "content": "Notion同期タスク: 礼拝の時の子供達の時間の準備（うちわ）",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-14T21:33:00.000Z",
    "updatedAt": "2026-08-18T07:45:00.000Z",
    "notionPageId": "3bc601af-1c24-8074-9da1-fbd795e43106"
  },
  {
    "id": "notion-3bc601af-1c24-80c9-af05-f3fd479c9725",
    "title": "礼拝のyoutubeの準備",
    "completed": true,
    "completedAt": "2026-08-15T12:20:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-15",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3bc601af",
        "type": "callout",
        "content": "Notion同期タスク: 礼拝のyoutubeの準備",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-14T21:33:00.000Z",
    "updatedAt": "2026-08-15T12:20:00.000Z",
    "notionPageId": "3bc601af-1c24-80c9-af05-f3fd479c9725"
  },
  {
    "id": "notion-3bc601af-1c24-80c6-9428-c5b89d2d0359",
    "title": "賛美のipadの準備",
    "completed": true,
    "completedAt": "2026-08-18T07:45:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-15",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3bc601af",
        "type": "callout",
        "content": "Notion同期タスク: 賛美のipadの準備",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-14T21:33:00.000Z",
    "updatedAt": "2026-08-18T07:45:00.000Z",
    "notionPageId": "3bc601af-1c24-80c6-9428-c5b89d2d0359"
  },
  {
    "id": "notion-3b9601af-1c24-8108-a55f-fb0846e8658c",
    "title": "キッズのゲーム用の道具を少しずつ増やしていく",
    "completed": true,
    "completedAt": "2026-08-22T09:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-11",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b9601af",
        "type": "callout",
        "content": "Notion同期タスク: キッズのゲーム用の道具を少しずつ増やしていく",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-11T08:07:00.000Z",
    "updatedAt": "2026-08-22T09:09:00.000Z",
    "notionPageId": "3b9601af-1c24-8108-a55f-fb0846e8658c"
  },
  {
    "id": "notion-3b8601af-1c24-8094-851e-dd365ad61121",
    "title": "段ボールを3階に運んでおく",
    "completed": true,
    "completedAt": "2026-08-10T03:14:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-10",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b8601af",
        "type": "callout",
        "content": "Notion同期タスク: 段ボールを3階に運んでおく",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-10T01:51:00.000Z",
    "updatedAt": "2026-08-10T03:14:00.000Z",
    "notionPageId": "3b8601af-1c24-8094-851e-dd365ad61121"
  },
  {
    "id": "notion-3b8601af-1c24-80ad-956d-d55c0b0b9048",
    "title": "椅子を3階に運んでおく",
    "completed": true,
    "completedAt": "2026-08-10T09:35:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-10",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b8601af",
        "type": "callout",
        "content": "Notion同期タスク: 椅子を3階に運んでおく",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-10T01:51:00.000Z",
    "updatedAt": "2026-08-10T09:35:00.000Z",
    "notionPageId": "3b8601af-1c24-80ad-956d-d55c0b0b9048"
  },
  {
    "id": "notion-3b8601af-1c24-8046-9243-c0ad6fb19387",
    "title": "机を3階に運んでおく",
    "completed": true,
    "completedAt": "2026-08-10T09:35:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-10",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b8601af",
        "type": "callout",
        "content": "Notion同期タスク: 机を3階に運んでおく",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-10T01:51:00.000Z",
    "updatedAt": "2026-08-10T09:35:00.000Z",
    "notionPageId": "3b8601af-1c24-8046-9243-c0ad6fb19387"
  },
  {
    "id": "notion-3b5601af-1c24-80d4-8ff2-cd8a3866b06f",
    "title": "方舟の完成を確認して、もう1セット作るかを確認する",
    "completed": true,
    "completedAt": "2026-08-09T13:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 方舟の完成を確認して、もう1セット作るかを確認する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T08:40:00.000Z",
    "updatedAt": "2026-08-09T13:09:00.000Z",
    "notionPageId": "3b5601af-1c24-80d4-8ff2-cd8a3866b06f"
  },
  {
    "id": "notion-3b5601af-1c24-80eb-87a2-e83f399f343d",
    "title": "かき氷用の氷を購入",
    "completed": true,
    "completedAt": "2026-08-10T09:35:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-10",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: かき氷用の氷を購入",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T08:39:00.000Z",
    "updatedAt": "2026-08-10T09:35:00.000Z",
    "notionPageId": "3b5601af-1c24-80eb-87a2-e83f399f343d"
  },
  {
    "id": "notion-3b5601af-1c24-80cb-9e30-cf03cd724391",
    "title": "あひるのおもちゃ",
    "completed": true,
    "completedAt": "2026-08-09T13:10:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: あひるのおもちゃ",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T08:26:00.000Z",
    "updatedAt": "2026-08-09T13:10:00.000Z",
    "notionPageId": "3b5601af-1c24-80cb-9e30-cf03cd724391"
  },
  {
    "id": "notion-3b5601af-1c24-8012-aea3-c421a5b03e13",
    "title": "シーソーの準備",
    "completed": true,
    "completedAt": "2026-08-10T03:14:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-10",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: シーソーの準備",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T08:26:00.000Z",
    "updatedAt": "2026-08-10T03:14:00.000Z",
    "notionPageId": "3b5601af-1c24-8012-aea3-c421a5b03e13"
  },
  {
    "id": "notion-3b5601af-1c24-8035-b3eb-e3ba4e708959",
    "title": "食事の時の机の確保を確認する",
    "completed": true,
    "completedAt": "2026-08-08T12:11:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 食事の時の机の確保を確認する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T08:24:00.000Z",
    "updatedAt": "2026-08-08T12:11:00.000Z",
    "notionPageId": "3b5601af-1c24-8035-b3eb-e3ba4e708959"
  },
  {
    "id": "notion-3b5601af-1c24-8078-9cd7-d073a74b189f",
    "title": "8/9【デザイン＆祈祷】スライドを見ながらの全体チェックと祈り込み",
    "completed": true,
    "completedAt": "2026-08-09T13:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-07",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/9【デザイン＆祈祷】スライドを見ながらの全体チェックと祈り込み",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T07:56:00.000Z",
    "updatedAt": "2026-08-09T13:09:00.000Z",
    "notionPageId": "3b5601af-1c24-8078-9cd7-d073a74b189f"
  },
  {
    "id": "notion-3b5601af-1c24-80e4-825b-e1d44c257655",
    "title": "8/9【デザイン＆祈祷】スライド（タイトル・3ポイント・聖句）の作成",
    "completed": true,
    "completedAt": "2026-08-09T13:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-07",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/9【デザイン＆祈祷】スライド（タイトル・3ポイント・聖句）の作成",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T07:56:00.000Z",
    "updatedAt": "2026-08-09T13:09:00.000Z",
    "notionPageId": "3b5601af-1c24-80e4-825b-e1d44c257655"
  },
  {
    "id": "notion-3b5601af-1c24-80a6-ab4f-e81ee88ce50e",
    "title": "8/9【ライティング】導入→本論→結論→適用の流れを通した原稿の肉付け・推敲",
    "completed": true,
    "completedAt": "2026-08-09T13:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-06",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/9【ライティング】導入→本論→結論→適用の流れを通した原稿の肉付け・推敲",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T07:56:00.000Z",
    "updatedAt": "2026-08-09T13:09:00.000Z",
    "notionPageId": "3b5601af-1c24-80a6-ab4f-e81ee88ce50e"
  },
  {
    "id": "notion-3b5601af-1c24-8037-b7c7-c495e09215fd",
    "title": "8/9【ライティング】結論を受けた具体的なアクション（適用）の作成",
    "completed": true,
    "completedAt": "2026-08-08T23:58:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-06",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/9【ライティング】結論を受けた具体的なアクション（適用）の作成",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T07:56:00.000Z",
    "updatedAt": "2026-08-08T23:58:00.000Z",
    "notionPageId": "3b5601af-1c24-8037-b7c7-c495e09215fd"
  },
  {
    "id": "notion-3b5601af-1c24-80ec-afc1-d48b7c0303f3",
    "title": "8/9【ライティング】本論へ引き込む問いかけや例話（導入）の作成",
    "completed": true,
    "completedAt": "2026-08-08T23:58:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-06",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/9【ライティング】本論へ引き込む問いかけや例話（導入）の作成",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T07:56:00.000Z",
    "updatedAt": "2026-08-08T23:58:00.000Z",
    "notionPageId": "3b5601af-1c24-80ec-afc1-d48b7c0303f3"
  },
  {
    "id": "notion-3b5601af-1c24-809c-aa9f-cf3dbc455975",
    "title": "8/9【ストラクチャー】最終的な着地点（結論）の確定",
    "completed": true,
    "completedAt": "2026-08-08T23:58:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-05",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/9【ストラクチャー】最終的な着地点（結論）の確定",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T07:56:00.000Z",
    "updatedAt": "2026-08-08T23:58:00.000Z",
    "notionPageId": "3b5601af-1c24-809c-aa9f-cf3dbc455975"
  },
  {
    "id": "notion-3b5601af-1c24-807b-bb81-d3cf1e1e07ec",
    "title": "8/9【ストラクチャー】3つのブロックそれぞれの見出し（本論3ポイント）作成",
    "completed": true,
    "completedAt": "2026-08-08T23:47:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-05",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/9【ストラクチャー】3つのブロックそれぞれの見出し（本論3ポイント）作成",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T07:56:00.000Z",
    "updatedAt": "2026-08-08T23:47:00.000Z",
    "notionPageId": "3b5601af-1c24-807b-bb81-d3cf1e1e07ec"
  },
  {
    "id": "notion-3b5601af-1c24-80e3-a98f-d1f3405548b6",
    "title": "8/9【リサーチ＆神学】聖書箇所を3つの意味のまとまりにブロック分けする",
    "completed": true,
    "completedAt": "2026-08-08T23:47:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-04",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/9【リサーチ＆神学】聖書箇所を3つの意味のまとまりにブロック分けする",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T07:56:00.000Z",
    "updatedAt": "2026-08-08T23:47:00.000Z",
    "notionPageId": "3b5601af-1c24-80e3-a98f-d1f3405548b6"
  },
  {
    "id": "notion-3b5601af-1c24-8085-88b8-c4f087ad4efc",
    "title": "8/9【リサーチ＆神学】聖書箇所を3つの意味のまとまりにブロック分けする",
    "completed": true,
    "completedAt": "2026-08-08T23:47:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-04",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/9【リサーチ＆神学】聖書箇所を3つの意味のまとまりにブロック分けする",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T07:56:00.000Z",
    "updatedAt": "2026-08-08T23:47:00.000Z",
    "notionPageId": "3b5601af-1c24-8085-88b8-c4f087ad4efc"
  },
  {
    "id": "notion-3b5601af-1c24-8017-8c32-ee4a264c3758",
    "title": "8/9【リサーチ＆神学】キリストの十字架と復活への接続ポイントを書き留める",
    "completed": true,
    "completedAt": "2026-08-08T23:47:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-04",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/9【リサーチ＆神学】キリストの十字架と復活への接続ポイントを書き留める",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T07:56:00.000Z",
    "updatedAt": "2026-08-08T23:47:00.000Z",
    "notionPageId": "3b5601af-1c24-8017-8c32-ee4a264c3758"
  },
  {
    "id": "notion-3b5601af-1c24-8070-9470-f344b32d360e",
    "title": "8/9【リサーチ＆神学】原語の意味・歴史的背景・文脈の調査",
    "completed": true,
    "completedAt": "2026-08-07T12:35:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-04",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/9【リサーチ＆神学】原語の意味・歴史的背景・文脈の調査",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T07:56:00.000Z",
    "updatedAt": "2026-08-07T12:35:00.000Z",
    "notionPageId": "3b5601af-1c24-8070-9470-f344b32d360e"
  },
  {
    "id": "notion-3b5601af-1c24-8041-9408-cf4a46b276e3",
    "title": "8/9【アナログ＆牧会】メッセージの方向性とテーマ（1文）の決定",
    "completed": true,
    "completedAt": "2026-08-07T12:35:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-03",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/9【アナログ＆牧会】メッセージの方向性とテーマ（1文）の決定",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T07:56:00.000Z",
    "updatedAt": "2026-08-07T12:35:00.000Z",
    "notionPageId": "3b5601af-1c24-8041-9408-cf4a46b276e3"
  },
  {
    "id": "notion-3b5601af-1c24-80f5-8c33-cfb7fcc87e6f",
    "title": "8/9【アナログ＆牧会】テキスト通読と心に響いた言葉の書き出し",
    "completed": true,
    "completedAt": "2026-08-07T08:20:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-03",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/9【アナログ＆牧会】テキスト通読と心に響いた言葉の書き出し",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T07:56:00.000Z",
    "updatedAt": "2026-08-07T08:20:00.000Z",
    "notionPageId": "3b5601af-1c24-80f5-8c33-cfb7fcc87e6f"
  },
  {
    "id": "notion-3b5601af-1c24-80a4-9745-e5ea1ab9e7f4",
    "title": "8/9【アナログ＆牧会】会衆と状況の黙想（社会情勢・地域の状況・教会の動き）",
    "completed": true,
    "completedAt": "2026-08-07T08:20:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-03",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b5601af",
        "type": "callout",
        "content": "Notion同期タスク: 8/9【アナログ＆牧会】会衆と状況の黙想（社会情勢・地域の状況・教会の動き）",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-07T07:56:00.000Z",
    "updatedAt": "2026-08-07T08:20:00.000Z",
    "notionPageId": "3b5601af-1c24-80a4-9745-e5ea1ab9e7f4"
  },
  {
    "id": "notion-3b4601af-1c24-80d9-b1c9-f1bd4a3f284b",
    "title": "県庁前店のワークマンで帽子を購入",
    "completed": true,
    "completedAt": "2026-08-10T01:30:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b4601af",
        "type": "callout",
        "content": "Notion同期タスク: 県庁前店のワークマンで帽子を購入",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-06T13:51:00.000Z",
    "updatedAt": "2026-08-10T01:30:00.000Z",
    "notionPageId": "3b4601af-1c24-80d9-b1c9-f1bd4a3f284b"
  },
  {
    "id": "notion-3b2601af-1c24-80dd-8e7b-c1461ab43ea0",
    "title": "無題のタスク",
    "completed": true,
    "completedAt": "2026-08-05T08:45:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: 無題のタスク",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:58:00.000Z",
    "updatedAt": "2026-08-05T08:45:00.000Z",
    "notionPageId": "3b2601af-1c24-80dd-8e7b-c1461ab43ea0"
  },
  {
    "id": "notion-3b2601af-1c24-806e-a667-fce2fa136e39",
    "title": "トラクト配布の準備",
    "completed": true,
    "completedAt": "2026-08-07T08:23:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: トラクト配布の準備",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:56:00.000Z",
    "updatedAt": "2026-08-07T08:23:00.000Z",
    "notionPageId": "3b2601af-1c24-806e-a667-fce2fa136e39"
  },
  {
    "id": "notion-3b2601af-1c24-8069-bf8f-e32bc09b0a3d",
    "title": "全体の記録のためのビデオカメラを設定する",
    "completed": true,
    "completedAt": "2026-08-14T21:31:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-11",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: 全体の記録のためのビデオカメラを設定する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:55:00.000Z",
    "updatedAt": "2026-08-14T21:31:00.000Z",
    "notionPageId": "3b2601af-1c24-8069-bf8f-e32bc09b0a3d"
  },
  {
    "id": "notion-3b2601af-1c24-800a-aa42-c7f7c3d42e60",
    "title": "分かち合いのためのズームリンクを送る",
    "completed": true,
    "completedAt": "2026-08-10T09:35:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-10",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: 分かち合いのためのズームリンクを送る",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:55:00.000Z",
    "updatedAt": "2026-08-10T09:35:00.000Z",
    "notionPageId": "3b2601af-1c24-800a-aa42-c7f7c3d42e60"
  },
  {
    "id": "notion-3b2601af-1c24-804c-9ded-ec87c7fb3de7",
    "title": "予算を確定したものを作成して藤村先生に送る",
    "completed": true,
    "completedAt": "2026-08-09T13:10:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: 予算を確定したものを作成して藤村先生に送る",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:55:00.000Z",
    "updatedAt": "2026-08-09T13:10:00.000Z",
    "notionPageId": "3b2601af-1c24-804c-9ded-ec87c7fb3de7"
  },
  {
    "id": "notion-3b2601af-1c24-808c-9185-c5ba847a72b2",
    "title": "うちわを購入する",
    "completed": true,
    "completedAt": "2026-08-06T05:24:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: うちわを購入する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:54:00.000Z",
    "updatedAt": "2026-08-06T05:24:00.000Z",
    "notionPageId": "3b2601af-1c24-808c-9185-c5ba847a72b2"
  },
  {
    "id": "notion-3b2601af-1c24-8068-a241-e56f1dfb8366",
    "title": "かき氷用のカップを購入",
    "completed": true,
    "completedAt": "2026-08-07T08:23:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: かき氷用のカップを購入",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:53:00.000Z",
    "updatedAt": "2026-08-07T08:23:00.000Z",
    "notionPageId": "3b2601af-1c24-8068-a241-e56f1dfb8366"
  },
  {
    "id": "notion-3b2601af-1c24-80fb-9cf3-c2b92b511cc0",
    "title": "食事をする人数を藤沢から確認する",
    "completed": true,
    "completedAt": "2026-08-06T05:24:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: 食事をする人数を藤沢から確認する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:53:00.000Z",
    "updatedAt": "2026-08-06T05:24:00.000Z",
    "notionPageId": "3b2601af-1c24-80fb-9cf3-c2b92b511cc0"
  },
  {
    "id": "notion-3b2601af-1c24-80dd-8ea5-c78cfa5850f8",
    "title": "シーソー用で文庫本ボックスを使う",
    "completed": true,
    "completedAt": "2026-08-10T03:14:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-10",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: シーソー用で文庫本ボックスを使う",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:48:00.000Z",
    "updatedAt": "2026-08-10T03:14:00.000Z",
    "notionPageId": "3b2601af-1c24-80dd-8ea5-c78cfa5850f8"
  },
  {
    "id": "notion-3b2601af-1c24-805a-9065-f27d1c8dae1c",
    "title": "松井商店に駐車場のお願いをする",
    "completed": true,
    "completedAt": "2026-08-06T05:24:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: 松井商店に駐車場のお願いをする",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:47:00.000Z",
    "updatedAt": "2026-08-06T05:24:00.000Z",
    "notionPageId": "3b2601af-1c24-805a-9065-f27d1c8dae1c"
  },
  {
    "id": "notion-3b2601af-1c24-80b6-8566-c09065fbe867",
    "title": "水風船を当てるターゲットを用意する",
    "completed": true,
    "completedAt": "2026-08-09T13:10:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: 水風船を当てるターゲットを用意する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:47:00.000Z",
    "updatedAt": "2026-08-09T13:10:00.000Z",
    "notionPageId": "3b2601af-1c24-80b6-8566-c09065fbe867"
  },
  {
    "id": "notion-3b2601af-1c24-80d1-ac1e-f927fbdcea16",
    "title": "ポイもしくはそれに代わるものを準備する",
    "completed": true,
    "completedAt": "2026-08-07T08:23:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: ポイもしくはそれに代わるものを準備する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:46:00.000Z",
    "updatedAt": "2026-08-07T08:23:00.000Z",
    "notionPageId": "3b2601af-1c24-80d1-ac1e-f927fbdcea16"
  },
  {
    "id": "notion-3b2601af-1c24-80c6-91c0-ccda8e1ae61c",
    "title": "水風船を購入する",
    "completed": true,
    "completedAt": "2026-08-07T08:23:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: 水風船を購入する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:46:00.000Z",
    "updatedAt": "2026-08-07T08:23:00.000Z",
    "notionPageId": "3b2601af-1c24-80c6-91c0-ccda8e1ae61c"
  },
  {
    "id": "notion-3b2601af-1c24-804d-af17-ce2825977017",
    "title": "水鉄砲を用意する",
    "completed": true,
    "completedAt": "2026-08-09T13:09:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: 水鉄砲を用意する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:46:00.000Z",
    "updatedAt": "2026-08-09T13:09:00.000Z",
    "notionPageId": "3b2601af-1c24-804d-af17-ce2825977017"
  },
  {
    "id": "notion-3b2601af-1c24-8035-859a-e1ec2bd15c1e",
    "title": "油性マジックや装飾用のシールを用意する",
    "completed": true,
    "completedAt": "2026-08-07T08:23:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: 油性マジックや装飾用のシールを用意する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:45:00.000Z",
    "updatedAt": "2026-08-07T08:23:00.000Z",
    "notionPageId": "3b2601af-1c24-8035-859a-e1ec2bd15c1e"
  },
  {
    "id": "notion-3b2601af-1c24-80d0-b308-cf5772047aed",
    "title": "布テープやガムテープを用意する",
    "completed": true,
    "completedAt": "2026-08-07T08:23:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: 布テープやガムテープを用意する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:44:00.000Z",
    "updatedAt": "2026-08-07T08:23:00.000Z",
    "notionPageId": "3b2601af-1c24-80d0-b308-cf5772047aed"
  },
  {
    "id": "notion-3b2601af-1c24-8065-8de3-d6f7ed439976",
    "title": "動物カードを印刷してカットする",
    "completed": true,
    "completedAt": "2026-08-14T21:30:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-10",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: 動物カードを印刷してカットする",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:44:00.000Z",
    "updatedAt": "2026-08-14T21:30:00.000Z",
    "notionPageId": "3b2601af-1c24-8065-8de3-d6f7ed439976"
  },
  {
    "id": "notion-3b2601af-1c24-80e1-98d7-d794789e80af",
    "title": "段ボールを集める",
    "completed": true,
    "completedAt": "2026-08-06T04:30:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: 段ボールを集める",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:44:00.000Z",
    "updatedAt": "2026-08-06T04:30:00.000Z",
    "notionPageId": "3b2601af-1c24-80e1-98d7-d794789e80af"
  },
  {
    "id": "notion-3b2601af-1c24-80a2-85ea-e71f6e305a4f",
    "title": "段ボール作りの設計をする",
    "completed": true,
    "completedAt": "2026-08-05T08:45:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b2601af",
        "type": "callout",
        "content": "Notion同期タスク: 段ボール作りの設計をする",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-04T14:43:00.000Z",
    "updatedAt": "2026-08-05T08:45:00.000Z",
    "notionPageId": "3b2601af-1c24-80a2-85ea-e71f6e305a4f"
  },
  {
    "id": "notion-3b1601af-1c24-81b3-ace9-efafca82d7f7",
    "title": "眼科にいく",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b1601af",
        "type": "callout",
        "content": "Notion同期タスク: 眼科にいく",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-03T20:33:00.000Z",
    "updatedAt": "2026-08-10T01:51:00.000Z",
    "notionPageId": "3b1601af-1c24-81b3-ace9-efafca82d7f7"
  },
  {
    "id": "notion-3b0601af-1c24-80f4-9651-ef8c1a820e3e",
    "title": "高嶋さんが来るときにお盆休みで大丈夫か確認",
    "completed": true,
    "completedAt": "2026-08-06T20:59:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b0601af",
        "type": "callout",
        "content": "Notion同期タスク: 高嶋さんが来るときにお盆休みで大丈夫か確認",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-02T13:32:00.000Z",
    "updatedAt": "2026-08-06T20:59:00.000Z",
    "notionPageId": "3b0601af-1c24-80f4-9651-ef8c1a820e3e"
  },
  {
    "id": "notion-3b0601af-1c24-8030-a3db-e6ba116c8908",
    "title": "教会で遊ぼうの下準備をする段取り",
    "completed": true,
    "completedAt": "2026-08-05T08:45:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-05",
    "dueTime": "05:00",
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b0601af",
        "type": "callout",
        "content": "Notion同期タスク: 教会で遊ぼうの下準備をする段取り",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-02T13:28:00.000Z",
    "updatedAt": "2026-08-05T08:45:00.000Z",
    "notionPageId": "3b0601af-1c24-8030-a3db-e6ba116c8908"
  },
  {
    "id": "notion-3b0601af-1c24-80a6-9201-cd6733f69450",
    "title": "高木先生に返信する",
    "completed": true,
    "completedAt": "2026-08-06T20:58:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-07",
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3b0601af",
        "type": "callout",
        "content": "Notion同期タスク: 高木先生に返信する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-02T13:28:00.000Z",
    "updatedAt": "2026-08-06T20:58:00.000Z",
    "notionPageId": "3b0601af-1c24-80a6-9201-cd6733f69450"
  },
  {
    "id": "notion-f4e4d335-7649-4661-a090-0455a3929377",
    "title": "浦野先生に返信する",
    "completed": true,
    "completedAt": "2026-08-02T13:36:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-02",
    "dueTime": "05:30",
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-f4e4d335",
        "type": "callout",
        "content": "Notion同期タスク: 浦野先生に返信する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-01T12:25:00.000Z",
    "updatedAt": "2026-08-02T13:36:00.000Z",
    "notionPageId": "f4e4d335-7649-4661-a090-0455a3929377"
  },
  {
    "id": "notion-3af601af-1c24-807a-b511-e5599026ac14",
    "title": "聖会のコサージュを誰にしたか確認",
    "completed": false,
    "completedAt": null,
    "status": "not_started",
    "priority": "none",
    "dueDate": null,
    "dueTime": null,
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3af601af",
        "type": "callout",
        "content": "Notion同期タスク: 聖会のコサージュを誰にしたか確認",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-01T12:18:00.000Z",
    "updatedAt": "2026-08-01T12:52:00.000Z",
    "notionPageId": "3af601af-1c24-807a-b511-e5599026ac14"
  },
  {
    "id": "notion-3af601af-1c24-814d-a521-ca32e97f87e6",
    "title": "高木先生に返信する",
    "completed": true,
    "completedAt": "2026-08-02T13:57:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-02",
    "dueTime": "06:00",
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3af601af",
        "type": "callout",
        "content": "Notion同期タスク: 高木先生に返信する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-08-01T10:40:00.000Z",
    "updatedAt": "2026-08-02T13:57:00.000Z",
    "notionPageId": "3af601af-1c24-814d-a521-ca32e97f87e6"
  },
  {
    "id": "notion-3ae601af-1c24-8003-9b71-f9bf5bf789e3",
    "title": "週報を印刷する",
    "completed": true,
    "completedAt": "2026-08-02T13:36:00.000Z",
    "status": "completed",
    "priority": "none",
    "dueDate": "2026-08-02",
    "dueTime": "05:00",
    "listId": "inbox",
    "tags": [],
    "subtasks": [],
    "notionBlocks": [
      {
        "id": "nb-3ae601af",
        "type": "callout",
        "content": "Notion同期タスク: 週報を印刷する",
        "calloutIcon": "⚡"
      }
    ],
    "estimatedPomodoros": 2,
    "completedPomodoros": 0,
    "createdAt": "2026-07-31T11:57:00.000Z",
    "updatedAt": "2026-08-02T13:36:00.000Z",
    "notionPageId": "3ae601af-1c24-8003-9b71-f9bf5bf789e3"
  }
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
  notionDatabaseId: '311601af-1c24-818e-8631-d288af234250',
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
