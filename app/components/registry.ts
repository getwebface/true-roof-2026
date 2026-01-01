// Component Registry
// Maps JSON type strings to React components for dynamic rendering

import React from 'react';
import HeroSection from './sections/home/HeroSection';
import BentoGridSection from './sections/home/BentoGridSection';
import TestimonialsSection from './sections/home/TestimonialsSection';
// Import other sections as they become available

export const COMPONENT_REGISTRY: Record<string, React.FC<any>> = {
  // Home Template Sections
  'hero_home': HeroSection,
  'bento_grid': BentoGridSection,
  'testimonials': TestimonialsSection,
  'before_after': () => React.createElement('div', null, 'BeforeAfterSection (to be imported)'),
  'service_map': () => React.createElement('div', null, 'ServiceMapSection (to be imported)'),
  'process': () => React.createElement('div', null, 'ProcessSection (to be imported)'),
  'services': () => React.createElement('div', null, 'ServicesSection (to be imported)'),
  'faq': () => React.createElement('div', null, 'FAQSection (to be imported)'),
  'final_cta': () => React.createElement('div', null, 'FinalCTASection (to be imported)'),
  
  // Service Hub Template Sections
  'hub_hero': () => React.createElement('div', null, 'ServiceHubHero (to be imported)'),
  'hub_filtering': () => React.createElement('div', null, 'FilteringMatrix (to be imported)'),
  'hub_services_grid': () => React.createElement('div', null, 'ServicesGridSection (to be imported)'),
  'hub_comparison': () => React.createElement('div', null, 'ComparisonSection (to be imported)'),
  'hub_tech_specs': () => React.createElement('div', null, 'TechSpecsSection (to be imported)'),
  'hub_process': () => React.createElement('div', null, 'ProcessSection (to be imported)'),
  'hub_cta': () => React.createElement('div', null, 'CTASection (to be imported)'),
  
  // Local Service Template Sections
  'local_hero': () => React.createElement('div', null, 'LocalHeroSection (to be imported)'),
  'local_intel': () => React.createElement('div', null, 'LocalIntelSection (to be imported)'),
  'local_technician_log': () => React.createElement('div', null, 'TechnicianLogSection (to be imported)'),
  'local_services': () => React.createElement('div', null, 'LocalServicesSection (to be imported)'),
  'local_social_proof': () => React.createElement('div', null, 'SocialProofSection (to be imported)'),
  'local_emergency': () => React.createElement('div', null, 'EmergencySection (to be imported)'),
  
  // Utility Components
  'headless_form': () => React.createElement('div', null, 'HeadlessForm (to be imported)'),
};

// Helper function to get component by type
export const getComponentByType = (type: string): React.FC<any> => {
  const Component = COMPONENT_REGISTRY[type];
  if (!Component) {
    console.warn(`Component type "${type}" not found in registry`);
    return () => React.createElement('div', { 
      className: 'p-4 bg-red-50 text-red-700 rounded-lg' 
    }, `Unknown component type: ${type}`);
  }
  return Component;
};

// Type guard for section data structure
export interface SectionData {
  type: string;
  id: string;
  data: any;
  styles?: string;
  trackingId?: string;
  animations?: any;
  className?: string;
}

export interface PageSections {
  layout_order: string[];
  sections: Record<string, SectionData>;
}

// Validate page sections structure
export const validatePageSections = (sections: any): sections is PageSections => {
  if (!sections || typeof sections !== 'object') return false;
  if (!Array.isArray(sections.layout_order)) return false;
  if (!sections.sections || typeof sections.sections !== 'object') return false;
  
  // Validate each section
  for (const sectionId of sections.layout_order) {
    const section = sections.sections[sectionId];
    if (!section || typeof section !== 'object') return false;
    if (!section.type || typeof section.type !== 'string') return false;
    if (!section.id || typeof section.id !== 'string') return false;
  }
  
  return true;
};
