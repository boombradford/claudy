import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  delay = 0,
  onClick,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ ...springTransition, delay }}
    onClick={onClick}
    className={cn(
      'relative overflow-hidden rounded-3xl',
      'bg-white/5 backdrop-blur-2xl',
      'border border-white/10',
      'shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]',
      'group',
      onClick && 'cursor-pointer',
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    {children}
  </motion.div>
);
