import { TaskRecord } from '../types';
import { getTodayDateString } from '../utils/formatters';

export function generateSampleTasks(): TaskRecord[] {
  const today = getTodayDateString();
  const now = Date.now();

  // Create realistic operational entries going backwards from recent
  const sampleRecords: Omit<TaskRecord, 'id'>[] = [
    {
      activityId: '1',
      activityName: 'Activity 1',
      app: 'Salesforce CRM',
      remarks: 'Tier 2 Account reconciliation & credit status review (#SF-94812)',
      date: today,
      startTime: now - 3600 * 1000 * 3,
      endTime: now - 3600 * 1000 * 3 + 14 * 60 * 1000 + 22 * 1000,
      durationSeconds: 862, // ~14m 22s
    },
    {
      activityId: '2',
      activityName: 'Activity 2',
      app: 'Zendesk Support',
      remarks: 'Priority customer onboarding ticket response (#ZD-4029)',
      date: today,
      startTime: now - 3600 * 1000 * 2.5,
      endTime: now - 3600 * 1000 * 2.5 + 8 * 60 * 1000 + 45 * 1000,
      durationSeconds: 525, // ~8m 45s
    },
    {
      activityId: '3',
      activityName: 'Activity 3',
      app: 'Excel / PowerQuery',
      remarks: 'Weekly pipeline forecasting & regional variance audit',
      date: today,
      startTime: now - 3600 * 1000 * 2,
      endTime: now - 3600 * 1000 * 2 + 26 * 60 * 1000 + 10 * 1000,
      durationSeconds: 1570, // ~26m 10s
    },
    {
      activityId: '1',
      activityName: 'Activity 1',
      app: 'Salesforce CRM',
      remarks: 'Inbound lead enrichment & deduplication check',
      date: today,
      startTime: now - 3600 * 1000 * 1.4,
      endTime: now - 3600 * 1000 * 1.4 + 11 * 60 * 1000 + 8 * 1000,
      durationSeconds: 668, // ~11m 08s
    },
    {
      activityId: '2',
      activityName: 'Activity 2',
      app: 'ServiceNow',
      remarks: 'Access request provisioning & IAM permission verification',
      date: today,
      startTime: now - 3600 * 1000 * 0.9,
      endTime: now - 3600 * 1000 * 0.9 + 6 * 60 * 1000 + 30 * 1000,
      durationSeconds: 390, // ~6m 30s
    },
    {
      activityId: '3',
      activityName: 'Activity 3',
      app: 'Jira Software',
      remarks: 'Sprint backlog grooming & QA defect triage (#OPS-114)',
      date: today,
      startTime: now - 3600 * 1000 * 0.5,
      endTime: now - 3600 * 1000 * 0.5 + 18 * 60 * 1000 + 15 * 1000,
      durationSeconds: 1095, // ~18m 15s
    },
  ];

  return sampleRecords.map((item, index) => ({
    ...item,
    id: `sample-task-${Date.now()}-${index}`,
  }));
}
