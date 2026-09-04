import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Trash2,
} from 'lucide-react';
import { ActivityId, TaskRecord } from '../types';
import { ACTIVITIES, formatClockTime, formatDateDisplay, formatDuration } from '../utils/formatters';

interface TaskHistoryTableProps {
  tasks: TaskRecord[];
  onDeleteTask: (id: string) => void;
  onClearAll: () => void;
  onExportCsv: () => void;
  onLoadSampleData: () => void;
}

export const TaskHistoryTable: React.FC<TaskHistoryTableProps> = ({
  tasks,
  onDeleteTask,
  onClearAll,
  onExportCsv,
  onLoadSampleData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState<'ALL' | ActivityId>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (activityFilter !== 'ALL') {
      result = result.filter((t) => t.activityId === activityFilter);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.app.toLowerCase().includes(q) ||
          t.remarks.toLowerCase().includes(q) ||
          t.date.toLowerCase().includes(q) ||
          t.activityName.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      return sortOrder === 'desc' ? b.startTime - a.startTime : a.startTime - b.startTime;
    });

    return result;
  }, [tasks, activityFilter, searchTerm, sortOrder]);

  return (
    <div
      id="task-history-section"
      className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col flex-grow overflow-hidden shadow-2xl"
    >
      {/* Table Header & Controls Bar */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 shrink-0">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">
            Operational Task Log
          </h3>

          {/* Search Input Box */}
          <div className="flex items-center bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
            <input
              id="search-tasks-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search records..."
              className="bg-transparent text-xs text-slate-200 outline-none w-36 sm:w-48 placeholder-slate-500"
            />
          </div>

          {/* Activity Category Filter */}
          <select
            id="filter-activity-select"
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value as 'ALL' | ActivityId)}
            className="bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-300 outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Activities</option>
            {ACTIVITIES.map((act) => (
              <option key={act.id} value={act.id} className="bg-slate-900">
                {act.code}
              </option>
            ))}
          </select>

          {/* Sort Order Toggle */}
          <button
            id="sort-order-toggle"
            type="button"
            onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 px-2 py-1.5 rounded border border-slate-800 bg-slate-950 cursor-pointer transition-colors"
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-3 h-3 text-slate-500" />
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-export-csv"
            type="button"
            onClick={onExportCsv}
            disabled={tasks.length === 0}
            className={`text-xs font-bold px-3 py-1.5 rounded border transition-colors ${
              tasks.length === 0
                ? 'bg-slate-950 text-slate-600 border-slate-800 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 cursor-pointer'
            }`}
          >
            Export CSV
          </button>

          <button
            id="btn-load-samples"
            type="button"
            onClick={onLoadSampleData}
            className="text-xs font-bold bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded border border-slate-800 transition-colors cursor-pointer"
          >
            Load Sample Data
          </button>

          {tasks.length > 0 && (
            <button
              id="btn-clear-all"
              type="button"
              onClick={onClearAll}
              className="text-xs font-bold bg-rose-950/30 hover:bg-rose-900/40 text-rose-400 px-3 py-1.5 rounded border border-rose-500/20 transition-colors cursor-pointer"
              title="Delete all tasks"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-grow overflow-x-auto overflow-y-auto max-h-[460px]">
        <table id="task-history-table" className="w-full text-left border-collapse">
          <thead className="bg-slate-950/60 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                Date
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                Activity
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                App
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                Timeframe
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">
                Duration
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Remarks
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-800/50">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-sm font-semibold text-slate-400">
                      {tasks.length === 0 ? 'No logged sessions yet' : 'No matching records found'}
                    </span>
                    <span className="text-xs text-slate-600">
                      {tasks.length === 0
                        ? 'Start a task on the left or click "Load Sample Data"'
                        : 'Try searching with another keyword or clearing filters'}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => {
                const badgeColor =
                  task.activityId === '1'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : task.activityId === '2'
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

                const durationColor =
                  task.activityId === '1'
                    ? 'text-blue-400'
                    : task.activityId === '2'
                    ? 'text-purple-400'
                    : 'text-amber-400';

                return (
                  <tr
                    key={task.id}
                    id={`task-row-${task.id}`}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Date */}
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs whitespace-nowrap">
                      {task.date}
                    </td>

                    {/* Activity Badge */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${badgeColor}`}
                      >
                        ACT {task.activityId}
                      </span>
                    </td>

                    {/* App / Tool */}
                    <td className="px-4 py-3 text-slate-300 font-medium whitespace-nowrap">
                      {task.app}
                    </td>

                    {/* Timeframe */}
                    <td className="px-4 py-3 text-slate-500 text-xs font-mono whitespace-nowrap">
                      {formatClockTime(task.startTime)} — {formatClockTime(task.endTime)}
                    </td>

                    {/* Duration */}
                    <td
                      className={`px-4 py-3 text-right font-mono font-semibold whitespace-nowrap ${durationColor}`}
                    >
                      {formatDuration(task.durationSeconds)}
                    </td>

                    {/* Remarks */}
                    <td
                      className="px-4 py-3 text-slate-400 text-xs truncate max-w-[200px]"
                      title={task.remarks}
                    >
                      {task.remarks || <span className="text-slate-600 italic">None</span>}
                    </td>

                    {/* Delete Action */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        id={`btn-delete-task-${task.id}`}
                        onClick={() => onDeleteTask(task.id)}
                        className="text-slate-600 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Status Note */}
      <div className="p-3 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0">
        <span>
          Displaying {filteredTasks.length} of {tasks.length} Sessions
        </span>
        <span className="hidden sm:inline text-slate-600">
          Operational Integrity Verified &bull; Local Storage
        </span>
      </div>
    </div>
  );
};
