import React, { useState, useEffect } from 'react';
import { CleanScheduleData } from './types';
import { defaultAugust2026, generateMonthDuties } from './sampleData';
import { ScheduleEditor } from './ScheduleEditor';
import { SchedulePrintPreview } from './SchedulePrintPreview';
import { ChurchLogo } from './ChurchLogo';
import {
  Printer,
  Save,
  Copy,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Columns,
  Eye,
  Edit3,
  Download,
  Upload,
  CheckCircle,
} from 'lucide-react';

const STORAGE_KEY = 'church_schedule_v5_master';

export const ServiceScheduleMaker: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<CleanScheduleData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.duties && parsed.events && parsed.sidebar) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved data:', e);
      }
    }
    return defaultAugust2026;
  });

  const [previewScale, setPreviewScale] = useState<number>(0.85);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [showSaveToast, setShowSaveToast] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setViewMode('edit');
        setPreviewScale(0.65);
      } else {
        setViewMode('split');
        setPreviewScale(0.85);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleData));
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  const handleCreateNextMonth = () => {
    let nextYear = scheduleData.year;
    let nextMonth = scheduleData.month + 1;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }

    const newDuties = generateMonthDuties(nextYear, nextMonth);

    const nextData: CleanScheduleData = {
      ...scheduleData,
      year: nextYear,
      month: nextMonth,
      duties: newDuties,
      events: [
        {
          id: `e-${Date.now()}-1`,
          dateText: '月〜金 毎朝',
          title: 'オンライン早天祈祷',
          detail: '6:00 - 6:30 （Zoomにて配信）',
          isHighlight: true,
        },
      ],
      sidebar: {
        ...scheduleData.sidebar,
        newsText: `${scheduleData.month}月も豊かな恵みと祝福に満たされた月となりました！`,
      },
    };

    setScheduleData(nextData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
    alert(`${nextYear}年${nextMonth}月の奉仕表を新規作成しました！`);
  };

  const handleResetToSample = () => {
    if (window.confirm('初期デザイン（2026年8月完全版）にリセットしますか？')) {
      setScheduleData(defaultAugust2026);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAugust2026));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scheduleData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `奉仕表_${scheduleData.year}年${scheduleData.month}月.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          setScheduleData(parsed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          alert('奉仕表データを読み込みました！');
        } catch (err) {
          alert('ファイルの読み込みに失敗しました。');
        }
      };
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-stone-100 overflow-hidden font-sans">
      {/* 印刷用CSSスタイル */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          header, nav, aside, .no-print {
            display: none !important;
          }
          #printable-schedule-sheet {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            transform: none !important;
            box-shadow: none !important;
            padding: 6mm !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
          }
        }
      `}</style>

      {/* 1. 最上部アプリケーションバー */}
      <header className="no-print h-14 bg-stone-900 text-white px-4 flex items-center justify-between shadow-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          <ChurchLogo size={28} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-wide text-sm sm:text-base text-amber-400">
                {scheduleData.churchName}
              </span>
              <span className="text-xs bg-amber-600/90 px-2 py-0.5 rounded font-bold">
                {scheduleData.docTitle}
              </span>
            </div>
            <span className="text-[10px] text-stone-400 hidden sm:inline">
              {scheduleData.year}年 {scheduleData.month}月号 を編集中
            </span>
          </div>
        </div>

        {/* ボタン群 */}
        <div className="flex items-center gap-2">
          {showSaveToast && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold animate-pulse mr-2">
              <CheckCircle size={14} /> 保存完了
            </span>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded text-xs font-bold transition-colors border border-stone-700"
            title="ブラウザに保存"
          >
            <Save size={14} />
            <span className="hidden sm:inline">保存</span>
          </button>

          <button
            onClick={handleCreateNextMonth}
            className="flex items-center gap-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded text-xs font-bold transition-colors border border-stone-700"
            title="翌月分を新規作成"
          >
            <Copy size={14} />
            <span className="hidden md:inline">翌月を新規作成</span>
          </button>

          <button
            onClick={handleResetToSample}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-xs font-bold transition-colors border border-stone-700"
            title="初期デザインに再読込"
          >
            <RotateCcw size={13} />
            <span className="hidden lg:inline">初期デザイン再読込</span>
          </button>

          {/* 印刷・PDF保存ボタン */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-black text-xs sm:text-sm transition-all shadow-md ring-2 ring-amber-400/40"
          >
            <Printer size={16} />
            <span>🖨️ A4印刷 / PDF保存</span>
          </button>
        </div>
      </header>

      {/* 2. サブツールバー */}
      <div className="no-print h-10 bg-white border-b border-stone-200 px-4 flex items-center justify-between text-xs text-stone-600 shrink-0">
        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded border border-stone-200">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-colors ${
              viewMode === 'split' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'hover:text-stone-900'
            }`}
          >
            <Columns size={13} />
            <span className="hidden sm:inline">分割表示</span>
          </button>
          <button
            onClick={() => setViewMode('edit')}
            className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-colors ${
              viewMode === 'edit' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'hover:text-stone-900'
            }`}
          >
            <Edit3 size={13} />
            <span>編集のみ</span>
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1 px-2 py-1 rounded font-medium transition-colors ${
              viewMode === 'preview' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'hover:text-stone-900'
            }`}
          >
            <Eye size={13} />
            <span>プレビューのみ</span>
          </button>
        </div>

        {/* ズーム */}
        <div className="flex items-center gap-3">
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className="flex items-center gap-1.5 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              <button
                onClick={() => setPreviewScale((s) => Math.max(0.4, Number((s - 0.05).toFixed(2))))}
                className="p-1 hover:text-stone-900"
                title="縮小"
              >
                <ZoomOut size={13} />
              </button>
              <span className="font-mono text-[11px] w-10 text-center font-bold">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                onClick={() => setPreviewScale((s) => Math.min(1.3, Number((s + 0.05).toFixed(2))))}
                className="p-1 hover:text-stone-900"
                title="拡大"
              >
                <ZoomIn size={13} />
              </button>
            </div>
          )}

          <div className="hidden lg:flex items-center gap-2 border-l border-stone-200 pl-3">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1 text-[11px] hover:text-stone-900"
            >
              <Download size={12} />
              <span>ファイル保存</span>
            </button>

            <label className="flex items-center gap-1 text-[11px] hover:text-stone-900 cursor-pointer">
              <Upload size={12} />
              <span>読込</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* 3. メインエリア */}
      <div className="flex-1 flex overflow-hidden">
        {(viewMode === 'split' || viewMode === 'edit') && (
          <div
            className={`no-print ${
              viewMode === 'split' ? 'w-full lg:w-[48%] xl:w-[45%]' : 'w-full max-w-4xl mx-auto'
            } h-full overflow-hidden`}
          >
            <ScheduleEditor data={scheduleData} onChange={setScheduleData} />
          </div>
        )}

        {(viewMode === 'split' || viewMode === 'preview') && (
          <div
            className={`flex-1 h-full bg-stone-300/80 overflow-auto flex justify-center items-start p-4 ${
              viewMode === 'preview' ? 'w-full' : ''
            }`}
          >
            <SchedulePrintPreview data={scheduleData} scale={previewScale} />
          </div>
        )}
      </div>
    </div>
  );
};
