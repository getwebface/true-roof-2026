// ServiceHubHero.tsx
// Extracted from ServiceHubTemplate.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import clsx from 'clsx';
import TechBadge from '~/components/sections/shared/TechBadge';
import StatusIndicator from '~/components/sections/shared/StatusIndicator';
import GlassCard from '~/components/sections/shared/GlassCard';
import NoiseOverlay from '~/components/sections/shared/NoiseOverlay';

interface SystemStatus {
  operational_services: number;
  total_services: number;
  last_updated: string;
  uptime_percentage: number;
  active_jobs: number;
  response_time: string;
}

interface HeroSection {
  headline: string;
  headline_accent: string;
  description: string;
  system_status: SystemStatus;
  quick_stats: Array<{
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
    trend_value?: string;
  }>;
  version_tag: string;
  breadcrumb: string[];
}

interface SiteData {
  site_name: string;
  tagline: string;
  phone: string;
  email: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
}

interface ServiceHubHeroProps {
  data: HeroSection;
  siteData: SiteData;
}

export const ServiceHubHero: React.FC<ServiceHubHeroProps> = ({
  data,
  siteData,
}: ServiceHubHeroProps) => {
  // Map props to expected variable names
  const section = data;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      data-component-id="service-hub-hero"
      className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    >
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute -left-48 top-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-48 bottom-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />

      <NoiseOverlay opacity={0.04} />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-32"
      >
        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            {section.breadcrumb.map((item: string, index: number) => (
              <React.Fragment key={index}>
                <span
                  className={clsx(
                    index === section.breadcrumb.length - 1
                      ? 'text-white'
                      : 'text-white/50 hover:text-white/70'
                  )}
                >
                  {item}
                </span>
                {index < section.breadcrumb.length - 1 && (
                  <svg
                    className="h-4 w-4 text-white/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Version Tag */}
          <div className="flex items-center gap-3">
            <TechBadge variant="info" size="md">
              {section.version_tag}
            </TechBadge>
            <span className="font-mono text-sm text-white/40">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Side - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              {section.headline}
              <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                {section.headline_accent}
              </span>
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/60">
              {section.description}
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {section.quick_stats.map((stat: { label: string; value: string; trend?: 'up' | 'down' | 'stable'; trend_value?: string; }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                    {stat.trend && (
                      <span
                        className={clsx(
                          'flex items-center text-xs font-medium',
                          stat.trend === 'up' && 'text-emerald-400',
                          stat.trend === 'down' && 'text-red-400',
                          stat.trend === 'stable' && 'text-white/50'
                        )}
                      >
                        {stat.trend === 'up' && '↑'}
                        {stat.trend === 'down' && '↓'}
                        {stat.trend === 'stable' && '→'}
                        {stat.trend_value}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/50">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - System Status Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <GlassCard dark className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-semibold text-white">System Status</h3>
                <StatusIndicator
                  status={
                    section.system_status.uptime_percentage >= 99
                      ? 'operational'
                      : section.system_status.uptime_percentage >= 95
                        ? 'degraded'
                        : 'down'
                  }
                  label={
                    section.system_status.uptime_percentage >= 99
                      ? 'All Systems Operational'
                      : 'Degraded Performance'
                  }
                />
              </div>

              {/* Status Metrics */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Service Availability</span>
                  <span className="font-mono text-sm text-white">
                    {section.system_status.operational_services}/
                    {section.system_status.total_services}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(section.system_status.operational_services / section.system_status.total_services) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {section.system_status.uptime_percentage}%
                    </div>
                    <div className="text-xs text-white/50">Uptime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {section.system_status.active_jobs}
                    </div>
                    <div className="text-xs text-white/50">Active Jobs</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm text-white/60">Avg Response Time</span>
                  <span className="font-mono text-sm font-medium text-emerald-400">
                    {section.system_status.response_time}
                  </span>
                </div>

                <div className="text-right text-xs text-white/40">
                  Last updated: {section.system_status.last_updated}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#f8fafc"
          />
        </svg>
      </div>
    </section>
  );
};

export default ServiceHubHero;
