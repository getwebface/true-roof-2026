// TechnicianLogSection.tsx
// Recent inspections report section for local service pages
'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import NoiseOverlay from '~/components/sections/shared/NoiseOverlay';
import MapTextureBackground from '~/components/sections/shared/MapTextureBackground';

// Type definitions
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

interface TechnicianLogSectionData {
  headline: string;
  subheadline: string;
  location_summary: string;
  logs: TechnicianLog[];
  last_inspection_date: string;
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

interface TechnicianLogSectionProps {
  section?: TechnicianLogSectionData;
  data?: SiteData;
}

const TechnicianLogSection: React.FC<TechnicianLogSectionProps> = ({ section, data }) => {
  // Safe data access with fallbacks
  const safeSection = section ?? {
    headline: 'Field Technician Reports',
    subheadline: 'Recent inspections and recommendations',
    location_summary: 'No recent inspections available',
    logs: [],
    last_inspection_date: 'N/A'
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
    <section className="py-24 bg-slate-950 relative overflow-hidden" data-component-id="technician-log">
      <MapTextureBackground />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-500 mb-2 font-mono text-sm uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Field Report
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{safeSection.headline}</h2>
            <p className="text-slate-400 max-w-xl">{safeSection.subheadline}</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-right">
            <div className="text-xs text-slate-500 uppercase">Last Inspection</div>
            <div className="text-white font-mono">{safeSection.last_inspection_date}</div>
          </div>
        </div>

        {/* Location Summary */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-white/10 mb-12">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.809-.983L15 7m0 10V7m0 0L9 7" />
            </svg>
            Area Analysis: {safeData?.location?.suburb ?? 'Local Area'}
          </h3>
          <p className="text-slate-300 leading-relaxed text-lg">{safeSection.location_summary}</p>
        </div>

        {/* Logs */}
        <div className="space-y-6">
          {(safeSection.logs ?? []).map((log) => (
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
                      {log.technician_name?.charAt(0) ?? 'T'}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{log.technician_name ?? 'Technician'}</div>
                      <div className="text-slate-500 text-xs">{log.date ?? 'N/A'}</div>
                    </div>
                  </div>
                  <span className={clsx(
                    "inline-block px-2 py-1 rounded text-xs font-bold uppercase mt-2",
                    log.priority === 'urgent' ? "bg-red-500/20 text-red-400" :
                    log.priority === 'recommended' ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
                  )}>
                    Priority: {log.priority ?? 'routine'}
                  </span>
                </div>

                {/* Log Content */}
                <div className="flex-grow">
                  <div className="mb-4">
                    <h4 className="text-slate-500 text-xs uppercase tracking-wider mb-1">Observation</h4>
                    <p className="text-slate-200">{log.observation ?? 'No observation recorded'}</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                    <h4 className="text-emerald-500 text-xs uppercase tracking-wider mb-1">Recommendation</h4>
                    <p className="text-white text-sm">{log.recommendation ?? 'No recommendation provided'}</p>
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

export default TechnicianLogSection;
