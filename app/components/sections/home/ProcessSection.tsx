// ProcessSection Component
// Extracted from HomeTemplate.tsx with standardized SectionProps interface

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import type { SectionProps } from '~/types/sdui';
import GlassCard from '../shared/GlassCard';

interface ProcessStep {
  id: string;
  step_number: number;
  title: string;
  description: string;
  icon: string;
  duration: string;
}

interface ProcessData {
  headline: string;
  subheadline: string;
  steps: ProcessStep[];
}

const ProcessSection: React.FC<SectionProps> = ({ id, data, siteData, styles, trackingId, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [activeStep, setActiveStep] = useState(0);
  
  const processData = data as ProcessData || {
    headline: 'Our Process',
    subheadline: 'Simple, transparent steps to your perfect roof',
    steps: []
  };
  
  // Auto-advance steps
  useEffect(() => {
    if (processData.steps.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processData.steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [processData.steps.length]);
  
  return (
    <section 
      ref={containerRef}
      className={twMerge(
        'relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-32',
        styles,
        className
      )}
      data-component-id={trackingId || 'process-timeline'}
    >
      {/* Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
        }}
      />
      
      {/* Animated Lines Background */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"
            style={{ top: `${20 + i * 15}%` }}
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {processData.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            {processData.subheadline}
          </p>
        </motion.div>
        
        {/* Process Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-0 right-0 top-1/2 hidden h-1 -translate-y-1/2 rounded-full bg-white/10 lg:block">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
              initial={{ width: '0%' }}
              animate={isInView ? { width: `${((activeStep + 1) / processData.steps.length) * 100}%` } : {}}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processData.steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.15 }}
                onClick={() => setActiveStep(index)}
                className="relative cursor-pointer"
              >
                {/* Step Number Circle */}
                <div className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                  <motion.div
                    className={`flex h-full w-full items-center justify-center rounded-full border-2 text-2xl transition-all duration-500 ${
                      index <= activeStep
                        ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-red-600 text-white'
                        : 'border-white/20 bg-slate-900 text-white/50'
                    }`}
                    animate={index === activeStep ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {step.icon}
                  </motion.div>
                  
                  {index === activeStep && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-orange-500"
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>
                
                <GlassCard 
                  className={`p-6 text-center transition-all duration-500 ${
                    index === activeStep ? 'border-orange-500/50 bg-orange-500/10' : ''
                  }`}
                  hover={false}
                >
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
                    Step {step.step_number}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-white/60">{step.description}</p>
                  <div className="mt-4 text-xs text-white/40">{step.duration}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
