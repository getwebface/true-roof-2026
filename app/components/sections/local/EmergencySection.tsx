// EmergencySection.tsx
// Emergency call-to-action section for local service pages
'use client';
import * as React from 'react';
import NoiseOverlay from '~/components/sections/shared/NoiseOverlay';

// Type definitions
interface EmergencySectionData {
  headline: string;
  subheadline: string;
  phone: string;
  features: string[];
  available_hours: string;
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

interface EmergencySectionProps {
  section?: EmergencySectionData;
  data?: SiteData;
}

const EmergencySection: React.FC<EmergencySectionProps> = ({ section, data }) => {
  // Safe data access with fallbacks
  const safeSection = section ?? {
    headline: 'Emergency Roofing Services',
    subheadline: 'Available 24/7 for urgent repairs',
    phone: '',
    features: ['24/7 Emergency Response', 'Same-Day Service', 'Free Assessments'],
    available_hours: '24/7'
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

  return (
    <section className="bg-orange-600 py-12 relative overflow-hidden" data-component-id="emergency-cta">
      <NoiseOverlay opacity={0.05} />
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">{safeSection.headline}</h2>
        <p className="text-orange-100 mb-8 max-w-2xl mx-auto">{safeSection.subheadline}</p>
        <a href={`tel:${safeSection.phone || safeData.phone}`} className="inline-block bg-white text-orange-700 font-bold text-xl px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition-transform">
          Call {safeSection.phone || safeData.phone}
        </a>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-orange-100">
          {(safeSection.features ?? []).map((feat, i) => (
            <span key={i} className="flex items-center gap-1">
              ✓ {feat}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmergencySection;
