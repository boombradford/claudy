import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, CheckCircle2 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { QuickCapture } from './QuickCapture';
import { TaskCard } from './TaskCard';
import type { VideoTask } from '../types';
import { calculateTaskStats } from '../utils/tasks';

interface DashboardViewProps {
  tasks: VideoTask[];
  onAddTask: (task: Partial<VideoTask>) => void;
  onUpdateTask: (id: string, updates: Partial<VideoTask>) => void;
  onDeleteTask: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const stats = calculateTaskStats(tasks);
  const inProductionTasks = tasks
    .filter((t) => t.status !== 'queue' && t.status !== 'ready')
    .slice(0, 5);

  return (
    <>
      <QuickCapture onAddTask={onAddTask} />

      {/* Pipeline section */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-semibold text-white tracking-tight">
            In Production
          </h2>
          <span className="text-sm text-slate-400">
            {inProductionTasks.length} active
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide snap-x snap-mandatory">
          {inProductionTasks.length > 0 ? (
            inProductionTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                delay={index * 0.1}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
              />
            ))
          ) : (
            <GlassCard className="min-w-[280px] p-8 flex items-center justify-center">
              <p className="text-slate-400 text-sm text-center">
                No tasks in production.
                <br />
                Start by adding a new reaction!
              </p>
            </GlassCard>
          )}
        </div>
      </section>

      {/* Channel Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard delay={0.3} className="p-5 h-48 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <LayoutGrid size={20} />
            </div>
            <span className="font-medium text-slate-200">Total Tasks</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-slate-400 mt-1">
              {stats.byStatus.editing} editing • {stats.byStatus.recording} recording
            </div>
          </div>
          <div className="w-full bg-white/10 h-1 mt-4 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((stats.total / 10) * 100, 100)}%` }}
              transition={{ duration: 1.5, ease: 'circOut' }}
              className="h-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"
            />
          </div>
        </GlassCard>

        <GlassCard delay={0.4} className="p-5 h-48 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              <CheckCircle2 size={20} />
            </div>
            <span className="font-medium text-slate-200">
              Ready This Week
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-white">
              {stats.completedThisWeek}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              Goal: <span className="text-slate-200 font-semibold">5</span> uploads
            </div>
          </div>
          <div className="flex -space-x-2 mt-3">
            {Array.from({ length: Math.min(stats.completedThisWeek, 5) }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[#020617] bg-gradient-to-br from-purple-500 to-pink-500"
              />
            ))}
            {stats.completedThisWeek === 0 && (
              <div className="text-xs text-slate-500 pt-1">No uploads yet</div>
            )}
          </div>
        </GlassCard>
      </section>
    </>
  );
};
