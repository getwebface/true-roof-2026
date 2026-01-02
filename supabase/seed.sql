-- Seed data for True Roof 2026
-- This file contains default data for development and testing

-- ============================================================================
-- DEFAULT PAGES
-- ============================================================================

-- Insert default home page
INSERT INTO pages (
  id,
  slug,
  page_type,
  h1_heading,
  h2_heading,
  meta_description,
  primary_cta,
  secondary_cta,
  content_sections,
  stats,
  trust_badges,
  bento_cards,
  before_after_slides,
  service_areas,
  testimonials,
  social_proof,
  process_steps,
  service_highlights,
  faq_items,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '/',
  'home',
  'Professional Roofing Services',
  'For Your Home',
  'Expert roofing solutions with quality craftsmanship and reliable service. Get your free quote today.',
  'Get Free Quote',
  'View Services',
  '{
    "layout_order": ["hero_1", "bento_1", "before_after_1", "service_map_1", "testimonials_1", "process_1", "services_1", "faq_1", "final_cta_1"],
    "sections": {
      "hero_1": {
        "type": "hero_home",
        "id": "hero_1",
        "data": {
          "headline": "Professional Roofing Services",
          "headline_accent": "For Your Home",
          "subheadline": "Expert roofing solutions with quality craftsmanship and reliable service",
          "primary_cta": "Get Free Quote",
          "secondary_cta": "View Services",
          "stats": [
            {"value": "25", "label": "Years Experience", "suffix": "+"},
            {"value": "5000", "label": "Roofs Completed", "suffix": "+"},
            {"value": "4.9", "label": "Customer Rating", "suffix": "/5"}
          ],
          "trust_badges": ["Licensed & Insured", "Free Estimates", "24/7 Emergency Service"]
        },
        "styles": "",
        "trackingId": "hero_home"
      },
      "bento_1": {
        "type": "bento_grid",
        "id": "bento_1",
        "data": {
          "headline": "Our Services",
          "subheadline": "Comprehensive roofing solutions for every need",
          "cards": [
            {
              "title": "Roof Installation",
              "description": "Complete roof replacement with premium materials",
              "icon": "home",
              "link": "/services/roof-installation"
            },
            {
              "title": "Roof Repair",
              "description": "Expert repairs for leaks, damage, and wear",
              "icon": "wrench",
              "link": "/services/roof-repair"
            },
            {
              "title": "Emergency Service",
              "description": "24/7 emergency roofing services",
              "icon": "clock",
              "link": "/services/emergency"
            }
          ]
        },
        "styles": "",
        "trackingId": "bento_grid"
      },
      "before_after_1": {
        "type": "before_after",
        "id": "before_after_1",
        "data": {
          "headline": "Before & After",
          "subheadline": "See our transformation work",
          "slides": [
            {
              "before_image": "/images/before-after-1-before.jpg",
              "after_image": "/images/before-after-1-after.jpg",
              "title": "Complete Roof Replacement",
              "description": "Transformed an old, damaged roof into a beautiful, durable new one"
            }
          ]
        },
        "styles": "",
        "trackingId": "before_after"
      },
      "service_map_1": {
        "type": "service_map",
        "id": "service_map_1",
        "data": {
          "headline": "Service Areas",
          "subheadline": "We serve these locations with excellence",
          "areas": [
            {"name": "Melbourne CBD", "lat": -37.8136, "lng": 144.9631},
            {"name": "St Kilda", "lat": -37.8676, "lng": 144.9800},
            {"name": "Richmond", "lat": -37.8230, "lng": 145.0077}
          ],
          "center_coordinates": {"lat": -37.8136, "lng": 144.9631}
        },
        "styles": "",
        "trackingId": "service_map"
      },
      "testimonials_1": {
        "type": "testimonials",
        "id": "testimonials_1",
        "data": {
          "headline": "Customer Testimonials",
          "subheadline": "Hear what our clients have to say about our roofing services",
          "items": [
            {
              "name": "Sarah Johnson",
              "location": "Melbourne",
              "rating": 5,
              "text": "Excellent service from start to finish. The team was professional, arrived on time, and did beautiful work on our roof.",
              "date": "2024-01-15"
            }
          ],
          "social_proof": [
            {"platform": "Google", "rating": 4.9, "count": 150}
          ]
        },
        "styles": "",
        "trackingId": "testimonials"
      },
      "process_1": {
        "type": "process",
        "id": "process_1",
        "data": {
          "headline": "Our Process",
          "subheadline": "Simple, transparent steps to your perfect roof",
          "steps": [
            {
              "number": 1,
              "title": "Free Inspection",
              "description": "We assess your roof and provide a detailed quote"
            },
            {
              "number": 2,
              "title": "Planning & Permits",
              "description": "We handle all necessary permits and planning"
            },
            {
              "number": 3,
              "title": "Installation",
              "description": "Professional installation with quality materials"
            },
            {
              "number": 4,
              "title": "Final Inspection",
              "description": "We ensure everything meets our high standards"
            }
          ]
        },
        "styles": "",
        "trackingId": "process"
      },
      "services_1": {
        "type": "services",
        "id": "services_1",
        "data": {
          "headline": "Our Services",
          "subheadline": "Comprehensive roofing solutions",
          "highlights": [
            {
              "title": "Residential Roofing",
              "description": "Complete roofing services for homes",
              "features": ["Installation", "Repair", "Maintenance"]
            },
            {
              "title": "Commercial Roofing",
              "description": "Professional roofing for businesses",
              "features": ["Large Projects", "Insurance Claims", "Warranties"]
            }
          ]
        },
        "styles": "",
        "trackingId": "services"
      },
      "faq_1": {
        "type": "faq",
        "id": "faq_1",
        "data": {
          "headline": "Frequently Asked Questions",
          "subheadline": "Find answers to common questions",
          "items": [
            {
              "question": "How long does a roof replacement take?",
              "answer": "Most residential roof replacements take 1-3 days, depending on the size and complexity."
            },
            {
              "question": "Do you provide warranties?",
              "answer": "Yes, we provide comprehensive warranties on both materials and workmanship."
            }
          ]
        },
        "styles": "",
        "trackingId": "faq"
      },
      "final_cta_1": {
        "type": "final_cta",
        "id": "final_cta_1",
        "data": {
          "headline": "Ready to Transform Your Roof?",
          "subheadline": "Get your free, no-obligation quote today",
          "primary_cta": "Get Free Quote",
          "secondary_cta": "Schedule Consultation",
          "urgency_text": "Limited spots available this month",
          "guarantee_text": "100% satisfaction guarantee"
        },
        "styles": "",
        "trackingId": "final_cta"
      }
    }
  }'::jsonb,
  '[{"value": "25", "label": "Years Experience", "suffix": "+"}, {"value": "5000", "label": "Roofs Completed", "suffix": "+"}, {"value": "4.9", "label": "Customer Rating", "suffix": "/5"}]'::jsonb,
  '["Licensed & Insured", "Free Estimates", "24/7 Emergency Service"]'::jsonb,
  '[{"title": "Roof Installation", "description": "Complete roof replacement with premium materials", "icon": "home", "link": "/services/roof-installation"}, {"title": "Roof Repair", "description": "Expert repairs for leaks, damage, and wear", "icon": "wrench", "link": "/services/roof-repair"}, {"title": "Emergency Service", "description": "24/7 emergency roofing services", "icon": "clock", "link": "/services/emergency"}]'::jsonb,
  '[{"before_image": "/images/before-after-1-before.jpg", "after_image": "/images/before-after-1-after.jpg", "title": "Complete Roof Replacement", "description": "Transformed an old, damaged roof into a beautiful, durable new one"}]'::jsonb,
  '[{"name": "Melbourne CBD", "lat": -37.8136, "lng": 144.9631}, {"name": "St Kilda", "lat": -37.8676, "lng": 144.9800}, {"name": "Richmond", "lat": -37.8230, "lng": 145.0077}]'::jsonb,
  '[{"name": "Sarah Johnson", "location": "Melbourne", "rating": 5, "text": "Excellent service from start to finish. The team was professional, arrived on time, and did beautiful work on our roof.", "date": "2024-01-15"}]'::jsonb,
  '[{"platform": "Google", "rating": 4.9, "count": 150}]'::jsonb,
  '[{"number": 1, "title": "Free Inspection", "description": "We assess your roof and provide a detailed quote"}, {"number": 2, "title": "Planning & Permits", "description": "We handle all necessary permits and planning"}, {"number": 3, "title": "Installation", "description": "Professional installation with quality materials"}, {"number": 4, "title": "Final Inspection", "description": "We ensure everything meets our high standards"}]'::jsonb,
  '[{"title": "Residential Roofing", "description": "Complete roofing services for homes", "features": ["Installation", "Repair", "Maintenance"]}, {"title": "Commercial Roofing", "description": "Professional roofing for businesses", "features": ["Large Projects", "Insurance Claims", "Warranties"]}]'::jsonb,
  '[{"question": "How long does a roof replacement take?", "answer": "Most residential roof replacements take 1-3 days, depending on the size and complexity."}, {"question": "Do you provide warranties?", "answer": "Yes, we provide comprehensive warranties on both materials and workmanship."}]'::jsonb,
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- DEFAULT OPTIMIZATION HISTORY
-- ============================================================================

-- Insert some sample optimization proposals
INSERT INTO optimization_history (
  proposal_id,
  page_id,
  component_id,
  proposal_type,
  current_performance,
  proposed_changes,
  expected_impact,
  status,
  created_at,
  updated_at
) VALUES (
  'opt_hero_cta_001',
  (SELECT id FROM pages WHERE slug = '/' LIMIT 1),
  'hero_1',
  'cta_optimization',
  '{"conversion_rate": 2.3, "time_on_page": 45, "bounce_rate": 65}'::jsonb,
  '{"primary_cta": "Get Your Free Quote Today", "urgency_text": "Limited Time Offer"}'::jsonb,
  '{"conversion_increase": 25, "confidence_level": "high"}'::jsonb,
  'proposed',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days'
) ON CONFLICT (proposal_id) DO NOTHING;

-- ============================================================================
-- SAMPLE A/B TEST (for development)
-- ============================================================================

-- Insert a sample A/B test
INSERT INTO a_b_tests (
  page_id,
  component_id,
  variant_name,
  variant_json,
  test_group_size,
  start_date,
  end_date,
  status,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM pages WHERE slug = '/' LIMIT 1),
  'hero_1',
  'urgency_variant',
  '{
    "layout_order": ["hero_1", "bento_1", "before_after_1", "service_map_1", "testimonials_1", "process_1", "services_1", "faq_1", "final_cta_1"],
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
        "trackingId": "hero_1_urgency_variant"
      }
    }
  }'::jsonb,
  0.5,
  NOW() - INTERVAL '7 days',
  NOW() + INTERVAL '7 days',
  'active',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- SAMPLE APPLICATION LOGS (for development)
-- ============================================================================

-- Insert some sample application logs
INSERT INTO application_logs (
  id,
  timestamp,
  level,
  category,
  message,
  user_id,
  session_id,
  page_url,
  component_id,
  metadata,
  environment,
  version
) VALUES (
  gen_random_uuid(),
  NOW() - INTERVAL '1 hour',
  'INFO',
  'user_action',
  'User clicked Get Free Quote button',
  NULL,
  'session_123456',
  '/',
  'hero_1',
  '{"button_text": "Get Free Quote", "user_agent": "Mozilla/5.0...", "referrer": "google.com"}'::jsonb,
  'development',
  '1.0.0'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO application_logs (
  id,
  timestamp,
  level,
  category,
  message,
  user_id,
  session_id,
  page_url,
  component_id,
  metadata,
  environment,
  version
) VALUES (
  gen_random_uuid(),
  NOW() - INTERVAL '30 minutes',
  'ERROR',
  'client',
  'Failed to load component: TypeError: Cannot read property of undefined',
  NULL,
  'session_123456',
  '/',
  'bento_1',
  '{"error_stack": "at Component.render...", "component_props": {"cards": []}}'::jsonb,
  'development',
  '1.0.0'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SAMPLE OPTIMIZATION LOGS
-- ============================================================================

INSERT INTO optimization_logs (
  page_id,
  component_id,
  action,
  variant_count,
  created_at,
  metadata
) VALUES (
  (SELECT id FROM pages WHERE slug = '/' LIMIT 1),
  'hero_1',
  'variant_created',
  2,
  NOW() - INTERVAL '7 days',
  '{"variant_names": ["original", "urgency_variant"], "test_type": "cta_optimization"}'::jsonb
) ON CONFLICT DO NOTHING;
