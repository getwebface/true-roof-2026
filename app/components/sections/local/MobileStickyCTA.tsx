// MobileStickyCTA.tsx
// Mobile sticky call-to-action for local service pages
'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Type definitions
interface MobileCtaSection {
  call_text: string;
  book_text: string;
  phone: string;
}

interface MobileStickyCTAProps {
  section?: MobileCtaSection;
  phone?: string;
}

const MobileStickyCTA: React.FC<MobileStickyCTAProps> = ({ section, phone }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const safeSection = section ?? {
    call_text: 'Call Now',
    book_text: 'Book Online',
    phone: phone || ''
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-slate-200 z-50 lg:hidden pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <div className="flex gap-3">
            <a
              href={`tel:${safeSection.phone}`}
              className="flex-1 bg-red-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-95 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {safeSection.call_text}
            </a>
            <button className="flex-1 bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-transform">
              {safeSection.book_text}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileStickyCTA;
