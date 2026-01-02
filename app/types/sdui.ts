import { z } from 'zod';

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

// Zod validation schemas
export const animationSchema = z.object({
  entrance: z.enum(['fadeIn', 'slideUp', 'slideLeft', 'scaleUp', 'none']).optional(),
  duration: z.number().optional(),
  delay: z.number().optional(),
  staggerChildren: z.number().optional(),
});

export const sectionDataSchema = z.object({
  type: z.string(),
  id: z.string(),
  data: z.any(),
  styles: z.string().optional(),
  trackingId: z.string().optional(),
  className: z.string().optional(),
  animations: animationSchema.optional(),
});

export const pageSectionsSchema = z.object({
  layout_order: z.array(z.string()),
  sections: z.record(z.string(), sectionDataSchema),
});

export const globalSiteDataSchema = z.object({
  config: z.object({
    site_name: z.string(),
    tagline: z.string(),
    phone: z.string(),
    email: z.string(),
    address: z.string(),
    logo_url: z.string(),
    primary_color: z.string(),
    secondary_color: z.string(),
    website_url: z.string(),
  }),
  location: z.object({
    suburb: z.string(),
    region: z.string(),
    postcode: z.string(),
    state: z.string(),
    service_radius_km: z.number(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }).optional(),
  analytics: z.object({
    sessionId: z.string(),
    userId: z.string().optional(),
    pageViewId: z.string(),
  }).optional(),
});

// Type inference from schemas
export type ValidatedSectionData = z.infer<typeof sectionDataSchema>;
export type ValidatedPageSections = z.infer<typeof pageSectionsSchema>;
export type ValidatedGlobalSiteData = z.infer<typeof globalSiteDataSchema>;

// Validation helper functions
export function validateSectionData(data: any): ValidatedSectionData | null {
  const result = sectionDataSchema.safeParse(data);
  return result.success ? result.data : null;
}

export function validatePageSections(data: any): ValidatedPageSections | null {
  const result = pageSectionsSchema.safeParse(data);
  return result.success ? result.data : null;
}

export function validateGlobalSiteData(data: any): ValidatedGlobalSiteData | null {
  const result = globalSiteDataSchema.safeParse(data);
  return result.success ? result.data : null;
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
