# SwasthSetu AI 🩺 — Smart Health Centre & Supply Chain Command

**Hack2Skill · Track 3: Smart Health — AI-Driven Health Center & Supply Chain Management (Google Cloud)**

An AI command centre for Primary & Community Health Centres (PHC/CHC): live medicine stock, patient footfall, bed availability, doctor attendance and lab audits — with **Vertex-AI-style demand forecasting**, **early stock-out warnings**, and **smart redistribution** between centres. Demo data covers **10 centres in Pune district**.

> "Paracetamol stock will run out in 3 days at PHC Wakad." — the app tells you *before* it happens, and suggests moving 320 units of ORS from PHC Aundh.

---

## ✨ Modern motion design

Simple, fast, professional — no WebGL, no heavy libraries beyond Framer Motion:

- **Staggered fade-up hero** with an animated **health-pulse (ECG) line**
- **Animated gradient-mesh** background + soft aurora blobs (pure CSS)
- **Floating live-risk preview card** and gentle hover-lift feature cards
- **Scroll-reveal sections** (Framer Motion `whileInView`)
- **Minimal boot splash** (pulsing logo + progress sweep) and route transitions
- Respects `prefers-reduced-motion`; zero animation assets to download

## 🧠 Core capabilities (Track 3 brief)

1. Medicine stock monitoring with thresholds & expiry
2. Patient footfall (OPD + emergency) tracking
3. Bed availability by centre
4. Doctor attendance with irregular-pattern flags
5. Lab test availability & reagent/machine audits
6. Early stock-out warnings ("runs out in N days")
7. AI demand forecasting (14-day history + 7-day forecast)
8. Smart redistribution: surplus → deficit transfer suggestions
9. Auto-flagging underperforming centres for district admins (AI risk score)

Plus: expanded role-specific portals for **Patient · Doctor · PHC Staff · District Admin**, full **English · हिन्दी · मराठी** UI, dark/light glassmorphism theme, mobile responsive.

## 🏥 Expanded healthcare ecosystem

SwasthSetu AI now includes separate protected workflows for every role:

- **Patient Portal** — appointments, medical records, lab reports, medicine reminders, health tracker, AI assistant and SOS emergency flow.
- **Doctor Portal** — daily appointments, patient queue, consultation workspace, prescription builder, schedule and AI clinical assistant.
- **PHC Staff Portal** — reception, queue management, inventory, bed management, lab status, pharmacy dispensing and attendance.
- **District Admin Dashboard** — live analytics, resource monitoring, forecasting, redistribution and performance reports.

## 🚀 Quickstart

```bash
npm install
cp .env.example .env.local
# Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
npm run dev        # http://localhost:3000
```

This project now uses **real Supabase Authentication only**. It does not use mock/local authentication. If Supabase environment variables are missing, login/signup/forgot password/applications are disabled and the login page shows a setup warning.

### Real authentication

Supported flows:

- Login with email and password
- New patient account creation
- Forgot password / reset link
- Logout
- Role-based redirects and protected routes
- Professional access application for Doctor, PHC Staff, Manager and District Admin

To enable real accounts:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Enable Email provider in Supabase Authentication.
4. Add these variables in `.env.local` locally, or in Vercel → Project → Settings → Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

See [`docs/AUTH_SETUP.md`](docs/AUTH_SETUP.md) for the complete setup guide.

### Real test account reference

The test account section is still boldly visible on the login page, but those buttons only fill test credentials. They do not bypass authentication. Create these accounts in Supabase Auth first and set their `auth_profiles.role` values.

| Role | Email | Password |
|---|---|---|
| District Administrator | `admin@swasthsetu.in` | `admin123` |
| PHC/CHC Manager (Wakad) | `manager.wakad@swasthsetu.in` | `phc123` |
| Doctor | `doctor@swasthsetu.in` | `doc123` |
| Patient | `patient@swasthsetu.in` | `pat123` |
| PHC Staff | `staff@swasthsetu.in` | `staff123` |

## ☁️ Deploy to Vercel (~5 minutes)

1. Push this folder to a GitHub repo.
2. [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework is auto-detected as Next.js — click **Deploy**. Done.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Environment Variables, run `supabase/schema.sql`, then redeploy.

Full guide: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

## 🏗️ Google Cloud integration map

| Service | Where in code | Status |
|---|---|---|
| Vertex AI (forecasting) | `src/lib/vertex.ts` → `app/api/forecast` | adapter stub, one-line swap |
| Firebase Auth | `src/lib/firebase.ts` | adapter stub |
| Firestore / **Supabase** | `src/lib/supabase.ts` + `supabase/schema.sql` | schema ready |
| Cloud Functions | `functions/index.js` (hourly stock sentinel → FCM) | deployable |
| Translate API | `src/lib/translate.ts` | working when key set |
| Looker-style analytics | `dashboard/reports` | built-in |

## 📁 Structure

```
src/
  app/                 # Next.js App Router pages
    page.tsx           # animated landing (Framer Motion + CSS)
    login/             # auth with one-tap demo roles
    dashboard/         # shell + 10 feature pages
    api/alerts         # GET alert feed (JSON)
    api/forecast       # POST per-centre forecast
  components/
    ui.tsx, Shell.tsx
  context/AppProvider  # auth · language · theme · data · toasts
  lib/                 # data, AI heuristics, i18n, GCP adapters
supabase/schema.sql    # Postgres schema + RLS
functions/             # Firebase Cloud Function (stock sentinel)
docs/                  # deployment · pitch deck · demo script · architecture
```

## 📚 Docs

- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — Vercel, Supabase, Firebase, Vertex AI
- [`docs/PITCH_DECK.md`](docs/PITCH_DECK.md) — 12-slide outline
- [`docs/DEMO_VIDEO_SCRIPT.md`](docs/DEMO_VIDEO_SCRIPT.md) — timed 4-minute script
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system + 3D performance notes

---

MIT · Built for Hack2Skill Track 3 · Demo data only — not for clinical use.
