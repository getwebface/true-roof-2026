# Supabase Database Migrations

This directory contains the database schema and migrations for True Roof 2026. We use Supabase's migration system to maintain a "Source of Truth" workflow where our code repository dictates the database structure.

## Overview

- **Migrations**: SQL files that define database schema changes
- **Seed Data**: Default data for development and testing
- **Local Development**: Docker-based local Supabase instance
- **CI/CD**: Automated deployment via GitHub Actions

## Directory Structure

```
supabase/
├── migrations/           # Database migration files
│   ├── 20240101000000_initial_schema.sql
│   └── 20240101000001_application_logs.sql
├── seed.sql             # Default data for development
├── config.toml          # Supabase project configuration
└── README.md           # This file
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Supabase
```bash
npm run db:start
```

### 3. Reset Database (with migrations + seed)
```bash
npm run db:reset
```

### 4. Generate TypeScript Types
```bash
npm run db:types
```

## Migration Workflow

### Creating a New Migration

1. **Create migration file**:
   ```bash
   npm run db:migrate:new "add_user_profiles_table"
   ```

2. **Edit the generated SQL file** in `supabase/migrations/`

3. **Test locally**:
   ```bash
   npm run db:reset
   ```

4. **Commit and push** - GitHub Actions will deploy automatically

### Migration File Naming

Files follow the pattern: `YYYYMMDDHHMMSS_description.sql`

Example:
- `20240101000000_initial_schema.sql`
- `20240102000001_add_user_auth.sql`

### Best Practices

- **One change per migration**: Keep migrations focused and atomic
- **Idempotent**: Migrations should be safe to run multiple times
- **Test locally**: Always test migrations before pushing
- **Document changes**: Add comments explaining complex changes
- **Use transactions**: Wrap multi-statement changes in transactions

## Local Development

### Starting Supabase
```bash
npm run db:start
```

### Stopping Supabase
```bash
npm run db:stop
```

### Reset Database
Resets everything and reapplies migrations + seed data:
```bash
npm run db:reset
```

### View Local Dashboard
Once started, access at: http://localhost:54323

## Production Deployment

### Automatic Deployment
- Pushes to `main` branch trigger automatic deployment
- Only migration files are monitored for changes
- Independent of frontend deployments

### Manual Deployment
```bash
npm run db:push
```

### GitHub Secrets Required
- `SUPABASE_ACCESS_TOKEN`: Personal access token from Supabase dashboard
- `PRODUCTION_DB_PASSWORD`: Database password
- `PRODUCTION_PROJECT_ID`: Your Supabase project reference

## TypeScript Types

### Auto-generation
Types are automatically generated after each migration deployment:
```bash
npm run db:types
```

This creates `app/types/database.ts` with type definitions for all tables.

### Manual Generation
```bash
./node_modules/.bin/supabase gen types typescript > app/types/database.ts
```

## Troubleshooting

### Migration Fails
1. Check the migration SQL syntax
2. Ensure dependencies are installed: `npm install`
3. Test locally first: `npm run db:reset`
4. Check Supabase dashboard for error details

### Local Development Issues
1. Ensure Docker is running
2. Check port conflicts (54322 for DB, 54323 for dashboard)
3. Reset if needed: `npm run db:reset`

### Type Generation Issues
1. Ensure you're connected to the correct project
2. Check that migrations have been applied
3. Verify Supabase CLI is up to date

## Migration Examples

### Adding a New Table
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
```

### Adding a Column
```sql
ALTER TABLE pages ADD COLUMN IF NOT EXISTS seo_title TEXT;
```

### Creating an Index
```sql
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_pages_slug ON pages(slug);
```

## Seed Data

The `seed.sql` file contains default data for development:
- Sample pages with dynamic content
- Test A/B tests
- Sample application logs
- Optimization history

Seed data is automatically loaded when you run `npm run db:reset`.

## Environment Variables

For local development, create a `.env.local` file:
```env
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Contributing

1. Create a feature branch
2. Make database changes via migrations
3. Test locally with `npm run db:reset`
4. Commit migration files
5. Create a pull request
6. Review and merge - deployment happens automatically

## Migration History

| Date | Migration | Description |
|------|-----------|-------------|
| 2024-01-01 | `20240101000000_initial_schema.sql` | Initial database schema with pages, A/B tests, and optimization tables |
| 2024-01-01 | `20240101000001_application_logs.sql` | Centralized application logging system |

## Support

- Check the [Supabase Migration Docs](https://supabase.com/docs/guides/cli/local-development)
- Review existing migrations for patterns
- Test all changes locally before deploying
