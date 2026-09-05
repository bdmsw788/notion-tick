import { Task, NotionBlock, Priority, TaskStatus, Project } from '../types';

export const NOTION_PARA_DB_ID = '311601af-1c24-8128-b55f-c8d02bff9c2a';

export interface NotionSyncResult {
  success: boolean;
  message: string;
  syncedTasks?: Task[];
  syncedProjects?: Project[];
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

  // Fetch PARA Projects from Notion PARA Database
  async fetchProjects(apiKey: string, paraDbId: string = NOTION_PARA_DB_ID): Promise<Project[]> {
    const cleanApiKey = apiKey.trim();
    const cleanDbId = normalizeNotionId(paraDbId);
    if (!cleanApiKey || !cleanDbId) return [];

    try {
      const res = await this.sendNotionRequest(
        `/databases/${cleanDbId}/query`,
        cleanApiKey,
        'POST',
        { page_size: 100 }
      );
      if (!res.ok) return [];

      const data = await res.json();
      const pages = data.results || [];
      return pages.map((p: any) => {
        const props = p.properties || {};
        const titleProp = props['名前']?.title || [];
        const name = titleProp.map((t: any) => t.plain_text).join('').trim() || '無題のプロジェクト';
        const cat = props['カテゴリー']?.select?.name || 'プロジェクト';
        const stat = props['ステータス']?.status?.name || 'アクティブ';
        const targetDate = props['目標期限']?.date?.start || null;

        return {
          id: p.id,
          name,
          category: cat,
          status: stat,
          targetDate,
          color: name.startsWith('【P】') ? '#3B82F6' : name.startsWith('【A】') ? '#10B981' : '#6366F1',
          icon: name.startsWith('【P】') ? '🎪' : name.startsWith('【A】') ? '🏛️' : '📁',
        };
      });
    } catch {
      return [];
    }
  },

  // Parse Notion Page object into our Task interface
  parseNotionPageToTask(
    page: any,
    projectsMap: Record<string, string> = {},
    defaultListId: string = 'inbox'
  ): Task {
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

    // 2. Extract Completion & Notion-aligned Status
    let completed = false;
    let status: TaskStatus = 'Inbox'; // Default to Inbox (Inbox-first philosophy!)

    // Check status property
    const statusProp = props['ステータス'] || Object.values(props).find((p: any) => p.type === 'status');
    if (statusProp && (statusProp as any).status) {
      const sName = (statusProp as any).status.name || '';
      if (sName === '完了') {
        completed = true;
        status = '完了';
      } else if (['Inbox', '次にやる', 'スケジュール', 'プロジェクト', '連絡待ち', 'いつかやる'].includes(sName)) {
        status = sName as TaskStatus;
      } else if (sName.includes('完了') || sName.includes('done')) {
        completed = true;
        status = '完了';
      } else if (sName.includes('進行') || sName.includes('doing')) {
        status = '次にやる';
      }
    }

    // Fallback checkbox
    for (const key of Object.keys(props)) {
      const p = props[key];
      if (p.type === 'checkbox' && p.checkbox === true) {
        completed = true;
        status = '完了';
      }
    }

    // 3. Extract Due Date & Start Time / Duration
    let dueDate: string | undefined = undefined;
    let dueTime: string | undefined = undefined;
    let startTime: string | undefined = undefined;
    let durationMinutes: number | undefined = undefined;

    for (const propName of ['実施予定日', '締切日', '日付', 'Date']) {
      const p = props[propName];
      if (p && p.type === 'date' && p.date && p.date.start) {
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

    // 4. Extract Project (IB_PARA relation)
    let projectId: string | undefined = undefined;
    let projectName: string | undefined = undefined;
    const paraProp = props['IB_PARA'] || props['プロジェクト'] || props['PARA'];
    if (paraProp && paraProp.type === 'relation' && paraProp.relation && paraProp.relation.length > 0) {
      projectId = paraProp.relation[0].id;
      projectName = projectsMap[projectId] || undefined;
    }

    // 5. Extract Priority
    let priority: Priority = 'none';
    const prioProp = props['優先順位'] || props['Priority'];
    if (prioProp && prioProp.type === 'select' && prioProp.select) {
      const valName = prioProp.select.name || '';
      if (valName.includes('★★★') || valName.includes('高') || valName.toLowerCase().includes('high')) {
        priority = 'high';
      } else if (valName.includes('★★') || valName.includes('中') || valName.toLowerCase().includes('med')) {
        priority = 'medium';
      } else if (valName.includes('★') || valName.includes('低') || valName.toLowerCase().includes('low')) {
        priority = 'low';
      }
    }

    // 6. Extract Tags
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
      listId: projectId || defaultListId,
      projectId,
      projectName,
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

  // Update a single Notion Page (Status, IB_PARA, Date, etc.)
  async updateNotionPage(
    apiKey: string,
    pageId: string,
    updates: {
      status?: TaskStatus;
      completed?: boolean;
      projectId?: string;
      dueDate?: string;
      startTime?: string;
      title?: string;
    }
  ): Promise<boolean> {
    const cleanApiKey = apiKey.trim();
    if (!cleanApiKey || !pageId) return false;

    const properties: Record<string, any> = {};

    // 1. Title
    if (updates.title !== undefined) {
      properties['名前'] = {
        title: [{ text: { content: updates.title } }],
      };
    }

    // 2. Status
    if (updates.status !== undefined) {
      properties['ステータス'] = {
        status: { name: updates.status },
      };
    } else if (updates.completed !== undefined) {
      properties['ステータス'] = {
        status: { name: updates.completed ? '完了' : '次にやる' },
      };
    }

    // 3. IB_PARA (Project)
    if (updates.projectId !== undefined) {
      properties['IB_PARA'] = {
        relation: updates.projectId ? [{ id: updates.projectId }] : [],
      };
    }

    // 4. Due Date
    if (updates.dueDate !== undefined) {
      if (updates.dueDate) {
        let startIso = updates.dueDate;
        if (updates.startTime) {
          startIso = `${updates.dueDate}T${updates.startTime}:00.000+09:00`;
        }
        properties['実施予定日'] = {
          date: { start: startIso },
        };
      } else {
        properties['実施予定日'] = { date: null };
      }
    }

    try {
      const res = await this.sendNotionRequest(
        `/pages/${pageId}`,
        cleanApiKey,
        'PATCH',
        { properties }
      );
      return res.ok;
    } catch {
      return false;
    }
  },

  // Fetch all tasks and projects from Notion Database and sync bidirectionally
  async syncDatabase(
    apiKey: string,
    rawDatabaseId: string,
    localTasks: Task[],
    paraDatabaseId: string = NOTION_PARA_DB_ID
  ): Promise<NotionSyncResult> {
    if (!apiKey || !rawDatabaseId) {
      return {
        success: false,
        message: 'API KeyまたはDatabase IDが設定されていません。',
      };
    }

    const databaseId = normalizeNotionId(rawDatabaseId);

    try {
      // 1. Fetch Projects from PARA DB
      const projects = await this.fetchProjects(apiKey, paraDatabaseId);
      const projectsMap: Record<string, string> = {};
      projects.forEach((p) => {
        projectsMap[p.id] = p.name;
      });

      // 2. Query Tasks Database from Notion API
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

      // 3. Map Notion pages into Tasks with project names
      const notionTasks: Task[] = pages.map((page: any) =>
        this.parseNotionPageToTask(page, projectsMap)
      );

      // 4. Merge Notion tasks with existing local tasks
      const mergedTasks: Task[] = [...notionTasks];

      localTasks.forEach((localTask) => {
        const matchingNotionIndex = mergedTasks.findIndex(
          (nt) => nt.notionPageId === localTask.notionPageId || nt.id === localTask.id
        );

        if (matchingNotionIndex >= 0) {
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
            listId: current.projectId || localTask.listId || current.listId,
          };
        } else if (!localTask.notionPageId) {
          // Local task created on app, preserve it
          mergedTasks.push(localTask);
        }
      });

      return {
        success: true,
        message: `Notionデータベースからタスク ${notionTasks.length}件、プロジェクト ${projects.length}件 を正常に同期しました！`,
        syncedTasks: mergedTasks,
        syncedProjects: projects.length > 0 ? projects : undefined,
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
