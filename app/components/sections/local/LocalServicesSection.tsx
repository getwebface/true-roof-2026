// LocalServicesSection.tsx
// List of services section for local service pages
'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

// Type definitions
interface ServiceAvailable {
  id: string;
  name: string;
  description: string;
  response_time: string;
  available: boolean;
  price_from: string;
  features: string[];
}

interface ServicesSectionData {
  headline: string;
  subheadline: string;
  services: ServiceAvailable[];
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

interface LocalServicesSectionProps {
  section?: ServicesSectionData;
  data?: SiteData;
}

const LocalServicesSection: React.FC<LocalServicesSectionProps> = ({ section, data }) => {
  // Safe data access with fallbacks
  const safeSection = section ?? {
    headline: 'Our Services',
    subheadline: 'Comprehensive roofing solutions',
    services: []
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
    <section className="py-24 bg-white" id="services" data-component-id="local-services">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{safeSection.headline}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">{safeSection.subheadline}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(safeSection.services ?? []).map((service, idx) => (
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
                {(service.features ?? []).map((feature, fIdx) => (
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

export default LocalServicesSection;
