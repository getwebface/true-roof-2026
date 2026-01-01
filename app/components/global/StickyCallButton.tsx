import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface StickyCallButtonProps {
  phoneNumber?: string;
  className?: string;
}

const StickyCallButton: React.FC<StickyCallButtonProps> = ({ 
  phoneNumber = '0482022493',
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWithinBusinessHours, setIsWithinBusinessHours] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      // Convert to AEST (UTC+10) - Australia Eastern Standard Time
      // Note: Australia observes DST from October to April, but for simplicity
      // we'll use AEST (UTC+10) year-round for business hours
      const aestOffset = 10 * 60; // AEST is UTC+10
      const localOffset = now.getTimezoneOffset(); // in minutes
      const aestTime = new Date(now.getTime() + (aestOffset + localOffset) * 60000);
      
      const hours = aestTime.getHours();
      const minutes = aestTime.getMinutes();
      const currentTime = hours + minutes / 60;
      
      // Business hours: 10am to 4pm AEST
      const isBusinessHours = currentTime >= 10 && currentTime < 16;
      setIsWithinBusinessHours(isBusinessHours);
    };

    checkBusinessHours();
    // Check every minute to update business hours status
    const interval = setInterval(checkBusinessHours, 60000);
    return () => clearInterval(interval);
  }, []);

  const cn = (...inputs: (string | undefined | false | null)[]) => twMerge(clsx(inputs));

  const formattedPhoneNumber = phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');

  return (
    <AnimatePresence>
      {isVisible && isWithinBusinessHours && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className={cn(
            'fixed bottom-6 right-6 z-[100]',
            'md:bottom-8 md:right-8',
            className
          )}
        >
          <motion.a
            href={`tel:${phoneNumber}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              'relative flex items-center gap-3',
              'px-6 py-4 rounded-full shadow-2xl',
              'bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600',
              'text-white font-bold text-lg',
              'transition-all duration-300',
              'hover:shadow-orange-500/50 hover:shadow-xl',
              'active:scale-95'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Pulse Animation */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                scale: isHovered ? [1, 1.1, 1] : [1, 1.05, 1],
                opacity: isHovered ? [0.7, 0.3, 0.7] : [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: isHovered ? 0.8 : 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(234, 88, 12, 0.8))',
                filter: 'blur(8px)',
                zIndex: -1,
              }}
            />

            {/* Inner Glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 20px 0 rgba(249, 115, 22, 0.5)',
                  '0 0 30px 10px rgba(234, 88, 12, 0.5)',
                  '0 0 20px 0 rgba(249, 115, 22, 0.5)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ zIndex: -1 }}
            />

            {/* Phone Icon */}
            <motion.div
              animate={{ rotate: isHovered ? [0, 10, -10, 0] : 0 }}
              transition={{ duration: 0.5 }}
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                />
              </svg>
            </motion.div>

            {/* Text Content */}
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold tracking-wider uppercase">
                Call Us Today
              </span>
              <span className="text-xl font-black tracking-tight">
                {formattedPhoneNumber}
              </span>
            </div>

            {/* Call Now Badge */}
            <motion.div
              className="ml-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm"
              animate={{ 
                backgroundColor: ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)'],
                scale: isHovered ? [1, 1.1, 1] : [1, 1.05, 1]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <span className="text-sm font-bold text-white">CALL NOW</span>
            </motion.div>

            {/* Mobile Indicator */}
            <div className="hidden sm:block absolute -top-2 -right-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-orange-500"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.a>

          {/* Tooltip for Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Available 10am-4pm AEST</span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/90 rotate-45" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCallButton;
