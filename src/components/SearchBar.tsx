import React from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search tasks...',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md focus-within:bg-white/10 focus-within:border-cyan-500/50 transition-all duration-300">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent w-full outline-none text-white placeholder-slate-400 text-sm"
          aria-label="Search tasks"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
            aria-label="Clear search"
          >
            <X size={16} className="text-slate-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
