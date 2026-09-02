import React, { useState } from 'react';
import { AppSettings, Task, TaskList } from '../types';
import { notionService } from '../lib/notionService';
import { storageService } from '../lib/storage';
import {
  X,
  Database,
  Key,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface NotionSettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  tasks: Task[];
  lists: TaskList[];
  onClose: () => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onTasksSynced: (syncedTasks: Task[]) => void;
  onDataImported: () => void;
}

export const NotionSettingsModal: React.FC<NotionSettingsModalProps> = ({
  isOpen,
  settings,
  tasks,
  lists,
  onClose,
  onUpdateSettings,
  onTasksSynced,
  onDataImported,
}) => {
  const [apiKey, setApiKey] = useState(settings.notionApiKey || '');
  const [databaseId, setDatabaseId] = useState(settings.notionDatabaseId || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; databaseTitle?: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await notionService.testConnection(apiKey, databaseId);
    setTestResult(res);
    setIsTesting(false);

    if (res.success) {
      onUpdateSettings({
        ...settings,
        notionApiKey: apiKey,
        notionDatabaseId: databaseId,
      });
    }
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    const res = await notionService.syncDatabase(apiKey, databaseId, tasks);
    setIsSyncing(false);
    if (res.success && res.syncedTasks) {
      const nowStr = new Date().toLocaleString('ja-JP');
      onUpdateSettings({
        ...settings,
        notionApiKey: apiKey,
        notionDatabaseId: databaseId,
        notionLastSynced: nowStr,
      });
      onTasksSynced(res.syncedTasks);
      setSyncStatus(res.message);
    } else {
      setSyncStatus(res.message || '同期に失敗しました。');
    }
  };

  const handleExportJSON = () => {
    const jsonStr = storageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notion_tick_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = storageService.importData(content);
        if (ok) {
          setImportMessage('データの復元が完了しました。');
          onDataImported();
        } else {
          setImportMessage('JSONファイルの形式が正しくありません。');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Database size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Notion 連携 & データ管理</h2>
              <p className="text-xs text-neutral-500">Notionデータベースとの同期およびバックアップ</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Notion API Configuration Section */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-800 text-sm">Notion API 連携設定</span>
              <a
                href="https://www.notion.so/my-integrations"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Integration作成ページ</span>
                <ExternalLink size={11} />
              </a>
            </div>

            <div>
              <label className="block text-neutral-600 font-semibold mb-1">
                Notion API Token (Integration Token)
              </label>
              <div className="relative">
                <Key size={14} className="absolute left-3 top-3 text-neutral-400" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="ntn_... または secret_..."
                  className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
              <p className="text-[11px] text-neutral-400 mt-1">
                最新の「ntn_」および従来の「secret_」形式の両方に対応しています。
              </p>
            </div>

            <div>
              <label className="block text-neutral-600 font-semibold mb-1">
                Notion Database ID (または データベースのURL)
              </label>
              <input
                type="text"
                value={databaseId}
                onChange={(e) => setDatabaseId(e.target.value)}
                placeholder="例: 1a2b3c4d... または https://www.notion.so/..."
                className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:border-purple-500 font-mono"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                32桁のIDまたはデータベースのブラウザURLをそのまま貼り付けられます。
              </p>
            </div>

            {/* Test result message */}
            {testResult && (
              <div
                className={`p-3 rounded-xl flex items-start gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !apiKey}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-xs"
              >
                {isTesting ? '接続確認中...' : '接続テスト & 保存'}
              </button>

              <button
                type="button"
                onClick={handleSyncNow}
                disabled={isSyncing || !apiKey}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-xl font-bold transition-colors flex items-center gap-1.5"
              >
                <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                <span>{isSyncing ? '同期中...' : '今すぐ同期'}</span>
              </button>
            </div>

            {settings.notionLastSynced && (
              <p className="text-[11px] text-neutral-400">
                最終同期: {settings.notionLastSynced}
              </p>
            )}
            {syncStatus && <p className="text-[11px] text-purple-600 font-semibold">{syncStatus}</p>}
          </div>

          {/* Backup & Export Section */}
          <div className="pt-4 border-t border-neutral-100 space-y-3">
            <span className="font-bold text-neutral-800 text-sm block">バックアップと復元</span>
            <p className="text-neutral-500 text-[11px]">
              すべてのタスク、Notionメモ、習慣、ポモドーロセッションをJSONファイルとして保存または読み込めます。
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportJSON}
                className="px-3.5 py-2 bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl text-neutral-700 font-semibold flex items-center gap-2 shadow-2xs transition-colors"
              >
                <Download size={14} />
                <span>JSONバックアップをダウンロード</span>
              </button>

              <label className="px-3.5 py-2 bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl text-neutral-700 font-semibold flex items-center gap-2 shadow-2xs transition-colors cursor-pointer">
                <Upload size={14} />
                <span>JSON復元ファイルをアップロード</span>
                <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
              </label>
            </div>

            {importMessage && (
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-800 font-medium">
                {importMessage}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>トークンはブラウザのLocalStorageに安全に保存されます</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
