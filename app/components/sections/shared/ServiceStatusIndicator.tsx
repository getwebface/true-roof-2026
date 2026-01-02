// ServiceStatusIndicator.tsx
// Service availability status indicator with null-safety
import * as React from 'react';
import clsx from 'clsx';

interface ServiceStatusIndicatorProps {
  status?: 'available' | 'limited' | 'booked';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ServiceStatusIndicator: React.FC<ServiceStatusIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = true
}) => {
  const statusConfig = {
    available: { color: 'bg-orange-500', label: 'Available', pulseColor: 'bg-orange-400' },
    limited: { color: 'bg-amber-500', label: 'Limited', pulseColor: 'bg-amber-400' },
    booked: { color: 'bg-slate-500', label: 'Booked', pulseColor: 'bg-slate-400' },
  };

  const config = status ? statusConfig[status] : { color: 'bg-slate-500', label: 'Unknown', pulseColor: 'bg-slate-400' };
  const sizeClass = size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex">
        <span className={clsx('absolute inline-flex h-full w-full rounded-full opacity-75', config.pulseColor)}
          style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
        <span className={clsx('relative inline-flex rounded-full', sizeClass, config.color)} />
      </span>
      {showLabel && (
        <span className="font-medium text-white/90 text-sm">{config.label}</span>
      )}
    </div>
  );
};

export default ServiceStatusIndicator;
