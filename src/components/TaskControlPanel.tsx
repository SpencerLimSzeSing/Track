import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { ActiveSession, ActivityId } from '../types';
import { ACTIVITIES, formatClockTime, formatDuration, getActivityConfig } from '../utils/formatters';

interface TaskControlPanelProps {
  activeSession: ActiveSession | null;
  totalTasksDone: number;
  overallDurationFormatted: string;
  onStartTask: (activityId: ActivityId, app: string, remarks: string) => void;
  onEndTask: () => void;
  onCancelTask: () => void;
  onUpdateDraftRemarks: (remarks: string) => void;
}

const COMMON_APPS = ['Salesforce CRM', 'Zendesk', 'Excel', 'Jira', 'ServiceNow'];

export const TaskControlPanel: React.FC<TaskControlPanelProps> = ({
  activeSession,
  totalTasksDone,
  overallDurationFormatted,
  onStartTask,
  onEndTask,
  onCancelTask,
  onUpdateDraftRemarks,
}) => {
  const [selectedActivityId, setSelectedActivityId] = useState<ActivityId>('1');
  const [appInput, setAppInput] = useState<string>('');
  const [remarksInput, setRemarksInput] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const prevActiveRef = React.useRef(activeSession);

  useEffect(() => {
    if (activeSession) {
      setSelectedActivityId(activeSession.activityId);
      setAppInput(activeSession.app);
      setRemarksInput(activeSession.remarks);
    } else if (prevActiveRef.current) {
      setRemarksInput('');
      setAppInput('');
    }
    prevActiveRef.current = activeSession;
  }, [activeSession]);

  useEffect(() => {
    if (!activeSession) {
      setElapsedSeconds(0);
      return;
    }

    const calculateElapsed = () => {
      const diffMs = Math.max(0, Date.now() - activeSession.startTime);
      return Math.floor(diffMs / 1000);
    };

    setElapsedSeconds(calculateElapsed());
    const interval = setInterval(() => {
      setElapsedSeconds(calculateElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  const handleStart = () => {
    if (activeSession) return;
    if (!appInput.trim()) {
      setValidationError('Target App / Tool is required.');
      return;
    }
    setValidationError(null);
    onStartTask(selectedActivityId, appInput.trim(), remarksInput.trim());
  };

  const handleRemarksChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRemarksInput(val);
    if (activeSession) {
      onUpdateDraftRemarks(val);
    }
  };

  const activeConfig = getActivityConfig(activeSession ? activeSession.activityId : selectedActivityId);

  return (
    <section
      id="task-control-panel"
      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4"
    >
      {/* Top Header Bar with Session Status & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-bold">
            New Session Control
          </h3>
          {activeSession ? (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400 uppercase tracking-widest bg-rose-950/60 border border-rose-500/30 px-2.5 py-0.5 rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              Recording In Progress
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Ready To Track
            </span>
          )}
        </div>

        {/* Operational Stats Badge in Header */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              Tasks Logged:
            </span>
            <span className="font-mono font-bold text-slate-100 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
              {totalTasksDone}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
              Total Time:
            </span>
            <span className="font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
              {overallDurationFormatted}
            </span>
          </div>
        </div>
      </div>

      {/* Main Form & Stopwatch Grid (Top Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left 7 Columns: Activity, App & Remarks Inputs */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Activity Category Selector */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="activity-selector" className="text-xs text-slate-400 font-medium">
                Activity Category
              </label>
              <select
                id="activity-selector"
                disabled={!!activeSession}
                value={selectedActivityId}
                onChange={(e) => setSelectedActivityId(e.target.value as ActivityId)}
                className={`bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500 ${
                  activeSession ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {ACTIVITIES.map((act) => (
                  <option key={act.id} value={act.id} className="bg-slate-900 text-white">
                    {act.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Target App Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="app-input" className="text-xs text-slate-400 font-medium">
                  Target App/Tool
                </label>
                {!activeSession && (
                  <span className="text-[10px] text-slate-500">Quick fill</span>
                )}
              </div>
              <input
                id="app-input"
                type="text"
                disabled={!!activeSession}
                value={appInput}
                onChange={(e) => {
                  setAppInput(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Enter target app or tool..."
                className={`bg-slate-950 border rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500 placeholder-slate-600 ${
                  validationError ? 'border-rose-500' : 'border-slate-700'
                } ${activeSession ? 'opacity-60 cursor-not-allowed' : ''}`}
              />

              {!activeSession && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {COMMON_APPS.map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => {
                        setAppInput(app);
                        if (validationError) setValidationError(null);
                      }}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        appInput === app
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Remarks / Case ID Input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="remarks-input" className="text-xs text-slate-400 font-medium">
                Remarks / Case ID
              </label>
              {activeSession && (
                <span className="text-[10px] text-emerald-400 font-mono">Live edit enabled</span>
              )}
            </div>
            <input
              id="remarks-input"
              type="text"
              value={remarksInput}
              onChange={handleRemarksChange}
              placeholder="e.g., CASE-77291: Customer sync error & account validation..."
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500 placeholder-slate-600"
            />
          </div>

          {validationError && (
            <div
              id="validation-alert"
              className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-950/40 px-3 py-1.5 text-xs text-rose-300"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Right 5 Columns: Live Stopwatch & Action Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          {/* Live Stopwatch Display Box */}
          <div
            id="stopwatch-display-box"
            className="flex items-center justify-between bg-slate-950/70 border border-slate-800 rounded-lg px-5 py-3 relative overflow-hidden"
          >
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                Elapsed Stopwatch
              </span>
              <span
                id="live-stopwatch-readout"
                className={`text-3xl sm:text-4xl font-mono font-bold tracking-tighter ${
                  activeSession ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {formatDuration(elapsedSeconds)}
              </span>
            </div>

            <div className="text-right flex flex-col items-end">
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                  activeSession
                    ? `${activeConfig.color.badgeBg} border-emerald-500/30 text-emerald-400`
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                {activeSession ? `${activeConfig.shortLabel} LIVE` : 'STANDBY'}
              </span>
              {activeSession ? (
                <span className="text-[10px] text-slate-400 font-mono mt-1">
                  Started: {formatClockTime(activeSession.startTime)}
                </span>
              ) : (
                <span className="text-[10px] text-slate-600 font-mono mt-1">
                  Click START to begin
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="btn-start-task"
              type="button"
              disabled={!!activeSession}
              onClick={handleStart}
              className={`flex-1 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 uppercase text-xs tracking-wider transition-all duration-150 ${
                activeSession
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 cursor-pointer'
              }`}
            >
              <div className="w-2 h-2 bg-white rounded-xs" />
              <span>START</span>
            </button>

            <button
              id="btn-end-task"
              type="button"
              disabled={!activeSession}
              onClick={onEndTask}
              className={`flex-1 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 uppercase text-xs tracking-wider transition-all duration-150 ${
                !activeSession
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  : 'bg-rose-600 hover:bg-rose-500 text-white ring-4 ring-rose-600/20 shadow-lg shadow-rose-950/40 cursor-pointer animate-pulse'
              }`}
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
              <span>END TASK</span>
            </button>

            {activeSession && (
              <button
                id="btn-cancel-task"
                type="button"
                onClick={onCancelTask}
                className="text-slate-500 hover:text-slate-300 text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded border border-slate-800 hover:border-slate-700 bg-slate-950 cursor-pointer transition-colors"
                title="Discard current session without saving"
              >
                Discard
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
