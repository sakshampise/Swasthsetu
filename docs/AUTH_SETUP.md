# Supabase Authentication Setup

The app now uses real Supabase Authentication only. There is no mock authentication and no Local Preview Mode.

## Root cause of the warning

The warning appeared because the app could not find these environment variables at runtime:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Without these values, the browser cannot initialize the Supabase client. Login, signup, forgot password, access applications, and database writes cannot work until the variables are provided.

## Required steps

1. Create a Supabase project.
2. Open Supabase Dashboard → Project Settings → API.
3. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

5. Run the SQL in `supabase/schema.sql` inside Supabase SQL Editor.
6. In Supabase Authentication → Providers, enable Email provider.
7. Restart your local dev server after adding `.env.local`.

## Local commands

```bash
npm install
npm run dev
```

## Vercel deployment

Add the same two variables in Vercel:

Project → Settings → Environment Variables

Then redeploy.

## Test accounts

The visible test account buttons on the login page only fill credentials. They do not bypass authentication.

Create these users in Supabase Auth if you want the buttons to log in:

- `patient@swasthsetu.in` / `pat123`
- `doctor@swasthsetu.in` / `doc123`
- `staff@swasthsetu.in` / `staff123`
- `manager.wakad@swasthsetu.in` / `phc123`
- `admin@swasthsetu.in` / `admin123`

After creating each user, insert/update their row in `auth_profiles` with the correct role.

## What works after setup

- Real user signup through Supabase Auth
- Patient profile row creation via trigger/upsert
- Real login/logout session persistence
- Forgot password emails
- Protected role-based routes
- Access application database writes
- Medicine reads through Supabase data functions
