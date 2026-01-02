-- Supabase Migration Script for True Roof 2026 Dynamic Engine
-- Run this SQL in your Supabase SQL editor to enable A/B testing and component tracking

-- ============================================================================
-- A/B TESTS TABLE
-- ============================================================================

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

-- ============================================================================
-- UPDATE PAGES TABLE FOR COMPONENT TRACKING
-- ============================================================================

-- Add component-level tracking columns to pages table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS component_performance JSONB DEFAULT '{}';
ALTER TABLE pages ADD COLUMN IF NOT EXISTS last_optimized_at TIMESTAMPTZ;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS optimization_count INTEGER DEFAULT 0;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS migrated_at TIMESTAMPTZ;

-- ============================================================================
-- MIGRATION FUNCTION FOR EXISTING DATA
-- ============================================================================

-- Function to migrate existing page data to new JSON schema
CREATE OR REPLACE FUNCTION migrate_page_to_dynamic_schema(page_id UUID)
RETURNS JSONB AS $$
DECLARE
  page_record RECORD;
  new_sections JSONB;
BEGIN
  -- Get the page record
  SELECT * INTO page_record FROM pages WHERE id = page_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Page with id % not found', page_id;
  END IF;
  
  -- Convert based on page_type
  CASE page_record.page_type
    WHEN 'home' THEN
      new_sections := jsonb_build_object(
        'layout_order', ARRAY[
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
        'sections', jsonb_build_object(
          'hero_1', jsonb_build_object(
            'type', 'hero_home',
            'id', 'hero_1',
            'data', jsonb_build_object(
              'headline', COALESCE(page_record.h1_heading, 'Professional Roofing Services'),
              'headline_accent', COALESCE(page_record.h2_heading, 'For Your Home'),
              'subheadline', COALESCE(page_record.meta_description, 'Expert roofing solutions with quality craftsmanship'),
              'primary_cta', COALESCE(page_record.primary_cta, 'Get Free Quote'),
              'secondary_cta', COALESCE(page_record.secondary_cta, 'View Services'),
              'stats', COALESCE(page_record.stats, '[]'::jsonb),
              'trust_badges', COALESCE(page_record.trust_badges, '[]'::jsonb)
            ),
            'styles', '',
            'trackingId', 'hero_home'
          ),
          'bento_1', jsonb_build_object(
            'type', 'bento_grid',
            'id', 'bento_1',
            'data', jsonb_build_object(
              'headline', 'Our Services',
              'subheadline', 'Comprehensive roofing solutions for every need',
              'cards', COALESCE(page_record.bento_cards, '[]'::jsonb)
            ),
            'styles', '',
            'trackingId', 'bento_grid'
          ),
          'before_after_1', jsonb_build_object(
            'type', 'before_after',
            'id', 'before_after_1',
            'data', jsonb_build_object(
              'headline', 'Before & After',
              'subheadline', 'See our transformation work',
              'slides', COALESCE(page_record.before_after_slides, '[]'::jsonb)
            ),
            'styles', '',
            'trackingId', 'before_after'
          ),
          'service_map_1', jsonb_build_object(
            'type', 'service_map',
            'id', 'service_map_1',
            'data', jsonb_build_object(
              'headline', 'Service Areas',
              'subheadline', 'We serve these locations with excellence',
              'areas', COALESCE(page_record.service_areas, '[]'::jsonb),
              'center_coordinates', jsonb_build_object('lat', -37.8136, 'lng', 144.9631)
            ),
            'styles', '',
            'trackingId', 'service_map'
          ),
          'testimonials_1', jsonb_build_object(
            'type', 'testimonials',
            'id', 'testimonials_1',
            'data', jsonb_build_object(
              'headline', 'Customer Testimonials',
              'subheadline', 'Hear what our clients have to say about our roofing services',
              'items', COALESCE(page_record.testimonials, '[]'::jsonb),
              'social_proof', COALESCE(page_record.social_proof, '[]'::jsonb)
            ),
            'styles', '',
            'trackingId', 'testimonials'
          ),
          'process_1', jsonb_build_object(
            'type', 'process',
            'id', 'process_1',
            'data', jsonb_build_object(
              'headline', 'Our Process',
              'subheadline', 'Simple, transparent steps to your perfect roof',
              'steps', COALESCE(page_record.process_steps, '[]'::jsonb)
            ),
            'styles', '',
            'trackingId', 'process'
          ),
          'services_1', jsonb_build_object(
            'type', 'services',
            'id', 'services_1',
            'data', jsonb_build_object(
              'headline', 'Our Services',
              'subheadline', 'Comprehensive roofing solutions',
              'highlights', COALESCE(page_record.service_highlights, '[]'::jsonb)
            ),
            'styles', '',
            'trackingId', 'services'
          ),
          'faq_1', jsonb_build_object(
            'type', 'faq',
            'id', 'faq_1',
            'data', jsonb_build_object(
              'headline', 'Frequently Asked Questions',
              'subheadline', 'Find answers to common questions',
              'items', COALESCE(page_record.faq_items, '[]'::jsonb)
            ),
            'styles', '',
            'trackingId', 'faq'
          ),
          'final_cta_1', jsonb_build_object(
            'type', 'final_cta',
            'id', 'final_cta_1',
            'data', jsonb_build_object(
              'headline', 'Ready to Transform Your Roof?',
              'subheadline', 'Get your free, no-obligation quote today',
              'primary_cta', 'Get Free Quote',
              'secondary_cta', 'Schedule Consultation',
              'urgency_text', 'Limited spots available this month',
              'guarantee_text', '100% satisfaction guarantee'
            ),
            'styles', '',
            'trackingId', 'final_cta'
          )
        )
      );
      
    WHEN 'service_hub' THEN
      -- Service hub template migration (simplified)
      new_sections := jsonb_build_object(
        'layout_order', ARRAY[
          'hub_hero_1',
          'hub_filtering_1',
          'hub_services_grid_1',
          'hub_comparison_1',
          'hub_tech_specs_1',
          'hub_process_1',
          'hub_cta_1'
        ],
        'sections', jsonb_build_object(
          'hub_hero_1', jsonb_build_object(
            'type', 'hub_hero',
            'id', 'hub_hero_1',
            'data', jsonb_build_object(
              'headline', COALESCE(page_record.h1_heading, 'Service Hub'),
              'subheadline', COALESCE(page_record.meta_description, 'Find the perfect roofing solution')
            ),
            'styles', '',
            'trackingId', 'hub_hero'
          )
          -- Add other service hub sections as needed
        )
      );
      
    WHEN 'local_service' THEN
      -- Local service template migration (simplified)
      new_sections := jsonb_build_object(
        'layout_order', ARRAY[
          'local_hero_1',
          'local_intel_1',
          'local_technician_log_1',
          'local_services_1',
          'local_social_proof_1',
          'local_emergency_1'
        ],
        'sections', jsonb_build_object(
          'local_hero_1', jsonb_build_object(
            'type', 'local_hero',
            'id', 'local_hero_1',
            'data', jsonb_build_object(
              'headline', COALESCE(page_record.h1_heading, 'Local Roofing Services'),
              'subheadline', COALESCE(page_record.meta_description, 'Serving your local area')
            ),
            'styles', '',
            'trackingId', 'local_hero'
          )
          -- Add other local service sections as needed
        )
      );
      
    ELSE
      -- Default fallback for unknown page types
      new_sections := jsonb_build_object(
        'layout_order', ARRAY['hero_1'],
        'sections', jsonb_build_object(
          'hero_1', jsonb_build_object(
            'type', 'hero_home',
            'id', 'hero_1',
            'data', jsonb_build_object(
              'headline', COALESCE(page_record.h1_heading, 'Professional Roofing Services'),
              'headline_accent', COALESCE(page_record.h2_heading, 'For Your Home'),
              'subheadline', COALESCE(page_record.meta_description, 'Expert roofing solutions')
            ),
            'styles', '',
            'trackingId', 'default_hero'
          )
        )
      );
  END CASE;
  
  -- Update the page with new JSON structure
  UPDATE pages 
  SET 
    content_sections = new_sections,
    migrated_at = NOW(),
    optimization_count = 0
  WHERE id = page_id;
  
  RETURN new_sections;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- BATCH MIGRATION SCRIPT
-- ============================================================================

-- Uncomment and run this to migrate all pages at once
/*
DO $$
DECLARE
  page_record RECORD;
BEGIN
  FOR page_record IN SELECT id, page_type FROM pages WHERE migrated_at IS NULL LOOP
    BEGIN
      PERFORM migrate_page_to_dynamic_schema(page_record.id);
      RAISE NOTICE 'Migrated page: % (%)', page_record.id, page_record.page_type;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Failed to migrate page %: %', page_record.id, SQLERRM;
    END;
  END LOOP;
END;
$$;
*/

-- ============================================================================
-- TEST DATA INSERTION
-- ============================================================================

-- Insert a test A/B test record (example)
INSERT INTO a_b_tests (
  page_id,
  component_id,
  variant_name,
  variant_json,
  test_group_size,
  start_date,
  end_date,
  status
) VALUES (
  (SELECT id FROM pages WHERE slug = '/' LIMIT 1),
  'hero_1',
  'variant_b',
  '{
    "layout_order": ["hero_1", "social_proof", "bento_1", "before_after_1", "service_map_1", "testimonials_1", "process_1", "services_1", "faq_1", "final_cta_1"],
    "sections": {
      "hero_1": {
        "type": "hero_home",
        "id": "hero_1",
        "data": {
          "headline": "Emergency Roof Repair Experts",
          "headline_accent": "Available 24/7",
          "subheadline": "Fast, reliable emergency roofing services when you need them most",
          "primary_cta": "Call Now: Emergency Service",
          "secondary_cta": "Schedule Inspection",
          "stats": [
            {"value": "15", "label": "Minute Response", "suffix": "min"},
            {"value": "100", "label": "Emergency Jobs", "suffix": "+"},
            {"value": "4.9", "label": "Customer Rating", "suffix": "/5"}
          ],
          "trust_badges": ["24/7 Emergency Service", "Licensed & Insured", "Free Estimates"]
        },
        "styles": "bg-red-900 text-white",
        "trackingId": "hero_1_variant_b"
      }
    }
  }'::jsonb,
  0.5,
  NOW(),
  NOW() + INTERVAL '7 days',
  'active'
);

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================

-- View for active A/B tests
CREATE OR REPLACE VIEW active_ab_tests AS
SELECT 
  a.*,
  p.slug as page_slug,
  p.page_type
FROM a_b_tests a
JOIN pages p ON a.page_id = p.id
WHERE a.status = 'active'
AND a.end_date > NOW();

-- View for optimization performance
CREATE OR REPLACE VIEW optimization_performance AS
SELECT 
  p.slug,
  p.page_type,
  p.optimization_count,
  p.last_optimized_at,
  COUNT(DISTINCT a.id) as active_tests,
  AVG(a.conversion_rate) as avg_conversion_rate
FROM pages p
LEFT JOIN a_b_tests a ON p.id = a.page_id AND a.status = 'active'
GROUP BY p.id, p.slug, p.page_type, p.optimization_count, p.last_optimized_at;

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_a_b_tests_updated_at
BEFORE UPDATE ON a_b_tests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_page_type ON pages(page_type);
CREATE INDEX IF NOT EXISTS idx_a_b_tests_component_id ON a_b_tests(component_id);
CREATE INDEX IF NOT EXISTS idx_a_b_tests_created_at ON a_b_tests(created_at DESC);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check migration status
SELECT 
  page_type,
  COUNT(*) as total_pages,
  COUNT(CASE WHEN migrated_at IS NOT NULL THEN 1 END) as migrated_pages,
  COUNT(CASE WHEN migrated_at IS NULL THEN 1 END) as pending_pages
FROM pages
GROUP BY page_type;

-- Check A/B tests
SELECT 
  status,
  COUNT(*) as test_count,
  AVG(test_group_size) as avg_group_size
FROM a_b_tests
GROUP BY status;

-- ============================================================================
-- CLEANUP SCRIPT (if needed)
-- ============================================================================

/*
-- To rollback migration:
ALTER TABLE pages DROP COLUMN IF EXISTS component_performance;
ALTER TABLE pages DROP COLUMN IF EXISTS last_optimized_at;
ALTER TABLE pages DROP COLUMN IF EXISTS optimization_count;
ALTER TABLE pages DROP COLUMN IF EXISTS migrated_at;

DROP TABLE IF EXISTS a_b_tests CASCADE;
DROP TABLE IF EXISTS optimization_logs CASCADE;
DROP FUNCTION IF EXISTS migrate_page_to_dynamic_schema(UUID);
DROP VIEW IF EXISTS active_ab_tests;
DROP VIEW IF EXISTS optimization_performance;
*/
