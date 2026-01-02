# True Roof 2026 - Modular Template Setup Guide

## Overview

This document serves as the single source of truth for working with our modular component architecture. After atomizing the monolithic LocalServiceTemplate.tsx, we now have a clean, maintainable system for dynamic page rendering.

## Architecture Overview

### Component Structure
```
app/components/
├── registry.ts                    # Component registry mapping
├── templates/                     # Template orchestrators
│   ├── HomeTemplate.tsx          # Home page layout
│   ├── LocalServiceTemplate.tsx  # Local service pages
│   └── ServiceHubTemplate.tsx    # Service hub pages
└── sections/                     # Modular components
    ├── shared/                   # Reusable components
    │   ├── AnimatedCounter.tsx
    │   ├── MagneticButton.tsx
    │   ├── NoiseOverlay.tsx
    │   ├── MapTextureBackground.tsx    # NEW
    │   └── ServiceStatusIndicator.tsx  # NEW
    ├── home/                     # Home page sections
    ├── hub/                      # Service hub sections
    └── local/                    # Local service sections
        ├── LocalHeroSection.tsx          # NEW
        ├── LocalIntelSection.tsx         # NEW
        ├── TechnicianLogSection.tsx      # NEW
        ├── LocalServicesSection.tsx      # NEW
        ├── SocialProofSection.tsx        # NEW
        ├── EmergencySection.tsx          # NEW
        └── MobileStickyCTA.tsx           # NEW
```

### Registry System
The `registry.ts` file maps component types to React components for dynamic rendering:

```typescript
export const COMPONENT_REGISTRY: Record<string, React.FC<any>> = {
  // Home Template Sections
  'hero_home': HeroSection,
  'bento_grid': BentoGridSection,

  // Local Service Template Sections
  'local_hero': LocalHeroSection,
  'local_intel': LocalIntelSection,
  'local_technician_log': TechnicianLogSection,
  'local_services': LocalServicesSection,
  'local_social_proof': SocialProofSection,
  'local_emergency': EmergencySection,

  // Add new components here...
};
```

## Database Setup

### Required Tables

Run this SQL script in your Supabase SQL editor to set up the modular system:

```sql
-- ============================================================================
-- PAGES TABLE (Core table for all templates)
-- ============================================================================

CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  page_type TEXT NOT NULL CHECK (page_type IN ('home', 'service_hub', 'local_service')),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,

  -- SEO & Meta
  h1_heading TEXT,
  h2_heading TEXT,
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,

  -- Content (JSON structure for modular components)
  content_sections JSONB DEFAULT '{
    "layout_order": [],
    "sections": {}
  }',

  -- Legacy columns (for backward compatibility during migration)
  primary_cta TEXT,
  secondary_cta TEXT,
  stats JSONB DEFAULT '[]',
  trust_badges JSONB DEFAULT '[]',
  bento_cards JSONB DEFAULT '[]',
  before_after_slides JSONB DEFAULT '[]',
  service_areas JSONB DEFAULT '[]',
  testimonials JSONB DEFAULT '[]',
  social_proof JSONB DEFAULT '[]',
  process_steps JSONB DEFAULT '[]',
  service_highlights JSONB DEFAULT '[]',
  faq_items JSONB DEFAULT '[]',

  -- Analytics & Optimization
  component_performance JSONB DEFAULT '{}',
  last_optimized_at TIMESTAMPTZ,
  optimization_count INTEGER DEFAULT 0,
  migrated_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),

  -- Indexes
  INDEX idx_pages_slug (slug),
  INDEX idx_pages_page_type (page_type),
  INDEX idx_pages_site_id (site_id)
);

-- ============================================================================
-- SITES TABLE (Multi-tenant support)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT UNIQUE NOT NULL,
  site_name TEXT NOT NULL,
  tagline TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#f97316',
  secondary_color TEXT DEFAULT '#dc2626',

  -- Location data (for local SEO)
  location JSONB DEFAULT '{
    "suburb": "Local Area",
    "region": "",
    "postcode": "",
    "state": "",
    "service_radius_km": 25,
    "latitude": -37.8136,
    "longitude": 144.9631
  }',

  -- Settings
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- A/B TESTING TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS a_b_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  component_id TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  variant_json JSONB NOT NULL,
  test_group_size DECIMAL(3,2) DEFAULT 0.5,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),

  -- Metrics
  conversion_rate DECIMAL(5,4),
  time_on_component DECIMAL(10,2),
  hesitation_rate DECIMAL(5,4),
  bounce_rate DECIMAL(5,4),
  scroll_depth DECIMAL(5,4),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  INDEX idx_a_b_tests_page_id (page_id),
  INDEX idx_a_b_tests_status (status),
  INDEX idx_a_b_tests_end_date (end_date)
);

-- ============================================================================
-- COMPONENT ANALYTICS
-- ============================================================================

CREATE TABLE IF NOT EXISTS component_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  component_id TEXT NOT NULL,
  component_type TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'view', 'click', 'conversion', etc.

  -- Event data
  event_data JSONB DEFAULT '{}',
  user_id TEXT, -- Anonymous user tracking
  session_id TEXT,

  -- Context
  user_agent TEXT,
  referrer TEXT,
  viewport_size JSONB,
  scroll_position DECIMAL(5,2),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  INDEX idx_component_analytics_page_id (page_id),
  INDEX idx_component_analytics_component_id (component_id),
  INDEX idx_component_analytics_event_type (event_type),
  INDEX idx_component_analytics_created_at (created_at)
);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE a_b_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_analytics ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on your auth requirements)
CREATE POLICY "Enable read access for all users" ON pages FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON sites FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON a_b_tests FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON component_analytics FOR SELECT USING (true);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_a_b_tests_updated_at BEFORE UPDATE ON a_b_tests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Sample Data Insertion

```sql
-- Insert sample site
INSERT INTO sites (domain, site_name, tagline, phone, email, location) VALUES (
  'trueroof.example.com',
  'True Roof 2026',
  'Professional Roofing Services',
  '(03) 1234 5678',
  'info@trueroof.example.com',
  '{
    "suburb": "Melbourne CBD",
    "region": "Victoria",
    "postcode": "3000",
    "state": "VIC",
    "service_radius_km": 50,
    "latitude": -37.8136,
    "longitude": 144.9631
  }'::jsonb
);

-- Insert sample home page
INSERT INTO pages (
  slug, page_type, site_id, h1_heading, h2_heading, meta_description,
  content_sections
) VALUES (
  '/',
  'home',
  (SELECT id FROM sites LIMIT 1),
  'Professional Roofing Services',
  'For Your Home',
  'Expert roofing solutions with quality craftsmanship and 100% satisfaction guarantee',
  '{
    "layout_order": [
      "hero_1", "bento_1", "before_after_1", "service_map_1",
      "testimonials_1", "process_1", "services_1", "faq_1", "final_cta_1"
    ],
    "sections": {
      "hero_1": {
        "type": "hero_home",
        "id": "hero_1",
        "data": {
          "headline": "Professional Roofing Services",
          "headline_accent": "For Your Home",
          "subheadline": "Expert roofing solutions with quality craftsmanship",
          "primary_cta": "Get Free Quote",
          "secondary_cta": "View Services",
          "stats": [
            {"value": "500", "label": "Happy Customers", "suffix": "+"},
            {"value": "15", "label": "Years Experience", "suffix": "yrs"},
            {"value": "4.9", "label": "Average Rating", "suffix": "/5"}
          ],
          "trust_badges": ["Licensed & Insured", "Free Quotes", "Same-Day Service"]
        },
        "styles": "",
        "trackingId": "hero_home"
      }
    }
  }'::jsonb
);

-- Insert sample local service page
INSERT INTO pages (
  slug, page_type, site_id, h1_heading, meta_description, content_sections
) VALUES (
  '/roofing-melbourne-cbd',
  'local_service',
  (SELECT id FROM sites LIMIT 1),
  'Roofing Services Melbourne CBD',
  'Professional roofing services in Melbourne CBD. Free quotes, licensed contractors.',
  '{
    "layout_order": [
      "local_hero_1", "local_intel_1", "local_technician_log_1",
      "local_services_1", "local_social_proof_1", "local_emergency_1"
    ],
    "sections": {
      "local_hero_1": {
        "type": "local_hero",
        "id": "local_hero_1",
        "data": {
          "headline": "Roofing Services",
          "headline_location": "Melbourne CBD",
          "subheadline": "Professional roofing solutions for Melbourne CBD residents",
          "service_status": {
            "status": "available",
            "teams_available": 3,
            "availability_today": 8,
            "estimated_wait_time": "2-3 days"
          },
          "trust_signals": ["Licensed & Insured", "Free Quotes", "Same-Day Service"]
        },
        "styles": "",
        "trackingId": "local_hero_melbourne"
      },
      "local_intel_1": {
        "type": "local_intel",
        "id": "local_intel_1",
        "data": {
          "headline": "Melbourne CBD Insights",
          "subheadline": "Understanding CBD roofing needs",
          "stats": [
            {"value": "250", "label": "CBD Properties", "suffix": "+", "icon": "🏢"},
            {"value": "4.8", "label": "Response Time", "suffix": "/5", "icon": "⚡"},
            {"value": "95", "label": "Satisfaction", "suffix": "%", "icon": "⭐"}
          ],
          "common_issues": [
            {
              "title": "High-Rise Maintenance",
              "frequency": "Common",
              "severity": "medium",
              "description": "CBD buildings require specialized access and safety protocols",
              "recommended_action": "Schedule annual inspections",
              "avg_repair_cost": "$500-2000"
            }
          ]
        },
        "styles": "",
        "trackingId": "local_intel_melbourne"
      }
    }
  }'::jsonb
);
```

## Working with the Modular System

### Creating New Components

1. **Create the Component File**
```typescript
// app/components/sections/local/NewLocalSection.tsx
'use client';
import * as React from 'react';
import { motion } from 'framer-motion';

interface NewLocalSectionData {
  headline: string;
  subheadline: string;
  // Add your data structure
}

interface SiteData {
  // Site data interface
}

interface NewLocalSectionProps {
  section?: NewLocalSectionData;
  data?: SiteData;
}

const NewLocalSection: React.FC<NewLocalSectionProps> = ({ section, data }) => {
  // Safe data access with fallbacks
  const safeSection = section ?? {
    headline: 'Default Headline',
    subheadline: 'Default subheadline'
  };

  return (
    <section className="py-24 bg-white" data-component-id="new-local-section">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          {safeSection.headline}
        </h2>
        <p className="text-lg text-slate-600">
          {safeSection.subheadline}
        </p>
      </div>
    </section>
  );
};

export default NewLocalSection;
```

2. **Register the Component**
```typescript
// app/components/registry.ts
import NewLocalSection from './sections/local/NewLocalSection';

// Add to COMPONENT_REGISTRY
export const COMPONENT_REGISTRY: Record<string, React.FC<any>> = {
  // ... existing components
  'new_local_section': NewLocalSection,
};
```

3. **Add to Template**
```typescript
// app/components/templates/LocalServiceTemplate.tsx
// Import the new component
import NewLocalSection from '~/components/sections/local/NewLocalSection';

// Add to the main render
<main>
  {/* ... existing sections */}
  <NewLocalSection
    section={safeSections.new_section}
    data={safeData}
  />
</main>
```

### Component Data Structure

Each component receives props with this structure:

```typescript
interface ComponentProps {
  section?: ComponentData;  // The component's data from database
  data?: SiteData;         // Global site data (phone, location, etc.)
}
```

### Best Practices

1. **Always provide fallbacks** for undefined data
2. **Use TypeScript interfaces** for all data structures
3. **Include data-component-id** attributes for tracking
4. **Leverage shared components** when possible
5. **Follow naming conventions**: `TemplateNameSectionName.tsx`

### A/B Testing Components

To create A/B tests for components:

```sql
INSERT INTO a_b_tests (
  page_id,
  component_id,
  variant_name,
  variant_json,
  test_group_size
) VALUES (
  (SELECT id FROM pages WHERE slug = '/roofing-melbourne-cbd'),
  'local_hero_1',
  'urgency_variant',
  '{
    "type": "local_hero",
    "id": "local_hero_1",
    "data": {
      "headline": "Emergency Roofing Services",
      "headline_location": "Melbourne CBD",
      "subheadline": "⚠️ Limited availability - Book today!",
      "urgency_text": "Only 2 slots left this week"
    }
  }'::jsonb,
  0.3  -- 30% of users see this variant
);
```

### Analytics Integration

Components automatically track interactions via the `data-component-id` attribute. The system captures:

- View events (when component enters viewport)
- Click events (button/form interactions)
- Conversion events (form submissions, calls)
- Scroll depth and time spent

### Migration from Legacy Data

If you have existing pages with flat data structure, use this migration function:

```sql
-- Migrate a specific page
SELECT migrate_page_to_dynamic_schema(
  (SELECT id FROM pages WHERE slug = '/old-page-slug')
);

-- Migrate all unmigrated pages
DO $$
DECLARE
  page_record RECORD;
BEGIN
  FOR page_record IN SELECT id FROM pages WHERE migrated_at IS NULL LOOP
    PERFORM migrate_page_to_dynamic_schema(page_record.id);
  END LOOP;
END;
$$;
```

## Template Types

### Home Template (`page_type: 'home'`)
- **Purpose**: Main landing page for the business
- **Sections**: Hero, Bento Grid, Before/After, Service Map, Testimonials, Process, Services, FAQ, Final CTA
- **Layout Order**: Marketing-focused, conversion-oriented

### Service Hub Template (`page_type: 'service_hub'`)
- **Purpose**: Category pages for service types (residential, commercial, emergency)
- **Sections**: Hub Hero, Filtering Matrix, Services Grid, Comparison, Tech Specs, Process, CTA
- **Layout Order**: Educational and filtering-focused

### Local Service Template (`page_type: 'local_service'`)
- **Purpose**: Location-specific pages (city/neighborhood)
- **Sections**: Local Hero, Local Intel, Technician Log, Local Services, Social Proof, Emergency
- **Layout Order**: Local SEO optimized, trust-building

## Troubleshooting

### Component Not Rendering
1. Check if component is registered in `registry.ts`
2. Verify the component type matches the database `type` field
3. Check browser console for TypeScript errors
4. Ensure all required props have fallbacks

### Database Issues
1. Verify RLS policies allow read access
2. Check that JSON structure matches component interfaces
3. Use the verification queries to check migration status

### Performance Issues
1. Components are lazy-loaded by default
2. Use `React.memo()` for expensive components
3. Optimize images and animations
4. Monitor component analytics for bottlenecks

## Development Workflow

1. **Create Component** → Register in registry → Add to template
2. **Test Locally** → Verify data structure → Check responsive design
3. **Add Analytics** → Include tracking IDs → Test event capture
4. **Deploy** → Monitor performance → A/B test variations

## Support

For questions about the modular system:
- Check this document first
- Review existing component implementations
- Test with sample data before production use
- Monitor analytics for optimization opportunities

---

**Last Updated**: January 2, 2026
**Version**: 1.0.0
**Status**: Production Ready
