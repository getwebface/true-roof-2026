// FAQSection.tsx
// Extracted from HomeTemplate.tsx with standardized SectionProps interface

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { SectionProps } from '~/types/sdui';

const FAQSection: React.FC<SectionProps> = ({ id, data, siteData, styles, trackingId, className, animations }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const toggleItem = useCallback((itemId: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  // Ensure we have valid data with fallbacks
  const faqData = data || {
    headline: 'Frequently Asked Questions',
    subheadline: 'Everything you need to know about our roofing services',
    items: []
  };

  // Group FAQs by category
  const groupedFAQs = React.useMemo(() => {
    const groups: Record<string, any[]> = {};
    (faqData.items || []).forEach((faq: any) => {
      if (!groups[faq.category]) {
        groups[faq.category] = [];
      }
      groups[faq.category].push(faq);
    });
    return groups;
  }, [faqData.items]);

  const categories = Object.keys(groupedFAQs);
  const [activeCategory, setActiveCategory] = useState(categories[0] || 'all');

  const filteredFAQs = React.useMemo(() => {
    if (activeCategory === 'all') return faqData.items || [];
    return groupedFAQs[activeCategory] || [];
  }, [faqData.items, activeCategory, groupedFAQs]);

  return (
    <section
      ref={containerRef}
      data-component-id={trackingId || 'faq-section'}
      className={`relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-32 ${styles || ''} ${className || ''}`}
    >
      {/* Noise Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {faqData.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            {faqData.subheadline}
          </p>
        </motion.div>

        {/* Category Tabs */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="mb-8 flex flex-wrap justify-center gap-2"
          >
            <button
              onClick={() => setActiveCategory('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-white text-slate-900'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              All Topics
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-white text-slate-900'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredFAQs.map((faq: any, index: number) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/5"
                  >
                    <h3 className="pr-4 text-lg font-semibold text-white">{faq.question}</h3>
                    <motion.div
                      animate={{ rotate: openItems.has(faq.id) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 text-orange-500"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openItems.has(faq.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/10 px-6 pb-6 pt-4">
                          <p className="leading-relaxed text-white/70">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
