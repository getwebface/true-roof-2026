// app/components/registry.ts

import * as React from 'react';
// Remove { lazy } from imports
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
<<<<<<< HEAD
import ServiceHubHero from './sections/hub/ServiceHubHero'; // Standard import
=======
import ServiceHubHero from './sections/hub/ServiceHubHero';
>>>>>>> 1695f84 (500 error fix (apparently))

// Local Service sections
import LocalHeroSection from './sections/local/LocalHeroSection';
import LocalIntelSection from './sections/local/LocalIntelSection';
import TechnicianLogSection from './sections/local/TechnicianLogSection';
import LocalServicesSection from './sections/local/LocalServicesSection';
import SocialProofSection from './sections/local/SocialProofSection';
import EmergencySection from './sections/local/EmergencySection';
<<<<<<< HEAD
=======
import MobileStickyCTA from './sections/local/MobileStickyCTA';

// Import other sections as they become available
>>>>>>> 1695f84 (500 error fix (apparently))

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
  'local_hero': LocalHeroSection,
  'local_intel': LocalIntelSection,
  'local_technician_log': TechnicianLogSection,
  'local_services': LocalServicesSection,
  'local_social_proof': SocialProofSection,
  'local_emergency': EmergencySection,
  
  // Utility Components
  'headless_form': () => React.createElement('div', null, 'HeadlessForm (to be imported)'),
};

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

export { validatePageSections } from '~/types/sdui';
