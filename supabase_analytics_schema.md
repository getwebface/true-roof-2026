# Supabase Analytics Schema - Autonomous Optimization System

## Overview
This schema supports the autonomous website optimization system by storing user behavior data, conversion metrics, and optimization history.

## Tables

### 1. user_sessions
Stores user session information for tracking behavior across visits.

```sql
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  user_agent TEXT,
  referrer TEXT,
  landing_page TEXT NOT NULL,
  exit_page TEXT,
  exit_reason TEXT CHECK (exit_reason IN ('timeout', 'navigation', 'close', 'refresh')),
  device_type TEXT CHECK (device_type IN ('mobile', 'desktop', 'tablet')),
  screen_resolution TEXT,
  language TEXT,
  country_code CHAR(2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  duration_seconds INTEGER,
  page_count INTEGER DEFAULT 1
);

-- Indexes
CREATE INDEX idx_user_sessions_created_at ON user_sessions(created_at);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_exit_reason ON user_sessions(exit_reason);
```

### 2. behavior_events
Captures granular user interactions for friction analysis.

```sql
CREATE TABLE behavior_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'click',
    'scroll',
    'hover',
    'rage_click',
    'hesitation',
    'form_start',
    'form_abandon',
    'form_submit',
    'error',
    'page_view',
    'time_on_element',
    'scroll_depth'
  )),
  element_path TEXT,
  element_type TEXT,
  element_text TEXT,
  coordinates JSONB,
  viewport_size JSONB,
  event_data JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  page_url TEXT NOT NULL,
  component_id TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_behavior_events_session_id ON behavior_events(session_id);
CREATE INDEX idx_behavior_events_event_type ON behavior_events(event_type);
CREATE INDEX idx_behavior_events_timestamp ON behavior_events(timestamp);
CREATE INDEX idx_behavior_events_component_id ON behavior_events(component_id);
```

### 3. conversion_funnels
Tracks conversion paths and dropoff points.

```sql
CREATE TABLE conversion_funnels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_name TEXT NOT NULL,
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  session_id TEXT NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
  entered_at TIMESTAMPTZ DEFAULT NOW(),
  exited_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  dropoff_reason TEXT,
  metadata JSONB DEFAULT '{}',
  UNIQUE(session_id, funnel_name, step_order)
);

-- Indexes
CREATE INDEX idx_conversion_funnels_funnel_name ON conversion_funnels(funnel_name);
CREATE INDEX idx_conversion_funnels_session_id ON conversion_funnels(session_id);
CREATE INDEX idx_conversion_funnels_entered_at ON conversion_funnels(entered_at);
```

### 4. optimization_history
Tracks AI-generated optimization proposals and their outcomes.

```sql
CREATE TABLE optimization_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN (
    'proposed',
    'approved',
    'rejected',
    'implemented',
    'testing',
    'rolled_back',
    'archived'
  )),
  friction_point TEXT NOT NULL,
  component_id TEXT,
  page_url TEXT,
  change_description TEXT NOT NULL,
  proposed_changes JSONB NOT NULL,
  ai_confidence DECIMAL(3,2) CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  expected_impact DECIMAL(3,2) CHECK (expected_impact >= 0 AND expected_impact <= 1),
  actual_impact DECIMAL(3,2) CHECK (actual_impact >= 0 AND actual_impact <= 1),
  pr_url TEXT,
  pr_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  implemented_at TIMESTAMPTZ,
  tested_at TIMESTAMPTZ,
  deployed_at TIMESTAMPTZ,
  rollback_reason TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_optimization_history_status ON optimization_history(status);
CREATE INDEX idx_optimization_history_created_at ON optimization_history(created_at);
CREATE INDEX idx_optimization_history_component_id ON optimization_history(component_id);
```

### 5. a_b_tests
Manages A/B test variants and assignments.

```sql
CREATE TABLE a_b_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id TEXT NOT NULL UNIQUE,
  test_name TEXT NOT NULL,
  component_id TEXT NOT NULL,
  variant_a JSONB NOT NULL,
  variant_b JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  target_conversion TEXT,
  sample_size INTEGER DEFAULT 1000,
  confidence_threshold DECIMAL(3,2) DEFAULT 0.95,
  winner_variant TEXT CHECK (winner_variant IN ('A', 'B', 'none')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_a_b_tests_status ON a_b_tests(status);
CREATE INDEX idx_a_b_tests_component_id ON a_b_tests(component_id);
```

### 6. variant_assignments
Tracks which users see which test variants.

```sql
CREATE TABLE variant_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id TEXT NOT NULL REFERENCES a_b_tests(test_id) ON DELETE CASCADE,
  session_id TEXT NOT NULL REFERENCES user_sessions(session_id) ON DELETE CASCADE,
  variant TEXT NOT NULL CHECK (variant IN ('A', 'B')),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  conversion_events JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  UNIQUE(test_id, session_id)
);

-- Indexes
CREATE INDEX idx_variant_assignments_test_id ON variant_assignments(test_id);
CREATE INDEX idx_variant_assignments_session_id ON variant_assignments(session_id);
```

## Views

### 1. friction_points
Identifies common UX failure points.

```sql
CREATE VIEW friction_points AS
SELECT 
  be.element_path,
  be.element_type,
  be.event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT be.session_id) as affected_sessions,
  AVG(EXTRACT(EPOCH FROM (be.timestamp - us.created_at))) as avg_time_to_event,
  MIN(be.timestamp) as first_seen,
  MAX(be.timestamp) as last_seen,
  ARRAY_AGG(DISTINCT be.page_url) as pages_affected
FROM behavior_events be
JOIN user_sessions us ON be.session_id = us.session_id
WHERE be.event_type IN ('rage_click', 'hesitation', 'form_abandon', 'error')
GROUP BY be.element_path, be.element_type, be.event_type
HAVING COUNT(*) > 10;
```

### 2. conversion_impact
Measures business impact of optimization changes.

```sql
CREATE VIEW conversion_impact AS
SELECT 
  oh.proposal_id,
  oh.friction_point,
  oh.component_id,
  oh.expected_impact,
  oh.actual_impact,
  oh.status,
  COUNT(DISTINCT cf.session_id) as total_conversions,
  AVG(cf.duration_seconds) as avg_funnel_time,
  MIN(oh.created_at) as optimization_date,
  ARRAY_AGG(DISTINCT cf.funnel_name) as affected_funnels
FROM optimization_history oh
LEFT JOIN conversion_funnels cf ON cf.component_id = oh.component_id
WHERE oh.status IN ('implemented', 'testing')
GROUP BY oh.proposal_id, oh.friction_point, oh.component_id, oh.expected_impact, oh.actual_impact, oh.status;
```

### 3. session_analytics
Aggregated session metrics for AI analysis.

```sql
CREATE VIEW session_analytics AS
SELECT 
  us.session_id,
  us.landing_page,
  us.exit_page,
  us.exit_reason,
  us.duration_seconds,
  us.page_count,
  COUNT(DISTINCT be.id) as total_events,
  COUNT(DISTINCT CASE WHEN be.event_type = 'click' THEN be.id END) as click_count,
  COUNT(DISTINCT CASE WHEN be.event_type = 'rage_click' THEN be.id END) as rage_click_count,
  COUNT(DISTINCT CASE WHEN be.event_type = 'hesitation' THEN be.id END) as hesitation_count,
  COUNT(DISTINCT CASE WHEN be.event_type = 'form_abandon' THEN be.id END) as form_abandon_count,
  COUNT(DISTINCT CASE WHEN be.event_type = 'form_submit' THEN be.id END) as form_submit_count,
  MAX(CASE WHEN be.event_type = 'scroll_depth' THEN (be.event_data->>'percentage')::DECIMAL END) as max_scroll_depth,
  ARRAY_AGG(DISTINCT cf.funnel_name) as funnels_entered
FROM user_sessions us
LEFT JOIN behavior_events be ON us.session_id = be.session_id
LEFT JOIN conversion_funnels cf ON us.session_id = cf.session_id
GROUP BY us.session_id, us.landing_page, us.exit_page, us.exit_reason, us.duration_seconds, us.page_count;
```

## Materialized Views

### 1. daily_friction_summary
Daily aggregated friction metrics for AI analysis.

```sql
CREATE MATERIALIZED VIEW daily_friction_summary AS
SELECT 
  DATE(be.timestamp) as date,
  be.element_path,
  be.event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT be.session_id) as unique_sessions,
  AVG((be.event_data->>'hesitation_ms')::INTEGER) as avg_hesitation_ms,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (be.event_data->>'hesitation_ms')::INTEGER) as median_hesitation_ms,
  SUM(CASE WHEN be.event_type = 'form_abandon' THEN 1 ELSE 0 END) as form_abandons,
  SUM(CASE WHEN be.event_type = 'form_submit' THEN 1 ELSE 0 END) as form_submits
FROM behavior_events be
WHERE be.timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(be.timestamp), be.element_path, be.event_type
WITH DATA;

-- Refresh schedule (daily at 2 AM)
CREATE UNIQUE INDEX idx_daily_friction_summary ON daily_friction_summary(date, element_path, event_type);
```

### 2. component_performance
Component-level performance metrics.

```sql
CREATE MATERIALIZED VIEW component_performance AS
SELECT 
  be.component_id,
  be.page_url,
  COUNT(*) as total_interactions,
  COUNT(DISTINCT be.session_id) as unique_users,
  SUM(CASE WHEN be.event_type = 'click' THEN 1 ELSE 0 END) as clicks,
  SUM(CASE WHEN be.event_type = 'rage_click' THEN 1 ELSE 0 END) as rage_clicks,
  SUM(CASE WHEN be.event_type = 'hesitation' THEN 1 ELSE 0 END) as hesitations,
  AVG((be.event_data->>'hesitation_ms')::INTEGER) as avg_hesitation_ms,
  COUNT(DISTINCT cf.session_id) as conversions,
  MIN(be.timestamp) as first_seen,
  MAX(be.timestamp) as last_seen
FROM behavior_events be
LEFT JOIN conversion_funnels cf ON be.session_id = cf.session_id 
  AND cf.funnel_name = 'lead_capture'
WHERE be.component_id IS NOT NULL
GROUP BY be.component_id, be.page_url
WITH DATA;

CREATE UNIQUE INDEX idx_component_performance ON component_performance(component_id, page_url);
```

## Security Policies

```sql
-- Enable RLS on all tables
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimization_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE a_b_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_assignments ENABLE ROW LEVEL SECURITY;

-- Beacon ingestion service policy (insert only)
CREATE POLICY "beacon_ingest_insert" ON user_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "beacon_ingest_insert" ON behavior_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "beacon_ingest_insert" ON conversion_funnels
  FOR INSERT WITH CHECK (true);

-- AI analysis service policy (read only)
CREATE POLICY "ai_analysis_read" ON user_sessions
  FOR SELECT USING (true);

CREATE POLICY "ai_analysis_read" ON behavior_events
  FOR SELECT USING (true);

CREATE POLICY "ai_analysis_read" ON conversion_funnels
  FOR SELECT USING (true);

CREATE POLICY "ai_analysis_read" ON optimization_history
  FOR SELECT USING (true);

-- Admin policy (full access)
CREATE POLICY "admin_all" ON user_sessions
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "admin_all" ON behavior_events
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "admin_all" ON conversion_funnels
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "admin_all" ON optimization_history
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "admin_all" ON a_b_tests
  FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "admin_all" ON variant_assignments
  FOR ALL USING (auth.role() = 'admin');
```

## Triggers

```sql
-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_sessions_updated_at 
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-calculate session duration
CREATE OR REPLACE FUNCTION calculate_session_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.exit_page IS NOT NULL AND OLD.exit_page IS NULL THEN
    NEW.duration_seconds = EXTRACT(EPOCH FROM (NOW() - NEW.created_at));
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_session_duration_trigger
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW EXECUTE FUNCTION calculate_session_duration();
```

## Setup Instructions

1. **Create the schema:**
   - Run all CREATE TABLE statements above
   - Create indexes for performance
   - Enable RLS and set up policies

2. **Set up service roles:**
   - Create `beacon_ingest` role for Cloudflare Worker
   - Create `ai_analysis` role for AI optimization worker
   - Create `admin` role for manual management

3. **Configure environment variables:**
   - Add Supabase URL and service role keys to Cloudflare Workers
   - Set up GitHub Actions secrets for database access

4. **Initialize materialized views:**
   - Run REFRESH MATERIALIZED VIEW daily_friction_summary;
   - Schedule daily refresh via cron job

## Notes
- All timestamps are in UTC
- JSONB columns store flexible event data
- RLS policies ensure data security
- Materialized views optimize AI query performance
- Daily aggregation reduces query load on production
