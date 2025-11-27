import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import type { VideoTask } from '../types';

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

interface QuickCaptureProps {
  onAddTask: (task: Partial<VideoTask>) => void;
}

export const QuickCapture: React.FC<QuickCaptureProps> = ({ onAddTask }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Command/Ctrl + K to focus input
  useKeyboardShortcut(
    { key: 'k', metaKey: true },
    () => {
      inputRef.current?.focus();
    }
  );

  // Also support Ctrl + K for non-Mac users
  useKeyboardShortcut(
    { key: 'k', ctrlKey: true },
    () => {
      inputRef.current?.focus();
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = value.trim();

    if (!trimmedValue) return;

    // Parse input: "song • artist" or "song - artist" or just "song"
    const parts = trimmedValue.split(/[•\-–]/);
    const title = parts[0]?.trim();
    const artist = parts[1]?.trim();

    // Validate that we have at least a title
    if (!title) return;

    onAddTask({
      title,
      artist: artist || 'Unknown',
      tag: 'Record',
      status: 'queue',
      platform: 'youtube',
      color: 'bg-slate-500',
    });

    setValue('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springTransition, delay: 0.1 }}
      className="relative group mb-8"
    >
      <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md focus-within:bg-white/10 focus-within:border-cyan-500/50 transition-all duration-300"
      >
        <Plus className="text-cyan-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="New reaction idea (song • artist)…"
          className="bg-transparent w-full outline-none text-white placeholder-slate-400 text-lg tracking-wide"
          aria-label="Quick capture reaction idea"
        />
        <div className="flex gap-2">
          <span className="text-xs font-medium text-slate-500 border border-white/5 px-2 py-1 rounded-md">
            ⌘K
          </span>
        </div>
      </form>
    </motion.div>
  );
};
