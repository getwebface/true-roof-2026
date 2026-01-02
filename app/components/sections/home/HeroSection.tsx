// HeroSection Component
// Extracted from HomeTemplate.tsx with standardized SectionProps interface

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import type { SectionProps } from '~/types/sdui';
import GlassCard from '~/components/sections/shared/GlassCard';
import MagneticButton from '~/components/sections/shared/MagneticButton';
import AnimatedCounter from '~/components/sections/shared/AnimatedCounter';
import NoiseOverlay from '~/components/sections/shared/NoiseOverlay';

// Reuse utility hooks from original file
const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return position;
};

const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
};



// Main HeroSection Component
const HeroSection: React.FC<SectionProps> = ({ id, data, siteData, styles, trackingId, className, animations }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  
  const mousePosition = useMousePosition();
  const windowSize = useWindowSize();
  
  const mouseX = useSpring(
    (mousePosition.x / (windowSize.width || 1) - 0.5) * 20,
    { stiffness: 100, damping: 30 }
  );
  const mouseY = useSpring(
    (mousePosition.y / (windowSize.height || 1) - 0.5) * 20,
    { stiffness: 100, damping: 30 }
  );
  
  // Ensure we have valid data with fallbacks
  const heroData = data || {
    headline: 'Professional Roofing Services',
    headline_accent: 'For Your Home',
    subheadline: 'Expert roofing solutions with quality craftsmanship',
    primary_cta: 'Get Free Quote',
    secondary_cta: 'View Services',
    stats: [],
    trust_badges: []
  };
  
  return (
    <section 
      ref={containerRef}
      data-component-id={trackingId || 'hero-section'}
      className={twMerge(
        'relative min-h-[100vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
        styles,
        className
      )}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>
      
      {/* Floating Orbs */}
      <motion.div 
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/20 blur-[128px]"
        style={{ x: mouseX, y: mouseY }}
      />
      <motion.div 
        className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-red-500/20 blur-[128px]"
        style={{ x: useTransform(mouseX, v => -v), y: useTransform(mouseY, v => -v) }}
      />
      <motion.div 
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <NoiseOverlay opacity={0.04} />
      
      <motion.div 
        style={{ y, opacity, scale }}
        className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-32"
      >
        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-4"
        >
          {heroData.trust_badges.map((badge: string, index: number) => (
            <div 
              key={index}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-sm"
            >
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {badge}
            </div>
          ))}
        </motion.div>
        
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-center"
        >
          <h1 className="mb-4 text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl">
            {heroData.headline}
            <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
              {heroData.headline_accent}
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60 md:text-xl">
            {heroData.subheadline}
          </p>
        </motion.div>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton variant="primary" className="text-lg">
            {heroData.primary_cta}
          </MagneticButton>
          <MagneticButton variant="secondary" className="text-lg">
            {heroData.secondary_cta}
          </MagneticButton>
        </motion.div>
        
        {/* Stats Grid */}
        {heroData.stats && heroData.stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4"
          >
            {heroData.stats.map((stat: { value: string; label: string; suffix?: string }, index: number) => (
              <GlassCard 
                key={index} 
                className="group p-6 text-center"
                dark
              >
                <div className="text-3xl font-bold text-white md:text-4xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-sm text-white/50 transition-colors group-hover:text-white/70">
                  {stat.label}
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/40"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
