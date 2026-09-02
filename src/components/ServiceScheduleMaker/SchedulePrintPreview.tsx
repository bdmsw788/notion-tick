import React from 'react';
import { CleanScheduleData } from './types';
import { ChurchLogo } from './ChurchLogo';

interface SchedulePrintPreviewProps {
  data: CleanScheduleData;
  scale?: number;
}

export const SchedulePrintPreview: React.FC<SchedulePrintPreviewProps> = ({
  data,
  scale = 1,
}) => {
  const { year, month, churchName, docTitle, sidebar, events, regularNotice, duties } = data;

  return (
    <div className="flex justify-center items-start overflow-auto p-1 sm:p-3 bg-stone-300/90 print:bg-white print:p-0">
      {/* ========================================================================= */}
      {/* A4 縦用紙コンテナ (210mm x 297mm 相当) */}
      {/* ========================================================================= */}
      <div
        id="printable-schedule-sheet"
        style={{
          width: '210mm',
          height: '297mm',
          maxHeight: '297mm',
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
          boxSizing: 'border-box',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
        className="bg-white text-stone-950 shadow-2xl print:shadow-none p-[4.5mm] flex flex-col justify-between font-sans leading-tight select-none relative overflow-hidden"
      >
        {/* ========================================================================= */}
        {/* 1. 最上部ヘッダー（ロゴ ＋ 年月 ＋ 教会名 ＋ タイトル）詰め設計 */}
        {/* ========================================================================= */}
        <header className="flex items-center justify-between pb-0.5 border-b-2 border-amber-600 shrink-0 h-[14mm] mb-1">
          <div className="flex items-center gap-2.5">
            <ChurchLogo size={34} />
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-600 tracking-wider font-mono">
                {month}
              </span>
              <span className="text-base font-bold text-amber-600">月</span>
              <span className="text-2xl sm:text-3xl font-bold text-amber-600 tracking-wider font-mono ml-2">
                {year}
              </span>
              <span className="text-base font-bold text-amber-600">年</span>
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-xl sm:text-2xl font-black tracking-widest text-stone-950 flex items-center gap-2">
              <span>{churchName}</span>
              <span className="text-amber-800 font-extrabold">{docTitle}</span>
            </h1>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. メインコンテンツ（左右2カラム：左サイドバー ＋ 右上下分割エリア） */}
        {/* ========================================================================= */}
        <div className="flex gap-1.5 overflow-hidden h-[272mm]">
          {/* ----------------------------------------------------------------------- */}
          {/* 左サイドバー（幅: 56mm / 約 28%）5枠を余白なくギュッと詰める */}
          {/* ----------------------------------------------------------------------- */}
          <aside className="w-[28%] flex flex-col justify-between h-full shrink-0 gap-1">
            {/* 1. 教会テーマ */}
            <div className="border border-stone-600 rounded-xs overflow-hidden flex flex-col shrink-0">
              <div className="bg-stone-200 text-stone-950 font-black px-1 py-0.5 text-center text-[11px] border-b border-stone-400">
                {sidebar.themeYear}
              </div>
              <div className="p-1 text-center font-bold text-stone-950 whitespace-pre-line text-[11px] leading-tight bg-amber-50/60">
                {sidebar.themeText}
              </div>
            </div>

            {/* 2. テーマ聖句 */}
            <div className="border border-stone-600 rounded-xs overflow-hidden flex flex-col shrink-0">
              <div className="bg-stone-200 text-stone-950 font-black px-1 py-0.5 text-center text-[10.5px] border-b border-stone-400">
                {sidebar.scriptureRef}
              </div>
              <div className="p-1 text-stone-950 text-[10.5px] leading-snug bg-white font-medium">
                {sidebar.scriptureText}
              </div>
            </div>

            {/* 3. 前月のニュース */}
            <div className="border border-stone-600 rounded-xs overflow-hidden flex flex-col flex-1">
              <div className="bg-stone-200 text-stone-950 font-black px-1 py-0.5 text-center text-[11px] border-b border-stone-400 shrink-0">
                {sidebar.newsTitle}
              </div>
              <div className="p-1 text-stone-900 text-[10.5px] leading-relaxed bg-white font-medium flex-1 overflow-hidden">
                {sidebar.newsText}
              </div>
            </div>

            {/* 4. 祈祷課題 */}
            <div className="border border-stone-600 rounded-xs overflow-hidden flex flex-col shrink-0">
              <div className="bg-stone-200 text-stone-950 font-black px-1 py-0.5 text-center text-[11px] border-b border-stone-400">
                祈祷課題
              </div>
              <div className="p-1 text-stone-950 text-[11px] leading-tight space-y-0.8 bg-white">
                {sidebar.prayerRequests.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-1">
                    <span className="text-amber-700 font-black text-[11px]">•</span>
                    <span className="flex-1 font-bold text-stone-900">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. 一言メモ */}
            <div className="border border-stone-600 rounded-xs overflow-hidden flex flex-col flex-1">
              <div className="bg-stone-200 text-stone-950 font-black px-1 py-0.5 text-center text-[11px] border-b border-stone-400 shrink-0">
                {sidebar.memoTitle}
              </div>
              <div className="p-1 text-stone-900 text-[10.5px] leading-relaxed bg-white font-medium flex-1 overflow-hidden">
                {sidebar.memoText}
              </div>
            </div>
          </aside>

          {/* ----------------------------------------------------------------------- */}
          {/* 右メインエリア（幅: 約 72%）上下分割をギュッと詰めて文字特大化 */}
          {/* ----------------------------------------------------------------------- */}
          <main className="w-[72%] flex flex-col justify-between h-full overflow-hidden gap-1.5">
            {/* ===================================================================== */}
            {/* 上段：今月のイベント・行事予定（高さを引き締め凝縮） */}
            {/* ===================================================================== */}
            <div className="border border-stone-600 rounded-xs bg-white overflow-hidden flex flex-col justify-between h-[115mm] shrink-0">
              {/* セクション見出し */}
              <div className="bg-amber-100 text-amber-950 font-black px-2 py-0.5 text-[11.5px] border-b border-amber-300 flex items-center justify-between shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="text-amber-800 font-black">📅</span>
                  <span>今月のイベント・行事予定</span>
                </span>
                <span className="text-[10.5px] font-bold text-amber-900">
                  {month}月のスケジュール
                </span>
              </div>

              {/* イベント一覧（余白を詰め、文字を特大化） */}
              <div className="p-1 flex-1 flex flex-col justify-between overflow-hidden">
                <div className="space-y-0.8 flex-1 flex flex-col justify-around overflow-hidden">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-xs border ${
                        evt.isHighlight
                          ? 'bg-amber-50 border-amber-400 text-stone-950 font-bold'
                          : 'bg-stone-50 border-stone-300 text-stone-900'
                      }`}
                    >
                      {/* 日付バッジ */}
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded-xs font-black text-[11px] whitespace-nowrap shrink-0 ${
                          evt.isHighlight
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-200 text-stone-950 border border-stone-300'
                        }`}
                      >
                        {evt.dateText}
                      </span>

                      {/* イベントタイトル */}
                      <span className="font-bold text-[11.5px] flex-1 truncate text-stone-950">
                        {evt.title}
                      </span>

                      {/* 時間・詳細 */}
                      {evt.detail && (
                        <span className="text-[10.5px] text-stone-700 shrink-0 font-bold font-mono">
                          {evt.detail}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* 定期集会フッター告知 */}
                {regularNotice && (
                  <div className="bg-stone-100 px-2 py-0.5 rounded-xs text-[10px] font-black text-stone-900 text-center border border-stone-400 shrink-0 mt-0.5">
                    {regularNotice}
                  </div>
                )}
              </div>
            </div>

            {/* ===================================================================== */}
            {/* 下段：礼拝・集会 奉仕担当表（高さをたっぷり確保し、文字特大化） */}
            {/* ===================================================================== */}
            <div className="border border-stone-600 rounded-xs bg-white overflow-hidden flex flex-col flex-1">
              {/* セクション見出し */}
              <div className="bg-rose-100 text-rose-950 font-black px-2 py-0.5 text-[11.5px] border-b border-rose-300 flex items-center justify-between shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="text-rose-800 font-black">⛪</span>
                  <span>礼拝・集会 奉仕担当表</span>
                </span>
                <span className="text-[10.5px] font-bold text-rose-900">
                  主日礼拝 (10:30〜) ＆ 祈祷会 (10:30/19:30)
                </span>
              </div>

              {/* 奉仕者テーブル（余白を詰め、文字サイズ11.5pxの特大太字） */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <table className="w-full h-full border-collapse text-center table-fixed text-[11px]">
                  <thead>
                    <tr className="bg-stone-200 text-stone-950 font-black text-[11px] border-b border-stone-400 h-[22px]">
                      <th className="w-[8.5%] border-r border-stone-300 p-0 font-black">日付</th>
                      <th className="w-[14%] border-r border-stone-300 p-0 font-black">内容</th>
                      <th className="w-[8%] border-r border-stone-300 p-0 font-black">パン<br className="leading-none" />きっず</th>
                      <th className="w-[14%] border-r border-stone-300 p-0 font-black">説教</th>
                      <th className="w-[8%] border-r border-stone-300 p-0 font-black">司会</th>
                      <th className="w-[9.5%] border-r border-stone-300 p-0 font-black">ピアノ/<br className="leading-none" />奏楽</th>
                      <th className="w-[8%] border-r border-stone-300 p-0 font-black">ドラム/<br className="leading-none" />カホン</th>
                      <th className="w-[7%] border-r border-stone-300 p-0 font-black">PPT</th>
                      <th className="w-[7%] border-r border-stone-300 p-0 font-black">受付</th>
                      <th className="w-[7%] border-r border-stone-300 p-0 font-black">祈祷</th>
                      <th className="w-[9%] p-0 font-black">備考</th>
                    </tr>
                  </thead>
                  <tbody>
                    {duties.map((row) => {
                      const isSun = row.weekday === '日';
                      const rowBg = isSun ? 'bg-[#FDE8EA]/75 hover:bg-[#FDE8EA]' : 'bg-white hover:bg-stone-50';
                      const dateColor = isSun ? 'text-rose-700 font-black' : 'text-stone-900 font-bold';

                      return (
                        <tr
                          key={row.id}
                          className={`border-b border-stone-300 ${rowBg} transition-colors`}
                        >
                          {/* 日付 */}
                          <td className={`border-r border-stone-300 text-[11.5px] ${dateColor} p-0`}>
                            {row.day}日 ({row.weekday})
                          </td>

                          {/* 内容・礼拝名 */}
                          <td className="border-r border-stone-300 p-0 text-left px-1">
                            <span className="font-bold text-[11px] text-stone-950 block truncate">
                              {row.serviceName}
                            </span>
                          </td>

                          {/* パンきっず */}
                          <td className="border-r border-stone-300 p-0 text-[11px] truncate font-medium text-stone-900">
                            {row.praiseKids || '-'}
                          </td>

                          {/* 説教 */}
                          <td className="border-r border-stone-300 p-0 text-[11.5px] truncate font-black text-stone-950 px-0.5">
                            {row.sermon || '-'}
                          </td>

                          {/* 司会 */}
                          <td className="border-r border-stone-300 p-0 text-[11px] truncate font-medium text-stone-900">
                            {row.leader || '-'}
                          </td>

                          {/* ピアノ/奏楽 */}
                          <td className="border-r border-stone-300 p-0 text-[11px] truncate font-medium text-stone-900">
                            {row.music || '-'}
                          </td>

                          {/* ドラム/カホン */}
                          <td className="border-r border-stone-300 p-0 text-[11px] truncate font-medium text-stone-900">
                            {row.drums || '-'}
                          </td>

                          {/* PPT */}
                          <td className="border-r border-stone-300 p-0 text-[11px] truncate font-medium text-stone-900">
                            {row.ppt || '-'}
                          </td>

                          {/* 受付 */}
                          <td className="border-r border-stone-300 p-0 text-[11px] truncate font-medium text-stone-900">
                            {row.reception || '-'}
                          </td>

                          {/* 祈祷 */}
                          <td className="border-r border-stone-300 p-0 text-[11px] truncate font-medium text-stone-900">
                            {row.prayer || '-'}
                          </td>

                          {/* 備考 */}
                          <td className="p-0 text-[10px] font-black text-amber-900 truncate px-0.5">
                            {row.notes || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
