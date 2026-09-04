export type ActivityId = '1' | '2' | '3';

export interface ActivityConfig {
  id: ActivityId;
  code: string;
  name: string;
  shortLabel: string;
  color: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    pulseDot: string;
    progressFill: string;
    accentHex: string;
  };
}

export interface TaskRecord {
  id: string;
  activityId: ActivityId;
  activityName: string;
  app: string;
  remarks: string;
  date: string; // YYYY-MM-DD
  startTime: number; // epoch ms
  endTime: number; // epoch ms
  durationSeconds: number; // in seconds
}

export interface ActiveSession {
  activityId: ActivityId;
  app: string;
  remarks: string;
  startTime: number; // epoch ms
}

export interface ActivityMetric {
  activityId: ActivityId;
  config: ActivityConfig;
  count: number;
  totalDurationSeconds: number;
  ahtSeconds: number;
  timePercentage: number;
}

export interface GrandTotalMetric {
  totalCount: number;
  totalDurationSeconds: number;
  overallAhtSeconds: number;
}
