// Core roofing services for TrueRoof 2026
// These are the exact services we sell - used throughout the site

export interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  slug: string;
  color: string;
  features: string[];
  responseTime: string;
  priceRange: string;
}

export const CORE_SERVICES: Service[] = [
  {
    id: 'tiled-roof-leaks',
    name: 'Tiled Roof Leaks & Repairs',
    icon: '⚡',
    description: 'Expert leak detection and permanent repair solutions for tiled roofs',
    slug: 'tiled-roof-leaks-repairs',
    color: 'orange',
    features: [
      'Advanced leak detection technology',
      'Tile replacement & resealing',
      'Flashing repairs',
      '12-month warranty on all repairs'
    ],
    responseTime: 'Same-day emergency service',
    priceRange: 'From $450'
  },
  {
    id: 'tiled-roof-repointing',
    name: 'Tiled Roof Repointing & Rebedding',
    icon: '🧱',
    description: 'Professional repointing and rebedding to restore roof integrity',
    slug: 'tiled-roof-repointing-rebedding',
    color: 'amber',
    features: [
      'Mortar analysis & matching',
      'Ridge capping rebedding',
      'Valley repointing',
      'Weatherproof sealing'
    ],
    responseTime: 'Next available slot',
    priceRange: 'From $1,200'
  },
  {
    id: 'biocide-soft-wash',
    name: 'Biocide Soft Wash & Pressure Cleaning',
    icon: '💧',
    description: 'Gentle yet effective roof cleaning to remove moss, algae, and stains',
    slug: 'biocide-soft-wash-pressure-cleaning',
    color: 'blue',
    features: [
      'Eco-friendly biocide treatment',
      'Low-pressure soft wash system',
      'Mould & algae removal',
      'Protective coating application'
    ],
    responseTime: 'Within 48 hours',
    priceRange: 'From $850'
  },
  {
    id: 'full-roof-restorations',
    name: 'Full Roof Restorations',
    icon: '🏠',
    description: 'Complete roof restoration including cleaning, repairs, and sealing',
    slug: 'full-roof-restorations',
    color: 'emerald',
    features: [
      'Complete roof assessment',
      'Tile cleaning & treatment',
      'Full repointing & rebedding',
      '10-year restoration warranty'
    ],
    responseTime: 'Scheduled appointment',
    priceRange: 'From $3,500'
  },
  {
    id: 'drone-roof-inspections',
    name: 'Drone Roof Inspections',
    icon: '🔍',
    description: 'Advanced drone-based roof assessments with detailed reporting',
    slug: 'drone-roof-inspections',
    color: 'indigo',
    features: [
      'High-resolution aerial photography',
      'Thermal imaging for leak detection',
      'Detailed inspection report',
      'No-risk assessment'
    ],
    responseTime: 'Within 24 hours',
    priceRange: 'From $350'
  },
  {
    id: 'valley-iron-flashing',
    name: 'Valley Iron & Flashing Repairs',
    icon: '📐',
    description: 'Specialized valley iron and flashing repairs for water diversion',
    slug: 'valley-iron-flashing-repairs',
    color: 'violet',
    features: [
      'Valley iron replacement',
      'Custom flashing fabrication',
      'Waterproof sealing',
      'Structural reinforcement'
    ],
    responseTime: 'Emergency service available',
    priceRange: 'From $650'
  }
];

// Helper function to get service by ID
export function getServiceById(id: string): Service | undefined {
  return CORE_SERVICES.find(service => service.id === id);
}

// Helper function to get service by slug
export function getServiceBySlug(slug: string): Service | undefined {
  return CORE_SERVICES.find(service => service.slug === slug);
}

// Service categories for filtering
export const SERVICE_CATEGORIES = [
  { id: 'repairs', name: 'Repairs & Maintenance', icon: '🔧', services: ['tiled-roof-leaks', 'valley-iron-flashing'] },
  { id: 'restoration', name: 'Restoration', icon: '🏠', services: ['tiled-roof-repointing', 'full-roof-restorations'] },
  { id: 'cleaning', name: 'Cleaning', icon: '💧', services: ['biocide-soft-wash'] },
  { id: 'inspection', name: 'Inspection', icon: '🔍', services: ['drone-roof-inspections'] }
];
