// ServiceHubTemplate.tsx
// TrueRoof - Service Hub Template
// A professional roofing service explorer with filtering and detailed specifications

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
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  AnimatePresence,
  LayoutGroup,
} from 'framer-motion';
import clsx from 'clsx';
import HeadlessForm from '~/components/forms/HeadlessForm';

// Extracted section components
import FilteringMatrix from '~/components/sections/hub/FilteringMatrix';
import ServicesGridSection from '~/components/sections/hub/ServicesGridSection';
import ComparisonSection from '~/components/sections/hub/ComparisonSection';
import TechSpecsSection from '~/components/sections/hub/TechSpecsSection';
import HubCTASection from '~/components/sections/hub/CTASection';
import HubProcessSection from '~/components/sections/hub/ProcessSection';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface SystemStatus {
  operational_services: number;
  total_services: number;
  last_updated: string;
  uptime_percentage: number;
  active_jobs: number;
  response_time: string;
}

interface HeroSection {
  headline: string;
  headline_accent: string;
  description: string;
  system_status: SystemStatus;
  quick_stats: Array<{
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
    trend_value?: string;
  }>;
  version_tag: string;
  breadcrumb: string[];
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}

interface ServiceFeature {
  icon: string;
  text: string;
}

interface ServicePricing {
  type: 'fixed' | 'from' | 'custom' | 'range';
  value?: string;
  from?: string;
  to?: string;
  unit?: string;
}

interface ServiceCard {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  tags: string[];
  icon: string;
  image_url: string;
  features: ServiceFeature[];
  pricing: ServicePricing;
  availability: 'available' | 'limited' | 'unavailable';
  response_time: string;
  warranty: string;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_emergency: boolean;
  specs: Array<{
    label: string;
    value: string;
  }>;
}

interface TechSpec {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  related_services: string[];
  technical_level: 'basic' | 'intermediate' | 'advanced';
}

interface ComparisonFeature {
  name: string;
  basic: boolean | string;
  standard: boolean | string;
  premium: boolean | string;
}

interface ServiceTier {
  id: string;
  name: string;
  description: string;
  price_indicator: string;
  features: string[];
  is_popular: boolean;
  cta_text: string;
}

interface ProcessStep {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  icon: string;
}

interface Sections {
  hero: HeroSection;
  filtering: {
    headline: string;
    categories: ServiceCategory[];
    sort_options: Array<{ id: string; label: string }>;
    default_category: string;
  };
  services: {
    headline: string;
    subheadline: string;
    items: ServiceCard[];
    empty_state: {
      headline: string;
      description: string;
      cta_text: string;
    };
  };
  comparison: {
    headline: string;
    subheadline: string;
    tiers: ServiceTier[];
    features: ComparisonFeature[];
  };
  tech_specs: {
    headline: string;
    subheadline: string;
    items: TechSpec[];
    categories: string[];
  };
  process: {
    headline: string;
    subheadline: string;
    steps: ProcessStep[];
  };
  cta: {
    headline: string;
    subheadline: string;
    primary_cta: string;
    secondary_cta: string;
    features: string[];
  };
}

interface SiteData {
  site_name: string;
  tagline: string;
  phone: string;
  email: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
}

interface ServiceHubTemplateProps {
  data: SiteData;
  sections: Sections;
}

// ============================================================================
// UTILITY FUNCTIONS & HOOKS
// ============================================================================

const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return smoothProgress;
};

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// ============================================================================
// REUSABLE COMPONENTS
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

// Glass Card Component
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  hover?: boolean;
  glow?: boolean;
  glowColor?: string;
}> = ({ children, className = '', dark = false, hover = true, glow = false, glowColor = 'blue' }) => {
  const glowColors: Record<string, string> = {
    blue: 'hover:shadow-blue-500/20 hover:border-blue-500/50',
    orange: 'hover:shadow-orange-500/20 hover:border-orange-500/50',
    green: 'hover:shadow-green-500/20 hover:border-green-500/50',
    purple: 'hover:shadow-purple-500/20 hover:border-purple-500/50',
  };

  return (
    <motion.div
      className={clsx(
        'relative overflow-hidden rounded-2xl border backdrop-blur-lg transition-all duration-500',
        dark
          ? 'border-white/10 bg-white/5'
          : 'border-slate-200/50 bg-white/80',
        hover && 'hover:shadow-xl',
        glow && glowColors[glowColor],
        className
      )}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

// Magnetic Button
const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}> = ({ children, className = '', onClick, variant = 'primary', size = 'md' }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.1);
      y.set((e.clientY - centerY) * 0.1);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const variants = {
    primary:
      'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
    outline: 'bg-transparent border-2 border-slate-300 text-slate-700 hover:border-slate-400',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <motion.button
      ref={buttonRef}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        'relative overflow-hidden rounded-full font-semibold transition-all duration-300',
        variants[variant],
        sizes[size],
        className
      )}
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

// Status Indicator
const StatusIndicator: React.FC<{
  status: 'operational' | 'degraded' | 'down';
  label: string;
  showPulse?: boolean;
}> = ({ status, label, showPulse = true }) => {
  const statusColors = {
    operational: 'bg-emerald-500',
    degraded: 'bg-amber-500',
    down: 'bg-red-500',
  };

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        {showPulse && (
          <span
            className={clsx(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              statusColors[status]
            )}
          />
        )}
        <span
          className={clsx('relative inline-flex h-2.5 w-2.5 rounded-full', statusColors[status])}
        />
      </span>
      <span className="text-sm font-medium text-white/80">{label}</span>
    </div>
  );
};

// Tech Badge
const TechBadge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'premium';
  size?: 'sm' | 'md';
}> = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    premium: 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </span>
  );
};

// ============================================================================
// HERO SECTION - SERVICE HUB
// ============================================================================

const ServiceHubHero: React.FC<{ section: HeroSection; data: SiteData }> = ({
  section,
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      data-component-id="service-hub-hero"
      className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    >
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

              {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute -left-48 top-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-48 bottom-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      <NoiseOverlay opacity={0.04} />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-32"
      >
        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            {section.breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                <span
                  className={clsx(
                    index === section.breadcrumb.length - 1
                      ? 'text-white'
                      : 'text-white/50 hover:text-white/70'
                  )}
                >
                  {item}
                </span>
                {index < section.breadcrumb.length - 1 && (
                  <svg
                    className="h-4 w-4 text-white/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Version Tag */}
          <div className="flex items-center gap-3">
            <TechBadge variant="info" size="md">
              {section.version_tag}
            </TechBadge>
            <span className="font-mono text-sm text-white/40">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Side - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              {section.headline}
              <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                {section.headline_accent}
              </span>
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/60">
              {section.description}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {section.quick_stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                    {stat.trend && (
                      <span
                        className={clsx(
                          'flex items-center text-xs font-medium',
                          stat.trend === 'up' && 'text-emerald-400',
                          stat.trend === 'down' && 'text-red-400',
                          stat.trend === 'stable' && 'text-white/50'
                        )}
                      >
                        {stat.trend === 'up' && '↑'}
                        {stat.trend === 'down' && '↓'}
                        {stat.trend === 'stable' && '→'}
                        {stat.trend_value}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/50">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - System Status Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <GlassCard dark className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-semibold text-white">System Status</h3>
                <StatusIndicator
                  status={
                    section.system_status.uptime_percentage >= 99
                      ? 'operational'
                      : section.system_status.uptime_percentage >= 95
                        ? 'degraded'
                        : 'down'
                  }
                  label={
                    section.system_status.uptime_percentage >= 99
                      ? 'All Systems Operational'
                      : 'Degraded Performance'
                  }
                />
              </div>

              {/* Status Metrics */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Service Availability</span>
                  <span className="font-mono text-sm text-white">
                    {section.system_status.operational_services}/
                    {section.system_status.total_services}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(section.system_status.operational_services / section.system_status.total_services) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {section.system_status.uptime_percentage}%
                    </div>
                    <div className="text-xs text-white/50">Uptime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {section.system_status.active_jobs}
                    </div>
                    <div className="text-xs text-white/50">Active Jobs</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm text-white/60">Avg Response Time</span>
                  <span className="font-mono text-sm font-medium text-emerald-400">
                    {section.system_status.response_time}
                  </span>
                </div>

                <div className="text-right text-xs text-white/40">
                  Last updated: {section.system_status.last_updated}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#f8fafc"
          />
        </svg>
      </div>
    </section>
  );
};



// ============================================================================
// ACTIVE SERVICE CARD
// ============================================================================

const ActiveServiceCard: React.FC<{
  service: ServiceCard;
  viewMode: 'grid' | 'list';
  index: number;
}> = ({ service, viewMode, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const renderPricing = () => {
    switch (service.pricing.type) {
      case 'fixed':
        return <span className="text-2xl font-bold text-slate-900">{service.pricing.value}</span>;
      case 'from':
        return (
          <div>
            <span className="text-xs text-slate-500">From</span>
            <span className="ml-1 text-2xl font-bold text-slate-900">{service.pricing.from}</span>
          </div>
        );
      case 'range':
        return (
          <div>
            <span className="text-lg font-bold text-slate-900">{service.pricing.from}</span>
            <span className="mx-1 text-slate-400">-</span>
            <span className="text-lg font-bold text-slate-900">{service.pricing.to}</span>
          </div>
        );
      case 'custom':
        return <span className="text-lg font-semibold text-blue-600">Custom Quote</span>;
      default:
        return null;
    }
  };

  const availabilityStyles = {
    available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    limited: 'bg-amber-50 text-amber-700 border-amber-200',
    unavailable: 'bg-red-50 text-red-700 border-red-200',
  };

  const availabilityLabels = {
    available: 'Available Now',
    limited: 'Limited Slots',
    unavailable: 'Fully Booked',
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        ref={cardRef}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={clsx(
          'group relative overflow-hidden rounded-2xl border bg-white p-6 transition-all duration-500',
          isHovered
            ? 'border-blue-500/50 shadow-xl shadow-blue-500/10'
            : 'border-slate-200 shadow-sm'
        )}
      >
        <div className="flex items-center gap-6">
          {/* Icon */}
          <div
            className={clsx(
              'flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-3xl transition-all duration-300',
              isHovered
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30'
                : 'bg-slate-100'
            )}
          >
            <span className={clsx(isHovered && 'brightness-0 invert')}>{service.icon}</span>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
              {service.is_featured && (
                <TechBadge variant="premium">
                  <span className="text-amber-500">★</span> Featured
                </TechBadge>
              )}
              {service.is_emergency && (
                <TechBadge variant="warning">
                  <span>⚡</span> Emergency
                </TechBadge>
              )}
            </div>
            <p className="text-sm text-slate-600">{service.subtitle}</p>
            <div className="mt-2 flex items-center gap-4">
              <span
                className={clsx(
                  'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                  availabilityStyles[service.availability]
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {availabilityLabels[service.availability]}
              </span>
              <span className="text-sm text-slate-500">
                Response: <span className="font-medium text-slate-700">{service.response_time}</span>
              </span>
              <span className="flex items-center gap-1 text-sm">
                <span className="text-amber-400">★</span>
                <span className="font-medium text-slate-700">{service.rating}</span>
                <span className="text-slate-400">({service.review_count})</span>
              </span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex flex-shrink-0 items-center gap-6">
            <div className="text-right">{renderPricing()}</div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.2 }}
            >
              <button className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800">
                View Specs
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05, type: 'spring', stiffness: 200 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      className={clsx(
        'group relative overflow-hidden rounded-2xl border bg-white transition-all duration-500',
        isHovered
          ? 'border-blue-500/50 shadow-2xl shadow-blue-500/20'
          : 'border-slate-200 shadow-sm'
      )}
    >
      {/* Glow Effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.1), transparent 40%)',
        }}
      />

      {/* Image Header */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={service.image_url}
          alt={service.title}
          className="h-full w-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Tags */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {service.is_featured && (
            <TechBadge variant="premium" size="md">
              <span className="text-amber-500">★</span> Featured
            </TechBadge>
          )}
          {service.is_emergency && (
            <TechBadge variant="warning" size="md">
              <span>⚡</span> Emergency
            </TechBadge>
          )}
        </div>

        {/* Availability */}
        <div className="absolute right-4 top-4">
          <span
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm',
              availabilityStyles[service.availability]
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {availabilityLabels[service.availability]}
          </span>
        </div>

        {/* Icon Overlay */}
        <div className="absolute bottom-4 left-4">
          <motion.div
            className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-2xl backdrop-blur-md"
            animate={{
              backgroundColor: isHovered ? 'rgba(59, 130, 246, 0.9)' : 'rgba(255, 255, 255, 0.1)',
            }}
            transition={{ duration: 0.3 }}
          >
            <span className={clsx(isHovered && 'brightness-0 invert')}>{service.icon}</span>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="mb-1 text-xl font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
            {service.title}
          </h3>
          <p className="text-sm text-slate-500">{service.subtitle}</p>
        </div>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {service.description}
        </p>

        {/* Features */}
        <div className="mb-4 space-y-2">
          {service.features.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              {feature.text}
            </div>
          ))}
        </div>

        {/* Meta Info */}
        <div className="mb-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {service.response_time}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            {service.warranty}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-amber-400">★</span>
            {service.rating}
            <span className="text-slate-400">({service.review_count})</span>
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {renderPricing()}

          <motion.button
            className={clsx(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
              isHovered
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-slate-100 text-slate-700'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Specs
            <motion.svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </motion.svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// SERVICES GRID SECTION
// ============================================================================

const ServicesGridSection: React.FC<{
  section: Sections['services'];
  filteredServices: ServiceCard[];
  viewMode: 'grid' | 'list';
  isLoading: boolean;
}> = ({ section, filteredServices, viewMode, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section ref={containerRef} className="bg-slate-50 py-16" data-component-id="services-grid">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-end justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{section.headline}</h2>
            <p className="mt-2 text-slate-600">{section.subheadline}</p>
          </div>
          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{filteredServices.length}</span>{' '}
            services
          </div>
        </motion.div>

        {/* Services Grid */}
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {filteredServices.length > 0 ? (
              <motion.div
                layout
                className={clsx(
                  'gap-6',
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'flex flex-col'
                )}
              >
                {filteredServices.map((service, index) => (
                  <ActiveServiceCard
                    key={service.id}
                    service={service}
                    viewMode={viewMode}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-16 text-center"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
                  <svg
                    className="h-10 w-10 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">
                  {section.empty_state.headline}
                </h3>
                <p className="mb-6 text-slate-600">{section.empty_state.description}</p>
                <MagneticButton variant="primary">{section.empty_state.cta_text}</MagneticButton>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
};

// ============================================================================
// COMPARISON TABLE SECTION
// ============================================================================

const ComparisonSection: React.FC<{ section: Sections['comparison'] }> = ({ section }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      ) : (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      );
    }
    return <span className="text-sm font-medium text-slate-900">{value}</span>;
  };

  return (
    <section
      ref={containerRef}
      className="bg-gradient-to-b from-slate-50 to-white py-24"
      data-component-id="service-comparison"
    >
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

        {/* Tier Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 grid gap-6 md:grid-cols-3"
        >
          {section.tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + index * 0.1 }}
              onMouseEnter={() => setHoveredTier(tier.id)}
              onMouseLeave={() => setHoveredTier(null)}
              className={clsx(
                'relative overflow-hidden rounded-2xl border p-8 transition-all duration-500',
                tier.is_popular
                  ? 'border-blue-500 bg-gradient-to-b from-blue-50 to-white shadow-xl shadow-blue-500/10'
                  : 'border-slate-200 bg-white',
                hoveredTier === tier.id && !tier.is_popular && 'border-slate-300 shadow-lg'
              )}
            >
              {tier.is_popular && (
                <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-blue-600 to-cyan-500 px-12 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-slate-900">{tier.name}</h3>
                <p className="text-sm text-slate-600">{tier.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">{tier.price_indicator}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <MagneticButton
                variant={tier.is_popular ? 'primary' : 'outline'}
                className="w-full"
              >
                {tier.cta_text}
              </MagneticButton>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    Features
                  </th>
                  {section.tiers.map((tier) => (
                    <th
                      key={tier.id}
                      className={clsx(
                        'px-6 py-4 text-center text-sm font-semibold',
                        tier.is_popular ? 'bg-blue-50 text-blue-900' : 'text-slate-900'
                      )}
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.features.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-sm text-slate-600">{feature.name}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">{renderFeatureValue(feature.basic)}</div>
                    </td>
                    <td className="bg-blue-50/50 px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {renderFeatureValue(feature.standard)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {renderFeatureValue(feature.premium)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// TECH SPECS ACCORDION SECTION
// ============================================================================

const TechSpecsSection: React.FC<{ section: Sections['tech_specs'] }> = ({ section }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('all');

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

  const filteredSpecs = useMemo(() => {
    if (activeCategory === 'all') return section.items;
    return section.items.filter((item) => item.category === activeCategory);
  }, [section.items, activeCategory]);

  const technicalLevelColors = {
    basic: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700',
  };

  return (
    <section
      ref={containerRef}
      className="bg-gradient-to-b from-slate-900 to-slate-950 py-24"
      data-component-id="tech-specs"
    >
      <NoiseOverlay opacity={0.03} />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white">{section.headline}</h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">{section.subheadline}</p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          <button
            onClick={() => setActiveCategory('all')}
            className={clsx(
              'rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
              activeCategory === 'all'
                ? 'bg-white text-slate-900'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            )}
          >
            All Topics
          </button>
          {section.categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={clsx(
                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                activeCategory === category
                  ? 'bg-white text-slate-900'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              )}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Accordion Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredSpecs.map((spec, index) => (
              <motion.div
                key={spec.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <button
                  onClick={() => toggleItem(spec.id)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-4 pr-4">
                    {/* Technical Level Indicator */}
                    <div className="hidden sm:block">
                      <span
                        className={clsx(
                          'rounded-full px-2 py-1 text-xs font-medium',
                          technicalLevelColors[spec.technical_level]
                        )}
                      >
                        {spec.technical_level}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{spec.question}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {spec.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: openItems.has(spec.id) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 text-blue-400"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openItems.has(spec.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/10 px-6 pb-6 pt-4">
                        {/* Answer */}
                        <div className="prose prose-invert mb-6 max-w-none">
                          <p className="whitespace-pre-line leading-relaxed text-white/70">
                            {spec.answer}
                          </p>
                        </div>

                        {/* Related Services */}
                        {spec.related_services.length > 0 && (
                          <div className="border-t border-white/10 pt-4">
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                              Related Services
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {spec.related_services.map((service) => (
                                <a
                                  key={service}
                                  href={`#${service}`}
                                  className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-400 transition-colors hover:bg-blue-500/20"
                                >
                                  {service}
                                  <svg
                                    className="h-3 w-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
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
                    className={clsx(
                      'flex h-full w-full items-center justify-center rounded-full border-2 text-xl transition-all duration-500',
                      index <= activeStep
                        ? 'border-blue-500 bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                        : 'border-slate-300 bg-white text-slate-400'
                    )}
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
                  className={clsx(
                    'rounded-2xl border p-6 text-center transition-all duration-500',
                    index === activeStep
                      ? 'border-blue-500/30 bg-blue-50 shadow-lg'
                      : 'border-slate-200 bg-white'
                  )}
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
};

// ============================================================================
// CTA SECTION
// ============================================================================

const CTASection: React.FC<{ section: Sections['cta']; data: SiteData }> = ({ section, data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 py-24"
      data-component-id="service-cta"
    >
      <NoiseOverlay opacity={0.05} />

      {/* Background Elements */}
      <motion.div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-[100px]"
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-400/20 blur-[100px]"
        animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">{section.headline}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">{section.subheadline}</p>

          {/* Features Grid */}
          <div className="mb-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {section.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="text-sm font-medium text-white">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton
              variant="secondary"
              size="lg"
              className="bg-white text-blue-600 hover:bg-white/90"
            >
              {section.primary_cta}
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              size="lg"
              className="border-2 border-white/50 text-white hover:border-white"
            >
              {section.secondary_cta}
            </MagneticButton>
          </div>
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={clsx(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-500',
        isScrolled ? 'bg-slate-950/90 backdrop-blur-xl' : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
            <span className="text-xl font-bold text-white">T</span>
          </div>
          <div>
            <span className="text-lg font-bold text-white">{data.site_name}</span>
            <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
              Services
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="/" className="text-sm text-white/70 transition-colors hover:text-white">
            Home
          </a>
          <a href="/services" className="text-sm font-medium text-white">
            Services
          </a>
          <a href="/portfolio" className="text-sm text-white/70 transition-colors hover:text-white">
            Portfolio
          </a>
          <a href="/contact" className="text-sm text-white/70 transition-colors hover:text-white">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${data.phone}`}
            className="hidden items-center gap-2 text-sm font-medium text-white md:flex"
          >
            <svg
              className="h-5 w-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {data.phone}
          </a>
          <MagneticButton variant="primary" size="sm">
            Get Quote
          </MagneticButton>
        </div>
      </div>
    </motion.header>
  );
};

// ============================================================================
// SCROLL PROGRESS
// ============================================================================

const ScrollProgress: React.FC = () => {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600"
      style={{ scaleX: progress }}
    />
  );
};

// ============================================================================
// MAIN TEMPLATE COMPONENT
// ============================================================================

export default function ServiceHubTemplate({ data, sections }: ServiceHubTemplateProps) {
  // Filter State
  const [activeCategory, setActiveCategory] = useState(sections.filtering.default_category);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filtered & Sorted Services
  const filteredServices = useMemo(() => {
    let result = [...sections.services.items];

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter((service) => service.category === activeCategory);
    }

    // Filter by search query
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          service.features.some((f) => f.text.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'featured':
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'popular':
        result.sort((a, b) => b.review_count - a.review_count);
        break;
      default:
        break;
    }

    return result;
  }, [sections.services.items, activeCategory, debouncedSearch, sortBy]);

  return (
    <div className="relative min-h-screen bg-slate-50 antialiased">
      <ScrollProgress />
      <FloatingNav data={data} />

      <main>
        <ServiceHubHero section={sections.hero} data={data} />

        <FilteringMatrix
          section={sections.filtering}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <ServicesGridSection
          section={sections.services}
          filteredServices={filteredServices}
          viewMode={viewMode}
          isLoading={false}
        />

        <ComparisonSection section={sections.comparison} />

        <ProcessSection section={sections.process} />

        <TechSpecsSection section={sections.tech_specs} />

        <CTASection section={sections.cta} data={data} />
        
        {/* Headless Form Section */}
        <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" data-component-id="service-hub-form">
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                Get Your Service Quote
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-white/60">
                Tell us about your specific roofing needs and we'll provide a detailed quote
              </p>
            </div>
            
            <HeadlessForm 
              formId="service_hub_form"
              title="Request Service Quote"
              subtitle="Fill out this form to get a personalized quote for your specific roofing needs"
              submitText="Get Quote"
              successMessage="Thank you! Our team will review your request and contact you with a detailed quote."
              trackingPrefix="service_hub_form"
              variant="gradient"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
