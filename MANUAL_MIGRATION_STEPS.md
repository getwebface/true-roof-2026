# Manual Migration Steps for True Roof 2026 Dynamic Engine

## Overview
This document contains the manual steps required to migrate from the static template system to the new dynamic, data-driven engine.

## 1. Database Schema Updates

### A/B Tests Table Creation
Run this SQL in your Supabase SQL editor:

```sql
-- Create A/B tests table
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metrics (updated by analytics)
  conversion_rate DECIMAL(5,4),
  time_on_component DECIMAL(10,2),
  hesitation_rate DECIMAL(5,4),
  bounce_rate DECIMAL(5,4),
  scroll_depth DECIMAL(5,4),
  
  -- Indexes for performance
  INDEX idx_a_b_tests_page_id (page_id),
  INDEX idx_a_b_tests_status (status),
  INDEX idx_a_b_tests_end_date (end_date)
);

-- Create optimization logs table
CREATE TABLE IF NOT EXISTS optimization_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  component_id TEXT,
  action TEXT NOT NULL,
  variant_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Add RLS policies
ALTER TABLE a_b_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your auth setup)
CREATE POLICY "Enable read access for all users" ON a_b_tests FOR SELECT USING (true);
CREATE POLICY "Enable insert for service role" ON a_b_tests FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON a_b_tests FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON optimization_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert for service role" ON optimization_logs FOR INSERT WITH CHECK (true);
```

### Update Pages Table Schema
Add columns for tracking component-level analytics:

```sql
-- Add component-level tracking columns to pages table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS component_performance JSONB DEFAULT '{}';
ALTER TABLE pages ADD COLUMN IF NOT EXISTS last_optimized_at TIMESTAMPTZ;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS optimization_count INTEGER DEFAULT 0;
```

## 2. Environment Variables

Add these environment variables to your deployment:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# AI Optimization Worker
AI_OPTIMIZATION_ENABLED=true
AI_OPTIMIZATION_INTERVAL=3600000  # 1 hour in milliseconds
AI_OPTIMIZATION_THRESHOLD=0.3     # 30% hesitation rate threshold

# Analytics
ANALYTICS_ENDPOINT=https://your-analytics-service.com
ANALYTICS_API_KEY=your_analytics_api_key
```

## 3. Data Migration Script

Run this Node.js script to migrate existing page data to the new JSON schema:

```javascript
// migrate-pages.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migratePages() {
  console.log('Starting page migration...');
  
  // Fetch all pages
  const { data: pages, error } = await supabase
    .from('pages')
    .select('*');
    
  if (error) {
    console.error('Error fetching pages:', error);
    return;
  }
  
  console.log(`Found ${pages.length} pages to migrate`);
  
  for (const page of pages) {
    let newSections = {};
    
    // Convert based on page_type
    switch (page.page_type) {
      case 'home':
        newSections = migrateHomeTemplate(page);
        break;
      case 'service_hub':
        newSections = migrateServiceHubTemplate(page);
        break;
      case 'local_service':
        newSections = migrateLocalServiceTemplate(page);
        break;
      default:
        console.log(`Unknown page type: ${page.page_type}, skipping`);
        continue;
    }
    
    // Update the page with new JSON structure
    const { error: updateError } = await supabase
      .from('pages')
      .update({
        content_sections: newSections,
        migrated_at: new Date().toISOString()
      })
      .eq('id', page.id);
      
    if (updateError) {
      console.error(`Error updating page ${page.id}:`, updateError);
    } else {
      console.log(`Migrated page: ${page.slug}`);
    }
  }
  
  console.log('Migration complete!');
}

function migrateHomeTemplate(page) {
  // Example migration for home template
  return {
    layout_order: [
      'hero_1',
      'bento_1',
      'before_after_1',
      'service_map_1',
      'testimonials_1',
      'process_1',
      'services_1',
      'faq_1',
      'final_cta_1'
    ],
    sections: {
      hero_1: {
        type: 'hero_home',
        id: 'hero_1',
        data: {
          headline: page.h1_heading || 'Professional Roofing Services',
          headline_accent: page.h2_heading || 'For Your Home',
          subheadline: page.meta_description || 'Expert roofing solutions with quality craftsmanship',
          primary_cta: page.primary_cta || 'Get Free Quote',
          secondary_cta: page.secondary_cta || 'View Services',
          stats: page.stats || [],
          trust_badges: page.trust_badges || []
        },
        styles: '',
        trackingId: 'hero_home'
      },
      // Add other sections based on your existing data structure
      // ...
    }
  };
}

function migrateServiceHubTemplate(page) {
  // Similar structure for service hub
  return {
    layout_order: [
      'hub_hero_1',
      'hub_filtering_1',
      'hub_services_grid_1',
      'hub_comparison_1',
      'hub_tech_specs_1',
      'hub_process_1',
      'hub_cta_1'
    ],
    sections: {
      hub_hero_1: {
        type: 'hub_hero',
        id: 'hub_hero_1',
        data: {
          // Map your existing data
        },
        styles: '',
        trackingId: 'hub_hero'
      },
      // ...
    }
  };
}

function migrateLocalServiceTemplate(page) {
  // Similar structure for local service
  return {
    layout_order: [
      'local_hero_1',
      'local_intel_1',
      'local_technician_log_1',
      'local_services_1',
      'local_social_proof_1',
      'local_emergency_1'
    ],
    sections: {
      local_hero_1: {
        type: 'local_hero',
        id: 'local_hero_1',
        data: {
          // Map your existing data
        },
        styles: '',
        trackingId: 'local_hero'
      },
      // ...
    }
  };
}

// Run migration
migratePages().catch(console.error);
```

## 4. Verification Commands

### Test Database Connection
```bash
curl -X GET \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/pages?select=id,slug,page_type&limit=1"
```

### Test A/B Test Table
```bash
curl -X POST \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{
    "page_id": "YOUR_PAGE_UUID",
    "component_id": "hero_1",
    "variant_name": "test_variant",
    "variant_json": {"layout_order": ["hero_1"], "sections": {"hero_1": {"type": "hero_home", "id": "hero_1", "data": {}, "styles": ""}}},
    "test_group_size": 0.1
  }' \
  "$SUPABASE_URL/rest/v1/a_b_tests"
```

### Trigger AI Optimization Worker Manually
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "action": "optimize",
    "page_id": "YOUR_PAGE_UUID",
    "component_id": "hero_1"
  }' \
  "https://your-worker-url.workers.dev/optimize"
```

## 5. Frontend Verification

### Check Dynamic Rendering
1. Start your development server:
```bash
npm run dev
```

2. Visit any page and check browser console for:
   - "Invalid sections structure" warning (if data not migrated)
   - "Unknown component type" warnings (if registry incomplete)

3. Test with sample JSON:
```json
{
  "layout_order": ["hero_1", "bento_1"],
  "sections": {
    "hero_1": {
      "type": "hero_home",
      "id": "hero_1",
      "data": {
        "headline": "Test Dynamic Page",
        "headline_accent": "Working!",
        "subheadline": "This is a test of the dynamic rendering system",
        "primary_cta": "Test CTA",
        "secondary_cta": "Secondary Action",
        "stats": [
          {"value": "100", "label": "Projects", "suffix": "+"},
          {"value": "15", "label": "Years Experience", "suffix": "+"}
        ],
        "trust_badges": ["24/7 Emergency Service", "Licensed & Insured"]
      },
      "styles": "bg-blue-900",
      "trackingId": "test_hero"
    },
    "bento_1": {
      "type": "bento_grid",
      "id": "bento_1",
      "data": {
        "headline": "Our Services",
        "subheadline": "Comprehensive roofing solutions",
        "cards": [
          {
            "id": "card_1",
            "type": "feature",
            "span": "single",
            "title": "Roof Repair",
            "description": "Fast, reliable roof repairs",
            "icon": "🔧"
          }
        ]
      },
      "styles": "",
      "trackingId": "test_bento"
    }
  }
}
```

## 6. Rollback Plan

If issues occur, revert to original templates:

1. Comment out the new route logic in `app/routes/$.tsx` and restore the original switch statement
2. Keep the new components but don't use the dynamic renderer
3. Database changes are additive, so they won't break existing functionality

## 7. Performance Monitoring

After deployment, monitor:

1. **Page Load Times**: Compare before/after dynamic rendering
2. **Memory Usage**: Check for memory leaks in component registry
3. **Database Performance**: Monitor Supabase query performance
4. **Error Rates**: Track any rendering errors in production

## 8. Next Steps After Migration

1. **Extract Remaining Components**: Complete the extraction of all template sections
2. **Update Registry**: Add all extracted components to the registry
3. **Test A/B Functionality**: Verify the AI optimization worker can read/write JSON
4. **Add Analytics**: Implement tracking for component-level metrics
5. **Create Admin UI**: Build dashboard for viewing A/B test results
6. **Optimize Performance**: Implement lazy loading for components
7. **Add Caching**: Cache rendered components for better performance
