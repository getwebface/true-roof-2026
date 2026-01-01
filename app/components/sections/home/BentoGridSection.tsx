// BentoGridSection Component
// Extracted from HomeTemplate.tsx with standardized SectionProps interface

'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import type { SectionProps } from '~/types/sdui';
import GlassCard from '../shared/GlassCard';
import AnimatedCounter from '../shared/AnimatedCounter';

// Define BentoCard type locally since it's specific to this component
interface BentoCard {
  id: string;
  type: 'feature' | 'stat' | 'testimonial' | 'image' | 'service' | 'cta';
  span: 'single' | 'double' | 'triple' | 'tall' | 'wide' | 'hero';
  title?: string;
  description?: string;
  icon?: string;
  image_url?: string;
  stat_value?: string;
  stat_label?: string;
  testimonial_quote?: string;
  testimonial_author?: string;
  testimonial_role?: string;
  testimonial_avatar?: string;
  service_items?: string[];
  cta_text?: string;
  cta_url?: string;
  accent_color?: string;
}

interface BentoGridData {
  headline: string;
  subheadline: string;
  cards: BentoCard[];
}

const BentoGridSection: React.FC<SectionProps> = ({ id, data, siteData, styles, trackingId, className, animations }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  const bentoData = data as BentoGridData || {
    headline: 'Our Services',
    subheadline: 'Comprehensive roofing solutions for every need',
    cards: []
  };
  
  const getSpanClasses = (span: BentoCard['span']) => {
    const spanMap = {
      single: 'col-span-1 row-span-1',
      double: 'col-span-1 md:col-span-2 row-span-1',
      triple: 'col-span-1 md:col-span-3 row-span-1',
      tall: 'col-span-1 row-span-2',
      wide: 'col-span-1 md:col-span-2 row-span-1',
      hero: 'col-span-1 md:col-span-2 row-span-2',
    };
    return spanMap[span];
  };
  
  const renderCardContent = (card: BentoCard) => {
    switch (card.type) {
      case 'feature':
        return (
          <div className="flex h-full flex-col p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-2xl text-white">
              {card.icon}
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">{card.title}</h3>
            <p className="text-sm leading-relaxed text-white/60">{card.description}</p>
          </div>
        );
        
      case 'stat':
        return (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl font-bold text-white md:text-6xl">
              <AnimatedCounter value={card.stat_value || '0'} />
            </div>
            <div className="mt-2 text-sm uppercase tracking-wider text-white/50">
              {card.stat_label}
            </div>
          </div>
        );
        
      case 'testimonial':
        return (
          <div className="flex h-full flex-col justify-between p-6">
            <div>
              <svg className="mb-4 h-8 w-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-lg leading-relaxed text-white/80">{card.testimonial_quote}</p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-orange-500 to-red-600">
                {card.testimonial_avatar && (
                  <img src={card.testimonial_avatar} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div>
                <div className="font-semibold text-white">{card.testimonial_author}</div>
                <div className="text-sm text-white/50">{card.testimonial_role}</div>
              </div>
            </div>
          </div>
        );
        
      case 'image':
        return (
          <div className="relative h-full min-h-[200px] overflow-hidden">
            <img 
              src={card.image_url} 
              alt={card.title || ''} 
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {card.title && (
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
              </div>
            )}
          </div>
        );
        
      case 'service':
        return (
          <div className="flex h-full flex-col p-6">
            <h3 className="mb-4 text-xl font-semibold text-white">{card.title}</h3>
            <ul className="space-y-3">
              {card.service_items?.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white/70">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
        
      case 'cta':
        return (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 p-6 text-center">
            <h3 className="mb-4 text-2xl font-bold text-white">{card.title}</h3>
            <p className="mb-6 text-white/90">{card.description}</p>
            <button className="rounded-full border-2 border-white px-6 py-2 font-semibold text-white transition-colors hover:bg-white/20">
              {card.cta_text}
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <section 
      className={twMerge(
        'relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-32',
        styles,
        className
      )}
      data-component-id={trackingId || 'bento-grid'}
    >
      {/* Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
        }}
      />
      
      {/* Background Elements */}
      <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-orange-500/5 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-red-500/5 blur-[120px]" />
      
      <div ref={containerRef} className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {bentoData.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            {bentoData.subheadline}
          </p>
        </motion.div>
        
        {/* Bento Grid */}
        <div className="grid auto-rows-[200px] grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {bentoData.cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={getSpanClasses(card.span)}
            >
              <GlassCard className="h-full" dark hover>
                {renderCardContent(card)}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGridSection;
