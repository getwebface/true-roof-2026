// TestimonialsSection Component
// Extracted from HomeTemplate.tsx with standardized SectionProps interface

'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import type { SectionProps } from '~/types/sdui';
import GlassCard from '../shared/GlassCard';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  rating: number;
  avatar_url?: string;
  date: string;
  location: string;
}

interface TestimonialsData {
  headline: string;
  subheadline: string;
  testimonials: Testimonial[];
  show_avatars?: boolean;
  show_ratings?: boolean;
  show_dates?: boolean;
  auto_rotate?: boolean;
  rotation_interval?: number;
}

const TestimonialsSection: React.FC<SectionProps> = ({ id, data, siteData, styles, trackingId, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonialsData = data as TestimonialsData || {
    headline: 'Customer Testimonials',
    subheadline: 'Hear what our clients have to say about our roofing services',
    testimonials: [],
    auto_rotate: true,
    rotation_interval: 5000
  };
  
  // Auto-rotate testimonials
  React.useEffect(() => {
    if (!testimonialsData.auto_rotate || testimonialsData.testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => 
        current === testimonialsData.testimonials.length - 1 ? 0 : current + 1
      );
    }, testimonialsData.rotation_interval || 5000);
    
    return () => clearInterval(interval);
  }, [testimonialsData.auto_rotate, testimonialsData.testimonials.length, testimonialsData.rotation_interval]);
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };
  
  return (
    <section 
      ref={containerRef}
      className={twMerge(
        'relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 py-32',
        styles,
        className
      )}
      data-component-id={trackingId || 'testimonials-section'}
    >
      {/* Background Elements */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-red-500/10 blur-[120px]" />
      
      {/* Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
        }}
      />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {testimonialsData.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            {testimonialsData.subheadline}
          </p>
        </motion.div>
        
        {/* Testimonials Grid/List */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="wait">
            {testimonialsData.testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <GlassCard className="h-full p-8" dark hover>
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <svg className="h-12 w-12 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  
                  {/* Quote */}
                  <p className="mb-8 text-lg leading-relaxed text-white/80">
                    "{testimonial.quote}"
                  </p>
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    {testimonialsData.show_avatars !== false && (
                      <div className="h-14 w-14 overflow-hidden rounded-full bg-gradient-to-br from-orange-500 to-red-600">
                        {testimonial.avatar_url ? (
                          <img 
                            src={testimonial.avatar_url} 
                            alt={testimonial.author}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                            {testimonial.author.charAt(0)}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">{testimonial.author}</div>
                          <div className="text-sm text-white/50">
                            {testimonial.role}
                            {testimonial.company && ` • ${testimonial.company}`}
                          </div>
                        </div>
                        
                        {testimonialsData.show_ratings !== false && (
                          <div className="flex flex-col items-end">
                            {renderStars(testimonial.rating)}
                            {testimonialsData.show_dates !== false && (
                              <div className="mt-1 text-xs text-white/40">
                                {testimonial.date}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {testimonial.location && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-white/40">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {testimonial.location}
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Navigation Dots */}
        {testimonialsData.testimonials.length > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {testimonialsData.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-3 w-3 rounded-full transition-all ${
                  index === activeIndex 
                    ? 'bg-orange-500 w-8' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="mb-6 text-lg text-white/60">
            Ready to experience our quality service?
          </p>
          <button className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-8 py-4 font-semibold text-white transition-transform hover:scale-105">
            Get Your Free Quote
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
