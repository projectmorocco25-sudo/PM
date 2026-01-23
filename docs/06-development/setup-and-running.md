# Setup and Running the Application

**Last Updated:** 2026-01-22  
**Status:** ✅ Ready for Development

---

## Prerequisites

- **Node.js:** Version 18.x or higher
- **npm:** Version 9.x or higher (comes with Node.js)
- **Git:** For version control
- **Supabase Account:** Remote Supabase project (no local Supabase required)

---

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- Supabase client libraries
- Tailwind CSS
- TypeScript
- And all other dependencies

### 2. Configure Environment Variables

The application requires Supabase credentials to connect to your remote Supabase project.

**Option A: Use the provided `.env.local` file**

The `.env.local` file has been pre-configured with the project's Supabase credentials:
- **Project URL:** `https://lbtgmetmfkikrelbedou.supabase.co`
- **Publishable Key:** Already configured

**Option B: Create your own `.env.local`**

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Verify Supabase Connection

The application connects to a remote Supabase instance. Ensure:
- ✅ Your Supabase project is active
- ✅ All migrations have been applied
- ✅ RPC functions are deployed
- ✅ RLS policies are configured

---

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will start on **http://localhost:3000**

You should see output like:
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

### Available Scripts

- **`npm run dev`** - Start development server (hot reload enabled)
- **`npm run build`** - Build production bundle
- **`npm run start`** - Start production server (requires build first)
- **`npm run lint`** - Run ESLint to check code quality

---

## Application Structure

### Routes

- **Public Routes:** `/`, `/about`, `/support/*`, `/legal/*`, `/status`
- **Authentication:** `/login`, `/register`, `/forgot-password`, `/reset-password`
- **Dashboard:** `/dashboard` (role-based)
- **Profile:** `/profile`
- **Notifications:** `/notifications`
- **Communications:** `/communications/*`
- **History:** `/history` (placeholder)
- **Audit:** `/audit/*` (placeholders)

### Key Directories

```
PM/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public pages
│   ├── (auth)/            # Authentication pages
│   └── (dashboard)/       # Dashboard pages
├── components/            # React components
│   └── layout/           # Layout components (Header, Sidebar, etc.)
├── lib/                   # Utilities and libraries
│   ├── supabase/         # Supabase clients
│   ├── hooks/            # Custom React hooks
│   └── constants/        # Constants (roles, modules)
└── supabase/             # Supabase configuration
    └── migrations/       # Database migrations
```

---

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
npm run dev -- -p 3001
```

### Environment Variables Not Loading

1. Ensure `.env.local` exists in the project root
2. Restart the development server after changing `.env.local`
3. Check that variable names start with `NEXT_PUBLIC_` for client-side access

### Supabase Connection Issues

1. Verify your Supabase project is active
2. Check that the URL and key in `.env.local` are correct
3. Ensure your Supabase project has all migrations applied
4. Check browser console for specific error messages

### TypeScript Errors

If you see TypeScript errors:

```bash
# Check TypeScript configuration
npx tsc --noEmit
```

### Missing Dependencies

If you encounter module not found errors:

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Development Workflow

1. **Start the dev server:** `npm run dev`
2. **Open browser:** Navigate to http://localhost:3000
3. **Make changes:** Edit files in `app/`, `components/`, or `lib/`
4. **See changes:** Next.js hot reload will automatically refresh the page
5. **Check console:** Monitor browser console and terminal for errors

---

## Next Steps

- ✅ Application is ready to run
- ✅ All pages are implemented (some are placeholders)
- ✅ Supabase connection configured
- 📋 Next: Test authentication flow
- 📋 Next: Test dashboard navigation
- 📋 Next: Test communications features

---

## Support

For issues or questions:
- Check the [Support Center](../../app/(public)/support/page.tsx) (when running)
- Review [Documentation](../../app/(public)/support/documentation/page.tsx)
- Check Supabase dashboard for database status

---

**Status:** ✅ Ready for Development
