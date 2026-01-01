import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CORE_SERVICES } from '~/constants/services';

interface GlobalNavProps {
  className?: string;
}

const GlobalNav: React.FC<GlobalNavProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [inspectionsScheduled] = useState(8);

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
      data-component-id="global-nav"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        'border-b border-white/10',
        isScrolled 
          ? 'bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-black/50' 
          : 'bg-slate-950/80 backdrop-blur-lg',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 shadow-lg shadow-orange-500/30">
              <span className="text-lg font-bold text-white">T</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
              TrueRoof
            </span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Services Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-all duration-300',
                  'hover:text-orange-400',
                  isScrolled ? 'text-white/80' : 'text-white/90'
                )}
                whileHover={{ y: -2 }}
              >
                <span>Services</span>
                <motion.svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: isServicesOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden"
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <div className="py-2">
                      {CORE_SERVICES.map((service, index) => (
                        <motion.a
                          key={service.id}
                          href={`/services/${service.slug}`}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200',
                            'hover:bg-white/5 hover:text-orange-400',
                            'text-white/70'
                          )}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 4 }}
                        >
                          <span className="text-lg">{service.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium">{service.name}</div>
                            <div className="text-xs text-white/40 mt-0.5">{service.responseTime}</div>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Navigation Items */}
            {['About', 'Portfolio', 'Contact'].map((item, index) => (
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
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          {/* Right Side Indicators */}
          <div className="flex items-center gap-4">
            {/* Business Hours Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-orange-300 bg-white/5 px-3 py-1.5 rounded-md border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span>10am-4pm AEST</span>
            </div>

            {/* Inspections Scheduled Indicator */}
            <motion.div 
              className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-3 py-1.5 rounded-full"
              animate={{ 
                boxShadow: [
                  '0 0 0 0 rgba(249, 115, 22, 0.7)',
                  '0 0 0 6px rgba(249, 115, 22, 0)',
                  '0 0 0 0 rgba(249, 115, 22, 0)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xs font-semibold text-orange-400">INSPECTIONS</span>
              <span className="text-xs font-bold text-white bg-orange-500 px-2 py-0.5 rounded-full">
                {inspectionsScheduled}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default GlobalNav;
