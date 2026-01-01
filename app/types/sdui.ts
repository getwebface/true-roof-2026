// Standardized Section Props Interface
// This interface defines the contract for all dynamic components in the system

export interface SectionProps {
  id: string; // The specific instance ID from JSON (e.g., "hero_variant_b")
  data: any; // The content object (headline, images, etc.)
  siteData: any; // Global site data (phone, logo, location, config, analytics)
  styles?: string; // AI-injected Tailwind classes (e.g., "bg-red-900")
  trackingId?: string; // For analytics (data-component-id)
  className?: string; // Additional static styling
  animations?: {
    // Framer Motion animation configuration
    entrance?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'scaleUp' | 'none';
    duration?: number;
    delay?: number;
    staggerChildren?: number;
  };
}

// Global site data structure
export interface GlobalSiteData {
  config: {
    site_name: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
    logo_url: string;
    primary_color: string;
    secondary_color: string;
    website_url: string;
  };
  location?: {
    suburb: string;
    region: string;
    postcode: string;
    state: string;
    service_radius_km: number;
    latitude?: number;
    longitude?: number;
  };
  analytics?: {
    sessionId: string;
    userId?: string;
    pageViewId: string;
  };
}

// Animation presets for Framer Motion
export const ANIMATION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 }
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  }
} as const;
