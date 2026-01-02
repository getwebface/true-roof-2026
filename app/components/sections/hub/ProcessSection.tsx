// ProcessSection.tsx
// Process timeline section component extracted from ServiceHubTemplate

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface ProcessStep {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  icon: string;
}

interface ProcessSectionProps {
  section: {
    headline: string;
    subheadline: string;
    steps: ProcessStep[];
  };
}

export default function ProcessSection({ section }: ProcessSectionProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [activeStep, setActiveStep] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % section.steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [section.steps.length]);

  return (
    <section ref={containerRef} className="bg-white py-24" data-component-id="service-process">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-slate-900">{section.headline}</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">{section.subheadline}</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-0 right-0 top-16 hidden h-1 bg-slate-200 lg:block">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
              initial={{ width: '0%' }}
              animate={isInView ? { width: `${((activeStep + 1) / section.steps.length) * 100}%` } : {}}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {section.steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * index }}
                onClick={() => setActiveStep(index)}
                className="relative cursor-pointer"
              >
                {/* Step Number */}
                <div className="relative z-10 mx-auto mb-6 flex h-12 w-12 items-center justify-center lg:h-16 lg:w-16">
                  <motion.div
                    className={`flex h-full w-full items-center justify-center rounded-full border-2 text-xl transition-all duration-500 ${
                      index <= activeStep
                        ? 'border-blue-500 bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                        : 'border-slate-300 bg-white text-slate-400'
                    }`}
                    animate={index === activeStep ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {step.icon}
                  </motion.div>

                  {index === activeStep && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blue-500"
                      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Content Card */}
                <div
                  className={`rounded-2xl border p-6 text-center transition-all duration-500 ${
                    index === activeStep
                      ? 'border-blue-500/30 bg-blue-50 shadow-lg'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Step {step.number}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="mb-4 text-sm text-slate-600">{step.description}</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {step.duration}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
