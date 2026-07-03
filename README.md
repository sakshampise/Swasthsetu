# SwasthSetu AI 🩺 — Smart Health Centre & Supply Chain Command

**Hack2Skill · Track 3: Smart Health — AI-Driven Health Center & Supply Chain Management (Google Cloud)**

An AI command centre for Primary & Community Health Centres (PHC/CHC): live medicine stock, patient footfall, bed availability, doctor attendance and lab audits — with **Vertex-AI-style demand forecasting**, **early stock-out warnings**, and **smart redistribution** between centres. Demo data covers **10 centres in Pune district**.

> "Paracetamol stock will run out in 3 days at PHC Wakad." — the app tells you *before* it happens, and suggests moving 320 units of ORS from PHC Aundh.

---

## ✨ Premium 3D experience

A world-class WebGL layer, built to feel like Apple/Vercel/Linear-grade sites — never gimmicky:

| Element | Where |
|---|---|
| Interactive healthcare **globe** (10 live centres, risk-coloured markers) | Landing, chapter 1 |
| **Animated supply-chain routes** driven by the real redistribution engine | Globe + district cluster |
| Floating **holographic hospital** + centre buildings with glowing status indicators | Landing, chapter 2 |
| **Health dashboard floating in 3D space** + **AI hologram assistant** | Landing, chapter 3 |
| Floating **medicine capsule, vaccine vial, medical cross**, AI network nodes | Around the globe |
| **Smooth scroll-choreographed camera** (globe → cluster → holo deck) | Whole landing page |
| **Mouse parallax**, soft lighting, **bloom**, contact shadows, fog, **particles** | Scene-wide |
| **Animated gradient-mesh** background + glassmorphism UI over the canvas | Everywhere |
| **3D medical-cross loading animation** + premium route transitions | App-wide |
| **AI assistant orb** (live WebGL) floating in the dashboard | All app pages |

**Performance:** device-pixel-ratio clamping, mobile scene budget (fewer particles, no post-processing), `prefers-reduced-motion` support, zero network assets (procedural textures only) — tuned for 60 FPS.

Stack: **React Three Fiber + Three.js + drei + @react-three/postprocessing + Framer Motion + GSAP**.

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

Plus: 3 roles (District Admin / PHC-CHC Manager / Doctor), full **English · हिन्दी · मराठी** UI, dark/light glassmorphism theme, mobile responsive.

## 🚀 Quickstart

```bash
npm install
npm run dev        # http://localhost:3000
```

No env vars needed — `NEXT_PUBLIC_USE_MOCK=true` is the default and everything runs on bundled Pune-district demo data.

### Demo logins

| Role | Email | Password |
|---|---|---|
| District Administrator | `admin@swasthsetu.in` | `admin123` |
| PHC/CHC Manager (Wakad) | `manager.wakad@swasthsetu.in` | `phc123` |
| Doctor/Staff | `doctor@swasthsetu.in` | `doc123` |

(One-tap buttons for all three are on the login page.)

## ☁️ Deploy to Vercel (~5 minutes)

1. Push this folder to a GitHub repo.
2. [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework is auto-detected as Next.js — click **Deploy**. Done.
4. *(Optional live mode)* add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, set `NEXT_PUBLIC_USE_MOCK=false`, and run `supabase/schema.sql` in Supabase.

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
    page.tsx           # 3D landing (scroll-choreographed WebGL)
    login/             # auth with one-tap demo roles
    dashboard/         # shell + 10 feature pages
    api/alerts         # GET alert feed (JSON)
    api/forecast       # POST per-centre forecast
  components/
    three/             # R3F scenes: globe, hospitals, holo-deck, orb, loader
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
