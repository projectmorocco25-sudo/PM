# Quick Start Guide

**Last Updated:** 2026-01-22

---

## 🚀 Launch the Application

### Step 1: Create Environment File

Create a `.env.local` file in the project root with your Supabase credentials:

```bash
# Create the file
touch .env.local
```

Then add the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lbtgmetmfkikrelbedou.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xIxwUBJkwlhGiX6XGXkc7A_F27KDpVB
```

**Note:** If the modern publishable key doesn't work, use the legacy anon key:
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxidGdtZXRtZmtpa3JlbGJlZG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNDU0MDEsImV4cCI6MjA4MzgyMTQwMX0.GKtwMXCWEHcFTimXzgwqnMvHWfX7FFi77X522ggeMog
```

### Step 2: Install Dependencies (if not already done)

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Open in Browser

Navigate to: **http://localhost:3000**

---

## ✅ That's It!

The application should now be running and connected to your remote Supabase instance.

---

## 📋 Available Routes

- **Homepage:** http://localhost:3000/
- **Login:** http://localhost:3000/login
- **Register:** http://localhost:3000/register
- **Dashboard:** http://localhost:3000/dashboard (requires authentication)
- **About:** http://localhost:3000/about
- **Support:** http://localhost:3000/support

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### Environment Variables Not Loading
1. Ensure `.env.local` is in the project root (same level as `package.json`)
2. Restart the dev server after creating/modifying `.env.local`
3. Variable names must start with `NEXT_PUBLIC_` for client-side access

### Supabase Connection Issues
- Verify your Supabase project is active
- Check that migrations are applied in your Supabase dashboard
- Check browser console for specific error messages

---

## 📚 More Information

For detailed setup instructions, see: [docs/06-development/setup-and-running.md](docs/06-development/setup-and-running.md)

---

**Status:** ✅ Ready to Run
