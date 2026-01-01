# Autonomous Website Optimization System - Integration Guide

## Overview
This guide explains how to set up and integrate the autonomous website optimization system with your existing TrueRoof application.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   Cloudflare    │    │   Supabase      │
│   (Frontend)    │────│   Workers       │────│   (Database)    │
│                 │    │                 │    │                 │
│  • Tracking     │    │  • Beacon       │    │  • Analytics    │
│  • A/B Testing  │    │  • AI Analysis  │    │  • History      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                       │
         │                        │                       │
         └────────────────────────┼───────────────────────┘
                                  │
                         ┌────────▼────────┐
                         │   GitHub        │
                         │                 │
                         │  • PR Creation  │
                         │  • Deployment   │
                         │  • Safety       │
                         └─────────────────┘
```

## Setup Steps

### 1. Supabase Database Setup

**Manual Steps Required:**
1. **Create Supabase Project:**
   - Go to supabase.com and create a new project
   - Note the project URL and anon/public key

2. **Run SQL Schema:**
   - Use the SQL from `supabase_analytics_schema.md`
   - Execute all CREATE TABLE statements
   - Create indexes and views
   - Enable RLS and set up policies

3. **Create Service Roles:**
   ```sql
   -- Create beacon_ingest role
   CREATE ROLE beacon_ingest WITH LOGIN PASSWORD 'secure_password';
   GRANT INSERT ON ALL TABLES IN SCHEMA public TO beacon_ingest;
   
   -- Create ai_analysis role  
   CREATE ROLE ai_analysis WITH LOGIN PASSWORD 'secure_password';
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO ai_analysis;
   ```

### 2. Cloudflare Workers Configuration

**Manual Steps Required:**

1. **Create Workers:**
   - Go to Cloudflare Dashboard → Workers & Pages
   - Create two new workers:
     - `beacon-ingest` (uses `functions/beacon-ingest.js`)
     - `ai-optimization` (uses `functions/ai-optimization.js`)

2. **Configure Environment Variables:**
   For each worker, add these environment variables:
   ```
   SUPABASE_URL: [Your Supabase URL]
   SUPABASE_SERVICE_ROLE_KEY: [Your Supabase service role key]
   ```

   For `ai-optimization` worker only:
   ```
   OPENROUTER_API_KEY: [Your OpenRouter API key]
   GITHUB_TOKEN: [GitHub personal access token]
   GITHUB_REPO: getwebface/true-roof-2026
   API_SECRET: [Generate a secure random string]
   ```

3. **Configure Routes:**
   - `beacon-ingest`: Route to `/api/beacon`
   - `ai-optimization`: Route to `/api/ai-optimization`

### 3. GitHub Repository Configuration

**Manual Steps Required:**

1. **Add Repository Secrets:**
   Go to Settings → Secrets and variables → Actions → New repository secret
   
   Add these secrets:
   ```
   SUPABASE_URL: [Your Supabase URL]
   SUPABASE_SERVICE_ROLE_KEY: [Your Supabase service role key]
   OPENROUTER_API_KEY: [Your OpenRouter API key]
   GITHUB_TOKEN: [GitHub personal access token]
   AI_OPTIMIZATION_SECRET: [Same as API_SECRET in Cloudflare]
   CLOUDFLARE_API_TOKEN: [Cloudflare API token]
   CLOUDFLARE_ACCOUNT_ID: [Your Cloudflare account ID]
   ```

2. **Configure GitHub Actions:**
   - The workflows in `.github/workflows/` are already configured
   - Ensure actions have write permissions for:
     - Contents
     - Pull requests
     - Issues
     - Checks

### 4. Frontend Integration

**Manual Steps Required:**

1. **Initialize Tracking:**
   In your main application file (e.g., `app/root.tsx`), add:

   ```typescript
   import { initBehaviorTracker } from '~/lib/tracking/behaviorTracker';
   
   // Initialize on app start
   if (typeof window !== 'undefined') {
     initBehaviorTracker({
       beaconEndpoint: 'https://your-worker.workers.dev/api/beacon',
       sampleRate: 1.0,
       debug: process.env.NODE_ENV === 'development'
     });
   }
   ```

2. **Add Component IDs:**
   Add `data-component-id` attributes to key components for tracking:
   
   ```tsx
   // Example in LocalServiceTemplate.tsx
   <div data-component-id="hero-section">
     {/* Hero content */}
   </div>
   
   <form data-component-id="lead-capture-form">
     {/* Form fields */}
   </div>
   ```

3. **Track Conversions:**
   Add conversion tracking to key user actions:

   ```typescript
   import { trackConversion } from '~/lib/tracking/behaviorTracker';
   
   // When user submits lead form
   trackConversion('lead_capture', 'form_submitted', 3);
   
   // When user clicks call button
   trackConversion('lead_capture', 'call_initiated', 4);
   ```

### 5. A/B Testing Integration

**Manual Steps Required:**

1. **Create A/B Test Component:**
   Create `app/components/optimization/ABTestWrapper.tsx`:

   ```tsx
   'use client';
   import { useEffect, useState } from 'react';
   
   interface ABTestWrapperProps {
     testId: string;
     componentId: string;
     variantA: React.ReactNode;
     variantB: React.ReactNode;
   }
   
   export default function ABTestWrapper({ 
     testId, 
     componentId, 
     variantA, 
     variantB 
   }: ABTestWrapperProps) {
     const [variant, setVariant] = useState<'A' | 'B'>('A');
     
     useEffect(() => {
       // Determine variant (simplified - in production, fetch from API)
       const storedVariant = localStorage.getItem(`ab_test_${testId}`);
       if (storedVariant) {
         setVariant(storedVariant as 'A' | 'B');
       } else {
         const randomVariant = Math.random() > 0.5 ? 'B' : 'A';
         localStorage.setItem(`ab_test_${testId}`, randomVariant);
         setVariant(randomVariant);
         
         // Track assignment
         fetch('/api/ab-assignment', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             testId,
             componentId,
             variant: randomVariant
           })
         });
       }
     }, [testId, componentId]);
     
     return variant === 'A' ? variantA : variantB;
   }
   ```

2. **Wrap Components for Testing:**
   ```tsx
   import ABTestWrapper from '~/components/optimization/ABTestWrapper';
   
   // Wrap components that might be optimized
   <ABTestWrapper
     testId="hero-headline-test"
     componentId="hero-section"
     variantA={<h1>Original Headline</h1>}
     variantB={<h1>Optimized Headline</h1>}
   />
   ```

### 6. Safety Configuration

**Manual Steps Required:**

1. **Review Safety Rules:**
   Check `.github/workflows/safety-check.yml` and adjust:
   - `MAX_CHANGES`: Maximum lines changed per PR (default: 500)
   - `DISALLOWED_PATTERNS`: Files that AI cannot modify
   - Reviewers for safety violations

2. **Configure Emergency Stop:**
   Create a GitHub environment variable to disable AI:
   ```
   AI_OPTIMIZATION_ENABLED: true
   ```
   
   Add check in workflows:
   ```yaml
   - name: Check if AI optimization is enabled
     if: env.AI_OPTIMIZATION_ENABLED != 'true'
     run: echo "AI optimization disabled" && exit 0
   ```

### 7. Monitoring and Maintenance

**Manual Steps Required:**

1. **Set Up Monitoring:**
   - Create Supabase dashboard for optimization metrics
   - Set up alerts for safety violations
   - Monitor GitHub PR frequency and quality

2. **Regular Reviews:**
   - Weekly review of AI-generated PRs
   - Monthly analysis of optimization impact
   - Quarterly review of safety rules

3. **Performance Monitoring:**
   ```sql
   -- Create monitoring view
   CREATE VIEW optimization_impact_monitoring AS
   SELECT 
     DATE(deployed_at) as deployment_date,
     COUNT(*) as optimizations_deployed,
     AVG(expected_impact) as avg_expected_impact,
     AVG(actual_impact) as avg_actual_impact,
     SUM(CASE WHEN actual_impact > expected_impact THEN 1 ELSE 0 END) as exceeded_expectations,
     SUM(CASE WHEN actual_impact < 0 THEN 1 ELSE 0 END) as negative_impact
   FROM optimization_history
   WHERE status = 'implemented'
   GROUP BY DATE(deployed_at);
   ```

## Testing the System

### 1. Test Tracking
```bash
# 1. Start development server
npm run dev

# 2. Open browser and interact with site
# 3. Check browser console for tracking logs
# 4. Verify data appears in Supabase
```

### 2. Test AI Analysis
```bash
# 1. Manually trigger AI optimization
curl -X POST \
  -H "Authorization: Bearer YOUR_API_SECRET" \
  https://your-worker.workers.dev/api/ai-optimization

# 2. Check GitHub for new PR
# 3. Verify proposal in Supabase optimization_history
```

### 3. Test Safety Checks
```bash
# 1. Create a test PR with disallowed changes
# 2. Verify safety check fails
# 3. Check that issue is created for review
```

## Troubleshooting

### Common Issues:

1. **No Data in Supabase:**
   - Check Cloudflare Worker logs
   - Verify Supabase RLS policies
   - Check network requests in browser

2. **AI Not Generating PRs:**
   - Verify OpenRouter API key
   - Check GitHub token permissions
   - Review AI response parsing

3. **Safety Checks Failing:**
   - Review disallowed file patterns
   - Check change size limits
   - Verify proposal ID extraction

4. **Performance Issues:**
   - Monitor Supabase query performance
   - Check materialized view refresh
   - Review event batch sizes

## Security Considerations

1. **API Keys:**
   - Never commit API keys to repository
   - Use environment variables
   - Rotate keys regularly

2. **Data Privacy:**
   - No PII collection
   - IP anonymization
   - Data retention policies

3. **Access Control:**
   - Principle of least privilege
   - Separate service roles
   - Regular access reviews

## Maintenance Schedule

- **Daily:** Check AI-generated PRs
- **Weekly:** Review optimization impact
- **Monthly:** Update safety rules
- **Quarterly:** Full system audit

## Support

For issues with this system:
1. Check GitHub Actions logs
2. Review Cloudflare Worker logs
3. Examine Supabase query performance
4. Contact: [Your contact information]

---

*This integration guide is part of the Autonomous Website Optimization System. Last updated: $(date)*
