// FinalCTASection.tsx
// Extracted from HomeTemplate.tsx with standardized SectionProps interface

'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import MagneticButton from '~/components/sections/shared/MagneticButton';
import type { SectionProps } from '~/types/sdui';

const FinalCTASection: React.FC<SectionProps> = ({ id, data, siteData, styles, trackingId, className, animations }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Ensure we have valid data with fallbacks
  const ctaData = data || {
    headline: 'Ready to Transform Your Roof?',
    subheadline: 'Get your free inspection and quote today. Professional service guaranteed.',
    primary_cta: 'Get Free Quote',
    secondary_cta: 'Call Now',
    urgency_text: 'Limited time offer - Book within 24 hours',
    guarantee_text: '100% Satisfaction Guarantee'
  };

  const siteInfo = siteData || {
    phone: '(555) 123-4567'
  };

  return (
    <section
      ref={containerRef}
      data-component-id={trackingId || 'final-cta'}
      className={`relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 py-32 ${styles || ''} ${className || ''}`}
    >
      {/* Noise Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.05,
        }}
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-[100px]"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-black/10 blur-[100px]"
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
          {/* Urgency Badge */}
          {ctaData.urgency_text && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
            >
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
              </span>
              <span className="text-sm font-medium text-white">{ctaData.urgency_text}</span>
            </motion.div>
          )}

          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {ctaData.headline}
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            {ctaData.subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton
              variant="ghost"
              className="border-2 border-white bg-white text-orange-600 hover:bg-white/90"
            >
              {ctaData.primary_cta}
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              className="border-2 border-white/50 text-white hover:border-white"
            >
              {ctaData.secondary_cta}
            </MagneticButton>
          </div>

          {/* Trust Badge */}
          {ctaData.guarantee_text && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-2 text-white/80"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{ctaData.guarantee_text}</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
