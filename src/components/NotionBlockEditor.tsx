import React, { useState, useRef, useEffect } from 'react';
import { NotionBlock, NotionBlockType } from '../types';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  AlertCircle,
  Minus,
  Type,
  Plus,
  Trash2,
  Smile,
} from 'lucide-react';

interface NotionBlockEditorProps {
  blocks: NotionBlock[];
  onChange: (blocks: NotionBlock[]) => void;
}

interface CommandMenuItem {
  type: NotionBlockType;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

const COMMANDS: CommandMenuItem[] = [
  { type: 'text', label: 'テキスト', desc: '通常のテキスト段落', icon: <Type size={16} /> },
  { type: 'h1', label: '見出し 1', desc: '大見出し (Heading 1)', icon: <Heading1 size={16} /> },
  { type: 'h2', label: '見出し 2', desc: '中見出し (Heading 2)', icon: <Heading2 size={16} /> },
  { type: 'h3', label: '見出し 3', desc: '小見出し (Heading 3)', icon: <Heading3 size={16} /> },
  { type: 'bullet', label: '箇条書きリスト', desc: 'シンプルな黒丸リスト', icon: <List size={16} /> },
  { type: 'number', label: '番号付きリスト', desc: '順序付きリスト', icon: <ListOrdered size={16} /> },
  { type: 'todo', label: 'ToDo リスト', desc: 'チェックボックス付きアイテム', icon: <CheckSquare size={16} /> },
  { type: 'quote', label: '引用', desc: '目立たせる引用文', icon: <Quote size={16} /> },
  { type: 'code', label: 'コードブロック', desc: 'ソースコードの記載', icon: <Code size={16} /> },
  { type: 'callout', label: 'コールアウト', desc: 'アイコン付き注目ボックス', icon: <AlertCircle size={16} /> },
  { type: 'divider', label: '区切り線', desc: '水平線でセクションを分離', icon: <Minus size={16} /> },
];

const CALLOUT_ICONS = ['💡', '📌', '🚀', '⚠️', '🎯', '📝', '✨', '🔥'];

export const NotionBlockEditor: React.FC<NotionBlockEditorProps> = ({ blocks, onChange }) => {
  const [activeMenuBlockId, setActiveMenuBlockId] = useState<string | null>(null);
  const [menuFilter, setMenuFilter] = useState('');
  const [menuIndex, setMenuIndex] = useState(0);
  const [activeIconPickerId, setActiveIconPickerId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Ensure at least one block exists
  const currentBlocks: NotionBlock[] = blocks.length > 0 ? blocks : [{ id: `nb-${Date.now()}`, type: 'text', content: '' }];

  const handleUpdateContent = (id: string, content: string) => {
    // Check if user typed slash command trigger
    if (content.startsWith('/') && !content.includes('\n')) {
      setActiveMenuBlockId(id);
      setMenuFilter(content.slice(1).toLowerCase());
      setMenuIndex(0);
    } else if (activeMenuBlockId === id && !content.startsWith('/')) {
      setActiveMenuBlockId(null);
    }

    const updated = currentBlocks.map((b) => (b.id === id ? { ...b, content } : b));
    onChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number, block: NotionBlock) => {
    // Handle Command Menu Navigation
    if (activeMenuBlockId === block.id) {
      const filtered = COMMANDS.filter(
        (c) => c.label.toLowerCase().includes(menuFilter) || c.type.toLowerCase().includes(menuFilter)
      );

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMenuIndex((prev) => (prev + 1) % (filtered.length || 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMenuIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
        return;
      }
      if (e.key === 'Enter' && filtered.length > 0) {
        e.preventDefault();
        applyBlockType(block.id, filtered[menuIndex]?.type || 'text');
        return;
      }
      if (e.key === 'Escape') {
        setActiveMenuBlockId(null);
        return;
      }
    }

    // Handle Enter to create new block
    if (e.key === 'Enter' && !e.shiftKey && block.type !== 'code') {
      e.preventDefault();
      const newBlock: NotionBlock = {
        id: `nb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: block.type === 'bullet' || block.type === 'number' || block.type === 'todo' ? block.type : 'text',
        content: '',
        checked: false,
        calloutIcon: '💡',
      };
      const next = [...currentBlocks];
      next.splice(index + 1, 0, newBlock);
      onChange(next);
      setActiveMenuBlockId(null);
    }

    // Handle Backspace on empty block to delete or convert to text
    if (e.key === 'Backspace' && block.content === '') {
      if (block.type !== 'text') {
        e.preventDefault();
        applyBlockType(block.id, 'text');
      } else if (currentBlocks.length > 1) {
        e.preventDefault();
        const next = currentBlocks.filter((b) => b.id !== block.id);
        onChange(next);
      }
    }
  };

  const applyBlockType = (blockId: string, type: NotionBlockType) => {
    const updated = currentBlocks.map((b) => {
      if (b.id === blockId) {
        return {
          ...b,
          type,
          content: b.content.startsWith('/') ? '' : b.content,
          calloutIcon: type === 'callout' ? (b.calloutIcon || '💡') : undefined,
          checked: type === 'todo' ? false : undefined,
        };
      }
      return b;
    });
    onChange(updated);
    setActiveMenuBlockId(null);
  };

  const handleToggleTodo = (id: string) => {
    const updated = currentBlocks.map((b) => (b.id === id ? { ...b, checked: !b.checked } : b));
    onChange(updated);
  };

  const handleDeleteBlock = (id: string) => {
    if (currentBlocks.length <= 1) {
      onChange([{ id: `nb-${Date.now()}`, type: 'text' as NotionBlockType, content: '' }]);
      return;
    }
    onChange(currentBlocks.filter((b) => b.id !== id));
  };

  const handleAddBlockAtEnd = () => {
    const newBlock: NotionBlock = {
      id: `nb-${Date.now()}`,
      type: 'text',
      content: '',
    };
    onChange([...currentBlocks, newBlock]);
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuBlockId(null);
        setActiveIconPickerId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCommands = COMMANDS.filter(
    (c) => c.label.toLowerCase().includes(menuFilter) || c.type.toLowerCase().includes(menuFilter)
  );

  return (
    <div className="space-y-1 relative font-sans">
      <div className="flex items-center justify-between text-xs text-neutral-500 font-semibold mb-2">
        <span className="flex items-center gap-1.5 text-neutral-700">
          <span>Notion ドキュメント</span>
          <span className="text-[10px] text-neutral-400 font-normal">(/ でコマンド呼び出し)</span>
        </span>
      </div>

      <div className="space-y-1.5">
        {currentBlocks.map((block, index) => (
          <div key={block.id} className="group relative flex items-start gap-2 py-0.5 rounded px-1 transition-colors hover:bg-neutral-50">
            {/* Block Drag / Action handle */}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 pt-1.5 transition-opacity text-neutral-300">
              <button
                type="button"
                onClick={() => setActiveMenuBlockId(activeMenuBlockId === block.id ? null : block.id)}
                className="hover:text-neutral-600 p-0.5 rounded hover:bg-neutral-200"
                title="ブロックタイプを変更"
              >
                <Plus size={13} />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteBlock(block.id)}
                className="hover:text-red-500 p-0.5 rounded hover:bg-neutral-200"
                title="削除"
              >
                <Trash2 size={13} />
              </button>
            </div>

            {/* Block Content Renderers */}
            <div className="flex-1 min-w-0">
              {block.type === 'h1' && (
                <input
                  type="text"
                  value={block.content}
                  placeholder="見出し 1"
                  onChange={(e) => handleUpdateContent(block.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index, block)}
                  className="w-full text-xl font-bold text-neutral-900 bg-transparent focus:outline-none border-b border-transparent focus:border-neutral-200 py-1"
                />
              )}

              {block.type === 'h2' && (
                <input
                  type="text"
                  value={block.content}
                  placeholder="見出し 2"
                  onChange={(e) => handleUpdateContent(block.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index, block)}
                  className="w-full text-lg font-bold text-neutral-800 bg-transparent focus:outline-none border-b border-transparent focus:border-neutral-200 py-0.5"
                />
              )}

              {block.type === 'h3' && (
                <input
                  type="text"
                  value={block.content}
                  placeholder="見出し 3"
                  onChange={(e) => handleUpdateContent(block.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index, block)}
                  className="w-full text-base font-semibold text-neutral-800 bg-transparent focus:outline-none border-b border-transparent focus:border-neutral-200 py-0.5"
                />
              )}

              {block.type === 'bullet' && (
                <div className="flex items-start gap-2 pt-0.5">
                  <span className="text-neutral-400 text-sm select-none mt-0.5">•</span>
                  <input
                    type="text"
                    value={block.content}
                    placeholder="リスト項目"
                    onChange={(e) => handleUpdateContent(block.id, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index, block)}
                    className="flex-1 text-sm text-neutral-800 bg-transparent focus:outline-none"
                  />
                </div>
              )}

              {block.type === 'number' && (
                <div className="flex items-start gap-2 pt-0.5">
                  <span className="text-neutral-400 text-xs font-mono select-none mt-1">{index + 1}.</span>
                  <input
                    type="text"
                    value={block.content}
                    placeholder="順序項目"
                    onChange={(e) => handleUpdateContent(block.id, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index, block)}
                    className="flex-1 text-sm text-neutral-800 bg-transparent focus:outline-none"
                  />
                </div>
              )}

              {block.type === 'todo' && (
                <div className="flex items-start gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    checked={block.checked || false}
                    onChange={() => handleToggleTodo(block.id)}
                    className="mt-1 h-3.5 w-3.5 rounded border-neutral-300 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={block.content}
                    placeholder="タスク項目"
                    onChange={(e) => handleUpdateContent(block.id, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index, block)}
                    className={`flex-1 text-sm bg-transparent focus:outline-none ${
                      block.checked ? 'line-through text-neutral-400' : 'text-neutral-800'
                    }`}
                  />
                </div>
              )}

              {block.type === 'quote' && (
                <div className="border-l-2 border-neutral-400 pl-3 py-1 bg-neutral-50/50 rounded-r">
                  <textarea
                    rows={2}
                    value={block.content}
                    placeholder="引用文を入力..."
                    onChange={(e) => handleUpdateContent(block.id, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index, block)}
                    className="w-full text-sm text-neutral-700 bg-transparent italic focus:outline-none resize-none"
                  />
                </div>
              )}

              {block.type === 'code' && (
                <div className="bg-neutral-900 text-neutral-100 p-3 rounded-lg font-mono text-xs overflow-x-auto shadow-inner">
                  <div className="text-[10px] text-neutral-400 pb-1 border-b border-neutral-800 mb-2 flex justify-between">
                    <span>CODE</span>
                    <span>Markdown/TypeScript</span>
                  </div>
                  <textarea
                    rows={4}
                    value={block.content}
                    placeholder="// コードを貼り付けまたは入力"
                    onChange={(e) => handleUpdateContent(block.id, e.target.value)}
                    className="w-full bg-transparent font-mono text-xs text-neutral-200 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              )}

              {block.type === 'callout' && (
                <div className="flex items-start gap-2.5 p-2.5 bg-amber-50/80 border border-amber-200/70 rounded-lg text-neutral-800 relative">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveIconPickerId(activeIconPickerId === block.id ? null : block.id)}
                      className="text-base hover:scale-110 transition-transform p-0.5 rounded hover:bg-amber-100/60"
                      title="アイコンを変更"
                    >
                      {block.calloutIcon || '💡'}
                    </button>
                    {activeIconPickerId === block.id && (
                      <div className="absolute left-0 top-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg p-2 flex gap-1 z-30">
                        {CALLOUT_ICONS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              onChange(
                                currentBlocks.map((b) => (b.id === block.id ? { ...b, calloutIcon: emoji } : b))
                              );
                              setActiveIconPickerId(null);
                            }}
                            className="p-1 hover:bg-neutral-100 rounded text-sm"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={block.content}
                    placeholder="コールアウトの重要なメモを入力..."
                    onChange={(e) => handleUpdateContent(block.id, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index, block)}
                    className="w-full text-sm bg-transparent focus:outline-none resize-none text-neutral-800"
                  />
                </div>
              )}

              {block.type === 'divider' && (
                <div className="py-2">
                  <hr className="border-neutral-200" />
                </div>
              )}

              {block.type === 'text' && (
                <textarea
                  rows={Math.max(1, block.content.split('\n').length)}
                  value={block.content}
                  placeholder="テキストを入力、または '/' でコマンド..."
                  onChange={(e) => handleUpdateContent(block.id, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, index, block)}
                  className="w-full text-sm text-neutral-800 bg-transparent focus:outline-none resize-none leading-relaxed py-0.5"
                />
              )}
            </div>

            {/* Slash Command Dropdown Popup */}
            {activeMenuBlockId === block.id && (
              <div
                ref={menuRef}
                className="absolute left-6 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 py-1.5 z-40 max-h-72 overflow-y-auto"
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                  ブロックを挿入
                </div>
                {filteredCommands.map((cmd, idx) => (
                  <button
                    key={cmd.type}
                    type="button"
                    onClick={() => applyBlockType(block.id, cmd.type)}
                    onMouseEnter={() => setMenuIndex(idx)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                      menuIndex === idx ? 'bg-blue-50 text-blue-600' : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="p-1 rounded bg-neutral-100 text-neutral-600 group-hover:bg-white">{cmd.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-neutral-900">{cmd.label}</div>
                      <div className="text-[10px] text-neutral-400 truncate">{cmd.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddBlockAtEnd}
        className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 py-1.5 px-2 rounded-lg hover:bg-neutral-100/70 transition-colors mt-2"
      >
        <Plus size={14} />
        <span>ブロックを追加</span>
      </button>
    </div>
  );
};
