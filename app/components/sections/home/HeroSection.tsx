// HeroSection Component
// Extracted from HomeTemplate.tsx with standardized SectionProps interface

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import type { SectionProps } from '~/types/sdui';

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

// Reuse utility components
const NoiseOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.03 }) => (
  <div 
    className="pointer-events-none absolute inset-0 z-50"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      opacity,
    }}
  />
);

const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  dark?: boolean;
  hover?: boolean;
}> = ({ children, className = '', blur = 'lg', dark = true, hover = true }) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };
  
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl border
        ${blurClasses[blur]}
        ${dark 
          ? 'border-white/10 bg-white/5' 
          : 'border-black/5 bg-white/70'
        }
        ${hover ? 'transition-all duration-500 hover:border-white/20 hover:bg-white/10' : ''}
        ${className}
      `}
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <NoiseOverlay opacity={0.02} />
      {children}
    </motion.div>
  );
};

const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}> = ({ children, className = '', onClick, variant = 'primary' }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  }, [x, y]);
  
  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white shadow-lg shadow-orange-500/30',
    secondary: 'bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20',
    ghost: 'bg-transparent border-2 border-white/30 text-white hover:border-white/60',
  };
  
  return (
    <motion.button
      ref={buttonRef}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`
        relative overflow-hidden rounded-full px-8 py-4 font-semibold
        transition-all duration-300
        ${variants[variant]}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 -z-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
};

const AnimatedCounter: React.FC<{
  value: string;
  suffix?: string;
  duration?: number;
}> = ({ value, suffix = '', duration = 2 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [displayValue, setDisplayValue] = useState('0');
  
  useEffect(() => {
    if (!isInView) return;
    
    const numericValue = parseInt(value.replace(/\D/g, ''), 10);
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }
    
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * numericValue);
      setDisplayValue(current.toLocaleString());
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);
  
  return (
    <span ref={ref}>
      {displayValue}{suffix}
    </span>
  );
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
