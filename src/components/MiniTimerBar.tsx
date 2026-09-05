import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { Play, Pause, Check, Clock, X } from 'lucide-react';

interface MiniTimerBarProps {
  runningTask: Task | null;
  onPause: (task: Task) => void;
  onComplete: (task: Task) => void;
  onSelectTask: (taskId: string) => void;
}

export const MiniTimerBar: React.FC<MiniTimerBarProps> = ({
  runningTask,
  onPause,
  onComplete,
  onSelectTask,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!runningTask || !runningTask.isRunning || !runningTask.timerStartedAt) {
      setElapsedSeconds(0);
      return;
    }

    const start = runningTask.timerStartedAt;
    const initialElapsed = Math.floor((Date.now() - start) / 1000);
    setElapsedSeconds(initialElapsed);

    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [runningTask]);

  if (!runningTask || !runningTask.isRunning) return null;

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed top-3 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 bg-neutral-900/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-2xl border border-white/10 animate-scaleIn select-none flex items-center justify-between gap-3">
      {/* Task Info */}
      <div
        onClick={() => onSelectTask(runningTask.id)}
        className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
        <div className="min-w-0">
          <span className="text-xs font-bold block truncate">
            {runningTask.title}
          </span>
          <span className="text-[10px] text-neutral-400">作業中...</span>
        </div>
      </div>

      {/* Timer Display */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="font-mono text-sm font-bold text-emerald-400 bg-white/10 px-2.5 py-1 rounded-lg">
          {timeFormatted}
        </div>

        {/* Pause Button */}
        <button
          type="button"
          onClick={() => onPause(runningTask)}
          className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white active:scale-90 transition-transform"
          title="一時停止"
        >
          <Pause size={14} fill="currentColor" />
        </button>

        {/* Complete Button */}
        <button
          type="button"
          onClick={() => onComplete(runningTask)}
          className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white active:scale-90 transition-transform shadow-md shadow-emerald-500/30"
          title="完了にする"
        >
          <Check size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
