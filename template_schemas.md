# Complete Template Schema Documentation - True Roof 2026

This document provides the exact JSON structure required for each template in the True Roof 2026 dynamic page system.

## Table of Contents
1. [HomeTemplate Schema](#hometemplate-schema)
2. [ServiceHubTemplate Schema](#servicehubtemplate-schema)
3. [LocalServiceTemplate Schema](#localservicetemplate-schema)
4. [Database Field Requirements](#database-field-requirements)
5. [Validation Rules](#validation-rules)
6. [Migration Notes](#migration-notes)

---

## HomeTemplate Schema

**Required for pages with `page_type = 'home'`**

### Root Structure
```json
{
  "data": {
    "site_name": "string",
    "tagline": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "logo_url": "string",
    "primary_color": "string",
    "secondary_color": "string",
    "website_url": "string"
  },
  "sections": {
    "hero": { /* HeroSection data */ },
    "bento_grid": { /* BentoGridSection data */ },
    "before_after": { /* BeforeAfterSection data */ },
    "service_map": { /* ServiceMapSection data */ },
    "testimonials": { /* TestimonialsSection data */ },
    "process": { /* ProcessSection data */ },
    "services": { /* ServicesSection data */ },
    "faq": { /* FAQSection data */ },
    "final_cta": { /* FinalCTASection data */ }
  }
}
```

### Hero Section (`sections.hero`)
```json
{
  "headline": "string - Main headline",
  "headline_accent": "string - Accent text",
  "subheadline": "string - Description",
  "primary_cta": "string - Primary button text",
  "secondary_cta": "string - Secondary button text",
  "stats": [
    {
      "value": "string - Numeric value",
      "label": "string - Stat label",
      "suffix": "string - Optional suffix (e.g., '+', '%')",
      "icon": "string - Optional emoji/icon"
    }
  ],
  "trust_badges": ["string - Array of trust signals"],
  "background_image_url": "string - Optional background image"
}
```

### Bento Grid Section (`sections.bento_grid`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "cards": [
    {
      "id": "string - Unique identifier",
      "type": "feature|stat|testimonial|image|service|cta",
      "span": "single|double|triple|tall|wide|hero",
      "title": "string - Card title",
      "description": "string - Card description",
      "icon": "string - Emoji or icon",
      "image_url": "string - Image URL for image cards",
      "stat_value": "string - Value for stat cards",
      "stat_label": "string - Label for stat cards",
      "testimonial_quote": "string - Quote for testimonial cards",
      "testimonial_author": "string - Author for testimonial cards",
      "testimonial_role": "string - Role for testimonial cards",
      "testimonial_avatar": "string - Avatar URL for testimonial cards",
      "service_items": ["string - Array of service features"],
      "cta_text": "string - CTA button text",
      "cta_url": "string - CTA URL",
      "accent_color": "string - Optional accent color"
    }
  ]
}
```

### Before/After Section (`sections.before_after`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "slides": [
    {
      "id": "string - Unique identifier",
      "before_image": "string - Before image URL",
      "after_image": "string - After image URL",
      "title": "string - Slide title",
      "description": "string - Slide description",
      "location": "string - Project location",
      "service_type": "string - Service performed",
      "completion_time": "string - Time to complete"
    }
  ]
}
```

### Service Map Section (`sections.service_map`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "areas": [
    {
      "id": "string - Unique identifier",
      "name": "string - Area name",
      "coordinates": {
        "lat": "number - Latitude",
        "lng": "number - Longitude"
      },
      "jobs_completed": "number - Jobs done in area",
      "avg_rating": "number - Average rating",
      "is_active": "boolean - Whether area is active"
    }
  ],
  "center_coordinates": {
    "lat": "number - Map center latitude",
    "lng": "number - Map center longitude"
  }
}
```

### Testimonials Section (`sections.testimonials`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "items": [
    {
      "id": "string - Unique identifier",
      "quote": "string - Testimonial quote",
      "author": "string - Author name",
      "role": "string - Author role",
      "avatar_url": "string - Avatar image URL",
      "rating": "number - Rating (1-5)",
      "date": "string - Testimonial date",
      "service_type": "string - Service received"
    }
  ],
  "social_proof": [
    {
      "platform": "string - Platform name",
      "rating": "number - Platform rating",
      "review_count": "number - Number of reviews",
      "url": "string - Platform URL",
      "icon": "string - Platform icon"
    }
  ]
}
```

### Process Section (`sections.process`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "steps": [
    {
      "id": "string - Unique identifier",
      "step_number": "number - Step number",
      "title": "string - Step title",
      "description": "string - Step description",
      "icon": "string - Step icon",
      "duration": "string - Time estimate"
    }
  ]
}
```

### Services Section (`sections.services`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "highlights": [
    {
      "id": "string - Unique identifier",
      "title": "string - Service title",
      "description": "string - Service description",
      "icon": "string - Service icon",
      "features": ["string - Array of features"],
      "image_url": "string - Service image URL"
    }
  ]
}
```

### FAQ Section (`sections.faq`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "items": [
    {
      "id": "string - Unique identifier",
      "question": "string - FAQ question",
      "answer": "string - FAQ answer",
      "category": "string - FAQ category"
    }
  ]
}
```

### Final CTA Section (`sections.final_cta`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "primary_cta": "string - Primary button text",
  "secondary_cta": "string - Secondary button text",
  "urgency_text": "string - Urgency message",
  "guarantee_text": "string - Guarantee text"
}
```

---

## ServiceHubTemplate Schema

**Required for pages with `page_type = 'service_hub'`**

### Root Structure
```json
{
  "data": {
    "site_name": "string",
    "tagline": "string",
    "phone": "string",
    "email": "string",
    "logo_url": "string",
    "primary_color": "string",
    "secondary_color": "string"
  },
  "sections": {
    "hero": { /* ServiceHubHero data */ },
    "filtering": { /* FilteringMatrix data */ },
    "services": { /* ServicesGridSection data */ },
    "comparison": { /* ComparisonSection data */ },
    "tech_specs": { /* TechSpecsSection data */ },
    "process": { /* ProcessSection data */ },
    "cta": { /* CTASection data */ }
  }
}
```

### Hero Section (`sections.hero`)
```json
{
  "headline": "string - Main headline",
  "headline_accent": "string - Accent text",
  "description": "string - Description",
  "system_status": {
    "operational_services": "number - Number of operational services",
    "total_services": "number - Total services",
    "last_updated": "string - Last update time",
    "uptime_percentage": "number - Uptime percentage",
    "active_jobs": "number - Active jobs",
    "response_time": "string - Average response time"
  },
  "quick_stats": [
    {
      "label": "string - Stat label",
      "value": "string - Stat value",
      "trend": "up|down|stable",
      "trend_value": "string - Trend value"
    }
  ],
  "version_tag": "string - Version identifier",
  "breadcrumb": ["string - Array of breadcrumb items"]
}
```

### Filtering Section (`sections.filtering`)
```json
{
  "headline": "string - Section title",
  "categories": [
    {
      "id": "string - Category ID",
      "name": "string - Category name",
      "icon": "string - Category icon",
      "count": "number - Services in category",
      "color": "string - Category color"
    }
  ],
  "sort_options": [
    {
      "id": "string - Sort option ID",
      "label": "string - Sort option label"
    }
  ],
  "default_category": "string - Default category ID"
}
```

### Services Section (`sections.services`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "items": [
    {
      "id": "string - Service ID",
      "slug": "string - Service slug",
      "title": "string - Service title",
      "subtitle": "string - Service subtitle",
      "description": "string - Service description",
      "category": "string - Service category",
      "tags": ["string - Array of tags"],
      "icon": "string - Service icon",
      "image_url": "string - Service image URL",
      "features": [
        {
          "icon": "string - Feature icon",
          "text": "string - Feature text"
        }
      ],
      "pricing": {
        "type": "fixed|from|custom|range",
        "value": "string - For fixed pricing",
        "from": "string - For 'from' pricing",
        "to": "string - For range pricing",
        "unit": "string - Price unit"
      },
      "availability": "available|limited|unavailable",
      "response_time": "string - Response time",
      "warranty": "string - Warranty info",
      "rating": "number - Service rating",
      "review_count": "number - Number of reviews",
      "is_featured": "boolean - Whether featured",
      "is_emergency": "boolean - Whether emergency service",
      "specs": [
        {
          "label": "string - Spec label",
          "value": "string - Spec value"
        }
      ]
    }
  ],
  "empty_state": {
    "headline": "string - Empty state title",
    "description": "string - Empty state description",
    "cta_text": "string - Empty state CTA"
  }
}
```

### Comparison Section (`sections.comparison`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "tiers": [
    {
      "id": "string - Tier ID",
      "name": "string - Tier name",
      "description": "string - Tier description",
      "price_indicator": "string - Price display",
      "features": ["string - Array of features"],
      "is_popular": "boolean - Whether most popular",
      "cta_text": "string - CTA button text"
    }
  ],
  "features": [
    {
      "name": "string - Feature name",
      "basic": "boolean|string - Basic tier value",
      "standard": "boolean|string - Standard tier value",
      "premium": "boolean|string - Premium tier value"
    }
  ]
}
```

### Tech Specs Section (`sections.tech_specs`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "items": [
    {
      "id": "string - Spec ID",
      "question": "string - Question",
      "answer": "string - Answer",
      "category": "string - Category",
      "tags": ["string - Array of tags"],
      "related_services": ["string - Array of related service IDs"],
      "technical_level": "basic|intermediate|advanced"
    }
  ],
  "categories": ["string - Array of available categories"]
}
```

### Process Section (`sections.process`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "steps": [
    {
      "id": "string - Step ID",
      "number": "number - Step number",
      "title": "string - Step title",
      "description": "string - Step description",
      "duration": "string - Duration",
      "icon": "string - Step icon"
    }
  ]
}
```

### CTA Section (`sections.cta`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "primary_cta": "string - Primary CTA text",
  "secondary_cta": "string - Secondary CTA text",
  "features": ["string - Array of feature highlights"]
}
```

---

## LocalServiceTemplate Schema

**Required for pages with `page_type = 'local_service'`**

### Root Structure
```json
{
  "data": {
    "site_name": "string",
    "tagline": "string",
    "phone": "string",
    "email": "string",
    "logo_url": "string",
    "website_url": "string",
    "location": {
      "suburb": "string",
      "region": "string",
      "postcode": "string",
      "state": "string",
      "service_radius_km": "number",
      "latitude": "number",
      "longitude": "number"
    }
  },
  "sections": {
    "hero": { /* HeroSection data */ },
    "lead_capture": { /* LeadCaptureSection data */ },
    "local_intel": { /* LocalIntelSection data */ },
    "technician_log": { /* TechnicianLogSection data */ },
    "services": { /* ServicesSection data */ },
    "social_proof": { /* SocialProofSection data */ },
    "emergency": { /* EmergencySection data */ },
    "mobile_cta": { /* MobileCTASection data */ }
  }
}
```

### Hero Section (`sections.hero`)
```json
{
  "headline": "string - Main headline",
  "headline_location": "string - Location-specific headline",
  "subheadline": "string - Description",
  "service_status": {
    "status": "available|limited|booked",
    "teams_available": "number - Available teams",
    "last_inspection_completed": "string - Last inspection",
    "next_available_slot": "string - Next slot",
    "availability_today": "number - Available today",
    "estimated_wait_time": "string - Wait time"
  },
  "trust_signals": ["string - Array of trust signals"],
  "service_notice": "string - Optional service notice",
  "weather_alert": {
    "active": "boolean - Whether alert is active",
    "type": "string - Alert type",
    "message": "string - Alert message",
    "severity": "info|warning|danger"
  }
}
```

### Lead Capture Section (`sections.lead_capture`)
```json
{
  "headline": "string - Form headline",
  "subheadline": "string - Form subheadline",
  "form_fields": [
    {
      "id": "string - Field ID",
      "type": "text|email|tel|select|textarea",
      "label": "string - Field label",
      "placeholder": "string - Placeholder text",
      "required": "boolean - Whether required",
      "options": ["string - Array of options for select"]
    }
  ],
  "submit_text": "string - Submit button text",
  "privacy_text": "string - Privacy notice",
  "urgency_text": "string - Optional urgency message",
  "guarantee_badge": "string - Optional guarantee text"
}
```

### Local Intel Section (`sections.local_intel`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "stats": [
    {
      "id": "string - Stat ID",
      "label": "string - Stat label",
      "value": "string - Stat value",
      "suffix": "string - Optional suffix",
      "icon": "string - Icon",
      "trend": "up|down|stable",
      "trend_value": "string - Trend value",
      "description": "string - Optional description"
    }
  ],
  "common_issues": [
    {
      "id": "string - Issue ID",
      "title": "string - Issue title",
      "frequency": "string - Frequency",
      "severity": "low|medium|high|critical",
      "description": "string - Issue description",
      "recommended_action": "string - Recommended action",
      "avg_repair_cost": "string - Average cost"
    }
  ]
}
```

### Technician Log Section (`sections.technician_log`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "location_summary": "string - Area summary",
  "logs": [
    {
      "id": "string - Log ID",
      "date": "string - Log date",
      "technician_name": "string - Technician name",
      "technician_avatar": "string - Optional avatar URL",
      "observation": "string - Observation",
      "recommendation": "string - Recommendation",
      "priority": "routine|recommended|urgent",
      "affected_percentage": "string - Affected percentage"
    }
  ],
  "last_inspection_date": "string - Last inspection date"
}
```

### Services Section (`sections.services`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "services": [
    {
      "id": "string - Service ID",
      "name": "string - Service name",
      "description": "string - Service description",
      "response_time": "string - Response time",
      "available": "boolean - Whether available",
      "price_from": "string - Starting price",
      "features": ["string - Array of features"]
    }
  ]
}
```

### Social Proof Section (`sections.social_proof`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "testimonials": [
    {
      "id": "string - Testimonial ID",
      "quote": "string - Quote",
      "author": "string - Author name",
      "suburb": "string - Suburb",
      "street_reference": "string - Optional street",
      "service_type": "string - Service type",
      "rating": "number - Rating (1-5)",
      "date": "string - Date",
      "verified": "boolean - Whether verified"
    }
  ],
  "recent_projects": [
    {
      "id": "string - Project ID",
      "title": "string - Project title",
      "suburb": "string - Suburb",
      "image_url": "string - Image URL",
      "service_type": "string - Service type",
      "completion_date": "string - Completion date"
    }
  ],
  "total_jobs_in_area": "number - Total jobs",
  "avg_rating": "number - Average rating",
  "review_count": "number - Review count"
}
```

### Emergency Section (`sections.emergency`)
```json
{
  "headline": "string - Section title",
  "subheadline": "string - Section description",
  "phone": "string - Emergency phone",
  "features": ["string - Array of features"],
  "available_hours": "string - Available hours"
}
```

### Mobile CTA Section (`sections.mobile_cta`)
```json
{
  "call_text": "string - Call button text",
  "book_text": "string - Book button text",
  "phone": "string - Phone number"
}
```

---

## Database Field Requirements

### Required Fields by Template Type

#### All Templates Require:
- `id` (UUID)
- `slug` (string)
- `page_type` (string)
- `content_sections` (JSONB)
- `company_name` (string)
- `phone_number` (string)
- `email` (string)
- `logo_url` (string)

#### HomeTemplate Additional Requirements:
- `h1_heading` (string)
- `h2_heading` (string)
- `meta_description` (string)
- `primary_cta` (string)
- `secondary_cta` (string)
- `stats` (JSONB)
- `trust_badges` (JSONB)
- `bento_cards` (JSONB)
- `before_after_slides` (JSONB)
- `service_areas` (JSONB)
- `testimonials` (JSONB)
- `social_proof` (JSONB)
- `process_steps` (JSONB)
- `service_highlights` (JSONB)
- `faq_items` (JSONB)

#### ServiceHubTemplate Additional Requirements:
- `h1_heading` (string)
- `meta_description` (string)

#### LocalServiceTemplate Additional Requirements:
- `location_name` (string)
- `location_state_region` (string)
- `service_radius_km` (number)
- `latitude` (number)
- `longitude` (number)

### Optional Fields (All Templates):
- `tagline` (string)
- `address` (string)
- `website_url` (string)
- `primary_color` (string)
- `secondary_color` (string)
- `component_performance` (JSONB)
- `last_optimized_at` (TIMESTAMPTZ)
- `optimization_count` (integer)
- `migrated_at` (TIMESTAMPTZ)

---

## Validation Rules

### JSON Structure Validation
1. **Root Level**: Must contain `data` and `sections` objects
2. **Data Object**: Must contain required site metadata
3. **Sections Object**: Must contain template-specific section objects
4. **Arrays**: Can be empty but must exist as arrays
5. **Strings**: Cannot be null, use empty strings instead
6. **Numbers**: Must be valid numbers, no NaN or Infinity
7. **Booleans**: Must be true or false, not null

### Template-Specific Validation

#### HomeTemplate:
- `sections.hero` must exist
- `sections.hero.stats` must be array with valid stat objects
- `sections.bento_grid.cards` must be array with valid card objects
- All section objects must have required properties

#### ServiceHubTemplate:
- `sections.hero` must exist with system_status
- `sections.services.items` must be array with valid service objects
- `sections.comparison.tiers` must exist and have at least one tier

#### LocalServiceTemplate:
- `data.location` must exist with suburb and state
- `sections.hero.service_status` must exist
- `sections.lead_capture.form_fields` must be non-empty array

### Data Type Validation
- **Strings**: Trimmed, no leading/trailing whitespace
- **Numbers**: Finite, within reasonable ranges
- **URLs**: Valid format (https://...)
- **Emails**: Valid email format
- **Phone Numbers**: Valid phone format
- **Dates**: ISO 8601 format
- **Colors**: Valid hex codes or color names

---

## Migration Notes

### From Legacy Schema to New JSON Schema

1. **Run Migration Function**:
   ```sql
   SELECT migrate_page_to_dynamic_schema(page_id);
   ```

2. **Batch Migration**:
   ```sql
   -- Migrate all unmigrated pages
   UPDATE pages
   SET migrated_at = NOW()
   WHERE migrated_at IS NULL;
   ```

3. **Verification**:
   ```sql
   SELECT page_type, COUNT(*) as migrated
   FROM pages
   WHERE migrated_at IS NOT NULL
   GROUP BY page_type;
   ```

### A/B Testing Integration

1. **Test Setup**:
   ```sql
   INSERT INTO a_b_tests (
     page_id, component_id, variant_name, variant_json,
     test_group_size, status
   ) VALUES (...);
   ```

2. **Traffic Allocation**:
   - Uses hash-based user assignment
   - 50% default traffic split
   - Configurable via `test_group_size`

3. **Variant Merging**:
   - Deep merges variant JSON with base sections
   - Preserves existing data structure
   - Handles nested object updates

### Performance Considerations

1. **Indexing**:
   - `slug` for fast page lookups
   - `page_type` for template filtering
   - `component_id` for A/B test queries

2. **Caching**:
   - Implement CDN caching for static content
   - Cache rendered components
   - Use stale-while-revalidate strategy

3. **Optimization**:
   - Lazy load non-critical sections
   - Implement virtual scrolling for large lists
   - Optimize images and assets

### Error Handling

1. **Graceful Degradation**:
   - Fallback to default values for missing fields
   - Show skeleton loaders during loading
   - Provide user-friendly error messages

2. **Logging**:
   - Log all validation failures
   - Track performance metrics
   - Monitor error rates by template type

3. **Recovery**:
   - Automatic retry for failed requests
   - Fallback to cached versions
   - Progressive enhancement approach

---

## Complete Example JSON Structures

### HomeTemplate Example
```json
{
  "data": {
    "site_name": "TrueRoof",
    "tagline": "Professional Roofing Services",
    "phone": "+61 400 000 000",
    "email": "contact@trueroof.com.au",
    "address": "123 Roofing St, Melbourne VIC 3000",
    "logo_url": "/logo.svg",
    "primary_color": "#f97316",
    "secondary_color": "#dc2626",
    "website_url": "https://trueroof.com.au"
  },
  "sections": {
    "hero": {
      "headline": "Professional Roofing Services",
      "headline_accent": "For Your Home",
      "subheadline": "Expert roofing solutions with quality craftsmanship",
      "primary_cta": "Get Free Quote",
      "secondary_cta": "View Services",
      "stats": [
        {"value": "500", "label": "Happy Customers", "suffix": "+"},
        {"value": "15", "label": "Years Experience", "suffix": "+"},
        {"value": "4.9", "label": "Average Rating", "suffix": "/5"}
      ],
      "trust_badges": ["Licensed & Insured", "Free Quotes", "Same-Day Service"]
    },
    "bento_grid": {
      "headline": "Our Services",
      "subheadline": "Comprehensive roofing solutions for every need",
      "cards": [
        {
          "id": "service-1",
          "type": "feature",
          "span": "single",
          "title": "Roof Repairs",
          "description": "Expert repair services for all roof types",
          "icon": "🔧"
        }
      ]
    }
  }
}
```

### ServiceHubTemplate Example
```json
{
  "data": {
    "site_name": "TrueRoof Services",
    "tagline": "Professional Roofing Solutions",
    "phone": "+61 400 000 000",
    "email": "contact@trueroof.com.au",
    "logo_url": "/logo.svg",
    "primary_color": "#f97316",
    "secondary_color": "#dc2626"
  },
  "sections": {
    "hero": {
      "headline": "Professional Roofing Services",
      "headline_accent": "Service Hub",
      "description": "Find the perfect roofing solution for your needs",
      "system_status": {
        "operational_services": 15,
        "total_services": 18,
        "last_updated": "2 minutes ago",
        "uptime_percentage": 95,
        "active_jobs": 3,
        "response_time": "2.3s"
      },
      "quick_stats": [
        {"label": "Services Available", "value": "18", "trend": "up", "trend_value": "+2"},
        {"label": "Active Jobs", "value": "3", "trend": "stable"},
        {"label": "Avg Response", "value": "2.3s", "trend": "down", "trend_value": "-0.5s"}
      ],
      "version_tag": "v2.1.0",
      "breadcrumb": ["Home", "Services", "Service Hub"]
    },
    "services": {
      "headline": "Available Services",
      "subheadline": "Choose from our comprehensive range of roofing services",
      "items": [
        {
          "id": "service-1",
          "slug": "roof-repair",
          "title": "Roof Repair",
          "subtitle": "Professional repair services",
          "description": "Expert roof repair for all types of damage",
          "category": "repairs",
          "tags": ["repair", "maintenance"],
          "icon": "🔧",
          "image_url": "/images/roof-repair.jpg",
          "features": [
            {"icon": "✓", "text": "Licensed technicians"},
            {"icon": "✓", "text": "Quality materials"}
          ],
          "pricing": {"type": "from", "from": "$299"},
          "availability": "available",
          "response_time": "Same Day",
          "warranty": "5 Years",
          "rating": 4.8,
          "review_count": 127,
          "is_featured": true,
          "is_emergency": false,
          "specs": [
            {"label": "Response Time", "value": "Same Day"},
            {"label": "Warranty", "value": "5 Years"}
          ]
        }
      ],
      "empty_state": {
        "headline": "No services found",
        "description": "Try adjusting your filters",
        "cta_text": "Clear Filters"
      }
    }
  }
}
```

### LocalServiceTemplate Example
```json
{
  "data": {
    "site_name": "TrueRoof Melbourne",
    "tagline": "Local Roofing Experts",
    "phone": "+61 400 000 000",
    "email": "melbourne@trueroof.com.au",
    "logo_url": "/logo.svg",
    "website_url": "https://trueroof.com.au/melbourne",
    "location": {
      "suburb": "Melbourne",
      "region": "Victoria",
      "postcode": "3000",
      "state": "VIC",
      "service_radius_km": 25,
      "latitude": -37.8136,
      "longitude": 144.9631
    }
  },
  "sections": {
    "hero": {
      "headline": "Professional Roofing Services",
      "headline_location": "in Melbourne",
      "subheadline": "Expert roofing solutions for Melbourne residents",
      "service_status": {
        "status": "available",
        "teams_available": 3,
        "last_inspection_completed": "Today, 10:30 AM",
        "next_available_slot": "Tomorrow, 9:00 AM",
        "availability_today": 2,
        "estimated_wait_time": "2-4 hours"
      },
      "trust_signals": ["Licensed & Insured", "Free Quotes", "Same-Day Service"],
      "weather_alert": {
        "active": true,
        "type": "Storm Warning",
        "message": "Heavy rain expected this afternoon",
        "severity": "warning"
      }
    },
    "services": {
      "headline": "Our Services",
      "subheadline": "Comprehensive roofing solutions for Melbourne",
      "services": [
        {
          "id": "service-1",
          "name": "Emergency Roof Repair",
          "description": "24/7 emergency roofing services",
          "response_time": "Same Day",
          "available": true,
          "price_from": "$299",
          "features": ["24/7 Response", "Temporary Fixes", "Free Assessment"]
        }
      ]
    }
  }
}
```

---

## Implementation Notes

### Component Registration
- All components must be registered in `app/components/registry.ts`
- Component types must match the `type` field in section data
- Missing components fall back to error display

### Error Boundaries
- Wrap all template renders in error boundaries
- Log errors to Supabase application_logs table
- Show user-friendly fallback UI

### Performance Optimization
- Lazy load non-visible sections
- Implement virtual scrolling for large lists
- Cache rendered components where possible
- Use React.memo for expensive components

### Testing Strategy
- Unit tests for each component with mock data
- Integration tests for full template rendering
- E2E tests for user interactions
- Performance tests for large datasets

### Monitoring & Analytics
- Track component render times
- Monitor error rates by template type
- Log user interaction patterns
- A/B test performance metrics
