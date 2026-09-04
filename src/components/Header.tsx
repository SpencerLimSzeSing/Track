import React, { useEffect, useState } from 'react';
import { ActivityId, ActivityMetric, GrandTotalMetric } from '../types';
import { ACTIVITIES, formatClockTime, formatDateDisplay, formatDuration } from '../utils/formatters';

interface HeaderProps {
  activityMetrics: ActivityMetric[];
  grandTotal: GrandTotalMetric;
  activeActivityId: ActivityId | null;
}

export const Header: React.FC<HeaderProps> = ({
  activityMetrics,
  grandTotal,
  activeActivityId,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      id="app-header"
      className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 shrink-0"
    >
      {/* LEFT: Branding */}
      <div id="header-branding" className="flex items-center gap-3 lg:w-1/4">
        <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
          <svg className="w-5 h-5 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z" />
          </svg>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-100 uppercase">
            Task Tracker
          </span>
          <span className="hidden sm:inline-block text-[10px] font-bold text-emerald-500 tracking-widest uppercase">
            OPS
          </span>
        </div>
      </div>

      {/* MIDDLE: Activity AHT Bar (Pill shaped chips) */}
      <div id="activity-aht-bar" className="hidden md:flex gap-2 lg:w-2/4 justify-center items-center">
        {ACTIVITIES.map((act) => {
          const metric = activityMetrics.find((m) => m.activityId === act.id);
          const ahtFormatted = metric ? formatDuration(metric.ahtSeconds) : '00:00:00';
          const isLive = activeActivityId === act.id;

          if (isLive) {
            return (
              <div
                key={act.id}
                id={`aht-chip-act-${act.id}`}
                className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-3 py-1 shadow-sm transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/40 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  {act.shortLabel} Live
                </span>
                <span className="font-mono text-sm border-l border-slate-700 pl-2 text-white font-medium">
                  {ahtFormatted}
                </span>
              </div>
            );
          }

          return (
            <div
              key={act.id}
              id={`aht-chip-act-${act.id}`}
              className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-full px-3 py-1 opacity-70 hover:opacity-100 transition-opacity"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {act.shortLabel}
              </span>
              <span className="font-mono text-sm border-l border-slate-800 pl-2 text-slate-300">
                {ahtFormatted}
              </span>
            </div>
          );
        })}

        {/* Overall AHT chip */}
        <div
          id="aht-chip-overall"
          className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1"
        >
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
            Overall AHT
          </span>
          <span className="font-mono text-sm border-l border-indigo-500/20 pl-2 text-indigo-300 font-medium">
            {formatDuration(grandTotal.overallAhtSeconds)}
          </span>
        </div>
      </div>

      {/* RIGHT: Current Time display */}
      <div id="current-time-display" className="lg:w-1/4 flex flex-col items-end">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span id="live-digital-clock" className="text-xl sm:text-2xl font-mono font-medium text-slate-100 tracking-tight">
            {formatClockTime(currentTime)}
          </span>
        </div>
        <span id="live-calendar-date" className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
          {formatDateDisplay(currentTime)}
        </span>
      </div>
    </header>
  );
};
