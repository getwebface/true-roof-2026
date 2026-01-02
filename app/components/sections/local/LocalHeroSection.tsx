// LocalHeroSection.tsx
// Hero area with form for local service pages
'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { trackConversion } from '~/lib/tracking/behaviorTracker';
import { getLogger } from '~/lib/logging/logger';
import NoiseOverlay from '~/components/sections/shared/NoiseOverlay';
import MapTextureBackground from '~/components/sections/shared/MapTextureBackground';
import ServiceStatusIndicator from '~/components/sections/shared/ServiceStatusIndicator';
import MagneticButton from '~/components/sections/shared/MagneticButton';

// Type definitions
interface ServiceStatus {
  status: 'available' | 'limited' | 'booked';
  teams_available: number;
  last_inspection_completed: string;
  next_available_slot: string;
  availability_today: number;
  estimated_wait_time: string;
}

interface WeatherAlert {
  active: boolean;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
}

interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
}

interface HeroSection {
  headline: string;
  headline_location: string;
  subheadline: string;
  service_status: ServiceStatus;
  trust_signals: string[];
  service_notice?: string;
  weather_alert?: WeatherAlert;
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

interface LocalHeroSectionProps {
  section?: HeroSection;
  leadCapture?: LeadCaptureSection;
  data?: SiteData;
}

const LocalHeroSection: React.FC<LocalHeroSectionProps> = ({ section, leadCapture, data }) => {
  const [formState, setFormState] = useState({ loading: false, submitted: false, data: {} as any });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(p => ({ ...p, loading: true }));
    // Simulate API
    await new Promise(r => setTimeout(r, 1500));
    setFormState(p => ({ ...p, loading: false, submitted: true }));

    const logger = getLogger();
    logger?.info('client', 'Lead captured successfully', {
      formData: formState.data,
      location: safeData?.location?.suburb
    });

    // Track conversion
    trackConversion('lead_capture_form', 'submit_success', 1);
  };

  // Safe data access with fallbacks
  const safeSection = section ?? {
    headline: 'Local Roofing Services',
    headline_location: 'Your Area',
    subheadline: 'Professional roofing solutions for your community',
    service_status: {
      status: 'available' as const,
      teams_available: 0,
      last_inspection_completed: 'N/A',
      next_available_slot: 'N/A',
      availability_today: 0,
      estimated_wait_time: 'N/A'
    },
    trust_signals: ['Licensed & Insured', 'Free Quotes', 'Same-Day Service'],
    service_notice: undefined,
    weather_alert: undefined
  };

  const safeLeadCapture = leadCapture ?? {
    headline: 'Get Your Free Quote',
    subheadline: 'Schedule your inspection today',
    form_fields: [],
    submit_text: 'Request Quote',
    privacy_text: 'Your information is secure',
    urgency_text: undefined,
    guarantee_badge: undefined
  };

  const safeData = data ?? {
    site_name: 'Service Provider',
    tagline: '',
    phone: '',
    email: '',
    logo_url: '',
    website_url: '',
    location: {
      suburb: 'Local Area',
      region: '',
      postcode: '',
      state: '',
      service_radius_km: 25,
      latitude: undefined,
      longitude: undefined
    }
  };

  const serviceStatus = safeSection?.service_status ?? {
    status: 'available' as const,
    teams_available: 0,
    last_inspection_completed: 'N/A',
    next_available_slot: 'N/A',
    availability_today: 0,
    estimated_wait_time: 'N/A'
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-slate-950 pt-24 pb-12 overflow-hidden" data-component-id="local-service-hero">
      <MapTextureBackground />
      <NoiseOverlay opacity={0.04} />

      {/* Dynamic Background Orbs */}
      <motion.div
        className="absolute top-0 -left-64 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Weather Alert Banner */}
        <AnimatePresence>
          {safeSection?.weather_alert?.active && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className={clsx(
                "mb-8 rounded-lg border px-4 py-3 flex items-center gap-3",
                safeSection.weather_alert?.severity === 'danger' ? "bg-red-500/20 border-red-500/30 text-red-200" :
                safeSection.weather_alert?.severity === 'warning' ? "bg-amber-500/20 border-amber-500/30 text-amber-200" :
                "bg-blue-500/20 border-blue-500/30 text-blue-200"
              )}
            >
              <span className="text-xl">⚠️</span>
              <p className="text-sm font-medium">
                <strong>{safeSection.weather_alert?.type ?? 'Alert'}:</strong> {safeSection.weather_alert?.message ?? ''}
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
              <ServiceStatusIndicator status={serviceStatus?.status} />
              <span className="w-px h-4 bg-white/20" />
              <span className="text-sm text-white/60">
                {serviceStatus?.teams_available ?? 0} Teams in {safeData?.location?.suburb ?? 'Local Area'}
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              {safeSection?.headline ?? 'Local Roofing Services'}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
                {safeSection?.headline_location ?? 'Your Area'}
              </span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
              {safeSection?.subheadline ?? 'Professional roofing solutions for your community'}
            </p>

            {/* Service Metrics Panel */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-white mb-1">
                  {serviceStatus?.estimated_wait_time ?? 'N/A'}
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Next Available</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-orange-400 mb-1">
                  {serviceStatus?.availability_today ?? 0}
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wider">Inspections Today</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {(safeSection?.trust_signals ?? []).map((signal, i) => (
                <span key={i} className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 rounded-lg px-3 py-1.5 border border-slate-800">
                  <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {signal}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Quote Request Interface */}
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
                    <h2 className="text-xl font-bold text-white">{safeLeadCapture.headline}</h2>
                    <p className="text-sm text-slate-400 mt-1">{safeLeadCapture.subheadline}</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                </div>

                {!formState.submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {(safeLeadCapture.form_fields ?? [])
                      .filter(field => field.id && field.id.trim() !== '')
                      .map((field) => (
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
                            {(field.options ?? []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
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

                    {safeLeadCapture.urgency_text && (
                      <div className="flex items-center gap-2 text-amber-400 text-sm py-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {safeLeadCapture.urgency_text}
                      </div>
                    )}

                    <MagneticButton
                      type="submit"
                      fullWidth
                      disabled={formState.loading}
                    >
                      {formState.loading ? 'Processing...' : safeLeadCapture.submit_text}
                    </MagneticButton>

                    <p className="text-center text-xs text-slate-500 mt-4">
                      {safeLeadCapture.privacy_text}
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
                    <p className="text-slate-400">Our {safeData?.location?.suburb ?? 'Local Area'} team will contact you shortly.</p>
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

export default LocalHeroSection;
