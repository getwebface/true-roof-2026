# LocalServiceTemplate JSONB Schema - Gold Standard

This document defines the exact JSON structure required by the `LocalServiceTemplate.tsx` component. Use this as the blueprint for structuring the JSONB column in Supabase.

## Root Structure

```json
{
  "data": {
    // Site metadata and contact information
  },
  "sections": {
    // All page sections with their respective data
  }
}
```

## Data Contract

### 1. Site Data (`data` object)

**Required Fields:**
```json
{
  "site_name": "string - Business name (e.g., 'TrueRoof Melbourne')",
  "tagline": "string - Short business tagline",
  "phone": "string - Primary contact phone (format: '+61 400 000 000')",
  "email": "string - Contact email",
  "logo_url": "string - URL to business logo",
  "website_url": "string - Main website URL",
  "location": {
    "suburb": "string - Primary service suburb (e.g., 'Melbourne')",
    "region": "string - Region/state (e.g., 'Victoria')",
    "postcode": "string - Postcode",
    "state": "string - State abbreviation (e.g., 'VIC')",
    "service_radius_km": "number - Service radius in kilometers (e.g., 25)",
    "latitude": "number - Optional: Geographic coordinates",
    "longitude": "number - Optional: Geographic coordinates"
  }
}
```

### 2. Sections (`sections` object)

#### 2.1 Hero Section (`sections.hero`)
```json
{
  "headline": "string - Main headline (e.g., 'Professional Roofing Services')",
  "headline_location": "string - Location-specific headline (e.g., 'in Melbourne')",
  "subheadline": "string - Supporting description",
  "service_status": {
    "status": "string - Must be 'available', 'limited', or 'booked'",
    "teams_available": "number - Number of available teams",
    "last_inspection_completed": "string - Last inspection date/time",
    "next_available_slot": "string - Next available appointment",
    "availability_today": "number - Available inspections today",
    "estimated_wait_time": "string - Estimated wait time (e.g., '2-4 hours')"
  },
  "trust_signals": [
    "string - Trust badges (e.g., 'Licensed & Insured', 'Free Quotes')"
  ],
  "service_notice": "string - Optional: Service notice/alert",
  "weather_alert": {
    "active": "boolean - Whether alert is active",
    "type": "string - Alert type (e.g., 'Storm Warning')",
    "message": "string - Alert message",
    "severity": "string - Must be 'info', 'warning', or 'danger'"
  }
}
```

#### 2.2 Lead Capture Section (`sections.lead_capture`)
```json
{
  "headline": "string - Form headline",
  "subheadline": "string - Form subheadline",
  "form_fields": [
    {
      "id": "string - Field identifier (e.g., 'name', 'email')",
      "type": "string - Field type: 'text', 'email', 'tel', 'select', or 'textarea'",
      "label": "string - Field label",
      "placeholder": "string - Placeholder text",
      "required": "boolean - Whether field is required",
      "options": ["string - Array of options (for select fields only)"]
    }
  ],
  "submit_text": "string - Submit button text",
  "privacy_text": "string - Privacy notice text",
  "urgency_text": "string - Optional: Urgency message",
  "guarantee_badge": "string - Optional: Guarantee badge text"
}
```

#### 2.3 Local Intel Section (`sections.local_intel`)
```json
{
  "headline": "string - Section headline",
  "subheadline": "string - Section subheadline",
  "stats": [
    {
      "id": "string - Unique identifier",
      "label": "string - Stat label",
      "value": "string - Stat value (can include numbers and symbols)",
      "suffix": "string - Optional: Value suffix (e.g., '%', 'km')",
      "icon": "string - Emoji or icon representation",
      "trend": "string - Optional: 'up', 'down', or 'stable'",
      "trend_value": "string - Optional: Trend value",
      "description": "string - Optional: Stat description"
    }
  ],
  "common_issues": [
    {
      "id": "string - Unique identifier",
      "title": "string - Issue title",
      "frequency": "string - Frequency description",
      "severity": "string - Must be 'low', 'medium', 'high', or 'critical'",
      "description": "string - Issue description",
      "recommended_action": "string - Recommended action",
      "avg_repair_cost": "string - Average repair cost"
    }
  ]
}
```

#### 2.4 Technician Log Section (`sections.technician_log`)
```json
{
  "headline": "string - Section headline",
  "subheadline": "string - Section subheadline",
  "location_summary": "string - Area analysis summary",
  "logs": [
    {
      "id": "string - Unique identifier",
      "date": "string - Log date (format: 'DD/MM/YYYY')",
      "technician_name": "string - Technician name",
      "technician_avatar": "string - Optional: Avatar URL",
      "observation": "string - Observation notes",
      "recommendation": "string - Technician recommendation",
      "priority": "string - Must be 'routine', 'recommended', or 'urgent'",
      "affected_percentage": "string - Affected percentage (e.g., '15%')"
    }
  ],
  "last_inspection_date": "string - Last inspection date"
}
```

#### 2.5 Services Section (`sections.services`)
```json
{
  "headline": "string - Section headline",
  "subheadline": "string - Section subheadline",
  "services": [
    {
      "id": "string - Unique identifier",
      "name": "string - Service name",
      "description": "string - Service description",
      "response_time": "string - Response time (e.g., 'Same Day')",
      "available": "boolean - Whether service is currently available",
      "price_from": "string - Starting price (e.g., '$299')",
      "features": ["string - Array of service features"]
    }
  ]
}
```

#### 2.6 Social Proof Section (`sections.social_proof`)
```json
{
  "headline": "string - Section headline",
  "subheadline": "string - Section subheadline",
  "testimonials": [
    {
      "id": "string - Unique identifier",
      "quote": "string - Testimonial quote",
      "author": "string - Author name",
      "suburb": "string - Author suburb",
      "street_reference": "string - Optional: Street reference",
      "service_type": "string - Service type used",
      "rating": "number - Rating (1-5)",
      "date": "string - Testimonial date",
      "verified": "boolean - Whether testimonial is verified"
    }
  ],
  "recent_projects": [
    {
      "id": "string - Unique identifier",
      "title": "string - Project title",
      "suburb": "string - Project suburb",
      "image_url": "string - Project image URL",
      "service_type": "string - Service type",
      "completion_date": "string - Completion date"
    }
  ],
  "total_jobs_in_area": "number - Total jobs completed in area",
  "avg_rating": "number - Average rating (1-5 scale)",
  "review_count": "number - Total number of reviews"
}
```

#### 2.7 Emergency Section (`sections.emergency`)
```json
{
  "headline": "string - Emergency headline",
  "subheadline": "string - Emergency subheadline",
  "phone": "string - Emergency phone number",
  "features": ["string - Array of emergency features"],
  "available_hours": "string - Available hours (e.g., '24/7')"
}
```

#### 2.8 Mobile CTA Section (`sections.mobile_cta`)
```json
{
  "call_text": "string - Call button text",
  "book_text": "string - Book button text",
  "phone": "string - Phone number for calls"
}
```

## Complete Example JSON

```json
{
  "data": {
    "site_name": "TrueRoof Melbourne",
    "tagline": "Professional Roofing Solutions",
    "phone": "+61 400 000 000",
    "email": "contact@trueroof.com.au",
    "logo_url": "https://example.com/logo.png",
    "website_url": "https://trueroof.com.au",
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
      "subheadline": "Expert roofing solutions for residential and commercial properties",
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
    "lead_capture": {
      "headline": "Get Your Free Quote",
      "subheadline": "Schedule your inspection today",
      "form_fields": [
        {
          "id": "name",
          "type": "text",
          "label": "Full Name",
          "placeholder": "Enter your name",
          "required": true
        },
        {
          "id": "phone",
          "type": "tel",
          "label": "Phone Number",
          "placeholder": "Enter your phone number",
          "required": true
        }
      ],
      "submit_text": "Request Quote",
      "privacy_text": "Your information is secure and will not be shared",
      "urgency_text": "Limited availability today - book now!"
    },
    "local_intel": {
      "headline": "Local Area Insights",
      "subheadline": "Understanding Melbourne's roofing needs",
      "stats": [
        {
          "id": "stats-1",
          "label": "Roof Inspections This Month",
          "value": "42",
          "icon": "📊",
          "trend": "up",
          "trend_value": "+12%"
        }
      ],
      "common_issues": [
        {
          "id": "issue-1",
          "title": "Tile Roof Leaks",
          "frequency": "Common",
          "severity": "medium",
          "description": "Cracked or displaced roof tiles causing water ingress",
          "recommended_action": "Schedule a tile inspection and replacement",
          "avg_repair_cost": "$450-$800"
        }
      ]
    },
    "technician_log": {
      "headline": "Field Technician Reports",
      "subheadline": "Recent inspections and recommendations",
      "location_summary": "Melbourne CBD area showing increased wear on older tile roofs",
      "logs": [
        {
          "id": "log-1",
          "date": "15/12/2025",
          "technician_name": "John Smith",
          "observation": "Multiple cracked tiles on north-facing slope",
          "recommendation": "Replace 12-15 tiles, reseal flashing",
          "priority": "recommended",
          "affected_percentage": "15%"
        }
      ],
      "last_inspection_date": "15/12/2025"
    },
    "services": {
      "headline": "Our Services",
      "subheadline": "Comprehensive roofing solutions",
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
    },
    "social_proof": {
      "headline": "Community Trust",
      "subheadline": "What your neighbors say about us",
      "testimonials": [
        {
          "id": "testimonial-1",
          "quote": "Excellent service, fixed our leak quickly!",
          "author": "Sarah Johnson",
          "suburb": "Melbourne",
          "service_type": "Emergency Repair",
          "rating": 5,
          "date": "10/12/2025",
          "verified": true
        }
      ],
      "recent_projects": [
        {
          "id": "project-1",
          "title": "CBD Office Roof",
          "suburb": "Melbourne",
          "image_url": "https://example.com/project1.jpg",
          "service_type": "Commercial Repair",
          "completion_date": "05/12/2025"
        }
      ],
      "total_jobs_in_area": 127,
      "avg_rating": 4.8,
      "review_count": 42
    },
    "emergency": {
      "headline": "Emergency Roofing Services",
      "subheadline": "Available 24/7 for urgent repairs",
      "phone": "+61 400 000 000",
      "features": ["24/7 Emergency Response", "Same-Day Service", "Free Assessments"],
      "available_hours": "24/7"
    },
    "mobile_cta": {
      "call_text": "Call Now",
      "book_text": "Book Online",
      "phone": "+61 400 000 000"
    }
  }
}
```

## Naming Conventions & Standards

### Consistent Field Names
- Use `service_status` (NOT `live_status`)
- Use `teams_available` (NOT `available_teams`)
- Use `estimated_wait_time` (format: "2-4 hours")
- Use `response_time` (format: "Same Day", "24 Hours", etc.)

### Data Types
- **Numbers**: Use actual numbers (not strings) for counts and ratings
- **Booleans**: Use `true`/`false` (not strings)
- **Arrays**: Always provide empty array `[]` if no data
- **Optional Fields**: Marked as optional in documentation

### Validation Rules
1. All required fields must be present
2. Arrays can be empty but must exist
3. Status values must match allowed enums
4. Phone numbers should include country code
5. URLs should be valid and accessible

## Frontend Compatibility Notes

The `LocalServiceTemplate.tsx` component now includes:
- **Root Guard**: Returns skeleton loader if `data` or `sections` is undefined
- **Null Safety**: All data accesses use optional chaining (`?.`) and fallbacks
- **Type Guards**: Partial data is handled gracefully
- **Hydration Safety**: JSON-LD script is server-side safe
- **Motion Safety**: Framer Motion transforms have default values

## Supabase Implementation

When storing this structure in Supabase:
1. Create a JSONB column named `page_data`
2. Store the complete JSON structure as shown above
3. Use this schema for validation
4. Update via Supabase API with complete or partial updates

## Error Handling

The component will handle:
- Missing sections → Shows fallback content
- Missing arrays → Renders empty state
- Invalid data types → Uses fallback values
- Network errors → Shows skeleton loader
- Partial updates → Merges with existing data safely
