// SocialProofSection.tsx
// Testimonials and projects section for local service pages
'use client';
import * as React from 'react';
import { motion } from 'framer-motion';

// Type definitions
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

interface LocalProject {
  id: string;
  title: string;
  suburb: string;
  image_url: string;
  service_type: string;
  completion_date: string;
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

interface SocialProofSectionProps {
  section?: SocialProofSectionData;
  data?: SiteData;
}

const SocialProofSection: React.FC<SocialProofSectionProps> = ({ section, data }) => {
  // Safe data access with fallbacks
  const safeSection = section ?? {
    headline: 'Community Trust',
    subheadline: 'What your neighbors say about us',
    testimonials: [],
    recent_projects: [],
    total_jobs_in_area: 0,
    avg_rating: 0,
    review_count: 0
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
    <section className="py-24 bg-slate-50 border-t border-slate-200" data-component-id="social-proof">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Stats Column */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{safeSection.headline}</h2>
            <p className="text-lg text-slate-600 mb-8">{safeSection.subheadline}</p>

            <div className="flex gap-8 mb-12">
              <div>
                <div className="text-4xl font-bold text-slate-900">{safeSection.avg_rating}</div>
                <div className="text-slate-500 text-sm">Average Rating</div>
                <div className="flex text-amber-400 mt-1">⭐⭐⭐⭐⭐</div>
              </div>
              <div className="w-px bg-slate-300" />
              <div>
                <div className="text-4xl font-bold text-slate-900">{safeSection.total_jobs_in_area}</div>
                <div className="text-slate-500 text-sm">Jobs in {safeData.location?.suburb ?? 'Local Area'}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {safeSection.recent_projects.slice(0, 2).map((proj) => (
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
            {safeSection.testimonials.map((test, idx) => (
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

export default SocialProofSection;
