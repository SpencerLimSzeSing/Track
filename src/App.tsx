import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { TaskControlPanel } from './components/TaskControlPanel';
import { ProductivityMetrics } from './components/ProductivityMetrics';
import { TaskHistoryTable } from './components/TaskHistoryTable';
import { ConfirmModal } from './components/ConfirmModal';
import { ActiveSession, ActivityId, ActivityMetric, GrandTotalMetric, TaskRecord } from './types';
import { ACTIVITIES, exportTasksToCsv, getActivityConfig, getTodayDateString, formatDuration } from './utils/formatters';
import { generateSampleTasks } from './data/sampleData';

const STORAGE_KEY_TASKS = 'task_tracker_history_v1';
const STORAGE_KEY_ACTIVE = 'task_tracker_active_session_v1';
const STORAGE_KEY_INITIALIZED = 'task_tracker_initialized_v1';

export default function App() {
  const [tasks, setTasks] = useState<TaskRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) {
        return JSON.parse(saved);
      }
      const hasInit = localStorage.getItem(STORAGE_KEY_INITIALIZED);
      if (!hasInit) {
        localStorage.setItem(STORAGE_KEY_INITIALIZED, 'true');
        const samples = generateSampleTasks();
        localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(samples));
        return samples;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [activeSession, setActiveSession] = useState<ActiveSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.startTime === 'number') {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    confirmVariant: 'danger' | 'warning' | 'primary';
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    confirmVariant: 'danger',
    action: () => {},
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to persist tasks to localStorage:', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      if (activeSession) {
        localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(activeSession));
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE);
      }
    } catch (e) {
      console.error('Failed to persist active session to localStorage:', e);
    }
  }, [activeSession]);

  const grandTotal = useMemo<GrandTotalMetric>(() => {
    const totalCount = tasks.length;
    const totalDurationSeconds = tasks.reduce((sum, t) => sum + (t.durationSeconds || 0), 0);
    const overallAhtSeconds = totalCount > 0 ? Math.round(totalDurationSeconds / totalCount) : 0;

    return {
      totalCount,
      totalDurationSeconds,
      overallAhtSeconds,
    };
  }, [tasks]);

  const activityMetrics = useMemo<ActivityMetric[]>(() => {
    return ACTIVITIES.map((act) => {
      const actTasks = tasks.filter((t) => t.activityId === act.id);
      const count = actTasks.length;
      const totalDurationSeconds = actTasks.reduce((sum, t) => sum + (t.durationSeconds || 0), 0);
      const ahtSeconds = count > 0 ? Math.round(totalDurationSeconds / count) : 0;
      const timePercentage =
        grandTotal.totalDurationSeconds > 0
          ? (totalDurationSeconds / grandTotal.totalDurationSeconds) * 100
          : 0;

      return {
        activityId: act.id,
        config: act,
        count,
        totalDurationSeconds,
        ahtSeconds,
        timePercentage,
      };
    });
  }, [tasks, grandTotal.totalDurationSeconds]);

  const handleStartTask = useCallback((activityId: ActivityId, app: string, remarks: string) => {
    const newSession: ActiveSession = {
      activityId,
      app,
      remarks,
      startTime: Date.now(),
    };
    setActiveSession(newSession);
  }, []);

  const handleEndTask = useCallback(() => {
    if (!activeSession) return;

    const endTime = Date.now();
    const durationSeconds = Math.max(1, Math.floor((endTime - activeSession.startTime) / 1000));
    const config = getActivityConfig(activeSession.activityId);

    const newTask: TaskRecord = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      activityId: activeSession.activityId,
      activityName: config.name,
      app: activeSession.app || 'Unspecified',
      remarks: activeSession.remarks || '',
      date: getTodayDateString(),
      startTime: activeSession.startTime,
      endTime,
      durationSeconds,
    };

    setTasks((prev) => [newTask, ...prev]);
    setActiveSession(null);
  }, [activeSession]);

  const handleCancelTask = useCallback(() => {
    if (!activeSession) return;

    setConfirmModal({
      isOpen: true,
      title: 'Discard Active Session?',
      message:
        'Are you sure you want to cancel the current recording session? Recorded time will not be logged.',
      confirmLabel: 'Discard Session',
      confirmVariant: 'danger',
      action: () => {
        setActiveSession(null);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  }, [activeSession]);

  const handleUpdateDraftRemarks = useCallback((remarks: string) => {
    setActiveSession((prev) => (prev ? { ...prev, remarks } : null));
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    if (tasks.length === 0) return;

    setConfirmModal({
      isOpen: true,
      title: 'Clear All Task Records?',
      message: `Permanently remove all ${tasks.length} task records from browser local storage?`,
      confirmLabel: 'Clear All',
      confirmVariant: 'danger',
      action: () => {
        setTasks([]);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  }, [tasks.length]);

  const handleExportCsv = useCallback(() => {
    if (tasks.length === 0) return;
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now
      .getDate()
      .toString()
      .padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    exportTasksToCsv(tasks, `task_tracker_export_${timestamp}.csv`);
  }, [tasks]);

  const handleLoadSampleData = useCallback(() => {
    const samples = generateSampleTasks();
    if (tasks.length === 0) {
      setTasks(samples);
    } else {
      setConfirmModal({
        isOpen: true,
        title: 'Load Realistic Sample Data',
        message: 'Append 6 realistic sample operational tasks to your current task history?',
        confirmLabel: 'Append Records',
        confirmVariant: 'primary',
        action: () => {
          setTasks((prev) => [...samples, ...prev]);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
    }
  }, [tasks.length]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. Top Header */}
      <Header
        activityMetrics={activityMetrics}
        grandTotal={grandTotal}
        activeActivityId={activeSession ? activeSession.activityId : null}
      />

      {/* Main Layout: New Session Control at the top, followed by Productivity Metrics and Task History Log */}
      <main className="flex-1 flex flex-col p-4 lg:p-6 gap-6 max-w-[1600px] w-full mx-auto">
        {/* 2. Task Control Panel (Up / Top Section) */}
        <TaskControlPanel
          activeSession={activeSession}
          totalTasksDone={grandTotal.totalCount}
          overallDurationFormatted={formatDuration(grandTotal.totalDurationSeconds)}
          onStartTask={handleStartTask}
          onEndTask={handleEndTask}
          onCancelTask={handleCancelTask}
          onUpdateDraftRemarks={handleUpdateDraftRemarks}
        />

        {/* 3. Metrics Cards Row */}
        <ProductivityMetrics
          activityMetrics={activityMetrics}
          grandTotal={grandTotal}
        />

        {/* 4. Operational Task History Table */}
        <TaskHistoryTable
          tasks={tasks}
          onDeleteTask={handleDeleteTask}
          onClearAll={handleClearAll}
          onExportCsv={handleExportCsv}
          onLoadSampleData={handleLoadSampleData}
        />
      </main>

      {/* Footer Status Bar from Elegant Dark Theme */}
      <footer className="h-8 bg-slate-950 border-t border-slate-900 flex items-center justify-between px-6 shrink-0 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
              LocalStorage Persistent
            </span>
          </div>
          <div className="flex items-center gap-2 hidden sm:flex">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
              Offline Client SPA
            </span>
          </div>
        </div>
        <div className="text-[9px] uppercase font-bold text-slate-600 tracking-tighter">
          Task Tracker &bull; Operational Dashboard v2.4.0
        </div>
      </footer>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        confirmVariant={confirmModal.confirmVariant}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
