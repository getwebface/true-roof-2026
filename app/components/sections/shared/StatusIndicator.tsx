// StatusIndicator.tsx
// Reusable status indicator with pulse animation

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface StatusIndicatorProps {
  status: 'operational' | 'degraded' | 'down';
  label: string;
  showPulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, showPulse = true }) => {
  const statusColors = {
    operational: 'bg-emerald-500',
    degraded: 'bg-amber-500',
    down: 'bg-red-500',
  };

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        {showPulse && (
          <span
            className={clsx(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              statusColors[status]
            )}
          />
        )}
        <span
          className={clsx('relative inline-flex h-2.5 w-2.5 rounded-full', statusColors[status])}
        />
      </span>
      <span className="text-sm font-medium text-white/80">{label}</span>
    </div>
  );
};

export default StatusIndicator;
