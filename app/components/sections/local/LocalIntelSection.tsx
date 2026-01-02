// LocalIntelSection.tsx
// Stats and common issues section for local service pages
'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import AnimatedCounter from '~/components/sections/shared/AnimatedCounter';

// Type definitions
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

interface LocalIntelSectionData {
  headline: string;
  subheadline: string;
  stats: LocalStat[];
  common_issues: CommonIssue[];
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

interface LocalIntelSectionProps {
  section?: LocalIntelSectionData;
  data?: SiteData;
}

const LocalIntelSection: React.FC<LocalIntelSectionProps> = ({ section, data }) => {
  // Safe data access with fallbacks
  const safeSection = section ?? {
    headline: 'Local Area Insights',
    subheadline: 'Understanding your community\'s roofing needs',
    stats: [],
    common_issues: []
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
    <section className="py-24 bg-slate-50 border-b border-slate-200" data-component-id="local-intel">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {safeSection.headline}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">{safeSection.subheadline}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {(safeSection.stats ?? []).map((stat, idx) => (
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
          <h3 className="text-xl font-bold text-slate-900 mb-8">Common Issues in {safeData?.location?.suburb ?? 'Local Area'}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {(safeSection.common_issues ?? []).map((issue, idx) => (
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

export default LocalIntelSection;
