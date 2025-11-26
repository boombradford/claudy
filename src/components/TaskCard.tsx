import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Youtube, Edit2, Trash2, Check, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { GlassCard } from './GlassCard';
import { getStatusLabel } from '../utils/tasks';
import type { VideoTask } from '../types';

interface TaskCardProps {
  task: VideoTask;
  delay?: number;
  onUpdate?: (id: string, updates: Partial<VideoTask>) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  delay = 0,
  onUpdate,
  onDelete,
  compact = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editArtist, setEditArtist] = useState(task.artist);

  const handleSave = () => {
    if (onUpdate && (editTitle !== task.title || editArtist !== task.artist)) {
      onUpdate(task.id, {
        title: editTitle.trim() || task.title,
        artist: editArtist.trim() || task.artist,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditArtist(task.artist);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"?`)) {
      onDelete?.(task.id);
    }
  };

  if (compact) {
    return (
      <GlassCard
        delay={delay}
        className="p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
      >
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md text-white/90',
                task.color
              )}
            >
              {task.tag}
            </span>
            <span className="text-sm text-slate-200">{task.title}</span>
          </div>
          <span className="text-[11px] text-slate-400 uppercase tracking-[0.16em]">
            {task.artist} • {task.status.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onUpdate && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Edit task"
            >
              <Edit2 size={14} className="text-slate-400" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
              aria-label="Delete task"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
          )}
        </div>
      </GlassCard>
    );
  }

  return (
    <>
      <GlassCard
        delay={delay}
        className="min-w-[280px] p-5 snap-center active:scale-95 transition-transform duration-200"
      >
        <div className="flex justify-between items-start mb-6">
          <span
            className={cn(
              'text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md text-white/90',
              task.color
            )}
          >
            {task.tag}
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Task options"
            >
              <MoreHorizontal className="text-slate-500" size={16} />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-32 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl overflow-hidden z-10"
                >
                  {onUpdate && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10 transition-colors flex items-center gap-2"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        handleDelete();
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-lg font-semibold outline-none focus:border-cyan-500/50"
              placeholder="Song title"
            />
            <input
              type="text"
              value={editArtist}
              onChange={(e) => setEditArtist(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-slate-400 text-xs uppercase tracking-[0.2em] outline-none focus:border-cyan-500/50"
              placeholder="Artist"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <Check size={14} />
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                <X size={14} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white leading-tight">
                {task.title}
              </h3>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {task.artist}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>{getStatusLabel(task.status)}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10">
                <Youtube size={12} className="text-red-500" />
                <span className="uppercase tracking-[0.16em]">
                  {task.platform === 'shorts' ? 'Shorts' : task.platform === 'tiktok' ? 'TikTok' : 'YouTube'}
                </span>
              </div>
            </div>
          </>
        )}
      </GlassCard>
    </>
  );
};
