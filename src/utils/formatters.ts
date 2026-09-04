import { ActivityConfig, ActivityId, TaskRecord } from '../types';

export const ACTIVITIES: ActivityConfig[] = [
  {
    id: '1',
    code: '1 - Activity 1',
    name: 'Activity 1',
    shortLabel: 'Act 1',
    color: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      badgeBg: 'bg-blue-950/80 border-blue-800 text-blue-300',
      badgeText: 'text-blue-400',
      pulseDot: 'bg-blue-400',
      progressFill: 'bg-blue-500',
      accentHex: '#3b82f6',
    },
  },
  {
    id: '2',
    code: '2 - Activity 2',
    name: 'Activity 2',
    shortLabel: 'Act 2',
    color: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      badgeBg: 'bg-purple-950/80 border-purple-800 text-purple-300',
      badgeText: 'text-purple-400',
      pulseDot: 'bg-purple-400',
      progressFill: 'bg-purple-500',
      accentHex: '#a855f7',
    },
  },
  {
    id: '3',
    code: '3 - Activity 3',
    name: 'Activity 3',
    shortLabel: 'Act 3',
    color: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      badgeBg: 'bg-amber-950/80 border-amber-800 text-amber-300',
      badgeText: 'text-amber-400',
      pulseDot: 'bg-amber-400',
      progressFill: 'bg-amber-500',
      accentHex: '#f59e0b',
    },
  },
];

export function getActivityConfig(id: ActivityId): ActivityConfig {
  return ACTIVITIES.find((a) => a.id === id) || ACTIVITIES[0];
}

/**
 * Converts seconds into HH:MM:SS format
 */
export function formatDuration(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return '00:00:00';
  }
  const rounded = Math.floor(totalSeconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Formats a timestamp into HH:MM:SS AM/PM or 24-hr format
 */
export function formatClockTime(timestamp: number | Date): string {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Formats a date string (YYYY-MM-DD or timestamp) into a readable presentation
 */
export function formatDateDisplay(dateInput: string | number | Date): string {
  const date =
    typeof dateInput === 'string'
      ? new Date(dateInput.includes('T') ? dateInput : `${dateInput}T00:00:00`)
      : new Date(dateInput);

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats today's date in YYYY-MM-DD for storage
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generates and downloads a CSV of task records
 */
export function exportTasksToCsv(tasks: TaskRecord[], filename = 'task_records_export.csv'): void {
  if (!tasks.length) return;

  const headers = [
    'Date',
    'Activity Code',
    'Activity Name',
    'Start Time',
    'End Time',
    'Duration (HH:MM:SS)',
    'Duration (Seconds)',
    'Target App',
    'Remarks',
  ];

  const rows = tasks.map((task) => [
    `"${task.date}"`,
    `"${task.activityId}"`,
    `"${task.activityName}"`,
    `"${formatClockTime(task.startTime)}"`,
    `"${formatClockTime(task.endTime)}"`,
    `"${formatDuration(task.durationSeconds)}"`,
    task.durationSeconds,
    `"${(task.app || '').replace(/"/g, '""')}"`,
    `"${(task.remarks || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
