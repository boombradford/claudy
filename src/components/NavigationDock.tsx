import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  CheckCircle2,
  Calendar,
  Settings,
} from 'lucide-react';
import { cn } from '../utils/cn';
import type { TabId, TabConfig } from '../types';

const TABS: TabConfig[] = [
  { id: 'dashboard', icon: LayoutGrid, label: 'Studio' },
  { id: 'tasks', icon: CheckCircle2, label: 'Pipeline' },
  { id: 'calendar', icon: Calendar, label: 'Schedule' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

const tapAnimation = {
  scale: 0.96,
  transition: { duration: 0.1 },
};

interface NavigationDockProps {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto"
    >
      <div
        className={cn(
          'flex items-center gap-2 p-2 rounded-full',
          'bg-black/60 backdrop-blur-xl border border-white/10',
          'shadow-2xl shadow-black/50'
        )}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              whileTap={tapAnimation}
              className="relative px-4 py-3 rounded-full flex flex-col items-center justify-center transition-colors"
              aria-label={tab.label}
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/15 rounded-full"
                  transition={springTransition}
                />
              )}
              <Icon
                size={24}
                className={cn(
                  'relative z-10 transition-colors duration-300',
                  isActive
                    ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                    : 'text-slate-400'
                )}
              />
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
