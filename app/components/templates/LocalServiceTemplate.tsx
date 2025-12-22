// LocalServiceTemplate.tsx
// TrueRoof - Local Service Command Center Template
// High-conversion local landing page with live status monitoring aesthetic

'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import clsx from 'clsx';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface LiveStatus {
  status: 'active' | 'standby' | 'busy';
  crews_active: number;
  last_job_completed: string;
  current_wait_time: string;
  availability_today: number;
  next_available_slot: string;
}

interface LocalStat {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
  trend_value?: string;
  description?: string;
}

interface CommonIssue {
  id: string;
  title: string;
  frequency: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommended_action: string;
  avg_repair_cost: string;
}

interface TechnicianLog {
  id: string;
  date: string;
  technician_name: string;
  technician_avatar?: string;
  observation: string;
  recommendation: string;
  priority: 'routine' | 'recommended' | 'urgent';
  affected_percentage: string;
}

interface LocalTestimonial {
  id: string;
  quote: string;
  author: string;
  suburb: string;
  street_reference?: string;
  service_type: string;
  rating: number;
  date: string;
  verified: boolean;
}

interface ServiceAvailable {
  id: string;
  name: string;
  description: string;
  response_time: string;
  available: boolean;
  price_from: string;
}

interface LocalProject {
  id: string;
  title: string;
  suburb: string;
  image_url: string;
  service_type: string;
  completion_date: string;
  before_image?: string;
  after_image?: string;
}

interface WeatherAlert {
  active: boolean;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
}

interface HeroSection {
  headline: string;
  headline_location: string;
  subheadline: string;
  live_status: LiveStatus;
  trust_signals: string[];
  emergency_notice?: string;
  weather_alert?: WeatherAlert;
}

interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
}

interface LeadCaptureSection {
  headline: string;
  subheadline: string;
  form_fields: FormField[];
  submit_text: string;
  privacy_text: string;
  urgency_text?: string;
  guarantee_badge?: string;
}

interface LocalIntelSection {
  headline: string;
  subheadline: string;
  stats: LocalStat[];
  common_issues: CommonIssue[];
}

interface TechnicianLogSection {
  headline: string;
  subheadline: string;
  location_summary: string;
  logs: TechnicianLog[];
  last_inspection_date: string;
}

interface ServicesSection {
  headline: string;
  subheadline: string;
  services: ServiceAvailable[];
}

interface SocialProofSection {
  headline: string;
  subheadline: string;
  testimonials: LocalTestimonial[];
  recent_projects: LocalProject[];
  total_jobs_in_area: number;
  avg_rating: number;
  review_count: number;
}

interface EmergencySection {
  headline: string;
  subheadline: string;
  phone: string;
  features: string[];
  available_hours: string;
}

interface MobileCtaSection {
  call_text: string;
  book_text: string;
  phone: string;
}

interface Sections {
  hero: HeroSection;
  lead_capture: LeadCaptureSection;
  local_intel: LocalIntelSection;
  technician_log: TechnicianLogSection;
  services: ServicesSection;
  social_proof: SocialProofSection;
  emergency: EmergencySection;
  mobile_cta: MobileCtaSection;
}

interface SiteData {
  site_name: string;
  tagline: string;
  phone: string;
  email: string;
  logo_url: string;
  location: {
    suburb: string;
    region: string;
    postcode: string;
    state: string;
    service_radius_km: number;
  };
}

interface LocalServiceTemplateProps {
  data: SiteData;
  sections: Sections;
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return smoothProgress;
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const useHasScrolled = (threshold: number = 100) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return hasScrolled;
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

// Map Texture Background
const MapTextureBackground: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="map-grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="2" fill="currentColor" opacity="0.3" />
        </pattern>
        <pattern id="map-roads" width="200" height="200" patternUnits="userSpaceOnUse">
          <path d="M 0 100 L 200 100 M 100 0 L 100 200" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 0 50 L 200 50 M 0 150 L 200 150 M 50 0 L 50 200 M 150 0 L 150 200" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#map-grid)" />
      <rect width="100%" height="100%" fill="url(#map-roads)" />
    </svg>
  </div>
);

// Live Pulse Indicator
const LivePulse: React.FC<{
  status: 'active' | 'standby' | 'busy';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}> = ({ status, size = 'md', showLabel = true }) => {
  const statusConfig = {
    active: { color: 'bg-emerald-500', label: 'Live', pulseColor: 'bg-emerald-400' },
    standby: { color: 'bg-amber-500', label: 'Standby', pulseColor: 'bg-amber-400' },
    busy: { color: 'bg-red-500', label: 'Busy', pulseColor: 'bg-red-400' },
  };

  const sizeConfig = {
    sm: { dot: 'h-2 w-2', text: 'text-xs' },
    md: { dot: 'h-3 w-3', text: 'text-sm' },
    lg: { dot: 'h-4 w-4', text: 'text-base' },
  };

  const config = statusConfig[status];
  const sizes = sizeConfig[size];

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex">
        <motion.span
          className={clsx('absolute inline-flex h-full w-full rounded-full opacity-75', config.pulseColor)}
          animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className={clsx('relative inline-flex rounded-full', sizes.dot, config.color)} />
      </span>
      {showLabel && (
        <span className={clsx('font-medium text-white/90', sizes.text)}>{config.label}</span>
      )}
    </div>
  );
};

// Status Badge
const StatusBadge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  pulse?: boolean;
}> = ({ children, variant = 'neutral', pulse = false }) => {
  const variants = {
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    neutral: 'bg-white/10 text-white/70 border-white/20',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium',
        variants[variant]
      )}
    >
      {pulse && <LivePulse status="active" size="sm" showLabel={false} />}
      {children}
    </span>
  );
};

// Magnetic Button
const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({
  children,
  className = '',
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!buttonRef.current || disabled) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.1);
      y.set((e.clientY - centerY) * 0.1);
    },
    [x, y, disabled]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const variants = {
    primary: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40',
    secondary: 'bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40',
    ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        'relative overflow-hidden rounded-xl font-semibold transition-all duration-300',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      {!disabled && (
        <motion.div
          className="absolute inset-0 -z-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}
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
  const isInView = useInView(ref, { once: true, margin: '-50px' });
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
      {displayValue}
      {suffix}
    </span>
  );
};

// ============================================================================
// HERO SECTION - THE LIVE COMMAND CENTER
// ============================================================================

const HeroSection: React.FC<{
  section: HeroSection;
  leadCapture: LeadCaptureSection;
  data: SiteData;
}> = ({ section, leadCapture, data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Form State
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    console.log('Form Submission Payload:', {
      ...formData,
      location: data.location,
      timestamp: new Date().toISOString(),
      source: 'local_landing_page',
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    >
      {/* Map Texture Background */}
      <MapTextureBackground />

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute -left-64 top-0 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[150px]"
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-64 bottom-0 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[150px]"
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
      />

      <NoiseOverlay opacity={0.04} />

      {/* Weather Alert Banner */}
      <AnimatePresence>
        {section.weather_alert?.active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={clsx(
              'relative z-20 border-b px-6 py-3',
              section.weather_alert.severity === 'danger' && 'border-red-500/30 bg-red-500/20',
              section.weather_alert.severity === 'warning' && 'border-amber-500/30 bg-amber-500/20',
              section.weather_alert.severity === 'info' && 'border-blue-500/30 bg-blue-500/20'
            )}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-3">
              <span className="text-lg">
                {section.weather_alert.severity === 'danger' && '⚠️'}
                {section.weather_alert.severity === 'warning' && '🌧️'}
                {section.weather_alert.severity === 'info' && 'ℹ️'}
              </span>
              <span className="text-sm font-medium text-white">
                <strong>{section.weather_alert.type}:</strong> {section.weather_alert.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-24"
      >
        {/* Top Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <StatusBadge variant="success" pulse>
              {section.live_status.crews_active} Crews Active in {data.location.suburb}
            </StatusBadge>
            <span className="hidden text-sm text-white/50 md:inline">
              Last job completed: {section.live_status.last_job_completed}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {data.location.suburb}, {data.location.state} {data.location.postcode}
          </div>
        </motion.div>

        {/* Main Content - Split Layout */}
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Left Side - Headlines & Status */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Emergency Badge */}
            {section.emergency_notice && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  {section.emergency_notice}
                </span>
              </motion.div>
            )}

            {/* Main Headline */}
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              {section.headline}
              <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 bg-clip-text text-transparent">
                {section.headline_location}
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-white/60">
              {section.subheadline}
            </p>

            {/* Live Status Panel */}
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-white">Live Status Monitor</h3>
                <LivePulse status={section.live_status.status} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 p-4">
                  <div className="text-2xl font-bold text-white">
                    {section.live_status.current_wait_time}
                  </div>
                  <div className="text-xs text-white/50">Current Wait Time</div>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <div className="text-2xl font-bold text-emerald-400">
                    {section.live_status.availability_today}
                  </div>
                  <div className="text-xs text-white/50">Slots Available Today</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                <span className="text-white/50">Next Available Slot</span>
                <span className="font-medium text-emerald-400">
                  {section.live_status.next_available_slot}
                </span>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-3">
              {section.trust_signals.map((signal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70"
                >
                  <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {signal}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Lead Capture Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
              {/* Form Header - Software Interface Style */}
              <div className="border-b border-white/10 bg-white/5 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="h-3 w-3 rounded-full bg-amber-500" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-white/70">
                      availability_check.exe
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-400">Connected</span>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                {!isSubmitted ? (
                  <>
                    <div className="mb-6">
                      <h2 className="mb-1 text-xl font-bold text-white">{leadCapture.headline}</h2>
                      <p className="text-sm text-white/60">{leadCapture.subheadline}</p>
                    </div>

                    {leadCapture.urgency_text && (
                      <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                        <svg className="h-5 w-5 flex-shrink-0 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium text-amber-300">
                          {leadCapture.urgency_text}
                        </span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {leadCapture.form_fields.map((field) => (
                        <div key={field.id}>
                          <label className="mb-1.5 block text-sm font-medium text-white/70">
                            {field.label}
                            {field.required && <span className="ml-1 text-red-400">*</span>}
                          </label>
                          {field.type === 'select' ? (
                            <select
                              value={formData[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              required={field.required}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all duration-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            >
                              <option value="" className="bg-slate-900">
                                {field.placeholder}
                              </option>
                              {field.options?.map((option) => (
                                <option key={option} value={option} className="bg-slate-900">
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              value={formData[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              placeholder={field.placeholder}
                              required={field.required}
                              rows={3}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all duration-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                          ) : (
                            <input
                              type={field.type}
                              value={formData[field.id] || ''}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              placeholder={field.placeholder}
                              required={field.required}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 transition-all duration-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                          )}
                        </div>
                      ))}

                      <MagneticButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          leadCapture.submit_text
                        )}
                      </MagneticButton>

                      {leadCapture.guarantee_badge && (
                        <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                          <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          {leadCapture.guarantee_badge}
                        </div>
                      )}

                      <p className="text-center text-xs text-white/40">
                        {leadCapture.privacy_text}
                      </p>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20"
                    >
                      <svg className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                    <h3 className="mb-2 text-xl font-bold text-white">Request Received!</h3>
                    <p className="mb-4 text-white/60">
                      Our team in {data.location.suburb} will contact you within{' '}
                      <span className="font-medium text-emerald-400">15 minutes</span>.
                    </p>
                    <p className="text-sm text-white/40">
                      Reference: #TRF-{Date.now().toString(36).toUpperCase()}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
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
// LOCAL INTEL GRID SECTION
// ============================================================================

const LocalIntelSection: React.FC<{ section: LocalIntelSection; data: SiteData }> = ({
  section,
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const severityConfig = {
    low: { color: 'text-emerald-600 bg-emerald-100', label: 'Low Risk' },
    medium: { color: 'text-amber-600 bg-amber-100', label: 'Medium Risk' },
    high: { color: 'text-orange-600 bg-orange-100', label: 'High Risk' },
    critical: { color: 'text-red-600 bg-red-100', label: 'Critical' },
  };

  return (
    <section ref={containerRef} className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg">
              📊
            </span>
            <h2 className="text-3xl font-bold text-slate-900">{section.headline}</h2>
          </div>
          <p className="max-w-2xl text-slate-600">{section.subheadline}</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {section.stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-3xl">{stat.icon}</span>
                {stat.trend && (
                  <span
                    className={clsx(
                      'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                      stat.trend === 'up' && 'bg-emerald-100 text-emerald-700',
                      stat.trend === 'down' && 'bg-red-100 text-red-700',
                      stat.trend === 'stable' && 'bg-slate-100 text-slate-700'
                    )}
                  >
                    {stat.trend === 'up' && '↑'}
                    {stat.trend === 'down' && '↓'}
                    {stat.trend === 'stable' && '→'}
                    {stat.trend_value}
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-slate-900">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              {stat.description && (
                <div className="mt-2 text-xs text-slate-400">{stat.description}</div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Common Issues */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="mb-6 text-xl font-semibold text-slate-900">
            Common Issues in {data.location.suburb}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {section.common_issues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h4 className="font-semibold text-slate-900">{issue.title}</h4>
                  <span
                    className={clsx(
                      'rounded-full px-2 py-1 text-xs font-medium',
                      severityConfig[issue.severity].color
                    )}
                  >
                    {severityConfig[issue.severity].label}
                  </span>
                </div>
                <p className="mb-4 text-sm text-slate-600">{issue.description}</p>
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Frequency</span>
                    <span className="font-medium text-slate-900">{issue.frequency}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Avg Repair Cost</span>
                    <span className="font-medium text-slate-900">{issue.avg_repair_cost}</span>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-emerald-50 p-3">
                  <span className="text-xs font-medium text-emerald-700">
                    💡 {issue.recommended_action}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// TECHNICIAN'S LOG SECTION
// ============================================================================

const TechnicianLogSection: React.FC<{ section: TechnicianLogSection; data: SiteData }> = ({
  section,
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const priorityConfig = {
    routine: { color: 'border-slate-300 bg-slate-50', badge: 'text-slate-600 bg-slate-100' },
    recommended: { color: 'border-amber-300 bg-amber-50', badge: 'text-amber-700 bg-amber-100' },
    urgent: { color: 'border-red-300 bg-red-50', badge: 'text-red-700 bg-red-100' },
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 py-24"
    >
      <MapTextureBackground />
      <NoiseOverlay opacity={0.03} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-lg">
              📋
            </span>
            <h2 className="text-3xl font-bold text-white">{section.headline}</h2>
          </div>
          <p className="max-w-2xl text-white/60">{section.subheadline}</p>
        </motion.div>

        {/* Field Report Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
        >
          {/* Report Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="text-sm text-white/40">FIELD ANALYSIS REPORT</div>
              <h3 className="text-xl font-semibold text-white">
                {data.location.suburb} Area Assessment
              </h3>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/40">Last Inspection</div>
              <div className="font-mono text-emerald-400">{section.last_inspection_date}</div>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-8 rounded-xl bg-white/5 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-white">Location Summary</h4>
                <p className="leading-relaxed text-white/70">{section.location_summary}</p>
              </div>
            </div>
          </div>

          {/* Log Entries */}
          <div className="space-y-4">
            {section.logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={clsx(
                  'rounded-xl border-l-4 p-6',
                  priorityConfig[log.priority].color
                )}
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                      {log.technician_avatar ? (
                        <img
                          src={log.technician_avatar}
                          alt={log.technician_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-300 text-sm font-medium text-slate-600">
                          {log.technician_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{log.technician_name}</div>
                      <div className="text-sm text-slate-500">{log.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={clsx(
                        'rounded-full px-3 py-1 text-xs font-medium capitalize',
                        priorityConfig[log.priority].badge
                      )}
                    >
                      {log.priority}
                    </span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {log.affected_percentage} of homes
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Observation
                    </div>
                    <p className="text-slate-700">{log.observation}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-100 p-4">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                      Recommendation
                    </div>
                    <p className="text-emerald-800">{log.recommendation}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// SERVICES AVAILABLE SECTION
// ============================================================================

const ServicesAvailableSection: React.FC<{ section: ServicesSection; data: SiteData }> = ({
  section,
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section ref={containerRef} className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-slate-900">{section.headline}</h2>
          <p className="mx-auto max-w-2xl text-slate-600">{section.subheadline}</p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {section.services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index }}
              className={clsx(
                'group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300',
                service.available
                  ? 'border-slate-200 bg-white hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10'
                  : 'border-slate-100 bg-slate-50 opacity-60'
              )}
            >
              {/* Availability Badge */}
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={clsx(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                    service.available
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-200 text-slate-500'
                  )}
                >
                  <span
                    className={clsx(
                      'h-1.5 w-1.5 rounded-full',
                      service.available ? 'bg-emerald-500' : 'bg-slate-400'
                    )}
                  />
                  {service.available ? 'Available' : 'Unavailable'}
                </span>
                <span className="text-sm font-semibold text-slate-900">{service.price_from}</span>
              </div>

              <h3 className="mb-2 text-xl font-semibold text-slate-900 transition-colors group-hover:text-emerald-600">
                {service.name}
              </h3>
              <p className="mb-4 text-sm text-slate-600">{service.description}</p>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {service.response_time}
                </div>
                {service.available && (
                  <button className="flex items-center gap-1 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700">
                    Book Now
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// SOCIAL PROOF SECTION
// ============================================================================

const SocialProofSection: React.FC<{ section: SocialProofSection; data: SiteData }> = ({
  section,
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % section.testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [section.testimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={clsx('h-5 w-5', i < rating ? 'text-amber-400' : 'text-slate-200')}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section ref={containerRef} className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-slate-900">{section.headline}</h2>
          <p className="mx-auto max-w-2xl text-slate-600">{section.subheadline}</p>

          {/* Stats Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">
                <AnimatedCounter value={section.total_jobs_in_area.toString()} suffix="+" />
              </div>
              <div className="text-sm text-slate-500">Jobs in {data.location.suburb}</div>
            </div>
            <div className="h-12 w-px bg-slate-200" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-slate-900">
                {section.avg_rating}
                <svg className="h-7 w-7 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-sm text-slate-500">Average Rating</div>
            </div>
            <div className="h-12 w-px bg-slate-200" />
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">
                <AnimatedCounter value={section.review_count.toString()} />
              </div>
              <div className="text-sm text-slate-500">Verified Reviews</div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-3xl"
            >
              <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                {/* Quote Icon */}
                <svg
                  className="absolute -left-4 -top-4 h-12 w-12 text-emerald-500/20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <div className="mb-4 flex">{renderStars(section.testimonials[activeTestimonial].rating)}</div>

                <blockquote className="mb-6 text-xl leading-relaxed text-slate-700">
                  "{section.testimonials[activeTestimonial].quote}"
                </blockquote>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {section.testimonials[activeTestimonial].author}
                      </span>
                      {section.testimonials[activeTestimonial].verified && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">
                      {section.testimonials[activeTestimonial].suburb}
                      {section.testimonials[activeTestimonial].street_reference &&
                        ` • ${section.testimonials[activeTestimonial].street_reference}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                      {section.testimonials[activeTestimonial].service_type}
                    </span>
                    <div className="mt-1 text-xs text-slate-400">
                      {section.testimonials[activeTestimonial].date}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Testimonial Navigation */}
          <div className="mt-6 flex justify-center gap-2">
            {section.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={clsx(
                  'h-2 rounded-full transition-all duration-300',
                  index === activeTestimonial ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-300 hover:bg-slate-400'
                )}
              />
            ))}
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="mb-6 text-center text-xl font-semibold text-slate-900">
            Recent Projects in {data.location.suburb}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {section.recent_projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl"
              >
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="font-semibold text-white">{project.title}</h4>
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>{project.service_type}</span>
                    <span>{project.completion_date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// EMERGENCY SECTION
// ============================================================================

const EmergencySection: React.FC<{ section: EmergencySection; data: SiteData }> = ({
  section,
  data,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-800 py-20"
    >
      <NoiseOverlay opacity={0.05} />

      {/* Animated Background */}
      <motion.div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-[100px]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          {/* Content */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
              </span>
              <span className="text-sm font-medium text-white">24/7 Emergency Service</span>
            </div>

            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">{section.headline}</h2>
            <p className="mb-8 text-lg text-white/80">{section.subheadline}</p>

            <div className="mb-8 grid grid-cols-2 gap-4">
              {section.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-white/90">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>

            <div className="text-sm text-white/60">{section.available_hours}</div>
          </div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm"
          >
            <div className="mb-6 text-center">
              <div className="mb-2 text-5xl font-bold text-white">{section.phone}</div>
              <div className="text-white/60">Emergency Hotline</div>
            </div>

            <a
              href={`tel:${section.phone.replace(/\s/g, '')}`}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-4 text-lg font-bold text-red-600 transition-all duration-300 hover:bg-white/90 hover:shadow-lg"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call Now
            </a>

            <p className="mt-4 text-center text-sm text-white/50">
              Average response time: <span className="font-semibold text-white">Under 60 minutes</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================================
// MOBILE THUMB ZONE - STICKY BOTTOM BAR
// ============================================================================

const MobileThumbZone: React.FC<{ section: MobileCtaSection; data: SiteData }> = ({
  section,
  data,
}) => {
  const hasScrolled = useHasScrolled(300);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {hasScrolled && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 p-4 backdrop-blur-xl"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="flex gap-3">
            {/* Call Now Button */}
            <a
              href={`tel:${section.phone.replace(/\s/g, '')}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 py-4 font-semibold text-white shadow-lg shadow-red-500/30 transition-all duration-300 active:scale-95"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {section.call_text}
            </a>

            {/* Book Online Button */}
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-4 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 active:scale-95">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {section.book_text}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// FLOATING NAVIGATION
// ============================================================================

const FloatingNav: React.FC<{ data: SiteData }> = ({ data }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={clsx(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-500',
        isScrolled ? 'bg-slate-950/90 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
            <span className="text-xl font-bold text-white">T</span>
          </div>
          <div>
            <span className="text-lg font-bold text-white">{data.site_name}</span>
            <span className="ml-2 hidden rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400 sm:inline">
              {data.location.suburb}
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <a href={`tel:${data.phone}`} className="flex items-center gap-2 text-white">
            <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="font-medium">{data.phone}</span>
          </a>
          <MagneticButton variant="primary" size="sm">
            Get Free Quote
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
      className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-600"
      style={{ scaleX: progress }}
    />
  );
};

// ============================================================================
// MAIN TEMPLATE COMPONENT (THE CRITICAL FIX)
// ============================================================================

export default function LocalServiceTemplate({ data, sections }) {
  
  // --- 1. DEFENSIVE DATA NORMALIZATION ---
  // The database might pass 'data' inside 'sections' depending on the query structure.
  // We normalize it here so the rest of the component doesn't crash.
  
  const safeData = data || sections?.data || { 
    location: { suburb: "Local Area", state: "VIC" },
    site_name: "TrueRoof",
    phone: "1300 000 000"
  };

  const safeSections = sections?.sections || sections || {};
  
  // Ensure every section object exists to prevent "Cannot read x of undefined"
  const s = {
    hero: safeSections.hero || { live_status: {}, trust_signals: [] },
    lead_capture: safeSections.lead_capture || { form_fields: [] },
    local_intel: safeSections.local_intel || { stats: [], common_issues: [] },
    technician_log: safeSections.technician_log || { logs: [] },
    services: safeSections.services || { services: [] },
    social_proof: safeSections.social_proof || { testimonials: [], recent_projects: [] },
    emergency: safeSections.emergency || { features: [] },
    mobile_cta: safeSections.mobile_cta || {}
  };

  // --- 2. RENDER ---
  return (
    <div className="relative min-h-screen bg-white antialiased">
      {/* Scroll Progress Bar */}
      <motion.div className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-emerald-500" style={{ scaleX: 0 }} />
      
      {/* Floating Nav */}
      <header className="fixed top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md p-4">
         <div className="mx-auto flex max-w-7xl justify-between items-center text-white">
            <div className="font-bold text-xl">TrueRoof <span className="text-emerald-400 text-sm font-normal">{safeData.location.suburb} Ops</span></div>
            <a href={`tel:${safeData.phone}`} className="font-bold hover:text-emerald-400">{safeData.phone}</a>
         </div>
      </header>

      <main className="pb-20 md:pb-0">
        <HeroSection section={s.hero} leadCapture={s.lead_capture} data={safeData} />
        
        {/* Pass normalized props to other sections (Simplified for stability) */}
        {/* Local Intel */}
        <section className="bg-slate-50 py-24 px-6">
           <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold mb-12">{s.local_intel.headline}</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 {s.local_intel.stats.map(stat => (
                    <div key={stat.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                       <div className="text-3xl mb-2">{stat.icon}</div>
                       <div className="text-2xl font-bold">{stat.value}{stat.suffix}</div>
                       <div className="text-sm text-slate-500">{stat.label}</div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Technician Log */}
        <section className="bg-slate-900 py-24 px-6 text-white">
           <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                 <span className="text-4xl">📋</span>
                 <div>
                    <h2 className="text-3xl font-bold">{s.technician_log.headline}</h2>
                    <p className="text-white/60">{s.technician_log.location_summary}</p>
                 </div>
              </div>
              <div className="space-y-4">
                 {s.technician_log.logs.map(log => (
                    <div key={log.id} className="bg-white/10 p-6 rounded-xl border-l-4 border-emerald-500">
                       <div className="flex justify-between mb-2">
                          <span className="font-bold">{log.technician_name}</span>
                          <span className="text-sm opacity-50">{log.date}</span>
                       </div>
                       <p className="text-white/80">{log.observation}</p>
                       <div className="mt-4 text-emerald-400 text-sm font-bold">Recommended: {log.recommendation}</div>
                    </div>
                 ))}
              </div>
           </div>
        </section>

      </main>
