// ServicesSection Component
// Extracted from HomeTemplate.tsx with standardized SectionProps interface

'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { SectionProps } from '~/types/sdui';

interface ServiceHighlight {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  image_url: string;
}

interface ServicesSectionData {
  headline: string;
  subheadline: string;
  highlights: ServiceHighlight[];
}

const ServicesSection: React.FC<SectionProps> = ({ 
  id, 
  data, 
  siteData, 
  styles, 
  trackingId, 
  className, 
  animations 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  const [activeService, setActiveService] = useState(0);
  
  // Ensure we have valid data with fallbacks
  const sectionData: ServicesSectionData = data || {
    headline: 'Our Services',
    subheadline: 'Comprehensive roofing solutions for every need',
    highlights: [
      {
        id: 'service-1',
        title: 'Emergency Roof Repair',
        description: '24/7 emergency roofing services',
        icon: '🚨',
        features: ['24/7 Response', 'Temporary Fixes', 'Free Assessment'],
        image_url: '/images/emergency-repair.jpg'
      },
      {
        id: 'service-2',
        title: 'Roof Replacement',
        description: 'Complete roof replacement with quality materials',
        icon: '🏠',
        features: ['Quality Materials', 'Expert Installation', 'Warranty Included'],
        image_url: '/images/roof-replacement.jpg'
      },
      {
        id: 'service-3',
        title: 'Roof Maintenance',
        description: 'Regular maintenance to extend roof life',
        icon: '🔧',
        features: ['Regular Inspections', 'Preventive Care', 'Cost Savings'],
        image_url: '/images/roof-maintenance.jpg'
      }
    ]
  };

  return (
    <section 
      ref={containerRef}
      data-component-id={trackingId || 'services-section'}
      className={`relative overflow-hidden bg-white py-32 ${styles || ''} ${className || ''}`}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            {sectionData.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {sectionData.subheadline}
          </p>
        </motion.div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Service Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            {sectionData.highlights.map((service, index) => (
              <motion.button
                key={service.id}
                onClick={() => setActiveService(index)}
                className={`w-full text-left transition-all duration-300 ${
                  activeService === index ? 'scale-[1.02]' : ''
                }`}
                whileHover={{ x: 8 }}
              >
                <div 
                  className={`rounded-2xl border p-6 transition-all duration-300 ${
                    activeService === index
                      ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-orange-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-all duration-300 ${
                      activeService === index
                        ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold transition-colors duration-300 ${
                        activeService === index ? 'text-orange-600' : 'text-slate-900'
                      }`}>
                        {service.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">{service.description}</p>
                    </div>
                    <svg 
                      className={`h-6 w-6 transition-all duration-300 ${
                        activeService === index 
                          ? 'rotate-90 text-orange-500' 
                          : 'text-slate-400'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  <AnimatePresence>
                    {activeService === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-4 grid gap-2 border-t border-orange-200 pt-4 sm:grid-cols-2">
                          {service.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            ))}
          </motion.div>
          
          {/* Service Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="sticky top-8">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeService}
                    src={sectionData.highlights[activeService].image_url}
                    alt={sectionData.highlights[activeService].title}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                
                {/* Floating Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-6 left-6 right-6"
                >
                  <div className="rounded-2xl bg-white/90 p-4 backdrop-blur-lg">
                    <h4 className="font-semibold text-slate-900">
                      {sectionData.highlights[activeService].title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-600">
                      {sectionData.highlights[activeService].features.length} included services
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
