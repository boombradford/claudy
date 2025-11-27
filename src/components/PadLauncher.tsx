import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Loop } from '../types/audio';

interface PadLauncherProps {
  loops: Omit<Loop, 'buffer'>[];
  onPadClick: (loop: Omit<Loop, 'buffer'>) => void;
}

export function PadLauncher({ loops, onPadClick }: PadLauncherProps) {
  const [activePad, setActivePad] = useState<string | null>(null);

  const handlePadClick = (loop: Omit<Loop, 'buffer'>) => {
    setActivePad(loop.id);
    onPadClick(loop);

    // Visual feedback timeout
    setTimeout(() => {
      setActivePad(null);
    }, 200);
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-6">
      {loops.map((loop) => (
        <motion.button
          key={loop.id}
          onClick={() => handlePadClick(loop)}
          className="group relative aspect-square overflow-hidden rounded-2xl border-2 transition-all hover:scale-105"
          style={{
            borderColor: activePad === loop.id ? loop.color : loop.color + '40',
            backgroundColor: loop.color + '20',
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow:
              activePad === loop.id
                ? `0 0 30px ${loop.color}80`
                : '0 0 0px transparent',
          }}
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
            style={{
              background: `linear-gradient(135deg, ${loop.color}40 0%, transparent 100%)`,
            }}
          />

          {/* Content */}
          <div className="relative flex h-full flex-col items-center justify-center gap-2 p-4">
            {/* Category icon/badge */}
            <div
              className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: loop.color + '40',
                color: loop.color,
              }}
            >
              {loop.category}
            </div>

            {/* Loop name */}
            <span className="text-center text-sm font-bold text-white">
              {loop.name}
            </span>

            {/* Visual indicator */}
            {activePad === loop.id && (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  backgroundColor: loop.color + '60',
                }}
              />
            )}
          </div>

          {/* Pulse effect on active */}
          {activePad === loop.id && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-2"
              style={{ borderColor: loop.color }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
