import React from 'react';
import { ActivityMetric, GrandTotalMetric } from '../types';
import { formatDuration } from '../utils/formatters';

interface ProductivityMetricsProps {
  activityMetrics: ActivityMetric[];
  grandTotal: GrandTotalMetric;
}

export const ProductivityMetrics: React.FC<ProductivityMetricsProps> = ({
  activityMetrics,
  grandTotal,
}) => {
  return (
    <div id="productivity-metrics-row" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 shrink-0">
      {activityMetrics.map((item) => {
        const { config, count, totalDurationSeconds, ahtSeconds, timePercentage } = item;

        // Border accents per activity from theme: blue for 1, purple for 2, amber for 3
        const borderLeftClass =
          config.id === '1'
            ? 'border-l-4 border-l-blue-500'
            : config.id === '2'
            ? 'border-l-4 border-l-purple-500'
            : 'border-l-4 border-l-amber-500';

        const textColorClass =
          config.id === '1'
            ? 'text-blue-400'
            : config.id === '2'
            ? 'text-purple-400'
            : 'text-amber-400';

        return (
          <div
            key={config.id}
            id={`metric-card-act-${config.id}`}
            className={`bg-slate-900 border border-slate-800/80 ${borderLeftClass} p-4 rounded-lg shadow-sm flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {config.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {timePercentage.toFixed(1)}% time
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div
                    id={`metric-count-act-${config.id}`}
                    className="text-2xl font-bold text-white font-mono"
                  >
                    {count}
                  </div>
                  <div className="text-xs text-slate-400">Total Tasks</div>
                </div>
                <div className="text-right">
                  <div
                    id={`metric-aht-act-${config.id}`}
                    className={`text-sm font-mono font-semibold ${textColorClass}`}
                  >
                    {formatDuration(ahtSeconds)}
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase font-semibold">Avg AHT</div>
                </div>
              </div>
            </div>

            {/* Total Duration Footer */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="text-[10px] uppercase text-slate-500">Total Duration</span>
              <span className="text-slate-300 font-medium">
                {formatDuration(totalDurationSeconds)}
              </span>
            </div>
          </div>
        );
      })}

      {/* Grand Total Card */}
      <div
        id="metric-card-grand-total"
        className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-lg shadow-sm flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              Grand Total
            </span>
            <span className="text-[10px] font-mono text-emerald-400/80">
              AHT {formatDuration(grandTotal.overallAhtSeconds)}
            </span>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <div
                id="grand-total-tasks-count"
                className="text-2xl font-bold text-emerald-400 font-mono"
              >
                {grandTotal.totalCount}
              </div>
              <div className="text-xs text-emerald-500/70">Completed Tasks</div>
            </div>
            <div className="text-right">
              <div
                id="grand-total-duration"
                className="text-sm font-mono text-emerald-400 font-semibold"
              >
                {formatDuration(grandTotal.totalDurationSeconds)}
              </div>
              <div className="text-[9px] text-emerald-500/70 uppercase font-semibold">
                Total Operational
              </div>
            </div>
          </div>
        </div>

        {/* Mini progress breakdown bar */}
        <div className="mt-3 pt-2.5 border-t border-emerald-500/10 space-y-1">
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
            {activityMetrics.map((act) => (
              <div
                key={act.activityId}
                className={`h-full ${act.config.color.progressFill}`}
                style={{ width: `${Math.min(100, Math.max(0, act.timePercentage))}%` }}
                title={`${act.config.shortLabel}: ${act.timePercentage.toFixed(1)}%`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
