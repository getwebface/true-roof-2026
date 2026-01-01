# AI Optimization Logic for True Roof 2026

## Overview
This document outlines the logic for the AI optimization worker that performs A/B testing on page layouts, styles, and content ordering by modifying JSON data in Supabase.

## Architecture
- **Trigger**: High friction points detected in `friction_points` table
- **Action**: Generate variant JSON structures based on performance data
- **Storage**: Store variants in `a_b_tests` table
- **Activation**: Frontend serves variant JSON to test group users

## Trigger Conditions
The AI worker should be triggered when:
1. A component (`component_id`) shows high hesitation rates (>30% of users)
2. Multiple users abandon at the same component
3. Low conversion rates on specific page sections
4. Manual trigger via admin dashboard

## Optimization Actions

### 1. Component Reordering
**When**: High friction on a specific component
**Action**: Move the problematic component down in `layout_order`, move social proof/trust signals up
**Example**:
```json
// Before
{
  "layout_order": ["hero_1", "problem_component", "social_proof", "cta"],
  "sections": {...}
}

// After
{
  "layout_order": ["hero_1", "social_proof", "problem_component", "cta"],
  "sections": {...}
}
```

### 2. Style Injection
**When**: Low engagement with a component
**Action**: Inject Tailwind classes via `styles` property
**Examples**:
- `"bg-red-900 text-white"` - Increase contrast
- `"py-32"` - Add more vertical padding
- `"rounded-3xl"` - More rounded corners
- `"shadow-2xl"` - Add stronger shadow
- `"border-4 border-orange-500"` - Add prominent border

### 3. Content Rewriting
**When**: Low time-on-component or high bounce rates
**Action**: Rewrite headlines, CTAs, or descriptions
**Examples**:
- Headline: "Professional Roofing Services" → "Emergency Roof Repair Experts"
- CTA: "Get Quote" → "Get Free Roof Inspection"
- Description: Add urgency, social proof, or benefits

### 4. Component Replacement
**When**: Component consistently underperforms
**Action**: Replace component type with a different variant
**Example**: Replace `hero_home` with `hero_emergency`

## Data Flow

### 1. Detection Phase
```javascript
// Query friction_points table
const highFrictionComponents = await supabase
  .from('friction_points')
  .select('*')
  .gt('hesitation_rate', 0.3)
  .order('created_at', { ascending: false })
  .limit(10);
```

### 2. Analysis Phase
For each high-friction component:
- Fetch current page JSON from `pages.content_sections`
- Analyze component context (position, surrounding components)
- Check historical A/B test results for similar components

### 3. Variant Generation
Generate 1-3 variants:
1. **Reorder variant**: Move component, adjust layout
2. **Restyle variant**: Inject Tailwind classes
3. **Rewrite variant**: Modify content
4. **Replace variant**: Change component type

### 4. Storage Phase
```sql
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
  'page_uuid',
  'hero_1',
  'variant_b',
  '{"layout_order": [...], "sections": {...}}',
  0.5, -- 50% of traffic
  NOW(),
  NOW() + INTERVAL '7 days',
  'active'
);
```

### 5. Activation Logic
Frontend loader (`app/routes/$.tsx`) should:
1. Check for active A/B tests for the current page
2. If user is in test group (determined by session hash), serve variant JSON
3. Track variant exposure in analytics

## Implementation Details

### Session Hashing for Test Group Assignment
```javascript
function getTestGroup(sessionId, testName) {
  const hash = crypto.createHash('md5').update(`${sessionId}-${testName}`).digest('hex');
  const hashInt = parseInt(hash.substring(0, 8), 16);
  return hashInt % 100 < 50; // 50% chance for variant B
}
```

### JSON Schema for A/B Tests
```json
{
  "test_id": "uuid",
  "page_id": "page_uuid",
  "component_id": "hero_1",
  "variant_name": "variant_b",
  "variant_json": {
    "layout_order": ["hero_1", "social_proof", "problem_component", "cta"],
    "sections": {
      "hero_1": {
        "type": "hero_home",
        "id": "hero_1",
        "data": {...},
        "styles": "bg-red-900 text-white", // AI-injected
        "trackingId": "hero_1_variant_b"
      },
      // ... other sections
    }
  },
  "test_group_size": 0.5,
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-08T00:00:00Z",
  "status": "active",
  "metrics": {
    "conversion_rate": null,
    "time_on_component": null,
    "hesitation_rate": null
  }
}
```

## Worker Implementation

### Main Optimization Function
```javascript
async function optimizeComponent(pageId, componentId) {
  // 1. Fetch current page data
  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .single();
  
  // 2. Parse current JSON
  const currentJson = typeof page.content_sections === 'string' 
    ? JSON.parse(page.content_sections)
    : page.content_sections;
  
  // 3. Generate variants
  const variants = generateVariants(currentJson, componentId);
  
  // 4. Store variants
  for (const variant of variants) {
    await supabase
      .from('a_b_tests')
      .insert({
        page_id: pageId,
        component_id: componentId,
        variant_name: variant.name,
        variant_json: variant.json,
        test_group_size: 0.5,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      });
  }
  
  // 5. Log optimization
  await supabase
    .from('optimization_logs')
    .insert({
      page_id: pageId,
      component_id: componentId,
      action: 'generated_variants',
      variant_count: variants.length,
      created_at: new Date().toISOString()
    });
}
```

### Variant Generation Logic
```javascript
function generateVariants(currentJson, componentId) {
  const variants = [];
  
  // Variant 1: Reorder
  const reorderVariant = JSON.parse(JSON.stringify(currentJson));
  const componentIndex = reorderVariant.layout_order.indexOf(componentId);
  if (componentIndex > -1) {
    // Move problematic component down, move social proof up
    const socialProofIndex = reorderVariant.layout_order.findIndex(id => 
      id.includes('testimonial') || id.includes('social')
    );
    if (socialProofIndex > -1 && socialProofIndex > componentIndex) {
      [reorderVariant.layout_order[componentIndex], reorderVariant.layout_order[socialProofIndex]] = 
      [reorderVariant.layout_order[socialProofIndex], reorderVariant.layout_order[componentIndex]];
    }
  }
  variants.push({ name: 'reorder', json: reorderVariant });
  
  // Variant 2: Restyle
  const restyleVariant = JSON.parse(JSON.stringify(currentJson));
  if (restyleVariant.sections[componentId]) {
    restyleVariant.sections[componentId].styles = 
      (restyleVariant.sections[componentId].styles || '') + ' bg-red-900 text-white py-32';
  }
  variants.push({ name: 'restyle', json: restyleVariant });
  
  // Variant 3: Rewrite content
  const rewriteVariant = JSON.parse(JSON.stringify(currentJson));
  if (rewriteVariant.sections[componentId]?.data?.headline) {
    rewriteVariant.sections[componentId].data.headline = 
      `Emergency ${rewriteVariant.sections[componentId].data.headline}`;
  }
  variants.push({ name: 'rewrite', json: rewriteVariant });
  
  return variants;
}
```

## Monitoring & Metrics

### Key Metrics to Track
1. **Conversion Rate**: Percentage of users who convert after seeing variant
2. **Time on Component**: Average time spent on optimized component
3. **Hesitation Rate**: Post-optimization hesitation rates
4. **Bounce Rate**: Page-level bounce rate changes
5. **Scroll Depth**: How far users scroll with new layout

### Success Criteria
A variant is considered successful if:
- Conversion rate increases by >10%
- Hesitation rate decreases by >20%
- Time on component increases by >15%
- No negative impact on other metrics

## Rollback Strategy
If a variant performs worse than control:
1. Automatically deactivate after 24 hours of negative metrics
2. Send alert to engineering team
3. Log failure reason for future learning
4. Generate new variant based on failure analysis

## Integration Points

### 1. Friction Tracking
```javascript
// In component tracking
useEffect(() => {
  const timer = setTimeout(() => {
    if (!hasInteracted) {
      // Log hesitation
      trackHesitation(componentId, 'hero_1');
    }
  }, 3000);
  
  return () => clearTimeout(timer);
}, [hasInteracted, componentId]);
```

### 2. A/B Test Serving
```javascript
// In app/routes/$.tsx loader
async function getPageWithVariants(pageId, sessionId) {
  const { data: activeTests } = await supabase
    .from('a_b_tests')
    .select('*')
    .eq('page_id', pageId)
    .eq('status', 'active')
    .gt('end_date', new Date().toISOString());
  
  for (const test of activeTests) {
    if (getTestGroup(sessionId, test.variant_name)) {
      return test.variant_json; // Serve variant
    }
  }
  
  return null; // Serve control
}
```

## Next Steps
1. Implement the worker function in `functions/ai-optimization.js`
2. Add A/B test table to Supabase schema
3. Update frontend to check for active tests
4. Add tracking for variant performance
5. Create admin dashboard to monitor results
