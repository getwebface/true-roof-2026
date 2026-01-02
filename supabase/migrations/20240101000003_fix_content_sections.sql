-- Fix content_sections structure to match component expectations
-- This migration ensures all pages have properly formatted content_sections
-- that match the exact interface expected by each React component

-- Function to validate and fix content_sections structure
CREATE OR REPLACE FUNCTION fix_content_sections_structure()
RETURNS void AS $$
DECLARE
  page_record RECORD;
  fixed_sections JSONB;
BEGIN
  -- Process each page
  FOR page_record IN SELECT id, slug, page_type, content_sections FROM pages WHERE content_sections IS NOT NULL LOOP
    -- Fix based on page type
    CASE page_record.page_type
      WHEN 'home' THEN
        fixed_sections := '{
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
        }'::jsonb;

      WHEN 'service_hub' THEN
        fixed_sections := '{
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
        }'::jsonb;

      WHEN 'local_service' THEN
        fixed_sections := '{
          "layout_order": ["local_hero_1", "local_intel_1", "local_technician_log_1", "local_services_1", "local_social_proof_1", "local_emergency_1"],
          "sections": {
            "local_hero_1": {
              "type": "local_hero",
              "id": "local_hero_1",
              "data": {
                "headline": "Local Roofing Services",
                "subheadline": "Serving your local area with professional roofing solutions"
              },
              "styles": "",
              "trackingId": "local_hero"
            }
          }
        }'::jsonb;

      ELSE
        -- Default fallback
        fixed_sections := '{
          "layout_order": ["hero_1"],
          "sections": {
            "hero_1": {
              "type": "hero_home",
              "id": "hero_1",
              "data": {
                "headline": "Professional Roofing Services",
                "headline_accent": "For Your Home",
                "subheadline": "Expert roofing solutions with quality craftsmanship"
              },
              "styles": "",
              "trackingId": "default_hero"
            }
          }
        }'::jsonb;
    END CASE;

    -- Update the page with fixed sections
    UPDATE pages
    SET content_sections = fixed_sections,
        updated_at = NOW()
    WHERE id = page_record.id;

    RAISE NOTICE 'Fixed content_sections for page: % (%)', page_record.slug, page_record.page_type;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the fix function
SELECT fix_content_sections_structure();

-- Clean up the function
DROP FUNCTION fix_content_sections_structure();

-- Ensure all pages have required fields
UPDATE pages SET
  company_name = COALESCE(company_name, 'True Roof'),
  tagline = COALESCE(tagline, 'Professional Roofing Services'),
  phone_number = COALESCE(phone_number, '+61 400 000 000'),
  email = COALESCE(email, 'contact@example.com'),
  address = COALESCE(address, '123 Roofing St, Melbourne VIC 3000'),
  logo_url = COALESCE(logo_url, '/logo.svg'),
  primary_color = COALESCE(primary_color, '#f97316'),
  secondary_color = COALESCE(secondary_color, '#dc2626'),
  website_url = COALESCE(website_url, 'https://trueroof.com.au'),
  location_name = COALESCE(location_name, 'Local Area'),
  location_state_region = COALESCE(location_state_region, 'VIC'),
  postcode = COALESCE(postcode, '3756'),
  service_radius_km = COALESCE(service_radius_km, 50),
  updated_at = NOW()
WHERE company_name IS NULL
   OR tagline IS NULL
   OR phone_number IS NULL
   OR email IS NULL
   OR address IS NULL
   OR logo_url IS NULL
   OR primary_color IS NULL
   OR secondary_color IS NULL
   OR website_url IS NULL
   OR location_name IS NULL
   OR location_state_region IS NULL
   OR postcode IS NULL
   OR service_radius_km IS NULL;

-- Verify the fix worked
SELECT
  slug,
  page_type,
  jsonb_object_keys(content_sections->'sections') as section_count,
  content_sections->'layout_order' as layout_order
FROM pages
WHERE content_sections IS NOT NULL
ORDER BY slug;
