# Zaffa

A modern wedding planning platform with localized pages, a wedding planning assistant, auth flows, dashboard, and admin experience.

## Features
- Arabic and English localized experience
- Wedding planning AI-style assistant
- Auth and onboarding UI
- Dashboard and admin shell
- Supabase-ready data layer with mock fallback

## Development
```bash
npm install
npm run dev
```

Open http://localhost:3003

## Deployment
This project is configured for Vercel and Supabase.

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
NEXT_PUBLIC_APP_URL=
```

Launch checklist (Arabic): [docs/LAUNCH-AR.md](docs/LAUNCH-AR.md)

## Database
Run the SQL in [supabase/schema.sql](supabase/schema.sql) in your Supabase project.
