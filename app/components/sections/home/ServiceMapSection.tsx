// ServiceMapSection Component
// Extracted from HomeTemplate.tsx with standardized SectionProps interface

'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import type { SectionProps } from '~/types/sdui';
import GlassCard from '../shared/GlassCard';

interface ServiceArea {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  jobs_completed: number;
  avg_rating: number;
  is_active: boolean;
}

interface ServiceMapData {
  headline: string;
  subheadline: string;
  areas: ServiceArea[];
  center_coordinates: { lat: number; lng: number };
}

const ServiceMapSection: React.FC<SectionProps> = ({ id, data, siteData, styles, trackingId, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  
  const serviceMapData = data as ServiceMapData || {
    headline: 'Service Areas',
    subheadline: 'We serve these locations with excellence',
    areas: [],
    center_coordinates: { lat: -37.8136, lng: 144.9631 } // Melbourne coordinates
  };
  
  // Simplified map visualization using positioned dots
  const getPositionFromCoords = (lat: number, lng: number) => {
    const centerLat = serviceMapData.center_coordinates.lat;
    const centerLng = serviceMapData.center_coordinates.lng;
    
    const x = 50 + (lng - centerLng) * 10;
    const y = 50 - (lat - centerLat) * 10;
    
    return { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) };
  };
  
  return (
    <section 
      ref={containerRef}
      className={twMerge(
        'relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-32',
        styles,
        className
      )}
      data-component-id={trackingId || 'service-map'}
    >
      {/* Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
        }}
      />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {serviceMapData.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            {serviceMapData.subheadline}
          </p>
        </motion.div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Service Area Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <GlassCard className="relative aspect-[16/10] overflow-hidden" hover={false}>
              {/* Blueprint Background */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%),
                    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '100% 100%, 40px 40px, 40px 40px',
                }}
              />
              
              {/* Animated Construction Pulse */}
              <motion.div
                className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0 rounded-full border border-orange-500/20" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-orange-500/10 to-transparent" />
              </motion.div>
              
              {/* Center Point - Our Location */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="h-4 w-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50" />
                  <motion.div
                    className="absolute -inset-2 rounded-full border border-orange-500/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
              
              {/* Service Area Markers */}
              {serviceMapData.areas.map((area) => {
                const pos = getPositionFromCoords(area.coordinates.lat, area.coordinates.lng);
                return (
                  <motion.button
                    key={area.id}
                    className="absolute z-10"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.5 + Math.random() * 0.5 }}
                    onMouseEnter={() => setHoveredArea(area.id)}
                    onMouseLeave={() => setHoveredArea(null)}
                    onClick={() => setSelectedArea(area)}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                      <motion.div 
                        className={`h-3 w-3 rounded-full transition-all duration-300 ${
                          area.is_active 
                            ? 'bg-orange-500 shadow-lg shadow-orange-500/50' 
                            : 'bg-white/50'
                        } ${hoveredArea === area.id || selectedArea?.id === area.id ? 'scale-150' : ''}`}
                        whileHover={{ scale: 1.5 }}
                      />
                      {area.is_active && (
                        <motion.div
                          className="absolute -inset-1 rounded-full bg-orange-500/30"
                          animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                      
                      {/* Tooltip */}
                      <AnimatePresence>
                        {hoveredArea === area.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white p-3 shadow-xl"
                          >
                            <div className="text-sm font-semibold text-slate-900">{area.name}</div>
                            <div className="mt-1 text-xs text-slate-600">
                              {area.jobs_completed} projects • {area.avg_rating}★
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                );
              })}
            </GlassCard>
          </motion.div>
          
          {/* Area List */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-3"
          >
            {serviceMapData.areas.map((area) => (
              <motion.button
                key={area.id}
                onClick={() => setSelectedArea(area)}
                className={`w-full text-left transition-all duration-300 ${
                  selectedArea?.id === area.id ? 'scale-[1.02]' : ''
                }`}
                whileHover={{ x: 4 }}
              >
                <GlassCard 
                  className={`p-4 ${selectedArea?.id === area.id ? 'border-orange-500/50 bg-orange-500/10' : ''}`}
                  hover={false}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${area.is_active ? 'bg-orange-500' : 'bg-white/30'}`} />
                      <span className="font-medium text-white">{area.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <span>{area.jobs_completed} projects</span>
                      <span className="text-amber-400">★ {area.avg_rating}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceMapSection;
