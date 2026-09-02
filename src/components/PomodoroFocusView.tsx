import React, { useState, useEffect, useRef } from 'react';
import { Task, PomodoroSession, AppSettings } from '../types';
import { soundManager } from '../lib/soundEffects';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  CloudRain,
  Radio,
  Coffee,
  Waves,
  CheckCircle,
  Clock,
  Flame,
  Award,
} from 'lucide-react';

interface PomodoroFocusViewProps {
  tasks: Task[];
  sessions: PomodoroSession[];
  settings: AppSettings;
  activeFocusTask: Task | null;
  onSelectFocusTask: (task: Task | null) => void;
  onCompletePomodoroSession: (session: Omit<PomodoroSession, 'id'>) => void;
  onIncrementTaskPomodoro: (taskId: string) => void;
  onUpdateSettings: (settings: AppSettings) => void;
}

export const PomodoroFocusView: React.FC<PomodoroFocusViewProps> = ({
  tasks,
  sessions,
  settings,
  activeFocusTask,
  onSelectFocusTask,
  onCompletePomodoroSession,
  onIncrementTaskPomodoro,
  onUpdateSettings,
}) => {
  const [mode, setMode] = useState<'work' | 'short_break' | 'long_break'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(settings.pomodoroWorkDuration * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<AppSettings['ambientSound']>(settings.ambientSound);
  const [ambientVolume, setAmbientVolume] = useState<number>(settings.ambientVolume);

  const activeTasks = tasks.filter((t) => !t.completed);

  // Switch mode durations
  const getDurationForMode = (m: 'work' | 'short_break' | 'long_break') => {
    switch (m) {
      case 'work':
        return settings.pomodoroWorkDuration * 60;
      case 'short_break':
        return settings.pomodoroShortBreak * 60;
      case 'long_break':
        return settings.pomodoroLongBreak * 60;
    }
  };

  const switchMode = (newMode: 'work' | 'short_break' | 'long_break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getDurationForMode(newMode));
  };

  // Timer Tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed session
      if (settings.soundEnabled) {
        soundManager.playPomodoroAlert();
      }

      onCompletePomodoroSession({
        taskId: activeFocusTask?.id,
        taskTitle: activeFocusTask?.title,
        durationMinutes: mode === 'work' ? settings.pomodoroWorkDuration : mode === 'short_break' ? settings.pomodoroShortBreak : settings.pomodoroLongBreak,
        completedAt: new Date().toISOString(),
        type: mode,
      });

      if (mode === 'work' && activeFocusTask) {
        onIncrementTaskPomodoro(activeFocusTask.id);
      }

      // Auto cycle next mode
      if (mode === 'work') {
        switchMode('short_break');
      } else {
        switchMode('work');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, activeFocusTask]);

  // Ambient sound handler
  const handleToggleAmbient = (sound: AppSettings['ambientSound']) => {
    const nextSound = ambientSound === sound ? 'none' : sound;
    setAmbientSound(nextSound);
    onUpdateSettings({ ...settings, ambientSound: nextSound });

    if (nextSound === 'none') {
      soundManager.stopAmbient();
    } else {
      soundManager.startAmbient(nextSound, ambientVolume);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    onUpdateSettings({ ...settings, ambientVolume: vol });
    soundManager.setAmbientVolume(vol);
  };

  // Cleanup ambient sound on unmount
  useEffect(() => {
    return () => {
      soundManager.stopAmbient();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalDuration = getDurationForMode(mode);
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  // Stats calculation
  const todaySessions = sessions.filter((s) => {
    const sDate = new Date(s.completedAt).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return sDate === today && s.type === 'work';
  });

  const totalMinutesToday = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="flex flex-col items-center justify-start h-full max-w-4xl mx-auto py-4 space-y-6 overflow-y-auto">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => switchMode('work')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'work'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          🍅 集中ポモドーロ ({settings.pomodoroWorkDuration}分)
        </button>
        <button
          type="button"
          onClick={() => switchMode('short_break')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'short_break'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          ☕ 短い休憩 ({settings.pomodoroShortBreak}分)
        </button>
        <button
          type="button"
          onClick={() => switchMode('long_break')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'long_break'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          🌿 長い休憩 ({settings.pomodoroLongBreak}分)
        </button>
      </div>

      {/* Big Circular / Radial Timer */}
      <div className="relative flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-neutral-200/80 shadow-md w-full max-w-md">
        {/* SVG Progress Ring */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-neutral-100"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`transition-all duration-500 ${
                mode === 'work'
                  ? 'stroke-red-500'
                  : mode === 'short_break'
                  ? 'stroke-emerald-500'
                  : 'stroke-blue-500'
              }`}
              strokeWidth="6"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-mono font-black text-neutral-900 tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs font-semibold text-neutral-400 mt-1 uppercase tracking-wider">
              {mode === 'work' ? 'FOCUS TIME' : 'REST & RECHARGE'}
            </span>
          </div>
        </div>

        {/* Selected Focus Task Banner */}
        <div className="w-full mt-4 pt-3 border-t border-neutral-100 flex flex-col items-center text-center">
          <span className="text-[11px] text-neutral-400 font-medium">現在の集中タスク:</span>
          {activeFocusTask ? (
            <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-semibold max-w-full truncate border border-red-100">
              <span>🍅</span>
              <span className="truncate">{activeFocusTask.title}</span>
              <button
                type="button"
                onClick={() => onSelectFocusTask(null)}
                className="hover:text-red-900 text-xs ml-1"
                title="タスク選択を解除"
              >
                ×
              </button>
            </div>
          ) : (
            <select
              onChange={(e) => {
                const found = tasks.find((t) => t.id === e.target.value);
                onSelectFocusTask(found || null);
              }}
              defaultValue=""
              className="mt-1 text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1 text-neutral-600 focus:outline-none max-w-xs truncate cursor-pointer"
            >
              <option value="">タスクを選択して集中...</option>
              {activeTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => setTimeLeft(getDurationForMode(mode))}
            className="p-3 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
            title="リセット"
          >
            <RotateCcw size={20} />
          </button>

          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl flex items-center gap-2 font-bold text-sm text-white shadow-md hover:scale-105 active:scale-95 transition-all ${
              mode === 'work'
                ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                : mode === 'short_break'
                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                : 'bg-blue-500 hover:bg-blue-600 shadow-blue-200'
            }`}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} className="fill-white" />}
            <span>{isRunning ? '一時停止' : 'スタート'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (mode === 'work') switchMode('short_break');
              else switchMode('work');
            }}
            className="p-3 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
            title="スキップ"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      {/* Ambient Sound Player Box */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-neutral-500" />
            <span className="text-xs font-bold text-neutral-700">集中BGM / 環境音 (Web Audio)</span>
          </div>

          {ambientSound !== 'none' && (
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 accent-blue-600 h-1 bg-neutral-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-neutral-400">{Math.round(ambientVolume * 100)}%</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'rain', label: '雨音', icon: <CloudRain size={16} /> },
            { id: 'whitenoise', label: 'ホワイトノイズ', icon: <Radio size={16} /> },
            { id: 'cafe', label: 'カフェ音', icon: <Coffee size={16} /> },
            { id: 'waves', label: '波の音', icon: <Waves size={16} /> },
          ].map((s) => {
            const isActive = ambientSound === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleToggleAmbient(s.id as AppSettings['ambientSound'])}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-xs ring-1 ring-blue-300'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {s.icon}
                <span className="text-[11px]">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Focus Stats Today */}
      <div className="w-full max-w-md grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
            <Flame size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-neutral-800">{todaySessions.length}</div>
            <div className="text-[11px] text-neutral-400">本日のポモドーロ</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-neutral-800">{totalMinutesToday} 分</div>
            <div className="text-[11px] text-neutral-400">本日の集中時間</div>
          </div>
        </div>
      </div>
    </div>
  );
};
