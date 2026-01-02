// TechBadge.tsx
// Reusable badge component for technical tags

import React from 'react';
import clsx from 'clsx';

interface TechBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'premium';
  size?: 'sm' | 'md';
}

export const TechBadge: React.FC<TechBadgeProps> = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    premium: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </span>
  );
};

export default TechBadge;
