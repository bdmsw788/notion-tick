import { Task, NotionBlock, Priority, TaskStatus } from '../types';

export interface NotionSyncResult {
  success: boolean;
  message: string;
  syncedTasks?: Task[];
  errors?: string[];
}

// Format 32-char UUID or extract from Notion Database URL
export const normalizeNotionId = (raw: string): string => {
  if (!raw) return '';
  const trimmed = raw.trim();

  // If user pasted a full URL (e.g. https://www.notion.so/workspace/1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d?v=...)
  const match = trimmed.match(/([a-f0-9]{32})/i) || trimmed.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
  if (match) {
    const hex = match[1].replace(/-/g, '');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  const clean = trimmed.replace(/-/g, '');
  if (clean.length === 32) {
    return `${clean.slice(0, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}-${clean.slice(16, 20)}-${clean.slice(20)}`;
  }
  return trimmed;
};

export const notionService = {
  // Convert Notion Blocks to Markdown
  blocksToMarkdown(blocks: NotionBlock[]): string {
    return blocks
      .map((b) => {
        switch (b.type) {
          case 'h1':
            return `# ${b.content}`;
          case 'h2':
            return `## ${b.content}`;
          case 'h3':
            return `### ${b.content}`;
          case 'bullet':
            return `- ${b.content}`;
          case 'number':
            return `1. ${b.content}`;
          case 'todo':
            return `- [${b.checked ? 'x' : ' '}] ${b.content}`;
          case 'quote':
            return `> ${b.content}`;
          case 'code':
            return `\`\`\`\n${b.content}\n\`\`\``;
          case 'callout':
            return `> ${b.calloutIcon || '💡'} **Note:** ${b.content}`;
          case 'divider':
            return `---`;
          default:
            return b.content;
        }
      })
      .join('\n\n');
  },

  // Parse Markdown text into Notion Blocks
  markdownToBlocks(markdown: string): NotionBlock[] {
    const lines = markdown.split('\n');
    const blocks: NotionBlock[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('```')) {
        if (inCodeBlock) {
          blocks.push({
            id: `nb-code-${idx}`,
            type: 'code',
            content: codeBuffer.join('\n'),
          });
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeBuffer = [];
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (!trimmed) return;

      if (trimmed.startsWith('# ')) {
        blocks.push({
          id: `nb-h1-${idx}`,
          type: 'h1',
          content: trimmed.replace(/^#\s+/, ''),
        });
      } else if (trimmed.startsWith('## ')) {
        blocks.push({
          id: `nb-h2-${idx}`,
          type: 'h2',
          content: trimmed.replace(/^##\s+/, ''),
        });
      } else if (trimmed.startsWith('### ')) {
        blocks.push({
          id: `nb-h3-${idx}`,
          type: 'h3',
          content: trimmed.replace(/^###\s+/, ''),
        });
      } else if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('- [x] ')) {
        blocks.push({
          id: `nb-todo-${idx}`,
          type: 'todo',
          content: trimmed.substring(6),
          checked: trimmed.startsWith('- [x] '),
        });
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        blocks.push({
          id: `nb-bullet-${idx}`,
          type: 'bullet',
          content: trimmed.replace(/^[-*]\s+/, ''),
        });
      } else if (/^\d+\.\s+/.test(trimmed)) {
        blocks.push({
          id: `nb-num-${idx}`,
          type: 'number',
          content: trimmed.replace(/^\d+\.\s+/, ''),
        });
      } else if (trimmed.startsWith('> ')) {
        const quoteContent = trimmed.replace(/^>\s+/, '');
        if (quoteContent.includes('💡') || quoteContent.includes('⚠️') || quoteContent.includes('Note:')) {
          blocks.push({
            id: `nb-callout-${idx}`,
            type: 'callout',
            content: quoteContent.replace(/^(\S+)\s*\*\*Note:\*\*\s*/, ''),
            calloutIcon: quoteContent.charAt(0) || '💡',
          });
        } else {
          blocks.push({
            id: `nb-quote-${idx}`,
            type: 'quote',
            content: quoteContent,
          });
        }
      } else if (trimmed === '---') {
        blocks.push({
          id: `nb-div-${idx}`,
          type: 'divider',
          content: '',
        });
      } else {
        blocks.push({
          id: `nb-text-${idx}`,
          type: 'text',
          content: trimmed,
        });
      }
    });

    return blocks.length > 0
      ? blocks
      : [{ id: `nb-${Date.now()}`, type: 'text', content: '' }];
  },

  // Export Single Task as Markdown document
  exportTaskAsMarkdown(task: Task, listName: string = 'Inbox'): string {
    const header = [
      `# ${task.title}`,
      ``,
      `- **ステータス**: ${task.completed ? '完了 (Completed)' : task.status}`,
      `- **優先度**: ${task.priority.toUpperCase()}`,
      `- **リスト**: ${listName}`,
      task.dueDate ? `- **期日**: ${task.dueDate} ${task.dueTime || ''}` : null,
      task.tags.length > 0 ? `- **タグ**: ${task.tags.map((t) => `#${t}`).join(' ')}` : null,
      task.estimatedPomodoros > 0 ? `- **ポモドーロ**: 🍅 ${task.completedPomodoros}/${task.estimatedPomodoros}` : null,
      `- **作成日**: ${new Date(task.createdAt).toLocaleString('ja-JP')}`,
      ``,
    ]
      .filter(Boolean)
      .join('\n');

    let subtasksSection = '';
    if (task.subtasks.length > 0) {
      subtasksSection =
        `## サブタスク\n\n` +
        task.subtasks
          .map((st) => `- [${st.completed ? 'x' : ' '}] ${st.title}`)
          .join('\n') +
        `\n\n`;
    }

    const documentContent =
      task.notionBlocks.length > 0
        ? `## ノート & ドキュメント\n\n` + this.blocksToMarkdown(task.notionBlocks)
        : '';

    return `${header}\n${subtasksSection}${documentContent}`;
  },

  // Helper to send request with multi-tier fallback (Vite proxy -> CORS proxy -> direct)
  async sendNotionRequest(
    endpoint: string,
    apiKey: string,
    method: 'GET' | 'POST' | 'PATCH' = 'GET',
    body?: Record<string, unknown>
  ): Promise<Response> {
    const cleanApiKey = apiKey.trim();
    const headers: Record<string, string> = {
      Authorization: `Bearer ${cleanApiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    };

    // 1. Try via Vite local proxy (/api/notion)
    try {
      const proxyUrl = `/api/notion${endpoint}`;
      const res = await fetch(proxyUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      // If local proxy successfully handled or returned valid API response (not a proxy gateway error)
      if (res.status !== 500 && res.status !== 502 && res.status !== 504) {
        return res;
      }
    } catch {
      // Continue to fallback
    }

    // 2. Try direct attempt
    try {
      const directUrl = `https://api.notion.com/v1${endpoint}`;
      const res = await fetch(directUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      return res;
    } catch {
      // 3. Try CORS proxy as resilient fallback
      const targetUrl = `https://api.notion.com/v1${endpoint}`;
      const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
      return fetch(corsProxyUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    }
  },

  // Validate Notion API Connection & Database access
  async testConnection(apiKey: string, rawDatabaseId: string): Promise<{ success: boolean; message: string; databaseTitle?: string }> {
    const cleanApiKey = apiKey.trim();
    if (!cleanApiKey || cleanApiKey.length < 8) {
      return { success: false, message: '有効な Notion API Token (ntn_... または secret_...) を入力してください。' };
    }
    const databaseId = normalizeNotionId(rawDatabaseId);
    if (!databaseId || databaseId.length < 8) {
      return { success: false, message: '有効な Notion データベースID (32桁の文字列またはURL) を入力してください。' };
    }

    try {
      const res = await this.sendNotionRequest(`/databases/${databaseId}`, cleanApiKey, 'GET');

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errMsg = errorData.message || `ステータスコード: ${res.status}`;
        if (res.status === 404) {
          return {
            success: false,
            message: `データベースが見つかりません (404)。Notionページ右上の「...」メニュー >「接続先を追加」で作成したインテグレーション（Integration）にアクセス権限を付与してください。`,
          };
        }
        if (res.status === 401) {
          return {
            success: false,
            message: `認証エラー (401): Notion API Token が無効です。トークン文字列が正しいかご確認ください。(${errMsg})`,
          };
        }
        return { success: false, message: `Notion APIエラー (${res.status}): ${errMsg}` };
      }

      const data = await res.json();
      const title = data.title?.[0]?.plain_text || 'Notion データベース';

      return {
        success: true,
        message: `Notionデータベース「${title}」と正常に接続されました！`,
        databaseTitle: title,
      };
    } catch (e: unknown) {
      const err = e as Error;
      return {
        success: false,
        message: `通信エラー: ${err.message || 'ネットワークに接続できませんでした'}`,
      };
    }
  },

  // Parse Notion Page object into our Task interface
  parseNotionPageToTask(page: any, defaultListId: string = 'inbox'): Task {
    const props = page.properties || {};

    // 1. Extract Title
    let title = '無題のタスク';
    for (const key of Object.keys(props)) {
      const p = props[key];
      if (p.type === 'title' && p.title && p.title.length > 0) {
        title = p.title.map((t: any) => t.plain_text).join('').trim();
        break;
      }
    }

    // 2. Extract Completion / Status
    let completed = false;
    let status: TaskStatus = 'not_started';

    for (const key of Object.keys(props)) {
      const p = props[key];
      if (p.type === 'checkbox') {
        if (p.checkbox === true) {
          completed = true;
          status = 'completed';
        }
      } else if (p.type === 'status' && p.status) {
        const name = p.status.name?.toLowerCase() || '';
        if (name.includes('完了') || name.includes('done') || name.includes('complete')) {
          completed = true;
          status = 'completed';
        } else if (name.includes('進行') || name.includes('progress') || name.includes('doing')) {
          status = 'in_progress';
        }
      } else if (p.type === 'select' && p.select) {
        const name = p.select.name?.toLowerCase() || '';
        if (name.includes('完了') || name.includes('done') || name.includes('complete')) {
          completed = true;
          status = 'completed';
        } else if (name.includes('進行') || name.includes('progress') || name.includes('doing')) {
          status = 'in_progress';
        }
      }
    }

    // 3. Extract Due Date & Start Time / Duration
    let dueDate: string | undefined = undefined;
    let dueTime: string | undefined = undefined;
    let startTime: string | undefined = undefined;
    let durationMinutes: number | undefined = undefined;

    for (const key of Object.keys(props)) {
      const p = props[key];
      if (p.type === 'date' && p.date && p.date.start) {
        const startStr = p.date.start;
        if (startStr.includes('T')) {
          const parts = startStr.split('T');
          dueDate = parts[0];
          const timePart = parts[1].slice(0, 5);
          startTime = timePart;
          dueTime = timePart;

          if (p.date.end && p.date.end.includes('T')) {
            const endParts = p.date.end.split('T');
            const [sh, sm] = timePart.split(':').map(Number);
            const [eh, em] = endParts[1].slice(0, 5).split(':').map(Number);
            const diff = (eh * 60 + em) - (sh * 60 + sm);
            if (diff > 0) durationMinutes = diff;
          }
        } else {
          dueDate = startStr;
        }
        break;
      }
    }

    // Check "時間帯" select property if startTime is still undefined
    const timeSlotProp = props['時間帯'] || props['時間'] || props['TimeSlot'];
    if (!startTime && timeSlotProp && timeSlotProp.select && timeSlotProp.select.name) {
      const slot = timeSlotProp.select.name;
      if (slot.includes('早朝')) { startTime = '06:00'; durationMinutes = 60; }
      else if (slot.includes('午前')) { startTime = '09:00'; durationMinutes = 120; }
      else if (slot.includes('午後')) { startTime = '13:00'; durationMinutes = 120; }
      else if (slot.includes('夕方')) { startTime = '16:00'; durationMinutes = 90; }
      else if (slot.includes('夜') || slot.includes('今夜')) { startTime = '20:00'; durationMinutes = 60; }
    }

    // 4. Extract Priority
    let priority: Priority = 'none';
    for (const key of Object.keys(props)) {
      const p = props[key];
      if (
        (p.type === 'select' && p.select) ||
        (p.type === 'multi_select' && p.multi_select && p.multi_select[0])
      ) {
        const valName = (p.select?.name || p.multi_select?.[0]?.name || '').toLowerCase();
        if (valName.includes('high') || valName.includes('高') || valName.includes('緊急')) {
          priority = 'high';
        } else if (valName.includes('med') || valName.includes('中')) {
          priority = 'medium';
        } else if (valName.includes('low') || valName.includes('低')) {
          priority = 'low';
        }
      }
    }

    // 5. Extract Tags
    const tags: string[] = [];
    for (const key of Object.keys(props)) {
      const p = props[key];
      if (p.type === 'multi_select' && p.multi_select) {
        p.multi_select.forEach((ms: any) => {
          if (ms.name && !tags.includes(ms.name)) {
            tags.push(ms.name);
          }
        });
      }
    }

    return {
      id: `notion-${page.id}`,
      title,
      completed,
      completedAt: completed ? page.last_edited_time : undefined,
      status,
      priority,
      dueDate,
      dueTime,
      startTime,
      durationMinutes: durationMinutes || (startTime ? 60 : undefined),
      listId: defaultListId,
      tags,
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
      createdAt: page.created_time || new Date().toISOString(),
      updatedAt: page.last_edited_time || new Date().toISOString(),
      notionPageId: page.id,
    };
  },

  // Fetch all tasks from Notion Database and sync bidirectionally
  async syncDatabase(
    apiKey: string,
    rawDatabaseId: string,
    localTasks: Task[]
  ): Promise<NotionSyncResult> {
    if (!apiKey || !rawDatabaseId) {
      return {
        success: false,
        message: 'API KeyまたはDatabase IDが設定されていません。',
      };
    }

    const databaseId = normalizeNotionId(rawDatabaseId);

    try {
      // 1. Query Database from Notion API
      const res = await this.sendNotionRequest(
        `/databases/${databaseId}/query`,
        apiKey,
        'POST',
        { page_size: 100 }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return {
          success: false,
          message: `Notionのタスク取得に失敗しました: ${errorData.message || res.statusText}`,
        };
      }

      const data = await res.json();
      const pages = data.results || [];

      // 2. Map Notion pages into Tasks
      const notionTasks: Task[] = pages.map((page: any) => this.parseNotionPageToTask(page));

      // 3. Merge Notion tasks with existing local tasks
      // - Keep local blocks and subtasks if task was already synced before
      // - Add new Notion tasks
      // - Keep local-only tasks (that haven't been pushed to Notion yet)
      const mergedTasks: Task[] = [...notionTasks];

      localTasks.forEach((localTask) => {
        // If this local task matches a Notion page, retain local enriched blocks if present
        const matchingNotionIndex = mergedTasks.findIndex(
          (nt) => nt.notionPageId === localTask.notionPageId || nt.id === localTask.id
        );

        if (matchingNotionIndex >= 0) {
          // Merge local enriched subtasks & notionBlocks if existing
          const current = mergedTasks[matchingNotionIndex];
          mergedTasks[matchingNotionIndex] = {
            ...current,
            subtasks: localTask.subtasks.length > 0 ? localTask.subtasks : current.subtasks,
            notionBlocks:
              localTask.notionBlocks.some((b) => b.content.trim().length > 0)
                ? localTask.notionBlocks
                : current.notionBlocks,
            completedPomodoros: localTask.completedPomodoros || 0,
            estimatedPomodoros: localTask.estimatedPomodoros || 2,
            listId: localTask.listId || current.listId,
          };
        } else if (!localTask.notionPageId) {
          // Local task created on app, preserve it
          mergedTasks.push(localTask);
        }
      });

      return {
        success: true,
        message: `Notionデータベースから ${notionTasks.length}件 のタスクを正常に取得・同期しました！`,
        syncedTasks: mergedTasks,
      };
    } catch (e: unknown) {
      const err = e as Error;
      return {
        success: false,
        message: `同期中にエラーが発生しました: ${err.message}`,
      };
    }
  },
};
