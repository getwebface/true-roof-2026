-- Update seed data for True Roof 2026
-- This migration updates the pages table with proper content_sections structure

-- Update the home page with correct content_sections
UPDATE pages SET
  page_type = 'home',
  h1_heading = 'Professional Roofing Services',
  h2_heading = 'For Your Home',
  meta_description = 'Expert roofing solutions with quality craftsmanship and reliable service. Get your free quote today.',
  primary_cta = 'Get Free Quote',
  secondary_cta = 'View Services',
  content_sections = '{
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
              "id": "service-1",
              "type": "feature",
              "span": "single",
              "title": "Roof Installation",
              "description": "Complete roof replacement with premium materials",
              "icon": "home"
            },
            {
              "id": "service-2",
              "type": "feature",
              "span": "single",
              "title": "Roof Repair",
              "description": "Expert repairs for leaks, damage, and wear",
              "icon": "wrench"
            },
            {
              "id": "service-3",
              "type": "feature",
              "span": "single",
              "title": "Emergency Service",
              "description": "24/7 emergency roofing services",
              "icon": "clock"
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
              "title": "Installation of materials"
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
  stats = '[{"value": "25", "label": "Years Experience", "suffix": "+"}, {"value": "5000", "label": "Roofs Completed", "suffix": "+"}, {"value": "4.9", "label": "Customer Rating", "suffix": "/5"}]'::jsonb,
  trust_badges = '["Licensed & Insured", "Free Estimates", "24/7 Emergency Service"]'::jsonb,
  bento_cards = '[{"title": "Roof Installation", "description": "Complete roof replacement with premium materials", "icon": "home", "link": "/services/roof-installation"}, {"title": "Roof Repair", "description": "Expert repairs for leaks, damage, and wear", "icon": "wrench", "link": "/services/roof-repair"}, {"title": "Emergency Service", "description": "24/7 emergency roofing services", "icon": "clock", "link": "/services/emergency"}]'::jsonb,
  before_after_slides = '[{"before_image": "/images/before-after-1-before.jpg", "after_image": "/images/before-after-1-after.jpg", "title": "Complete Roof Replacement", "description": "Transformed an old, damaged roof into a beautiful, durable new one"}]'::jsonb,
  service_areas = '[{"name": "Melbourne CBD", "lat": -37.8136, "lng": 144.9631}, {"name": "St Kilda", "lat": -37.8676, "lng": 144.9800}, {"name": "Richmond", "lat": -37.8230, "lng": 145.0077}]'::jsonb,
  testimonials = '[{"name": "Sarah Johnson", "location": "Melbourne", "rating": 5, "text": "Excellent service from start to finish. The team was professional, arrived on time, and did beautiful work on our roof.", "date": "2024-01-15"}]'::jsonb,
  social_proof = '[{"platform": "Google", "rating": 4.9, "count": 150}]'::jsonb,
  process_steps = '[{"number": 1, "title": "Free Inspection", "description": "We assess your roof and provide a detailed quote"}, {"number": 2, "title": "Planning & Permits", "description": "We handle all necessary permits and planning"}, {"number": 3, "title": "Installation", "description": "Professional installation with quality materials"}, {"number": 4, "title": "Final Inspection", "description": "We ensure everything meets our high standards"}]'::jsonb,
  service_highlights = '[{"title": "Residential Roofing", "description": "Complete roofing services for homes", "features": ["Installation", "Repair", "Maintenance"]}, {"title": "Commercial Roofing", "description": "Professional roofing for businesses", "features": ["Large Projects", "Insurance Claims", "Warranties"]}]'::jsonb,
  faq_items = '[{"question": "How long does a roof replacement take?", "answer": "Most residential roof replacements take 1-3 days, depending on the size and complexity."}, {"question": "Do you provide warranties?", "answer": "Yes, we provide comprehensive warranties on both materials and workmanship."}]'::jsonb,
  updated_at = NOW()
WHERE slug = '/';

-- Insert additional pages if they don't exist
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
  created_at,
  updated_at
) VALUES
  (
    gen_random_uuid(),
    '/services',
    'service_hub',
    'Roofing Services',
    'Professional Solutions',
    'Comprehensive roofing services for residential and commercial properties',
    'Get Quote',
    'Contact Us',
    '{
      "layout_order": ["hub_hero_1", "hub_filtering_1", "hub_services_grid_1", "hub_comparison_1", "hub_tech_specs_1", "hub_process_1", "hub_cta_1"],
      "sections": {
        "hub_hero_1": {
          "type": "hub_hero",
          "id": "hub_hero_1",
          "data": {
            "headline": "Professional Roofing Services",
            "subheadline": "Find the perfect roofing solution for your property"
          },
          "styles": "",
          "trackingId": "hub_hero"
        }
      }
    }'::jsonb,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '/local/melbourne',
    'local_service',
    'Melbourne Roofing Services',
    'Local Experts',
    'Professional roofing services in Melbourne and surrounding areas',
    'Get Local Quote',
    'Call Now',
    '{
      "layout_order": ["local_hero_1", "local_intel_1", "local_technician_log_1", "local_services_1", "local_social_proof_1", "local_emergency_1"],
      "sections": {
        "local_hero_1": {
          "type": "local_hero",
          "id": "local_hero_1",
          "data": {
            "headline": "Melbourne Roofing Services",
            "subheadline": "Serving Melbourne with professional roofing solutions"
          },
          "styles": "",
          "trackingId": "local_hero"
        }
      }
    }'::jsonb,
    NOW(),
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;
