import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlobalFooterProps {
  className?: string;
}

const GlobalFooter: React.FC<GlobalFooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();
  const serviceAreas = [
    'Melbourne Metro',
    'Eastern Suburbs',
    'Western Suburbs',
    'Northern Suburbs',
    'Mornington Peninsula'
  ];

  const cn = (...inputs: (string | undefined | false | null)[]) => twMerge(clsx(inputs));

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={cn(
        'bg-slate-950 border-t border-white/10',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Copyright */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 via-red-500 to-orange-600">
                <span className="text-lg font-bold text-white">T</span>
              </div>
              <span className="text-xl font-bold text-white">TrueRoof 2026</span>
            </div>
            <p className="text-sm text-white/60">
              World-class roofing solutions with precision engineering and unmatched craftsmanship.
            </p>
            <div className="text-sm text-white/40">
              © {currentYear} TrueRoof. All rights reserved.
            </div>
          </div>

          {/* Service Coverage */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Service Coverage</h3>
            <div className="space-y-2">
              {serviceAreas.map((area, index) => (
                <motion.div
                  key={area}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-white/70"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {area}
                </motion.div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-white/50">
                Currently serving all LGA regions across Greater Melbourne
              </p>
            </div>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-3">
              <a 
                href="tel:0482022493" 
                className="flex items-center gap-2 text-sm text-white/70 hover:text-orange-400 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                0482 022 493
              </a>
              <a 
                href="mailto:info@trueroof.com.au" 
                className="flex items-center gap-2 text-sm text-white/70 hover:text-orange-400 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@trueroof.com.au
              </a>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex flex-wrap gap-4 text-xs text-white/50">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Licensing</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-white/40">
              ABN: 12 345 678 901 • QBCC License: 1234567
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-white/40">
                Operational Hours: 24/7 Emergency Dispatch
              </span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-400">Live Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default GlobalFooter;
