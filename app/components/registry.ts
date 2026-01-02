// Component Registry
// Maps JSON type strings to React components for dynamic rendering

import * as React from 'react';
import { lazy } from 'react';
import HeroSection from './sections/home/HeroSection';
import BentoGridSection from './sections/home/BentoGridSection';
import TestimonialsSection from './sections/home/TestimonialsSection';
import ServiceMapSection from './sections/home/ServiceMapSection';
import ProcessSection from './sections/home/ProcessSection';
import ServicesSection from './sections/home/ServicesSection';
import BeforeAfterSection from './sections/home/BeforeAfterSection';
import FAQSection from './sections/home/FAQSection';
import FinalCTASection from './sections/home/FinalCTASection';

// Service Hub sections
import FilteringMatrix from './sections/hub/FilteringMatrix';
import ServicesGridSection from './sections/hub/ServicesGridSection';
import ComparisonSection from './sections/hub/ComparisonSection';
import TechSpecsSection from './sections/hub/TechSpecsSection';
import HubCTASection from './sections/hub/CTASection';
import HubProcessSection from './sections/hub/ProcessSection';

// Import other sections as they become available

// Lazy loaded components
const ServiceHubHero = lazy(() => import('./sections/hub/ServiceHubHero'));

export const COMPONENT_REGISTRY: Record<string, React.FC<any>> = {
  // Home Template Sections
  'hero_home': HeroSection,
  'bento_grid': BentoGridSection,
  'testimonials': TestimonialsSection,
  'service_map': ServiceMapSection,
  'process': ProcessSection,
  'before_after': BeforeAfterSection,
  'services': ServicesSection,
  'faq': FAQSection,
  'final_cta': FinalCTASection,
  
  // Service Hub Template Sections
  'hub_hero': ServiceHubHero,
  'hub_filtering': FilteringMatrix,
  'hub_services_grid': ServicesGridSection,
  'hub_comparison': ComparisonSection,
  'hub_tech_specs': TechSpecsSection,
  'hub_process': HubProcessSection,
  'hub_cta': HubCTASection,
  
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

// Re-export Zod validation from sdui.ts for backward compatibility
export { validatePageSections } from '~/types/sdui';

// Type guard for section data structure (kept for backward compatibility)
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
