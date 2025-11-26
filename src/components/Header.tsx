import React from 'react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const now = new Date();
  const day = now.toLocaleDateString(undefined, { weekday: 'long' });
  const dateNum = now.getDate();

  return (
    <header className="flex justify-between items-center mb-8 pt-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col"
      >
        <span className="text-xs font-semibold text-cyan-400 tracking-[0.25em] uppercase mb-1">
          WaveReact Studio
        </span>
        <span className="text-sm font-medium text-slate-400 mb-1">
          {day}, {dateNum}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Creator Control Room
        </h1>
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center shadow-lg"
      >
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=WaveReact"
          alt="WaveReact avatar"
          className="w-8 h-8"
        />
      </motion.div>
    </header>
  );
};
