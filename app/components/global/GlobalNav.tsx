import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlobalNavProps {
  className?: string;
}

const GlobalNav: React.FC<GlobalNavProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [systemTime, setSystemTime] = useState('');
  const [crewsActive] = useState(12);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-AU', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
      setSystemTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cn = (...inputs: (string | undefined | false | null)[]) => twMerge(clsx(inputs));

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        'border-b border-white/10',
        isScrolled 
          ? 'bg-slate-950/80 backdrop-blur-xl shadow-lg shadow-black/50' 
          : 'bg-slate-950/60 backdrop-blur-lg',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 shadow-lg shadow-orange-500/30">
              <span className="text-lg font-bold text-white">T</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
              TrueRoof
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8">
            {['Services', 'About', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={cn(
                  'text-sm font-medium transition-all duration-300',
                  'hover:text-orange-400',
                  isScrolled ? 'text-white/80' : 'text-white/90'
                )}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-orange-400 bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              {systemTime}
            </div>

            <motion.div 
              className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full"
              animate={{ 
                boxShadow: [
                  '0 0 0 0 rgba(16, 185, 129, 0.7)',
                  '0 0 0 6px rgba(16, 185, 129, 0)',
                  '0 0 0 0 rgba(16, 185, 129, 0)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xs font-semibold text-emerald-400">CREWS</span>
              <span className="text-xs font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full">
                {crewsActive}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default GlobalNav;
