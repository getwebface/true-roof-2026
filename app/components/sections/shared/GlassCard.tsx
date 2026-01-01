// Shared GlassCard Component
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  dark?: boolean;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', blur = 'lg', dark = true, hover = true }) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };
  
  return (
    <motion.div
      className={twMerge(
        'relative overflow-hidden rounded-2xl border',
        blurClasses[blur],
        dark 
          ? 'border-white/10 bg-white/5' 
          : 'border-black/5 bg-white/70',
        hover ? 'transition-all duration-500 hover:border-white/20 hover:bg-white/10' : '',
        className
      )}
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div 
        className="pointer-events-none absolute inset-0 z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.02,
        }}
      />
      {children}
    </motion.div>
  );
};

export default GlassCard;
