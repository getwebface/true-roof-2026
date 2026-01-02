// CTASection.tsx
// Call-to-action section component extracted from ServiceHubTemplate

'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import MagneticButton from '~/components/sections/shared/MagneticButton';

interface CTASectionProps {
  section: {
    headline: string;
    subheadline: string;
    primary_cta: string;
    secondary_cta: string;
    features: string[];
  };
  data: any;
}

export default function CTASection({ section, data }: CTASectionProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 py-24"
      data-component-id="service-cta"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-[100px]"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-400/20 blur-[100px]"
          animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">{section.headline}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">{section.subheadline}</p>

          {/* Features Grid */}
          <div className="mb-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {section.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-white">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton
              variant="ghost"
              size="lg"
              className="bg-white text-blue-600 hover:bg-white/90"
            >
              {section.primary_cta}
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              size="lg"
              className="border-2 border-white/50 text-white hover:border-white"
            >
              {section.secondary_cta}
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
