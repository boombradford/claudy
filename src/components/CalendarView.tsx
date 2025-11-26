import React from 'react';
import { GlassCard } from './GlassCard';
import type { VideoTask } from '../types';

interface CalendarViewProps {
  tasks: VideoTask[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  // Get tasks with due dates
  const upcomingTasks = tasks
    .filter((task) => task.dueDate)
    .sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0))
    .slice(0, 5);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = date.toLocaleDateString(undefined, { weekday: 'short' });
    return day;
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-white tracking-tight mb-2">
        Release Schedule
      </h2>

      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-200">
            Upcoming Releases
          </span>
          <span className="text-xs text-slate-400">
            {upcomingTasks.length} scheduled
          </span>
        </div>

        {upcomingTasks.length > 0 ? (
          <div className="space-y-3 text-sm text-slate-300">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between">
                <span>
                  {task.dueDate && formatDate(task.dueDate)} · {task.title} — {task.artist}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10">
                  {task.platform === 'youtube' ? 'Full Reaction' : 'Short'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">
            No scheduled releases. Add due dates to your tasks to see them here.
          </p>
        )}
      </GlassCard>

      <GlassCard className="p-6">
        <p className="text-slate-300 text-sm">
          💡 Tip: Add due dates to your tasks to track upcoming releases and maintain a consistent upload schedule.
        </p>
      </GlassCard>
    </section>
  );
};
