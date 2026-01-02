-- Application Logs Table Migration - True Roof 2026
-- Run this SQL in your Supabase SQL editor to enable centralized application logging

-- ============================================================================
-- APPLICATION LOGS TABLE
-- ============================================================================

-- Create application_logs table
CREATE TABLE IF NOT EXISTS application_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  level TEXT NOT NULL CHECK (level IN ('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL')),
  category TEXT NOT NULL CHECK (category IN (
    'client',
    'server',
    'network',
    'database',
    'auth',
    'validation',
    'rendering',
    'performance',
    'security',
    'user_action',
    'system',
    'external_api'
  )),
  message TEXT NOT NULL,
  error_stack TEXT,
  user_id UUID,
  session_id TEXT,
  page_url TEXT,
  component_id TEXT,
  metadata JSONB,
  environment TEXT NOT NULL CHECK (environment IN ('development', 'staging', 'production')),
  version TEXT DEFAULT '1.0.0',

  -- Indexes for performance
  INDEX idx_application_logs_timestamp (timestamp DESC),
  INDEX idx_application_logs_level (level),
  INDEX idx_application_logs_category (category),
  INDEX idx_application_logs_session_id (session_id),
  INDEX idx_application_logs_user_id (user_id),
  INDEX idx_application_logs_component_id (component_id),
  INDEX idx_application_logs_environment (environment)
);

-- ============================================================================
-- PARTITIONING SETUP (Optional - for high-volume logging)
-- ============================================================================

-- Create partitioning function (uncomment if needed for high volume)
/*
-- Partition by month for better performance
CREATE OR REPLACE FUNCTION application_logs_partition_function()
RETURNS TRIGGER AS $$
BEGIN
  -- Create partition table if it doesn't exist
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS application_logs_%s PARTITION OF application_logs FOR VALUES FROM (%L) TO (%L)',
    to_char(NEW.timestamp, 'YYYY_MM'),
    date_trunc('month', NEW.timestamp),
    date_trunc('month', NEW.timestamp) + interval '1 month'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic partitioning
CREATE TRIGGER application_logs_partition_trigger
  BEFORE INSERT ON application_logs
  FOR EACH ROW EXECUTE FUNCTION application_logs_partition_function();
*/

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Enable Row Level Security
ALTER TABLE application_logs ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users (can only see their own logs in non-production)
CREATE POLICY "Users can view their own logs" ON application_logs
  FOR SELECT USING (
    auth.uid() = user_id
    AND environment != 'production'
  );

-- Policy for service role (full access for logging service)
CREATE POLICY "Service role has full access" ON application_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Policy for admin role (full access for administrators)
CREATE POLICY "Admin has full access" ON application_logs
  FOR ALL USING (auth.role() = 'admin');

-- ============================================================================
-- PERFORMANCE VIEWS
-- ============================================================================

-- View for error summary
CREATE OR REPLACE VIEW error_summary AS
SELECT
  DATE(timestamp) as date,
  environment,
  category,
  level,
  COUNT(*) as error_count,
  COUNT(DISTINCT session_id) as affected_sessions,
  COUNT(DISTINCT user_id) as affected_users,
  array_agg(DISTINCT component_id) FILTER (WHERE component_id IS NOT NULL) as affected_components
FROM application_logs
WHERE level IN ('ERROR', 'FATAL')
  AND timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(timestamp), environment, category, level
ORDER BY date DESC, error_count DESC;

-- View for performance metrics
CREATE OR REPLACE VIEW performance_metrics AS
SELECT
  DATE(timestamp) as date,
  category,
  metadata->>'value' as metric_value,
  metadata->>'unit' as metric_unit,
  metadata->>'category' as metric_category,
  COUNT(*) as measurement_count,
  AVG((metadata->>'value')::numeric) as avg_value,
  MIN((metadata->>'value')::numeric) as min_value,
  MAX((metadata->>'value')::numeric) as max_value
FROM application_logs
WHERE category = 'performance'
  AND timestamp >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(timestamp), category, metadata->>'value', metadata->>'unit', metadata->>'category'
ORDER BY date DESC;

-- View for user activity summary
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT
  DATE(timestamp) as date,
  session_id,
  user_id,
  COUNT(*) as total_actions,
  COUNT(CASE WHEN category = 'user_action' THEN 1 END) as user_actions,
  COUNT(CASE WHEN category = 'rendering' THEN 1 END) as component_renders,
  COUNT(CASE WHEN level IN ('ERROR', 'FATAL') THEN 1 END) as errors,
  array_agg(DISTINCT page_url) FILTER (WHERE page_url IS NOT NULL) as pages_visited,
  MIN(timestamp) as session_start,
  MAX(timestamp) as session_end
FROM application_logs
WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(timestamp), session_id, user_id
ORDER BY date DESC, total_actions DESC;

-- ============================================================================
-- CLEANUP POLICIES
-- ============================================================================

-- Function to clean up old logs (keeps last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM application_logs
  WHERE timestamp < CURRENT_DATE - INTERVAL '90 days'
    AND environment = 'development';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old logs in production (keeps last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_logs_production()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM application_logs
  WHERE timestamp < CURRENT_DATE - INTERVAL '30 days'
    AND environment = 'production';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MONITORING FUNCTIONS
-- ============================================================================

-- Function to get error rate for a component
CREATE OR REPLACE FUNCTION get_component_error_rate(
  component_id_param TEXT,
  days_back INTEGER DEFAULT 7
)
RETURNS TABLE (
  component_id TEXT,
  total_logs BIGINT,
  error_count BIGINT,
  error_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    al.component_id,
    COUNT(*) as total_logs,
    COUNT(CASE WHEN al.level IN ('ERROR', 'FATAL') THEN 1 END) as error_count,
    ROUND(
      (COUNT(CASE WHEN al.level IN ('ERROR', 'FATAL') THEN 1 END)::DECIMAL /
       NULLIF(COUNT(*), 0)) * 100,
      2
    ) as error_rate
  FROM application_logs al
  WHERE al.component_id = component_id_param
    AND al.timestamp >= CURRENT_DATE - (days_back || ' days')::INTERVAL
  GROUP BY al.component_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get session error summary
CREATE OR REPLACE FUNCTION get_session_error_summary(
  session_id_param TEXT
)
RETURNS TABLE (
  session_id TEXT,
  total_logs BIGINT,
  error_logs BIGINT,
  first_error TIMESTAMP WITH TIME ZONE,
  last_error TIMESTAMP WITH TIME ZONE,
  error_categories TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    al.session_id,
    COUNT(*) as total_logs,
    COUNT(CASE WHEN al.level IN ('ERROR', 'FATAL') THEN 1 END) as error_logs,
    MIN(CASE WHEN al.level IN ('ERROR', 'FATAL') THEN al.timestamp END) as first_error,
    MAX(CASE WHEN al.level IN ('ERROR', 'FATAL') THEN al.timestamp END) as last_error,
    array_agg(DISTINCT CASE WHEN al.level IN ('ERROR', 'FATAL') THEN al.category END)
      FILTER (WHERE al.level IN ('ERROR', 'FATAL')) as error_categories
  FROM application_logs al
  WHERE al.session_id = session_id_param
  GROUP BY al.session_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SCHEDULED MAINTENANCE (Optional)
-- ============================================================================

-- Create a function that can be called by a cron job or scheduled task
CREATE OR REPLACE FUNCTION perform_log_maintenance()
RETURNS TABLE (
  development_deleted INTEGER,
  production_deleted INTEGER,
  total_errors_today BIGINT,
  total_warnings_today BIGINT
) AS $$
DECLARE
  dev_deleted INTEGER := 0;
  prod_deleted INTEGER := 0;
  errors_today BIGINT := 0;
  warnings_today BIGINT := 0;
BEGIN
  -- Clean up old logs
  SELECT cleanup_old_logs() INTO dev_deleted;
  SELECT cleanup_old_logs_production() INTO prod_deleted;

  -- Get today's error/warning counts
  SELECT COUNT(*) INTO errors_today
  FROM application_logs
  WHERE DATE(timestamp) = CURRENT_DATE
    AND level IN ('ERROR', 'FATAL');

  SELECT COUNT(*) INTO warnings_today
  FROM application_logs
  WHERE DATE(timestamp) = CURRENT_DATE
    AND level = 'WARN';

  RETURN QUERY SELECT dev_deleted, prod_deleted, errors_today, warnings_today;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INDEX OPTIMIZATION
-- ============================================================================

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_logs_level_category_timestamp
  ON application_logs (level, category, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_logs_session_timestamp
  ON application_logs (session_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_logs_component_timestamp
  ON application_logs (component_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_logs_environment_timestamp
  ON application_logs (environment, timestamp DESC);

-- Partial indexes for error logs
CREATE INDEX IF NOT EXISTS idx_logs_errors_only
  ON application_logs (timestamp DESC, category, component_id)
  WHERE level IN ('ERROR', 'FATAL');

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================

/*
-- Query recent errors
SELECT * FROM application_logs
WHERE level IN ('ERROR', 'FATAL')
  AND timestamp >= NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC;

-- Get error rate for a component
SELECT * FROM get_component_error_rate('hero_1', 7);

-- Get session error summary
SELECT * FROM get_session_error_summary('session_123');

-- View error summary
SELECT * FROM error_summary LIMIT 10;

-- View performance metrics
SELECT * FROM performance_metrics LIMIT 10;

-- Manual cleanup (if needed)
SELECT cleanup_old_logs();
SELECT cleanup_old_logs_production();

-- Maintenance run
SELECT * FROM perform_log_maintenance();
*/

-- ============================================================================
-- GRANTS (adjust based on your auth setup)
-- ============================================================================

-- Grant necessary permissions
GRANT SELECT, INSERT ON application_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON application_logs TO service_role;
GRANT SELECT ON error_summary TO authenticated;
GRANT SELECT ON performance_metrics TO authenticated;
GRANT SELECT ON user_activity_summary TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE application_logs IS 'Centralized application logging table for True Roof 2026';
COMMENT ON COLUMN application_logs.id IS 'Unique log entry identifier';
COMMENT ON COLUMN application_logs.timestamp IS 'When the log entry was created (UTC)';
COMMENT ON COLUMN application_logs.level IS 'Log level: DEBUG, INFO, WARN, ERROR, FATAL';
COMMENT ON COLUMN application_logs.category IS 'Log category for organization';
COMMENT ON COLUMN application_logs.message IS 'The main log message';
COMMENT ON COLUMN application_logs.error_stack IS 'Stack trace for errors';
COMMENT ON COLUMN application_logs.metadata IS 'Additional structured data as JSON';
COMMENT ON COLUMN application_logs.environment IS 'Environment where log was generated';

-- ============================================================================
-- FINAL NOTES
-- ============================================================================

/*
Setup Instructions:
1. Run this migration in Supabase SQL editor
2. Update your application to use the new logging system
3. Set up monitoring dashboards using the provided views
4. Configure cleanup policies based on your retention needs

Performance Notes:
- Logs are partitioned by month for better performance (optional)
- Indexes are optimized for common query patterns
- RLS policies ensure data security
- Cleanup functions prevent table bloat

Monitoring:
- Use the error_summary view for daily error monitoring
- Use performance_metrics for application performance tracking
- Use user_activity_summary for user behavior analysis
- Set up alerts for high error rates or performance issues
*/
