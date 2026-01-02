// LocalServiceTemplate.tsx
// TrueRoof - Local Roofing Service Template (Modular Edition)
// Enhanced for Local SEO: Semantic HTML, Schema.org integration, and Keyword Density
'use client';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import HeadlessForm from '~/components/forms/HeadlessForm';
import LocalHeroSection from '~/components/sections/local/LocalHeroSection';
import LocalIntelSection from '~/components/sections/local/LocalIntelSection';
import TechnicianLogSection from '~/components/sections/local/TechnicianLogSection';
import LocalServicesSection from '~/components/sections/local/LocalServicesSection';
import SocialProofSection from '~/components/sections/local/SocialProofSection';
import EmergencySection from '~/components/sections/local/EmergencySection';
import MobileStickyCTA from '~/components/sections/local/MobileStickyCTA';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface ServiceStatus {
  status: 'available' | 'limited' | 'booked';
  teams_available: number;
  last_inspection_completed: string;
  next_available_slot: string;
  availability_today: number;
  estimated_wait_time: string;
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
  service_status: ServiceStatus;
  trust_signals: string[];
  service_notice?: string;
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

interface LocalIntelSectionData {
  headline: string;
  subheadline: string;
  stats: LocalStat[];
  common_issues: CommonIssue[];
}

interface TechnicianLogSectionData {
  headline: string;
  subheadline: string;
  location_summary: string;
  logs: TechnicianLog[];
  last_inspection_date: string;
}

interface ServicesSectionData {
  headline: string;
  subheadline: string;
  services: ServiceAvailable[];
}

interface SocialProofSectionData {
  headline: string;
  subheadline: string;
  testimonials: LocalTestimonial[];
  recent_projects: LocalProject[];
  total_jobs_in_area: number;
  avg_rating: number;
  review_count: number;
}

interface EmergencySectionData {
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
  local_intel: LocalIntelSectionData;
  technician_log: TechnicianLogSectionData;
  services: ServicesSectionData;
  social_proof: SocialProofSectionData;
  emergency: EmergencySectionData;
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
const LocalBusinessSchema: React.FC<{ data?: SiteData }> = ({ data }) => {
  // Safe data access with fallbacks
  const safeData = data ?? fallbackSiteData;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": safeData.site_name,
    "image": safeData.logo_url,
    "telephone": safeData.phone,
    "email": safeData.email,
    "url": safeData.website_url,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": safeData.location?.suburb ?? 'Local Area',
      "addressRegion": safeData.location?.state ?? '',
      "postalCode": safeData.location?.postcode ?? '',
      "addressCountry": "AU"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": safeData.location?.latitude ?? -37.8136,
        "longitude": safeData.location?.longitude ?? 144.9631
      },
      // Ensure math is wrapped in parentheses correctly with null safety
      "geoRadius": Number(safeData.location?.service_radius_km ?? 25) * 1000
    },
    "priceRange": "$"
  };

  // Use useEffect to safely set script content on client side
  const scriptRef = useRef<HTMLScriptElement>(null);

  useEffect(() => {
    if (scriptRef.current) {
      scriptRef.current.textContent = JSON.stringify(schema);
    }
  }, [schema]);

  return (
    <script
      ref={scriptRef}
      type="application/ld+json"
      // Empty content initially, populated via useEffect
    />
  );
};

// ============================================================================
// SKELETON LOADER & NULL-SAFETY UTILITIES
// ============================================================================
const SkeletonLoader: React.FC = () => (
  <div className="min-h-screen bg-slate-50 animate-pulse">
    <div className="h-24 bg-slate-200"></div>
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
        <div className="h-64 bg-slate-200 rounded"></div>
      </div>
    </div>
  </div>
);

// Type-safe fallback values
const fallbackSiteData: SiteData = {
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

// ============================================================================
// MAIN LAYOUT
// ============================================================================
export default function LocalServiceTemplate({ data, sections }: LocalServiceTemplateProps) {
  // Root guard - if data or sections are undefined, show skeleton loader
  if (!data || !sections) {
    return <SkeletonLoader />;
  }

  // Safe data access with fallbacks
  const safeData = data ?? fallbackSiteData;
  const safeSections = sections ?? {
    hero: {
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
    },
    lead_capture: {
      headline: 'Get Your Free Quote',
      subheadline: 'Schedule your inspection today',
      form_fields: [],
      submit_text: 'Request Quote',
      privacy_text: 'Your information is secure',
      urgency_text: undefined,
      guarantee_badge: undefined
    },
    local_intel: {
      headline: 'Local Area Insights',
      subheadline: 'Understanding your community\'s roofing needs',
      stats: [],
      common_issues: []
    },
    technician_log: {
      headline: 'Field Technician Reports',
      subheadline: 'Recent inspections and recommendations',
      location_summary: 'No recent inspections available',
      logs: [],
      last_inspection_date: 'N/A'
    },
    services: {
      headline: 'Our Services',
      subheadline: 'Comprehensive roofing solutions',
      services: []
    },
    social_proof: {
      headline: 'Community Trust',
      subheadline: 'What your neighbors say about us',
      testimonials: [],
      recent_projects: [],
      total_jobs_in_area: 0,
      avg_rating: 0,
      review_count: 0
    },
    emergency: {
      headline: 'Emergency Roofing Services',
      subheadline: 'Available 24/7 for urgent repairs',
      phone: safeData?.phone ?? '',
      features: ['24/7 Emergency Response', 'Same-Day Service', 'Free Assessments'],
      available_hours: '24/7'
    },
    mobile_cta: {
      call_text: 'Call Now',
      book_text: 'Book Online',
      phone: safeData?.phone ?? ''
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-emerald-500/30">
      <LocalBusinessSchema data={safeData} />

      <main>
        <LocalHeroSection
          section={safeSections.hero}
          leadCapture={safeSections.lead_capture}
          data={safeData}
        />
        <LocalIntelSection
          section={safeSections.local_intel}
          data={safeData}
        />
        <TechnicianLogSection
          section={safeSections.technician_log}
          data={safeData}
        />
        <LocalServicesSection
          section={safeSections.services}
          data={safeData}
        />
        <SocialProofSection
          section={safeSections.social_proof}
          data={safeData}
        />
        <EmergencySection
          section={safeSections.emergency}
          data={safeData}
        />

        {/* Headless Form Section */}
        <section className="py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" data-component-id="local-service-form">
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                Get Your Local Roofing Assessment
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-white/60">
                Tell us about your specific roofing needs in {safeData.location?.suburb ?? 'your area'} and we'll provide a personalized quote
              </p>
            </div>

            <HeadlessForm
              formId="local_service_form"
              title={`${safeData.location?.suburb ?? 'Local'} Roofing Quote`}
              subtitle="Fill out this form to get a detailed quote for your specific roofing needs"
              submitText="Get Local Quote"
              successMessage={`Thank you! Our ${safeData.location?.suburb ?? 'local'} team will review your request and contact you with a detailed quote.`}
              trackingPrefix="local_service_form"
              variant="gradient"
            />
          </div>
        </section>
      </main>

      <MobileStickyCTA
        section={safeSections.mobile_cta}
        phone={safeData.phone}
      />

      {/* Simple Footer */}
      <footer className="bg-slate-950 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white font-bold text-xl">{safeData.site_name}</div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} {safeData.site_name}. Serving {safeData.location?.suburb ?? 'Local Area'} & {safeData.location?.region ?? ''}.
          </div>
        </div>
      </footer>
    </div>
  );
}
