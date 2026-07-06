# Deployment Guide

## 1 · Vercel (recommended, ~5 min)
1. Create a GitHub repo and push this folder.
2. vercel.com → Add New Project → Import the repo.
3. Framework preset: **Next.js** (auto). Build command `next build` (default).
4. Add Supabase environment variables before deploying, otherwise authentication/database actions are disabled with a setup warning.

CLI alternative:
```bash
npm i -g vercel
vercel        # follow prompts
vercel --prod
```

## 2 · Configure Supabase
1. supabase.com → New project → SQL Editor → paste `supabase/schema.sql` → Run.
2. Project Settings → API → copy URL + anon key.
3. In Vercel → Project → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy. Create test accounts in Supabase Auth and seed/update `auth_profiles` roles.

## 3 · Firebase Auth (optional future adapter)
1. console.firebase.google.com → create project → Authentication → Email/Password.
2. `npm i firebase`, fill `NEXT_PUBLIC_FIREBASE_*`, uncomment `src/lib/firebase.ts`,
   call `fbSignIn()` from `app/login/page.tsx`.

## 4 · Cloud Functions (stock sentinel)
```bash
npm i -g firebase-tools
firebase login && firebase init functions   # choose existing ./functions
firebase deploy --only functions
```
Set `APP_URL` env to your Vercel URL. The function polls `/api/alerts` hourly and
pushes critical alerts to FCM topics (`centre-wakad`, …).

## 5 · Vertex AI forecasting
- Train an AutoML Forecasting model (or call TimesFM) on the `footfall` table.
- Implement `vertexForecast()` in `src/lib/vertex.ts` with `@google-cloud/aiplatform`.
- Swap it into `app/api/forecast/route.ts` (the one commented line).

## Troubleshooting
- **Type warnings on `npm run dev`:** intentional `@ts-nocheck` on ported pages; production `next build` ignores via `next.config.mjs`.
