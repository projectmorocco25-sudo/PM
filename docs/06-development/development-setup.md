# Development Environment Setup Guide - Pharmaceutical Governance Value Chain Platform (PM)

**Purpose:** This guide provides step-by-step instructions for setting up the local development environment.

**Last Updated:** 2025-12-31  
**Status:** ✅ Complete (Phase 0, Week 4)  
**Owner:** Leila

## Overview

This guide covers setting up the local development environment for the PM platform, including Supabase CLI, database setup, frontend development, and testing.

## Prerequisites

### Required Software

- **Node.js:** Version 18.x or higher
- **npm:** Version 9.x or higher (comes with Node.js)
- **Git:** Version 2.x or higher
- **Supabase CLI:** Latest version
- **Docker Desktop:** (Optional, for local Supabase instance)

### Recommended Tools

- **VS Code:** Recommended IDE
- **PostgreSQL Client:** pgAdmin, DBeaver, or similar (optional)
- **Git Client:** GitHub Desktop, SourceTree, or similar (optional)

---

## Step 1: Install Node.js and npm

### Windows

1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run installer and follow prompts
3. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

### macOS

```bash
# Using Homebrew
brew install node

# Verify installation
node --version
npm --version
```

### Linux

```bash
# Using apt (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

---

## Step 2: Install Supabase CLI

### Windows

```powershell
# Using npm
npm install -g supabase

# Verify installation
supabase --version
```

### macOS / Linux

```bash
# Using npm
npm install -g supabase

# Verify installation
supabase --version
```

**Alternative (macOS):**
```bash
# Using Homebrew
brew install supabase/tap/supabase

# Verify installation
supabase --version
```

---

## Step 3: Install Docker Desktop (Optional)

**Note:** Docker is optional. Supabase CLI can use remote Supabase projects or local Docker instance.

### Windows

1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Run installer and follow prompts
3. Start Docker Desktop
4. Verify installation:
   ```powershell
   docker --version
   ```

### macOS

1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Install and start Docker Desktop
3. Verify installation:
   ```bash
   docker --version
   ```

### Linux

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verify installation
docker --version
```

---

## Step 4: Clone Repository

```bash
# Clone repository
git clone {repository-url}
cd PM

# Verify repository structure
ls -la
```

---

## Step 5: Initialize Supabase

### Option A: Local Supabase (Docker)

```bash
# Initialize Supabase in project
supabase init

# Start local Supabase
supabase start

# Note the output - you'll need:
# - API URL
# - anon key
# - service_role key
```

**Output Example:**
```
API URL: http://localhost:54321
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Option B: Link to Remote Supabase Project

```bash
# Link to remote project
supabase link --project-ref {project-ref}

# Enter your Supabase access token when prompted
```

---

## Step 6: Set Up Environment Variables

### Create `.env.local` File

```bash
# Create .env.local file
touch .env.local
```

### Add Environment Variables

**For Local Supabase:**
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_ENV=development
```

**For Remote Supabase:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://{project-ref}.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_ENV=development
```

**Note:** Never commit `.env.local` to Git (it's in `.gitignore`)

---

## Step 7: Apply Database Migrations

```bash
# Apply all migrations
supabase db reset

# Or apply migrations incrementally
supabase migration up
```

**Verify Migrations:**
```bash
# Check migration status
supabase migration list
```

---

## Step 8: Set Up Frontend

### Install Dependencies

```bash
# Navigate to frontend directory (if separate)
cd frontend

# Install dependencies
npm install
```

### Start Development Server

```bash
# Start Next.js development server
npm run dev
```

**Server will start at:** `http://localhost:3000`

---

## Step 9: Set Up Testing

### Install Testing Dependencies

```bash
# Install Jest/Vitest
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Install Playwright (for E2E tests)
npm install --save-dev @playwright/test
npx playwright install
```

### Run Tests

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
```

---

## Step 10: Verify Setup

### Check Supabase Connection

```bash
# Check Supabase status
supabase status

# Test database connection
supabase db ping
```

### Check Frontend

1. Open browser: `http://localhost:3000`
2. Verify page loads
3. Check browser console for errors

### Check Database

```bash
# Open Supabase Studio (local)
supabase studio

# Or access remote Supabase Dashboard
# https://supabase.com/dashboard/project/{project-ref}
```

---

## Development Workflow

### Daily Development

1. **Start Supabase:**
   ```bash
   supabase start  # If using local
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Make Changes:**
   - Edit code
   - Test locally
   - Commit changes

4. **Create Migration (if needed):**
   ```bash
   supabase migration new {migration_name}
   # Edit migration file
   supabase db reset  # Apply migration
   ```

### Database Changes

1. **Create Migration:**
   ```bash
   supabase migration new add_new_table
   ```

2. **Edit Migration File:**
   ```sql
   -- supabase/migrations/{timestamp}_add_new_table.sql
   CREATE TABLE new_table (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     name text NOT NULL
   );
   ```

3. **Apply Migration:**
   ```bash
   supabase db reset
   ```

4. **Test Changes:**
   - Verify table created
   - Test RLS policies
   - Test RPC functions

### Edge Functions Development

1. **Create Edge Function:**
   ```bash
   supabase functions new {function_name}
   ```

2. **Edit Function:**
   ```typescript
   // supabase/functions/{function_name}/index.ts
   import "jsr:@supabase/functions-js/edge-runtime.d.ts";
   
   Deno.serve(async (req: Request) => {
     return new Response(JSON.stringify({ message: "Hello" }), {
       headers: { "Content-Type": "application/json" }
     });
   });
   ```

3. **Test Locally:**
   ```bash
   supabase functions serve {function_name}
   ```

4. **Deploy:**
   ```bash
   supabase functions deploy {function_name}
   ```

---

## Troubleshooting

### Supabase CLI Issues

**Issue:** `supabase: command not found`

**Solution:**
```bash
# Reinstall Supabase CLI
npm install -g supabase

# Or add to PATH
export PATH="$PATH:$(npm config get prefix)/bin"
```

**Issue:** Docker not running (for local Supabase)

**Solution:**
- Start Docker Desktop
- Verify Docker is running: `docker ps`

---

### Database Connection Issues

**Issue:** Cannot connect to database

**Solution:**
1. Check Supabase status: `supabase status`
2. Verify environment variables in `.env.local`
3. Check network connectivity
4. Restart Supabase: `supabase stop && supabase start`

---

### Migration Issues

**Issue:** Migration fails

**Solution:**
1. Check migration file syntax
2. Verify database state: `supabase db diff`
3. Reset database: `supabase db reset` (⚠️ deletes all data)
4. Check migration order

---

### Frontend Issues

**Issue:** Frontend cannot connect to Supabase

**Solution:**
1. Verify `.env.local` file exists and has correct values
2. Restart development server: `npm run dev`
3. Check browser console for errors
4. Verify Supabase is running: `supabase status`

---

## Useful Commands

### Supabase CLI

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Check status
supabase status

# Reset database (⚠️ deletes all data)
supabase db reset

# Create new migration
supabase migration new {name}

# Apply migrations
supabase migration up

# Generate TypeScript types
supabase gen types typescript --local > types/database.types.ts

# Open Supabase Studio
supabase studio
```

### Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint
```

---

## Related Documents

- [Database Schema Design](../../02-architecture/database/schema-design.md)
- [Migration Strategy](../../02-architecture/database/migration-strategy.md)
- [CI/CD Pipeline Configuration](../../08-deployment/ci-cd-pipeline.md)
- [Technical Decision Log](technical-decisions/decision-log.md)

---

**Next Review Date:** [To be scheduled]  
**Owner:** Leila

