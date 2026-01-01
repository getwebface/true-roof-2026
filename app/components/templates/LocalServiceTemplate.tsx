
// LocalServiceTemplate.tsx
// TrueRoof - Local Service Command Center Template (SEO Optimized Edition)
// Enhanced for Local SEO: Semantic HTML, Schema.org integration, and Keyword Density
'use client';
import React, {
useState,
useEffect,
useRef,
useCallback,
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
features: string[];
}
interface LocalProject {
id: string;
title: string;
suburb: string;
image_url: string;
service_type: string;
completion_date: string;
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
website_url: string;
location: {
suburb: string;
region: string;
postcode: string;
state: string;
service_radius_km: number;
latitude?: number;
longitude?: number;
};
}
interface LocalServiceTemplateProps {
data: SiteData;
sections: Sections;
}
// ============================================================================
// SEO HELPER: SCHEMA.ORG JSON-LD
// ============================================================================
const LocalBusinessSchema: React.FC<{ data: SiteData }> = ({ data }) => {
const schema = {
"@context": "https://schema.org",
"@type": "HomeAndConstructionBusiness",
"name": data.site_name,
"image": data.logo_url,
"telephone": data.phone,
"email": data.email,
"url": data.website_url,
"address": {
"@type": "PostalAddress",
"addressLocality": data.location.suburb,
"addressRegion": data.location.state,
"postalCode": data.location.postcode,
"addressCountry": "AU"
},
"areaServed": {
"@type": "GeoCircle",
"geoMidpoint": {
"@type": "GeoCoordinates",
"latitude": data.location.latitude || -37.8136,
"longitude": data.location.longitude || 144.9631
},
"geoRadius": data.location.service_radius_km || 25) * 1000
},
"priceRange": "$"
"
};
return (
<script
type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
);
};
// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================
// Noise Overlay for Texture (High Quality Aesthetic)
const NoiseOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.03 }) => (
<div
className="pointer-events-none absolute inset-0 z-50 select-none"
style={{
backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
opacity,
}}
/>
);
// Map Background (Geographic Context)
const MapTextureBackground: React.FC = () => (
<div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
<svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
<defs>
<pattern id="map-grid" width="100" height="100" patternUnits="userSpaceOnUse">
<path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" />
<circle cx="50" cy="50" r="2" fill="currentColor" opacity="0.3" />
</pattern>
</defs>
<rect width="100%" height="100%" fill="url(#map-grid)" />
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
const config = statusConfig[status];
const sizeClass = size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-3 w-3' : 'h-4 w-4';
return (
<div className="flex items-center gap-2">
<span className="relative flex">
<motion.span
className={clsx('absolute inline-flex h-full w-full rounded-full opacity-75', config.pulseColor)}
animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
transition={{ duration: 2, repeat: Infinity }}
/>
<span className={clsx('relative inline-flex rounded-full', sizeClass, config.color)} />
</span>
{showLabel && (
<span className="font-medium text-white/90 text-sm">{config.label}</span>
)}
</div>
);
};
// Magnetic Button
const MagneticButton: React.FC<{
children: React.ReactNode;
className?: string;
onClick?: () => void;
variant?: 'primary' | 'secondary' | 'danger';
fullWidth?: boolean;
type?: 'button' | 'submit';
disabled?: boolean;
}> = ({ children, className = '', onClick, variant = 'primary', fullWidth = false, type = 'button', disabled = false }) => {
const ref = useRef<HTMLButtonElement>(null);
const x = useMotionValue(0);
const y = useMotionValue(0);
const handleMouseMove = (e: React.MouseEvent) => {
if (!ref.current) return;
const { left, top, width, height } = ref.current.getBoundingClientRect();
x.set((e.clientX - (left + width / 2)) * 0.1);
y.set((e.clientY - (top + height / 2)) * 0.1);
};
const handleMouseLeave = () => {
x.set(0);
y.set(0);
};
const variants = {
primary: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25',
secondary: 'bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20',
danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25',
};
return (
<motion.button
ref={ref}
type={type}
style={{ x, y }}
onMouseMove={handleMouseMove}
onMouseLeave={handleMouseLeave}
onClick={onClick}
disabled={disabled}
className={clsx(
'relative overflow-hidden rounded-xl px-6 py-4 font-bold transition-all',
variants[variant],
fullWidth && 'w-full',
disabled && 'opacity-50 cursor-not-allowed',
className
)}
whileTap={{ scale: 0.95 }}
>
<span className="relative z-10">{children}</span>
</motion.button>
);
};
// Animated Counter
const AnimatedCounter: React.FC<{ value: string; suffix?: string }> = ({ value, suffix = '' }) => {
const ref = useRef<HTMLSpanElement>(null);
const isInView = useInView(ref, { once: true });
const [display, setDisplay] = useState('0');
useEffect(() => {
if (!isInView) return;
const numeric = parseInt(value.replace(/\D/g, ''));
if (isNaN(numeric)) {
setDisplay(value);
return;
}
code
Code
let start = 0;
const duration = 2000;
const startTime = performance.now();

const animate = (currentTime: number) => {
  const elapsed = currentTime - startTime;
  const progress = Math.min(elapsed / duration, 1);
  const ease = 1 - Math.pow(1 - progress, 3); 
  
  const current = Math.floor(ease * numeric);
  setDisplay(current.toLocaleString());

  if (progress < 1) requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
}, [isInView, value]);
return <span ref={ref}>{display}{suffix}</span>;
};
// ============================================================================
// SECTIONS
// ============================================================================
const HeroSection: React.FC<{
section: HeroSection;
leadCapture: LeadCaptureSection;
data: SiteData;
}> = ({ section, leadCapture, data }) => {
const [formState, setFormState] = useState({ loading: false, submitted: false, data: {} as any });
const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setFormState(p => ({ ...p, loading: true }));
// Simulate API
await new Promise(r => setTimeout(r, 1500));
setFormState(p => ({ ...p, loading: false, submitted: true }));
console.log('Lead captured:', formState.data);
};
return (
<section className="relative min-h-[90vh] flex items-center bg-slate-950 pt-24 pb-12 overflow-hidden">
<MapTextureBackground />
<NoiseOverlay opacity={0.04} />
code
Code
{/* Dynamic Background Orbs */}
  <motion.div 
    className="absolute top-0 -left-64 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]"
    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
    transition={{ duration: 20, repeat: Infinity }}
  />
  
  <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
    {/* Weather Alert Banner */}
    <AnimatePresence>
      {section.weather_alert?.active && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className={clsx(
            "mb-8 rounded-lg border px-4 py-3 flex items-center gap-3",
            section.weather_alert.severity === 'danger' ? "bg-red-500/20 border-red-500/30 text-red-200" :
            section.weather_alert.severity === 'warning' ? "bg-amber-500/20 border-amber-500/30 text-amber-200" :
            "bg-blue-500/20 border-blue-500/30 text-blue-200"
          )}
        >
          <span className="text-xl">⚠️</span>
          <p className="text-sm font-medium">
            <strong>{section.weather_alert.type}:</strong> {section.weather_alert.message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
      {/* Left Column: Copy & Live Status */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Status Pill */}
        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-md">
          <LivePulse status={section.live_status.status} />
          <span className="w-px h-4 bg-white/20" />
          <span className="text-sm text-white/60">
            {section.live_status.crews_active} Crews in {data.location.suburb}
          </span>
        </div>

        <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
          {section.headline}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            {section.headline_location}
          </span>
        </h1>

        <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
          {section.subheadline}
        </p>

        {/* Operational Metrics Panel */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-white mb-1">
              {section.live_status.current_wait_time}
            </div>
            <div className="text-xs text-white/50 uppercase tracking-wider">Est. Wait Time</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {section.live_status.availability_today}
            </div>
            <div className="text-xs text-white/50 uppercase tracking-wider">Slots Today</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {section.trust_signals.map((signal, i) => (
            <span key={i} className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 rounded-lg px-3 py-1.5 border border-slate-800">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {signal}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Right Column: Lead Capture Interface */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl">
          <div className="bg-slate-950/50 rounded-xl p-6 lg:p-8">
            {/* Form Header */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">{leadCapture.headline}</h2>
                <p className="text-sm text-slate-400 mt-1">{leadCapture.subheadline}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {!formState.submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {leadCapture.form_fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select 
                        required={field.required}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all appearance-none"
                        onChange={e => setFormState(p => ({ ...p, data: { ...p.data, [field.id]: e.target.value } }))}
                      >
                        <option value="">{field.placeholder}</option>
                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea 
                        rows={3}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        onChange={e => setFormState(p => ({ ...p, data: { ...p.data, [field.id]: e.target.value } }))}
                      />
                    ) : (
                      <input 
                        type={field.type}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        onChange={e => setFormState(p => ({ ...p, data: { ...p.data, [field.id]: e.target.value } }))}
                      />
                    )}
                  </div>
                ))}
                
                {leadCapture.urgency_text && (
                  <div className="flex items-center gap-2 text-amber-400 text-sm py-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {leadCapture.urgency_text}
                  </div>
                )}

                <MagneticButton 
                  type="submit" 
                  fullWidth 
                  disabled={formState.loading}
                >
                  {formState.loading ? 'Processing...' : leadCapture.submit_text}
                </MagneticButton>

                <p className="text-center text-xs text-slate-500 mt-4">
                  {leadCapture.privacy_text}
                </p>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Request Received</h3>
                <p className="text-slate-400">Our {data.location.suburb} team will contact you shortly.</p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>
);
};
// ============================================================================
// LOCAL INTEL SECTION (SEO GOLDMINE)
// ============================================================================
const LocalIntelSection: React.FC<{ section: LocalIntelSection; data: SiteData }> = ({ section, data }) => {
return (
<section className="py-24 bg-slate-50 border-b border-slate-200">
<div className="max-w-7xl mx-auto px-6">
<div className="mb-16">
<h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
{section.headline}
</h2>
<p className="text-lg text-slate-600 max-w-2xl">{section.subheadline}</p>
</div>
code
Code
{/* Stats Grid */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
      {section.stats.map((stat, idx) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          viewport={{ once: true }}
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">{stat.icon}</span>
            {stat.trend && (
              <span className={clsx(
                "text-xs font-medium px-2 py-1 rounded-full",
                stat.trend === 'up' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
              )}>
                {stat.trend === 'up' ? '↗' : '→'} {stat.trend_value}
              </span>
            )}
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </div>

    {/* Common Issues (High SEO Value content) */}
    <div>
      <h3 className="text-xl font-bold text-slate-900 mb-8">Common Issues in {data.location.suburb}</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {section.common_issues.map((issue, idx) => (
          <motion.article 
            key={issue.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (idx * 0.1) }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col h-full"
          >
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-slate-900">{issue.title}</h4>
                <span className={clsx(
                  "text-xs uppercase font-bold px-2 py-1 rounded",
                  issue.severity === 'high' ? "bg-orange-100 text-orange-700" :
                  issue.severity === 'critical' ? "bg-red-100 text-red-700" :
                  "bg-blue-100 text-blue-700"
                )}>
                  {issue.severity}
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {issue.description}
              </p>
            </div>
            
            <div className="mt-auto space-y-3 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Frequency:</span>
                <span className="font-medium text-slate-900">{issue.frequency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Est. Repair:</span>
                <span className="font-medium text-slate-900">{issue.avg_repair_cost}</span>
              </div>
              <div className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-lg mt-2">
                <strong>💡 Pro Tip:</strong> {issue.recommended_action}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </div>
</section>
);
};
// ============================================================================
// TECHNICIAN LOG (E-E-A-T Signal)
// ============================================================================
const TechnicianLogSection: React.FC<{ section: TechnicianLogSection; data: SiteData }> = ({ section, data }) => {
return (
<section className="py-24 bg-slate-950 relative overflow-hidden">
<MapTextureBackground />
<div className="max-w-7xl mx-auto px-6 relative z-10">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
<div>
<div className="flex items-center gap-2 text-emerald-500 mb-2 font-mono text-sm uppercase tracking-wider">
<span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
Field Report
</div>
<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{section.headline}</h2>
<p className="text-slate-400 max-w-xl">{section.subheadline}</p>
</div>
<div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-right">
<div className="text-xs text-slate-500 uppercase">Last Inspection</div>
<div className="text-white font-mono">{section.last_inspection_date}</div>
</div>
</div>
code
Code
{/* Location Summary */}
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-white/10 mb-12">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.809-.983L15 7m0 10V7m0 0L9 7" />
        </svg>
        Area Analysis: {data.location.suburb}
      </h3>
      <p className="text-slate-300 leading-relaxed text-lg">{section.location_summary}</p>
    </div>

    {/* Logs */}
    <div className="space-y-6">
      {section.logs.map((log) => (
        <motion.div 
          key={log.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={clsx(
            "border-l-4 rounded-r-xl bg-white/5 p-6 md:p-8 backdrop-blur-sm",
            log.priority === 'urgent' ? "border-red-500" :
            log.priority === 'recommended' ? "border-amber-500" : "border-emerald-500"
          )}
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Tech Info */}
            <div className="md:w-48 flex-shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                  {log.technician_name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{log.technician_name}</div>
                  <div className="text-slate-500 text-xs">{log.date}</div>
                </div>
              </div>
              <span className={clsx(
                "inline-block px-2 py-1 rounded text-xs font-bold uppercase mt-2",
                log.priority === 'urgent' ? "bg-red-500/20 text-red-400" :
                log.priority === 'recommended' ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
              )}>
                Priority: {log.priority}
              </span>
            </div>

            {/* Log Content */}
            <div className="flex-grow">
              <div className="mb-4">
                <h4 className="text-slate-500 text-xs uppercase tracking-wider mb-1">Observation</h4>
                <p className="text-slate-200">{log.observation}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                <h4 className="text-emerald-500 text-xs uppercase tracking-wider mb-1">Recommendation</h4>
                <p className="text-white text-sm">{log.recommendation}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
);
};
// ============================================================================
// SERVICES (Service Area Pages Logic)
// ============================================================================
const ServicesSection: React.FC<{ section: ServicesSection; data: SiteData }> = ({ section, data }) => {
return (
<section className="py-24 bg-white" id="services">
<div className="max-w-7xl mx-auto px-6">
<div className="text-center mb-16">
<h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{section.headline}</h2>
<p className="text-slate-600 max-w-2xl mx-auto">{section.subheadline}</p>
</div>
code
Code
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {section.services.map((service, idx) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          viewport={{ once: true }}
          className={clsx(
            "group rounded-2xl p-8 border transition-all duration-300 flex flex-col h-full",
            service.available 
              ? "bg-white border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10" 
              : "bg-slate-50 border-slate-100 opacity-60"
          )}
        >
          <div className="flex justify-between items-start mb-6">
            <div className={clsx(
              "h-12 w-12 rounded-xl flex items-center justify-center text-2xl",
              service.available ? "bg-emerald-50 text-emerald-600" : "bg-slate-200 text-slate-400"
            )}>
              {idx === 0 ? '⚡' : idx === 1 ? '🏠' : idx === 2 ? '💧' : '🔧'}
            </div>
            <span className="font-bold text-slate-900">{service.price_from}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
            {service.name}
          </h3>
          <p className="text-slate-600 text-sm mb-6 flex-grow">{service.description}</p>

          <ul className="space-y-2 mb-8">
            {service.features?.map((feature, fIdx) => (
              <li key={fIdx} className="flex items-center gap-2 text-sm text-slate-500">
                <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">
              {service.response_time}
            </span>
            {service.available && (
              <button className="text-emerald-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Book Now →
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
// SOCIAL PROOF (Localized)
// ============================================================================
const SocialProofSection: React.FC<{ section: SocialProofSection; data: SiteData }> = ({ section, data }) => {
return (
<section className="py-24 bg-slate-50 border-t border-slate-200">
<div className="max-w-7xl mx-auto px-6">
<div className="grid lg:grid-cols-2 gap-16 items-center">
{/* Stats Column */}
<div>
<h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{section.headline}</h2>
<p className="text-lg text-slate-600 mb-8">{section.subheadline}</p>
code
Code
<div className="flex gap-8 mb-12">
          <div>
            <div className="text-4xl font-bold text-slate-900">{section.avg_rating}</div>
            <div className="text-slate-500 text-sm">Average Rating</div>
            <div className="flex text-amber-400 mt-1">⭐⭐⭐⭐⭐</div>
          </div>
          <div className="w-px bg-slate-300" />
          <div>
            <div className="text-4xl font-bold text-slate-900">{section.total_jobs_in_area}</div>
            <div className="text-slate-500 text-sm">Jobs in {data.location.suburb}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {section.recent_projects.slice(0, 2).map((proj) => (
            <div key={proj.id} className="relative rounded-xl overflow-hidden aspect-video group">
              <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <div className="text-white font-bold text-sm">{proj.title}</div>
                <div className="text-white/60 text-xs">{proj.suburb}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Column */}
      <div className="space-y-6">
        {section.testimonials.map((test, idx) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="flex gap-1 text-amber-400 mb-4">
              {[...Array(test.rating)].map((_, i) => <span key={i}>★</span>)}
            </div>
            <p className="text-slate-700 italic mb-4">"{test.quote}"</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{test.author}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  {test.suburb} {test.verified && <span className="text-emerald-600 bg-emerald-50 px-1 rounded">✓ Verified</span>}
                </div>
              </div>
              <div className="text-xs text-slate-400">{test.service_type}</div>
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
// MOBILE THUMB ZONE & CTA
// ============================================================================
const MobileStickyCTA: React.FC<{ section: MobileCtaSection; phone: string }> = ({ section, phone }) => {
const [visible, setVisible] = useState(false);
useEffect(() => {
const handleScroll = () => setVisible(window.scrollY > 400);
window.addEventListener('scroll', handleScroll);
return () => window.removeEventListener('scroll', handleScroll);
}, []);
return (
<AnimatePresence>
{visible && (
<motion.div
initial={{ y: 100 }}
animate={{ y: 0 }}
exit={{ y: 100 }}
transition={{ type: "spring", stiffness: 300, damping: 30 }}
className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-slate-200 z-50 lg:hidden pb-[max(1rem,env(safe-area-inset-bottom))]"
>
<div className="flex gap-3">
<a
href={tel:${phone}}
className="flex-1 bg-red-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-95 transition-transform"
>
<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
</svg>
{section.call_text}
</a>
<button className="flex-1 bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-transform">
{section.book_text}
</button>
</div>
</motion.div>
)}
</AnimatePresence>
);
};
// ============================================================================
// MAIN LAYOUT
// ============================================================================
export default function LocalServiceTemplate({ data, sections }: LocalServiceTemplateProps) {
return (
<div className="bg-slate-50 min-h-screen font-sans selection:bg-emerald-500/30">
<LocalBusinessSchema data={data} />
code
Code
<main>
    <HeroSection section={sections.hero} leadCapture={sections.lead_capture} data={data} />
    <LocalIntelSection section={sections.local_intel} data={data} />
    <TechnicianLogSection section={sections.technician_log} data={data} />
    <ServicesSection section={sections.services} data={data} />
    <SocialProofSection section={sections.social_proof} data={data} />
    
    {/* Emergency Footer Strip */}
    <section className="bg-red-700 py-12 relative overflow-hidden">
      <NoiseOverlay opacity={0.05} />
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">{sections.emergency.headline}</h2>
        <p className="text-red-100 mb-8 max-w-2xl mx-auto">{sections.emergency.subheadline}</p>
        <a href={`tel:${data.phone}`} className="inline-block bg-white text-red-700 font-bold text-xl px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition-transform">
          Call {sections.emergency.phone}
        </a>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-red-100">
          {sections.emergency.features.map((feat, i) => (
            <span key={i} className="flex items-center gap-1">
              ✓ {feat}
            </span>
          ))}
        </div>
      </div>
    </section>
  </main>

  <MobileStickyCTA section={sections.mobile_cta} phone={data.phone} />
  
  {/* Simple Footer */}
  <footer className="bg-slate-950 py-12 border-t border-white/10">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-white font-bold text-xl">{data.site_name}</div>
      <div className="text-slate-500 text-sm">
        © {new Date().getFullYear()} {data.site_name}. Serving {data.location.suburb} & {data.location.region}.
      </div>
    </div>
  </footer>
</div>
);
}
