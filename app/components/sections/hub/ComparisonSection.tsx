// ComparisonSection.tsx
// Tier comparison table component extracted from ServiceHubTemplate

'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import MagneticButton from '~/components/sections/shared/MagneticButton';

interface ServiceTier {
  id: string;
  name: string;
  description: string;
  price_indicator: string;
  features: string[];
  is_popular: boolean;
  cta_text: string;
}

interface ComparisonFeature {
  name: string;
  basic: boolean | string;
  standard: boolean | string;
  premium: boolean | string;
}

interface ComparisonSectionProps {
  section: {
    headline: string;
    subheadline: string;
    tiers: ServiceTier[];
    features: ComparisonFeature[];
  };
}

export default function ComparisonSection({ section }: ComparisonSectionProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [hoveredTier, setHoveredTier] = React.useState<string | null>(null);

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
              className={`relative overflow-hidden rounded-2xl border p-8 transition-all duration-500 ${
                tier.is_popular
                  ? 'border-blue-500 bg-gradient-to-b from-blue-50 to-white shadow-xl shadow-blue-500/10'
                  : 'border-slate-200 bg-white'
              } ${hoveredTier === tier.id && !tier.is_popular ? 'border-slate-300 shadow-lg' : ''}`}
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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
                      className={`px-6 py-4 text-center text-sm font-semibold ${
                        tier.is_popular ? 'bg-blue-50 text-blue-900' : 'text-slate-900'
                      }`}
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
}
