// ServicesGridSection.tsx
// Grid/list view of services component extracted from ServiceHubTemplate

'use client';

import React, { useRef } from 'react';
import { motion, useInView, AnimatePresence, LayoutGroup } from 'framer-motion';
import MagneticButton from '~/components/sections/shared/MagneticButton';

interface ServiceFeature {
  icon: string;
  text: string;
}

interface ServicePricing {
  type: 'fixed' | 'from' | 'custom' | 'range';
  value?: string;
  from?: string;
  to?: string;
  unit?: string;
}

interface ServiceCard {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  tags: string[];
  icon: string;
  image_url: string;
  features: ServiceFeature[];
  pricing: ServicePricing;
  availability: 'available' | 'limited' | 'unavailable';
  response_time: string;
  warranty: string;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_emergency: boolean;
  specs: Array<{
    label: string;
    value: string;
  }>;
}

interface ServicesGridSectionProps {
  section: {
    headline: string;
    subheadline: string;
    items: ServiceCard[];
    empty_state: {
      headline: string;
      description: string;
      cta_text: string;
    };
  };
  filteredServices: ServiceCard[];
  viewMode: 'grid' | 'list';
  isLoading: boolean;
}

const ActiveServiceCard: React.FC<{
  service: ServiceCard;
  viewMode: 'grid' | 'list';
  index: number;
}> = ({ service, viewMode, index }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const renderPricing = () => {
    switch (service.pricing.type) {
      case 'fixed':
        return <span className="text-2xl font-bold text-slate-900">{service.pricing.value}</span>;
      case 'from':
        return (
          <div>
            <span className="text-xs text-slate-500">From</span>
            <span className="ml-1 text-2xl font-bold text-slate-900">{service.pricing.from}</span>
          </div>
        );
      case 'range':
        return (
          <div>
            <span className="text-lg font-bold text-slate-900">{service.pricing.from}</span>
            <span className="mx-1 text-slate-400">-</span>
            <span className="text-lg font-bold text-slate-900">{service.pricing.to}</span>
          </div>
        );
      case 'custom':
        return <span className="text-lg font-semibold text-blue-600">Custom Quote</span>;
      default:
        return null;
    }
  };

  const availabilityStyles = {
    available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    limited: 'bg-amber-50 text-amber-700 border-amber-200',
    unavailable: 'bg-red-50 text-red-700 border-red-200',
  };

  const availabilityLabels = {
    available: 'Available Now',
    limited: 'Limited Slots',
    unavailable: 'Fully Booked',
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        ref={cardRef}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative overflow-hidden rounded-2xl border bg-white p-6 transition-all duration-500 hover:shadow-xl"
      >
        <div className="flex items-center gap-6">
          {/* Icon */}
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-3xl">
            <span className="brightness-0 invert">{service.icon}</span>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
              {service.is_featured && (
                <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                  <span className="text-amber-500">★</span> Featured
                </span>
              )}
              {service.is_emergency && (
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                  <span>⚡</span> Emergency
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600">{service.subtitle}</p>
            <div className="mt-2 flex items-center gap-4">
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${
                availabilityStyles[service.availability]
              }`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {availabilityLabels[service.availability]}
              </span>
              <span className="text-sm text-slate-500">
                Response: <span className="font-medium text-slate-700">{service.response_time}</span>
              </span>
              <span className="flex items-center gap-1 text-sm">
                <span className="text-amber-400">★</span>
                <span className="font-medium text-slate-700">{service.rating}</span>
                <span className="text-slate-400">({service.review_count})</span>
              </span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex flex-shrink-0 items-center gap-6">
            <div className="text-right">{renderPricing()}</div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.2 }}
            >
              <button className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800">
                View Specs
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05, type: 'spring', stiffness: 200 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl border bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20"
    >
      {/* Glow Effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.1), transparent 40%)',
        }}
      />

      {/* Image Header */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={service.image_url}
          alt={service.title}
          className="h-full w-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Tags */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {service.is_featured && (
            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
              <span className="text-amber-500">★</span> Featured
            </span>
          )}
          {service.is_emergency && (
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
              <span>⚡</span> Emergency
            </span>
          )}
        </div>

        {/* Availability */}
        <div className="absolute right-4 top-4">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm ${
            availabilityStyles[service.availability]
          }`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {availabilityLabels[service.availability]}
          </span>
        </div>

        {/* Icon Overlay */}
        <div className="absolute bottom-4 left-4">
          <motion.div
            className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-2xl backdrop-blur-md"
            animate={{
              backgroundColor: isHovered ? 'rgba(59, 130, 246, 0.9)' : 'rgba(255, 255, 255, 0.1)',
            }}
            transition={{ duration: 0.3 }}
          >
            <span className={isHovered ? 'brightness-0 invert' : ''}>{service.icon}</span>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="mb-1 text-xl font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
            {service.title}
          </h3>
          <p className="text-sm text-slate-500">{service.subtitle}</p>
        </div>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {service.description}
        </p>

        {/* Features */}
        <div className="mb-4 space-y-2">
          {service.features.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              {feature.text}
            </div>
          ))}
        </div>

        {/* Meta Info */}
        <div className="mb-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {service.response_time}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            {service.warranty}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-amber-400">★</span>
            {service.rating}
            <span className="text-slate-400">({service.review_count})</span>
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {renderPricing()}

          <motion.button
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-blue-600 hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Specs
            <motion.svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </motion.svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default function ServicesGridSection({
  section,
  filteredServices,
  viewMode,
  isLoading,
}: ServicesGridSectionProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section ref={containerRef} className="bg-slate-50 py-16" data-component-id="services-grid">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-end justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{section.headline}</h2>
            <p className="mt-2 text-slate-600">{section.subheadline}</p>
          </div>
          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{filteredServices.length}</span>{' '}
            services
          </div>
        </motion.div>

        {/* Services Grid */}
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {filteredServices.length > 0 ? (
              <motion.div
                layout
                className={`gap-6 ${
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'flex flex-col'
                }`}
              >
                {filteredServices.map((service, index) => (
                  <ActiveServiceCard
                    key={service.id}
                    service={service}
                    viewMode={viewMode}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-16 text-center"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
                  <svg
                    className="h-10 w-10 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">
                  {section.empty_state.headline}
                </h3>
                <p className="mb-6 text-slate-600">{section.empty_state.description}</p>
                <MagneticButton variant="primary">{section.empty_state.cta_text}</MagneticButton>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}
