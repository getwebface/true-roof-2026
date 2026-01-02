// TechSpecsSection.tsx
// Technical specifications accordion component extracted from ServiceHubTemplate

'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

interface TechSpec {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  related_services: string[];
  technical_level: 'basic' | 'intermediate' | 'advanced';
}

interface TechSpecsSectionProps {
  section: {
    headline: string;
    subheadline: string;
    items: TechSpec[];
    categories: string[];
  };
}

export default function TechSpecsSection({ section }: TechSpecsSectionProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [openItems, setOpenItems] = React.useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const toggleItem = useCallback((id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const filteredSpecs = React.useMemo(() => {
    if (activeCategory === 'all') return section.items;
    return section.items.filter((item) => item.category === activeCategory);
  }, [section.items, activeCategory]);

  const technicalLevelColors = {
    basic: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700',
  };

  return (
    <section
      ref={containerRef}
      className="bg-gradient-to-b from-slate-900 to-slate-950 py-24"
      data-component-id="tech-specs"
    >
      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white">{section.headline}</h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">{section.subheadline}</p>
        </motion.div>

        {/* Category Filter */}
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
          {section.categories.map((category) => (
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

        {/* Accordion Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredSpecs.map((spec, index) => (
              <motion.div
                key={spec.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <button
                  onClick={() => toggleItem(spec.id)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-4 pr-4">
                    {/* Technical Level Indicator */}
                    <div className="hidden sm:block">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          technicalLevelColors[spec.technical_level]
                        }`}
                      >
                        {spec.technical_level}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{spec.question}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {spec.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: openItems.has(spec.id) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 text-blue-400"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openItems.has(spec.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/10 px-6 pb-6 pt-4">
                        {/* Answer */}
                        <div className="prose prose-invert mb-6 max-w-none">
                          <p className="whitespace-pre-line leading-relaxed text-white/70">
                            {spec.answer}
                          </p>
                        </div>

                        {/* Related Services */}
                        {spec.related_services.length > 0 && (
                          <div className="border-t border-white/10 pt-4">
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                              Related Services
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {spec.related_services.map((service) => (
                                <a
                                  key={service}
                                  href={`#${service}`}
                                  className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-400 transition-colors hover:bg-blue-500/20"
                                >
                                  {service}
                                  <svg
                                    className="h-3 w-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
