// BeforeAfterSection Component
// Extracted from HomeTemplate.tsx with standardized SectionProps interface

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import type { SectionProps } from '~/types/sdui';

interface BeforeAfterSlide {
  id: string;
  before_image: string;
  after_image: string;
  title: string;
  description: string;
  location: string;
  service_type: string;
  completion_time: string;
}

interface BeforeAfterData {
  headline: string;
  subheadline: string;
  slides: BeforeAfterSlide[];
}

const BeforeAfterSlider: React.FC<{ slide: BeforeAfterSlide }> = ({ slide }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);
  
  return (
    <div className="group relative overflow-hidden rounded-2xl">
      <div
        ref={containerRef}
        className="relative aspect-[4/3] cursor-ew-resize select-none"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Background) */}
        <div className="absolute inset-0">
          <img 
            src={slide.after_image} 
            alt="After" 
            className="h-full w-full object-cover"
          />
          <div className="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
            After
          </div>
        </div>
        
        {/* Before Image (Clipped) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img 
            src={slide.before_image} 
            alt="Before" 
            className="h-full w-full object-cover"
            style={{ width: `${100 * (100 / sliderPosition)}%`, maxWidth: 'none' }}
          />
          <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            Before
          </div>
        </div>
        
        {/* Slider Handle */}
        <div 
          className="absolute bottom-0 top-0 z-10 w-1 bg-white shadow-xl"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-slate-900 shadow-xl">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <h4 className="text-lg font-semibold text-white">{slide.title}</h4>
        <p className="mt-1 text-sm text-white/70">{slide.description}</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">{slide.location}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">{slide.service_type}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">{slide.completion_time}</span>
        </div>
      </div>
    </div>
  );
};

const BeforeAfterSection: React.FC<SectionProps> = ({ id, data, siteData, styles, trackingId, className }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  const beforeAfterData = data as BeforeAfterData || {
    headline: 'Before & After',
    subheadline: 'See our transformation work',
    slides: []
  };
  
  return (
    <section 
      ref={containerRef}
      className={twMerge(
        'relative overflow-hidden bg-white py-32',
        styles,
        className
      )}
      data-component-id={trackingId || 'before-after-slider'}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            {beforeAfterData.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {beforeAfterData.subheadline}
          </p>
        </motion.div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Main Slider */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <BeforeAfterSlider slide={beforeAfterData.slides[activeSlide]} />
          </motion.div>
          
          {/* Thumbnail Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {beforeAfterData.slides.map((slide, index) => (
              <motion.button
                key={slide.id}
                onClick={() => setActiveSlide(index)}
                className={`group relative aspect-video overflow-hidden rounded-xl transition-all duration-300 ${
                  activeSlide === index 
                    ? 'ring-4 ring-orange-500 ring-offset-2' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img 
                  src={slide.after_image} 
                  alt={slide.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3">
                  <span className="text-xs font-medium text-white">{slide.title}</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
