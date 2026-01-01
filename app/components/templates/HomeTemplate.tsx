// HomeTemplate.tsx
// TrueRoof - World-Class Bento UI Home Page Template
// Built with React 18+, TypeScript, Tailwind CSS, Framer Motion

'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  createContext,
  useContext,
} from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView, AnimatePresence } from 'framer-motion';
import HeadlessForm from '~/components/forms/HeadlessForm';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface HeroStat {
  value: string;
  label: string;
  suffix?: string;
  icon?: string;
}

interface HeroSection {
  headline: string;
  headline_accent: string;
  subheadline: string;
  primary_cta: string;
  secondary_cta: string;
  stats: HeroStat[];
  background_video_url?: string;
  trust_badges: string[];
}

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

interface ServiceArea {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  jobs_completed: number;
  avg_rating: number;
  is_active: boolean;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar_url: string;
  rating: number;
  date: string;
  service_type: string;
  location: string;
}

interface ProcessStep {
  id: string;
  step_number: number;
  title: string;
  description: string;
  icon: string;
  duration: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface ServiceHighlight {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  image_url: string;
}

interface SocialProof {
  platform: string;
  rating: number;
  review_count: number;
  url: string;
  icon: string;
}

interface Sections {
  hero: HeroSection;
  bento_grid: {
    headline: string;
    subheadline: string;
    cards: BentoCard[];
  };
  before_after: {
    headline: string;
    subheadline: string;
    slides: BeforeAfterSlide[];
  };
  service_map: {
    headline: string;
    subheadline: string;
    areas: ServiceArea[];
    center_coordinates: { lat: number; lng: number };
  };
  testimonials: {
    headline: string;
    subheadline: string;
    items: Testimonial[];
    social_proof: SocialProof[];
  };
  process: {
    headline: string;
    subheadline: string;
    steps: ProcessStep[];
  };
  services: {
    headline: string;
    subheadline: string;
    highlights: ServiceHighlight[];
  };
  faq: {
    headline: string;
    subheadline: string;
    items: FAQ[];
  };
  final_cta: {
    headline: string;
    subheadline: string;
    primary_cta: string;
    secondary_cta: string;
    urgency_text: string;
    guarantee_text: string;
  };
}

interface SiteData {
  site_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
}

interface HomeTemplateProps {
  data: SiteData;
  sections: Sections;
}

// ============================================================================
// CONTEXT & HOOKS
// ============================================================================

const ThemeContext = createContext<{
  isDark: boolean;
  toggleTheme: () => void;
}>({
  isDark: true,
  toggleTheme: () => {},
});

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

const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return smoothProgress;
};

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

// Noise Texture Overlay
const NoiseOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.03 }) => (
  <div 
    className="pointer-events-none absolute inset-0 z-50"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      opacity,
    }}
  />
);

// Glassmorphism Card
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

// Magnetic Button Component
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

// Animated Counter
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

// Parallax Container
const ParallaxContainer: React.FC<{
  children: React.ReactNode;
  speed?: number;
  className?: string;
}> = ({ children, speed = 0.5, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  
  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  );
};

// ============================================================================
// HERO SECTION
// ============================================================================

const HeroSection: React.FC<{ section: HeroSection; data: SiteData }> = ({ section, data }) => {
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
  
  return (
    <section 
      ref={containerRef}
      data-component-id="hero-section"
      className="relative min-h-[100vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
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
          {section.trust_badges.map((badge, index) => (
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
            {section.headline}
            <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-orange-500 bg-clip-text text-transparent">
              {section.headline_accent}
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60 md:text-xl">
            {section.subheadline}
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
            {section.primary_cta}
          </MagneticButton>
          <MagneticButton variant="secondary" className="text-lg">
            {section.secondary_cta}
          </MagneticButton>
        </motion.div>
        
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4"
        >
          {section.stats.map((stat, index) => (
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

// ============================================================================
// BENTO GRID SECTION
// ============================================================================

const BentoGridSection: React.FC<{ 
  section: Sections['bento_grid']; 
  data: SiteData;
}> = ({ section, data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
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
            <MagneticButton variant="ghost" className="border-white text-white hover:bg-white/20">
              {card.cta_text}
            </MagneticButton>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-32" data-component-id="bento-grid">
      <NoiseOverlay />
      
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
            {section.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            {section.subheadline}
          </p>
        </motion.div>
        
        {/* Bento Grid */}
        <div className="grid auto-rows-[200px] grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {section.cards.map((card, index) => (
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

// ============================================================================
// BEFORE/AFTER SLIDER SECTION
// ============================================================================

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

const BeforeAfterSection: React.FC<{ section: Sections['before_after'] }> = ({ section }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  return (
    <section className="relative overflow-hidden bg-white py-32" data-component-id="before-after-slider">
      <div ref={containerRef} className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            {section.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {section.subheadline}
          </p>
        </motion.div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Main Slider */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <BeforeAfterSlider slide={section.slides[activeSlide]} />
          </motion.div>
          
          {/* Thumbnail Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {section.slides.map((slide, index) => (
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

// ============================================================================
// SERVICE MAP SECTION
// ============================================================================

const ServiceMapSection: React.FC<{ section: Sections['service_map'] }> = ({ section }) => {
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  // Simplified map visualization using positioned dots
  const getPositionFromCoords = (lat: number, lng: number) => {
    // Normalize coordinates to percentage positions
    // This is a simplified mapping - adjust based on your actual service area
    const centerLat = section.center_coordinates.lat;
    const centerLng = section.center_coordinates.lng;
    
    const x = 50 + (lng - centerLng) * 10;
    const y = 50 - (lat - centerLat) * 10;
    
    return { x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) };
  };
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-32" data-component-id="service-map">
      <NoiseOverlay />
      
      <div ref={containerRef} className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {section.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            {section.subheadline}
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
              {section.areas.map((area) => {
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
            {section.areas.map((area) => (
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

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================

const TestimonialsSection: React.FC<{ section: Sections['testimonials'] }> = ({ section }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % section.items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [section.items.length]);
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-amber-400' : 'text-white/20'}`}
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };
  
  return (
    <section className="relative overflow-hidden bg-white py-32" data-component-id="testimonials">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-1/4 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-orange-100 to-red-50 blur-3xl" />
        <div className="absolute -left-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-amber-50 to-orange-100 blur-3xl" />
      </div>
      
      <div ref={containerRef} className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            {section.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {section.subheadline}
          </p>
          
          {/* Social Proof Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {section.social_proof.map((proof, index) => (
              <motion.a
                key={index}
                href={proof.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm transition-all duration-300 hover:border-orange-500/50 hover:shadow-md"
              >
                <span className="text-xl">{proof.icon}</span>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-900">{proof.rating}</span>
                    <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="text-xs text-slate-500">{proof.review_count} reviews</div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
        
        {/* Main Testimonial Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-4xl"
            >
              <div className="relative rounded-3xl border border-slate-100 bg-white p-8 shadow-xl md:p-12">
                {/* Quote Mark */}
                <svg 
                  className="absolute -left-4 -top-4 h-16 w-16 text-orange-500/20 md:-left-6 md:-top-6 md:h-24 md:w-24" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                
                <div className="relative">
                  <div className="mb-6 flex">{renderStars(section.items[activeIndex].rating)}</div>
                  
                  <blockquote className="text-xl leading-relaxed text-slate-700 md:text-2xl">
                    "{section.items[activeIndex].quote}"
                  </blockquote>
                  
                  <div className="mt-8 flex items-center gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-full bg-gradient-to-br from-orange-500 to-red-600">
                      {section.items[activeIndex].avatar_url && (
                        <img 
                          src={section.items[activeIndex].avatar_url} 
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {section.items[activeIndex].author}
                      </div>
                      <div className="text-sm text-slate-500">
                        {section.items[activeIndex].role} • {section.items[activeIndex].location}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                        {section.items[activeIndex].service_type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {section.items.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'w-8 bg-orange-500' 
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + section.items.length) % section.items.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all duration-300 hover:bg-slate-50 hover:shadow-xl md:-left-6"
          >
            <svg className="h-6 w-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % section.items.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all duration-300 hover:bg-slate-50 hover:shadow-xl md:-right-6"
          >
            <svg className="h-6 w-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Testimonial Grid Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid gap-4 md:grid-cols-3"
        >
          {section.items.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + index * 0.1 }}
              onClick={() => setActiveIndex(index)}
              className={`cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                index === activeIndex 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-slate-100 bg-white hover:border-orange-200 hover:shadow-md'
              }`}
            >
              <div className="mb-3 flex">{renderStars(testimonial.rating)}</div>
              <p className="line-clamp-3 text-sm text-slate-600">"{testimonial.quote}"</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-orange-500 to-red-600">
                  {testimonial.avatar_url && (
                    <img src={testimonial.avatar_url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900">{testimonial.author}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// PROCESS SECTION
// ============================================================================

const ProcessSection: React.FC<{ section: Sections['process'] }> = ({ section }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [activeStep, setActiveStep] = useState(0);
  
  // Auto-advance steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % section.steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [section.steps.length]);
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-32" data-component-id="process-timeline">
      <NoiseOverlay />
      
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
      
      <div ref={containerRef} className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {section.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            {section.subheadline}
          </p>
        </motion.div>
        
        {/* Process Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-0 right-0 top-1/2 hidden h-1 -translate-y-1/2 rounded-full bg-white/10 lg:block">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
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

// ============================================================================
// SERVICES HIGHLIGHT SECTION
// ============================================================================

const ServicesSection: React.FC<{ section: Sections['services'] }> = ({ section }) => {
  const [activeService, setActiveService] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  return (
    <section className="relative overflow-hidden bg-white py-32" data-component-id="services-highlight">
      <div ref={containerRef} className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
            {section.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {section.subheadline}
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
            {section.highlights.map((service, index) => (
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
                    src={section.highlights[activeService].image_url}
                    alt={section.highlights[activeService].title}
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
                      {section.highlights[activeService].title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-600">
                      {section.highlights[activeService].features.length} included services
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

// ============================================================================
// FAQ SECTION
// ============================================================================

const FAQSection: React.FC<{ section: Sections['faq'] }> = ({ section }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  
  // Group FAQs by category
  const groupedFAQs = useMemo(() => {
    const groups: Record<string, FAQ[]> = {};
    section.items.forEach((faq) => {
      if (!groups[faq.category]) {
        groups[faq.category] = [];
      }
      groups[faq.category].push(faq);
    });
    return groups;
  }, [section.items]);
  
  const categories = Object.keys(groupedFAQs);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-32" data-component-id="faq-section">
      <NoiseOverlay />
      
      <div ref={containerRef} className="relative z-10 mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {section.headline}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            {section.subheadline}
          </p>
        </motion.div>
        
        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
        
        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <AnimatePresence mode="wait">
            {groupedFAQs[activeCategory]?.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="overflow-hidden" hover={false}>
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <h3 className="pr-4 text-lg font-semibold text-white">{faq.question}</h3>
                    <motion.div
                      animate={{ rotate: openItems.has(faq.id) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 text-orange-500"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openItems.has(faq.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/10 px-6 pb-6 pt-4">
                          <p className="leading-relaxed text-white/70">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// FINAL CTA SECTION
// ============================================================================

const FinalCTASection: React.FC<{ section: Sections['final_cta']; data: SiteData }> = ({ section, data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 py-32" data-component-id="final-cta">
      <NoiseOverlay opacity={0.05} />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-[100px]"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-black/10 blur-[100px]"
          animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>
      
      <div ref={containerRef} className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Urgency Badge */}
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
            <span className="text-sm font-medium text-white">{section.urgency_text}</span>
          </motion.div>
          
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {section.headline}
          </h2>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            {section.subheadline}
          </p>
          
          {/* CTA Buttons */}
          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton 
              variant="ghost" 
              className="border-2 border-white bg-white text-orange-600 hover:bg-white/90"
            >
              {section.primary_cta}
            </MagneticButton>
            <MagneticButton 
              variant="ghost" 
              className="border-2 border-white/50 text-white hover:border-white"
            >
              {section.secondary_cta}
            </MagneticButton>
          </div>
          
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-2 text-white/80"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{section.guarantee_text}</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// FLOATING NAVIGATION
// ============================================================================

const FloatingNav: React.FC<{ data: SiteData }> = ({ data }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-slate-950/80 backdrop-blur-xl' 
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
              <span className="text-xl font-bold text-white">T</span>
            </div>
            <span className="text-xl font-bold text-white">{data.site_name}</span>
          </div>
          
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#services" className="text-sm text-white/70 transition-colors hover:text-white">Services</a>
            <a href="#portfolio" className="text-sm text-white/70 transition-colors hover:text-white">Portfolio</a>
            <a href="#reviews" className="text-sm text-white/70 transition-colors hover:text-white">Reviews</a>
            <a href="#contact" className="text-sm text-white/70 transition-colors hover:text-white">Contact</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <a 
              href={`tel:${data.phone}`}
              className="hidden items-center gap-2 text-sm font-medium text-white md:flex"
            >
              <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {data.phone}
            </a>
            
            <MagneticButton variant="primary" className="hidden text-sm md:block">
              Get Free Quote
            </MagneticButton>
            
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-white md:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white">{data.site_name}</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <nav className="mt-12 flex flex-col gap-6">
                <a href="#services" className="text-2xl font-semibold text-white" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
                <a href="#portfolio" className="text-2xl font-semibold text-white" onClick={() => setIsMobileMenuOpen(false)}>Portfolio</a>
                <a href="#reviews" className="text-2xl font-semibold text-white" onClick={() => setIsMobileMenuOpen(false)}>Reviews</a>
                <a href="#contact" className="text-2xl font-semibold text-white" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
              </nav>
              
              <div className="mt-auto">
                <a 
                  href={`tel:${data.phone}`}
                  className="mb-4 flex items-center gap-2 text-lg text-white"
                >
                  <svg className="h-6 w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {data.phone}
                </a>
                <button className="w-full rounded-full bg-gradient-to-r from-orange-500 to-red-600 py-4 font-semibold text-white">
                  Get Free Quote
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================================
// SCROLL PROGRESS INDICATOR
// ============================================================================

const ScrollProgress: React.FC = () => {
  const progress = useScrollProgress();
  
  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-orange-500 via-red-500 to-orange-600"
      style={{ scaleX: progress }}
    />
  );
};

// ============================================================================
// MAIN TEMPLATE COMPONENT
// ============================================================================

export default function HomeTemplate({ data, sections }: HomeTemplateProps) {
  return (
    <ThemeContext.Provider value={{ isDark: true, toggleTheme: () => {} }}>
      <div className="relative min-h-screen bg-slate-950 text-white antialiased">
        <ScrollProgress />
        <FloatingNav data={data} />
        
        <main>
          <HeroSection section={sections.hero} data={data} />
          <BentoGridSection section={sections.bento_grid} data={data} />
          <BeforeAfterSection section={sections.before_after} />
          <ServiceMapSection section={sections.service_map} />
          <TestimonialsSection section={sections.testimonials} />
          <ProcessSection section={sections.process} />
          <ServicesSection section={sections.services} />
          <FAQSection section={sections.faq} />
          <FinalCTASection section={sections.final_cta} data={data} />
          
          {/* Headless Form Section */}
          <section className="py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" data-component-id="headless-form-section">
            <div className="max-w-4xl mx-auto px-6">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                  Get Your Free Roofing Assessment
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-white/60">
                  Complete the form below and our team will contact you within 24 hours
                </p>
              </div>
              
              <HeadlessForm 
                formId="homepage_lead_form"
                title="Schedule Your Free Inspection"
                subtitle="Fill out this quick form and we'll call you to arrange a convenient time"
                trackingPrefix="homepage_form"
                variant="gradient"
              />
            </div>
          </section>
        </main>
        
        {/* Footer would go here */}
      </div>
    </ThemeContext.Provider>
  );
}
