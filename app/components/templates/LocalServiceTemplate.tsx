// LocalServiceTemplate.tsx
// "The Local Command Center" - High-conversion local landing page

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

interface LocalServiceTemplateProps {
  data: {
    location: {
      suburb: string;
      state: string;
      postcode: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    meta: {
      title: string;
      description: string;
    };
  };
  sections: {
    hero: {
      headline: string;
      subheadline: string;
      status_badge: {
        text: string;
        status: 'active' | 'busy' | 'available';
      };
      cta_primary: string;
      cta_secondary: string;
    };
    lead_capture: {
      title: string;
      subtitle: string;
      form_fields: Array<{
        id: string;
        label: string;
        type: string;
        placeholder: string;
        required: boolean;
      }>;
      submit_text: string;
      privacy_text: string;
    };
    local_intel: {
      title: string;
      stats: Array<{
        label: string;
        value: string;
        unit: string;
        trend?: 'up' | 'down' | 'stable';
      }>;
    };
    technician_log: {
      title: string;
      author: {
        name: string;
        role: string;
        avatar: string;
      };
      date: string;
      content: string;
      findings: Array<{
        issue: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        recommendation: string;
      }>;
    };
    services_grid: {
      title: string;
      services: Array<{
        id: string;
        name: string;
        icon: string;
        description: string;
        local_stats: string;
        price_range: string;
      }>;
    };
    social_proof: {
      title: string;
      testimonials: Array<{
        id: string;
        author: string;
        location: string;
        rating: number;
        text: string;
        date: string;
      }>;
    };
  };
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function LocalServiceTemplate({
  data,
  sections,
}: LocalServiceTemplateProps) {
  const [showMobileBar, setShowMobileBar] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Detect scroll for mobile sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowMobileBar(true);
      } else {
        setShowMobileBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Form handlers
  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submission Payload:', {
      location: data.location,
      timestamp: new Date().toISOString(),
      formData,
    });
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* ============================================================ */}
      {/* HERO SECTION - SPLIT LAYOUT */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden border-b border-slate-800">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT: Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-full px-4 py-2 mb-6">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium text-slate-300">
                  {data.location.suburb}, {data.location.state}{' '}
                  {data.location.postcode}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {sections.hero.headline}
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                {sections.hero.subheadline}
              </p>

              {/* Status Badge - Live Indicator */}
              <motion.div
                className={clsx(
                  'inline-flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-xl mb-8',
                  sections.hero.status_badge.status === 'active' &&
                    'bg-emerald-500/10 border-emerald-500/30',
                  sections.hero.status_badge.status === 'busy' &&
                    'bg-amber-500/10 border-amber-500/30',
                  sections.hero.status_badge.status === 'available' &&
                    'bg-blue-500/10 border-blue-500/30'
                )}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <motion.div
                  className={clsx(
                    'w-3 h-3 rounded-full',
                    sections.hero.status_badge.status === 'active' &&
                      'bg-emerald-400',
                    sections.hero.status_badge.status === 'busy' &&
                      'bg-amber-400',
                    sections.hero.status_badge.status === 'available' &&
                      'bg-blue-400'
                  )}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <span className="text-sm font-semibold text-white">
                  {sections.hero.status_badge.text}
                </span>
              </motion.div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {sections.hero.cta_primary}
                </motion.button>
                <motion.button
                  className="px-8 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700 text-white font-bold rounded-xl hover:bg-slate-700/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {sections.hero.cta_secondary}
                </motion.button>
              </div>
            </motion.div>

            {/* RIGHT: Lead Capture Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                {/* Card Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {sections.lead_capture.title}
                  </h3>
                  <p className="text-slate-400">
                    {sections.lead_capture.subtitle}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {sections.lead_capture.form_fields.map((field) => (
                    <div key={field.id}>
                      <label
                        htmlFor={field.id}
                        className="block text-sm font-medium text-slate-300 mb-2"
                      >
                        {field.label}
                        {field.required && (
                          <span className="text-red-400 ml-1">*</span>
                        )}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          id={field.id}
                          placeholder={field.placeholder}
                          required={field.required}
                          rows={4}
                          value={formData[field.id] || ''}
                          onChange={(e) =>
                            handleInputChange(field.id, e.target.value)
                          }
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      ) : (
                        <input
                          type={field.type}
                          id={field.id}
                          placeholder={field.placeholder}
                          required={field.required}
                          value={formData[field.id] || ''}
                          onChange={(e) =>
                            handleInputChange(field.id, e.target.value)
                          }
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      )}
                    </div>
                  ))}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className={clsx(
                      'w-full py-4 font-bold rounded-xl transition-all shadow-lg',
                      formSubmitted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                    )}
                    whileHover={{ scale: formSubmitted ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={formSubmitted}
                  >
                    {formSubmitted ? '✓ Submitted' : sections.lead_capture.submit_text}
                  </motion.button>

                  {/* Privacy Text */}
                  <p className="text-xs text-slate-500 text-center mt-4">
                    {sections.lead_capture.privacy_text}
                  </p>
                </form>
              </div>

              {/* Decorative Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-2xl -z-10 opacity-50"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* LOCAL INTEL GRID */}
      {/* ============================================================ */}
      <section className="relative py-16 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {sections.local_intel.title}
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.local_intel.stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-sm text-slate-400 mb-2 uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-lg text-slate-500">{stat.unit}</div>
                </div>
                {stat.trend && (
                  <div className="mt-3 flex items-center gap-1">
                    {stat.trend === 'up' && (
                      <>
                        <svg
                          className="w-4 h-4 text-emerald-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs text-emerald-400 font-medium">
                          Trending Up
                        </span>
                      </>
                    )}
                    {stat.trend === 'down' && (
                      <>
                        <svg
                          className="w-4 h-4 text-red-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs text-red-400 font-medium">
                          Trending Down
                        </span>
                      </>
                    )}
                    {stat.trend === 'stable' && (
                      <>
                        <div className="w-4 h-0.5 bg-slate-500"></div>
                        <span className="text-xs text-slate-400 font-medium">
                          Stable
                        </span>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TECHNICIAN'S LOG */}
      {/* ============================================================ */}
      <section className="relative py-16 bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="bg-slate-800/30 backdrop-blur-2xl border border-slate-700/50 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-8 py-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {sections.technician_log.author.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {sections.technician_log.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span>{sections.technician_log.author.name}</span>
                    <span>•</span>
                    <span>{sections.technician_log.author.role}</span>
                    <span>•</span>
                    <span>{sections.technician_log.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <p className="text-slate-300 leading-relaxed mb-8">
                {sections.technician_log.content}
              </p>

              {/* Findings */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white mb-4">
                  Key Findings:
                </h4>
                {sections.technician_log.findings.map((finding, index) => (
                  <motion.div
                    key={index}
                    className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Severity Indicator */}
                      <div
                        className={clsx(
                          'w-3 h-3 rounded-full mt-1.5 flex-shrink-0',
                          finding.severity === 'critical' && 'bg-red-500',
                          finding.severity === 'high' && 'bg-orange-500',
                          finding.severity === 'medium' && 'bg-amber-500',
                          finding.severity === 'low' && 'bg-emerald-500'
                        )}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h5 className="font-bold text-white">
                            {finding.issue}
                          </h5>
                          <span
                            className={clsx(
                              'text-xs px-2 py-1 rounded-full uppercase font-bold',
                              finding.severity === 'critical' &&
                                'bg-red-500/20 text-red-400',
                              finding.severity === 'high' &&
                                'bg-orange-500/20 text-orange-400',
                              finding.severity === 'medium' &&
                                'bg-amber-500/20 text-amber-400',
                              finding.severity === 'low' &&
                                'bg-emerald-500/20 text-emerald-400'
                            )}
                          >
                            {finding.severity}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm">
                          {finding.recommendation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SERVICES GRID */}
      {/* ============================================================ */}
      <section className="relative py-16 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {sections.services_grid.title}
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.services_grid.services.map((service, index) => (
              <motion.div
                key={service.id}
                className="group bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">{service.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {service.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  {service.description}
                </p>

                {/* Local Stats */}
                <div className="bg-slate-900/50 rounded-lg px-3 py-2 mb-4">
                  <div className="text-xs text-slate-500 mb-1">
                    In {data.location.suburb}:
                  </div>
                  <div className="text-sm font-semibold text-blue-400">
                    {service.local_stats}
                  </div>
                </div>

                {/* Price Range */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold">
                    {service.price_range}
                  </span>
                  <svg
                    className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SOCIAL PROOF */}
      {/* ============================================================ */}
      <section className="relative py-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {sections.social_proof.title}
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.social_proof.testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={clsx(
                        'w-5 h-5',
                        i < testimonial.rating
                          ? 'text-amber-400'
                          : 'text-slate-600'
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Testimonial */}
                <p className="text-slate-300 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-bold text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-slate-500">
                      {testimonial.location}
                    </div>
                  </div>
                  <div className="text-slate-600">{testimonial.date}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MOBILE STICKY BAR (Thumb Zone) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showMobileBar && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="bg-slate-900/95 backdrop-blur-2xl border-t border-slate-700 px-4 py-4 shadow-2xl">
              <div className="flex gap-3">
                <motion.a
                  href="tel:1300000000"
                  className="flex-1 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl text-center shadow-lg shadow-red-500/25"
                  whileTap={{ scale: 0.95 }}
                >
                  📞 Call Now
                </motion.a>
                <motion.button
                  className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25"
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                >
                  📅 Book Online
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
