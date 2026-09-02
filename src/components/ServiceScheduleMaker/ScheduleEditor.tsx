import React, { useState } from 'react';
import { CleanScheduleData, DutyItem, EventItem } from './types';
import { generateMonthDuties } from './sampleData';
import {
  Calendar,
  FileText,
  Users,
  Plus,
  Trash2,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ScheduleEditorProps {
  data: CleanScheduleData;
  onChange: (newData: CleanScheduleData) => void;
}

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<'duty' | 'events' | 'sidebar' | 'settings'>('duty');
  const [newMemberName, setNewMemberName] = useState('');

  // 年月の変更ハンドラ
  const handleYearMonthChange = (year: number, month: number) => {
    const newDuties = generateMonthDuties(year, month);
    onChange({
      ...data,
      year,
      month,
      duties: newDuties,
    });
  };

  // 奉仕担当行の更新
  const handleDutyChange = (id: string, field: keyof DutyItem, value: any) => {
    const updated = data.duties.map((row) => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    });
    onChange({ ...data, duties: updated });
  };

  // 奉仕行の追加
  const handleAddDutyRow = () => {
    const newRow: DutyItem = {
      id: `duty-custom-${Date.now()}`,
      day: 1,
      weekday: '日',
      serviceName: '特別集会',
      praiseKids: '',
      sermon: '',
      leader: '',
      music: '',
      drums: '',
      ppt: '',
      reception: '',
      prayer: '',
      notes: '',
    };
    onChange({
      ...data,
      duties: [...data.duties, newRow].sort((a, b) => a.day - b.day),
    });
  };

  // 奉仕行の削除
  const handleRemoveDutyRow = (id: string) => {
    onChange({
      ...data,
      duties: data.duties.filter((r) => r.id !== id),
    });
  };

  // イベント行の追加
  const handleAddEvent = () => {
    const newEvent: EventItem = {
      id: `e-${Date.now()}`,
      dateText: `${data.month}/`,
      title: '新しいイベント',
      detail: '',
      isHighlight: false,
    };
    onChange({
      ...data,
      events: [...data.events, newEvent],
    });
  };

  // イベント行の更新
  const handleUpdateEvent = (id: string, field: keyof EventItem, value: any) => {
    const updated = data.events.map((evt) => {
      if (evt.id === id) {
        return { ...evt, [field]: value };
      }
      return evt;
    });
    onChange({ ...data, events: updated });
  };

  // イベント行の削除
  const handleRemoveEvent = (id: string) => {
    onChange({
      ...data,
      events: data.events.filter((evt) => evt.id !== id),
    });
  };

  // サイドバー項目の更新
  const handleSidebarChange = (field: keyof CleanScheduleData['sidebar'], value: any) => {
    onChange({
      ...data,
      sidebar: {
        ...data.sidebar,
        [field]: value,
      },
    });
  };

  // 祈祷課題の更新
  const handlePrayerRequestChange = (index: number, value: string) => {
    const updated = [...data.sidebar.prayerRequests];
    updated[index] = value;
    handleSidebarChange('prayerRequests', updated);
  };

  const handleAddPrayerRequest = () => {
    handleSidebarChange('prayerRequests', [...data.sidebar.prayerRequests, '']);
  };

  const handleRemovePrayerRequest = (index: number) => {
    const updated = data.sidebar.prayerRequests.filter((_, idx) => idx !== index);
    handleSidebarChange('prayerRequests', updated);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-stone-200 shadow-sm overflow-hidden text-xs">
      {/* ========================================================================= */}
      {/* 1. 上部コントロールバー（年月選択 ＆ タブ切り替え） */}
      {/* ========================================================================= */}
      <div className="p-3 border-b border-stone-200 bg-stone-50 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700">対象年月:</span>
            <select
              value={data.year}
              onChange={(e) => handleYearMonthChange(Number(e.target.value), data.month)}
              className="px-2 py-1 bg-white border border-stone-300 rounded font-semibold text-xs text-stone-800 shadow-2xs focus:ring-2 focus:ring-amber-500"
            >
              {[2025, 2026, 2027, 2028].map((y) => (
                <option key={y} value={y}>
                  {y}年
                </option>
              ))}
            </select>
            <select
              value={data.month}
              onChange={(e) => handleYearMonthChange(data.year, Number(e.target.value))}
              className="px-2 py-1 bg-white border border-stone-300 rounded font-semibold text-xs text-stone-800 shadow-2xs focus:ring-2 focus:ring-amber-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}月
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ナビゲーションタブ */}
        <div className="flex gap-1 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('duty')}
            className={`flex items-center gap-1 px-3 py-1.5 font-bold rounded-t-md transition-colors ${
              activeTab === 'duty'
                ? 'bg-white text-rose-700 border-t-2 border-l border-r border-rose-500 shadow-2xs -mb-px'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>⛪ 奉仕担当表 ({data.duties.length}件)</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-1 px-3 py-1.5 font-bold rounded-t-md transition-colors ${
              activeTab === 'events'
                ? 'bg-white text-amber-800 border-t-2 border-l border-r border-amber-600 shadow-2xs -mb-px'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <span>📅 行事予定 ({data.events.length}件)</span>
          </button>

          <button
            onClick={() => setActiveTab('sidebar')}
            className={`flex items-center gap-1 px-3 py-1.5 font-bold rounded-t-md transition-colors ${
              activeTab === 'sidebar'
                ? 'bg-white text-amber-800 border-t-2 border-l border-r border-amber-600 shadow-2xs -mb-px'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <FileText size={13} />
            <span>お便り & 聖句</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1 px-3 py-1.5 font-bold rounded-t-md transition-colors ${
              activeTab === 'settings'
                ? 'bg-white text-amber-800 border-t-2 border-l border-r border-amber-600 shadow-2xs -mb-px'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Users size={13} />
            <span>設定</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. タブごとのメイン編集エリア */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* ======================================================================= */}
        {/* タブ1: 礼拝・祈祷会 奉仕担当表 */}
        {/* ======================================================================= */}
        {activeTab === 'duty' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-800">
                  ⛪ 礼拝・集会の奉仕担当者一覧
                </h3>
                <p className="text-[11px] text-stone-500">
                  日曜礼拝・水曜祈祷会の担当者を入力できます。
                </p>
              </div>

              <button
                onClick={handleAddDutyRow}
                className="flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold shadow-2xs"
              >
                <Plus size={13} />
                <span>集会・行を追加</span>
              </button>
            </div>

            {/* 各奉仕行のカード */}
            <div className="space-y-2">
              {data.duties.map((row) => {
                const isSun = row.weekday === '日';
                const cardBg = isSun ? 'bg-rose-50/60 border-rose-200' : 'bg-stone-50 border-stone-200';
                const badgeColor = isSun ? 'bg-rose-600 text-white' : 'bg-stone-700 text-white';

                return (
                  <div
                    key={row.id}
                    className={`border rounded-lg p-2.5 space-y-2 relative ${cardBg}`}
                  >
                    <button
                      onClick={() => handleRemoveDutyRow(row.id)}
                      className="absolute top-2 right-2 text-stone-400 hover:text-rose-600 p-0.5"
                      title="削除"
                    >
                      <Trash2 size={13} />
                    </button>

                    {/* 行ヘッダー */}
                    <div className="flex items-center gap-2 pr-6">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-black ${badgeColor}`}>
                        {data.month}月 {row.day}日 ({row.weekday})
                      </span>

                      <input
                        type="text"
                        value={row.serviceName}
                        onChange={(e) => handleDutyChange(row.id, 'serviceName', e.target.value)}
                        placeholder="集会名"
                        className="px-2 py-0.5 bg-white border border-stone-300 rounded font-bold text-stone-900 w-36 text-xs"
                      />

                      <input
                        type="text"
                        value={row.notes || ''}
                        onChange={(e) => handleDutyChange(row.id, 'notes', e.target.value)}
                        placeholder="備考（★愛餐会等）"
                        className="px-2 py-0.5 bg-white border border-amber-300 rounded text-amber-900 font-bold flex-1 text-xs"
                      />
                    </div>

                    {/* 奉仕者入力グリッド */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-stone-200/80">
                      <div>
                        <span className="text-[10px] font-bold text-stone-600 block mb-0.5">説教:</span>
                        <input
                          type="text"
                          value={row.sermon || ''}
                          onChange={(e) => handleDutyChange(row.id, 'sermon', e.target.value)}
                          className="w-full px-1.5 py-0.8 bg-white border border-stone-300 rounded text-xs font-bold"
                          placeholder="説教者"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-stone-600 block mb-0.5">司会:</span>
                        <input
                          type="text"
                          value={row.leader || ''}
                          onChange={(e) => handleDutyChange(row.id, 'leader', e.target.value)}
                          className="w-full px-1.5 py-0.8 bg-white border border-stone-300 rounded text-xs"
                          placeholder="司会者"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-stone-600 block mb-0.5">パンきっず:</span>
                        <input
                          type="text"
                          value={row.praiseKids || ''}
                          onChange={(e) => handleDutyChange(row.id, 'praiseKids', e.target.value)}
                          className="w-full px-1.5 py-0.8 bg-white border border-stone-300 rounded text-xs"
                          placeholder="担当者"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-stone-600 block mb-0.5">ピアノ/奏楽:</span>
                        <input
                          type="text"
                          value={row.music || ''}
                          onChange={(e) => handleDutyChange(row.id, 'music', e.target.value)}
                          className="w-full px-1.5 py-0.8 bg-white border border-stone-300 rounded text-xs"
                          placeholder="担当者"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-stone-600 block mb-0.5">ドラム/カホン:</span>
                        <input
                          type="text"
                          value={row.drums || ''}
                          onChange={(e) => handleDutyChange(row.id, 'drums', e.target.value)}
                          className="w-full px-1.5 py-0.8 bg-white border border-stone-300 rounded text-xs"
                          placeholder="担当者"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-stone-600 block mb-0.5">PPT:</span>
                        <input
                          type="text"
                          value={row.ppt || ''}
                          onChange={(e) => handleDutyChange(row.id, 'ppt', e.target.value)}
                          className="w-full px-1.5 py-0.8 bg-white border border-stone-300 rounded text-xs"
                          placeholder="担当者"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-stone-600 block mb-0.5">受付:</span>
                        <input
                          type="text"
                          value={row.reception || ''}
                          onChange={(e) => handleDutyChange(row.id, 'reception', e.target.value)}
                          className="w-full px-1.5 py-0.8 bg-white border border-stone-300 rounded text-xs"
                          placeholder="担当者"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-stone-600 block mb-0.5">祈祷:</span>
                        <input
                          type="text"
                          value={row.prayer || ''}
                          onChange={(e) => handleDutyChange(row.id, 'prayer', e.target.value)}
                          className="w-full px-1.5 py-0.8 bg-white border border-stone-300 rounded text-xs"
                          placeholder="担当者"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* タブ2: 行事・イベント予定 */}
        {/* ======================================================================= */}
        {activeTab === 'events' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-800">
                  📅 今月のイベント・行事スケジュール
                </h3>
                <p className="text-[11px] text-stone-500">
                  日付と内容を追加すると、右上に綺麗に並びます。
                </p>
              </div>

              <button
                onClick={handleAddEvent}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold shadow-2xs"
              >
                <Plus size={13} />
                <span>予定を追加</span>
              </button>
            </div>

            <div className="space-y-2">
              {data.events.map((evt) => (
                <div
                  key={evt.id}
                  className={`p-2 rounded-lg border flex flex-col gap-1.5 relative ${
                    evt.isHighlight ? 'bg-amber-50/90 border-amber-300' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <button
                    onClick={() => handleRemoveEvent(evt.id)}
                    className="absolute top-2 right-2 text-stone-400 hover:text-rose-600 p-0.5"
                    title="削除"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="flex items-center gap-2 pr-6">
                    <div className="w-28">
                      <input
                        type="text"
                        value={evt.dateText}
                        onChange={(e) => handleUpdateEvent(evt.id, 'dateText', e.target.value)}
                        placeholder="例: 8/11(火祝)"
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-bold"
                      />
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        value={evt.title}
                        onChange={(e) => handleUpdateEvent(evt.id, 'title', e.target.value)}
                        placeholder="例: 子どもデイキャンプ"
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={evt.detail || ''}
                      onChange={(e) => handleUpdateEvent(evt.id, 'detail', e.target.value)}
                      placeholder="時間・詳細（例: 10:00-14:00 @教会）"
                      className="flex-1 px-2 py-0.8 bg-white border border-stone-300 rounded text-stone-600"
                    />

                    <label className="flex items-center gap-1 text-[11px] font-bold text-amber-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(evt.isHighlight)}
                        onChange={(e) => handleUpdateEvent(evt.id, 'isHighlight', e.target.checked)}
                        className="rounded text-amber-600"
                      />
                      <span>強調枠</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-200">
              <label className="block font-bold text-stone-800 mb-1">
                定期集会のご案内（フッター枠）:
              </label>
              <input
                type="text"
                value={data.regularNotice}
                onChange={(e) => onChange({ ...data, regularNotice: e.target.value })}
                className="w-full px-2.5 py-1 bg-white border border-stone-300 rounded font-bold text-stone-700"
              />
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* タブ3: お便り・聖句・ニュース・メモ */}
        {/* ======================================================================= */}
        {activeTab === 'sidebar' && (
          <div className="space-y-3">
            {/* 教会テーマ */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-stone-800">教会テーマ</label>
                <input
                  type="text"
                  value={data.sidebar.themeYear}
                  onChange={(e) => handleSidebarChange('themeYear', e.target.value)}
                  className="px-2 py-0.5 bg-white border border-stone-300 rounded font-bold w-36 text-center"
                />
              </div>
              <textarea
                value={data.sidebar.themeText}
                onChange={(e) => handleSidebarChange('themeText', e.target.value)}
                rows={2}
                className="w-full p-2 bg-white border border-stone-300 rounded"
              />
            </div>

            {/* テーマ聖句 */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 space-y-1.5">
              <label className="block font-bold text-stone-800">テーマ聖句</label>
              <input
                type="text"
                value={data.sidebar.scriptureRef}
                onChange={(e) => handleSidebarChange('scriptureRef', e.target.value)}
                placeholder="聖句見出し"
                className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-bold"
              />
              <textarea
                value={data.sidebar.scriptureText}
                onChange={(e) => handleSidebarChange('scriptureText', e.target.value)}
                rows={3}
                placeholder="聖句本文"
                className="w-full p-2 bg-white border border-stone-300 rounded leading-relaxed"
              />
            </div>

            {/* 前月のニュース */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 space-y-1.5">
              <label className="block font-bold text-stone-800">前月のニュース</label>
              <textarea
                value={data.sidebar.newsText}
                onChange={(e) => handleSidebarChange('newsText', e.target.value)}
                rows={4}
                className="w-full p-2 bg-white border border-stone-300 rounded leading-relaxed"
              />
            </div>

            {/* 祈祷課題 */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-stone-800">祈祷課題</label>
                <button
                  onClick={handleAddPrayerRequest}
                  className="font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5"
                >
                  <Plus size={13} /> 行を追加
                </button>
              </div>
              <div className="space-y-1">
                {data.sidebar.prayerRequests.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="text-amber-700 font-bold">•</span>
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handlePrayerRequestChange(idx, e.target.value)}
                      className="flex-1 px-2 py-1 bg-white border border-stone-300 rounded"
                    />
                    <button
                      onClick={() => handleRemovePrayerRequest(idx)}
                      className="text-stone-400 hover:text-rose-600 p-0.5"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 一言メモ */}
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 space-y-1.5">
              <label className="block font-bold text-stone-800">一言メモ</label>
              <textarea
                value={data.sidebar.memoText}
                onChange={(e) => handleSidebarChange('memoText', e.target.value)}
                rows={4}
                placeholder="一言メモのテキストを入力..."
                className="w-full p-2 bg-white border border-stone-300 rounded leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* タブ4: 設定 */}
        {/* ======================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-3">
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 space-y-1.5">
              <label className="block font-bold text-stone-800">基本タイトル設定</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-stone-500">教会名:</span>
                  <input
                    type="text"
                    value={data.churchName}
                    onChange={(e) => onChange({ ...data, churchName: e.target.value })}
                    className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-stone-500">文書名:</span>
                  <input
                    type="text"
                    value={data.docTitle}
                    onChange={(e) => onChange({ ...data, docTitle: e.target.value })}
                    className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
