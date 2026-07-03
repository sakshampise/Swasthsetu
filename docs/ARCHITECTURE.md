# Architecture

```
Browser ─ Next.js 14 (App Router, Vercel)
│  ├─ React 18 + Tailwind glassmorphism UI (EN/HI/MR i18n)
│  ├─ WebGL layer: React Three Fiber + drei + postprocessing
│  │    Globe · hospital cluster · holo-deck · assistant orb · cross loader
│  ├─ Recharts analytics · Framer Motion transitions · GSAP hero timeline
│  └─ AppProvider: auth/session, language, theme, data, toasts (localStorage)
│
├─ /api/alerts     GET  → alert engine (lib/ai.ts)
├─ /api/forecast   POST → per-centre forecast (Vertex adapter point)
│
├─ Data: mock (lib/data.ts)  ⇄  Supabase Postgres (schema.sql, RLS)
├─ Firebase Auth (adapter) · Cloud Function stockSentinel → FCM push
└─ Google Cloud: Vertex AI (lib/vertex.ts) · Translate API (lib/translate.ts)
```

## AI models (deterministic demo → Vertex-swappable)
- **daysLeft / medStatus** — consumption-aware depletion + thresholds/expiry
- **footfallSeries** — seeded 14-day history + trended 7-day forecast
- **buildTransfers** — surplus(≥25d) → deficit(≤7d) matcher, qty = min(10-day need, 35% donor)
- **riskScore** — stock 35% · beds 25% · attendance 25% · labs 15%
- **buildAlerts** — all Track-3 example alerts, localized

## 3D performance budget (60 FPS target)
- Single persistent Canvas on landing; camera dolly instead of remounts
- `dpr` clamped (≤1.8 desktop, ≤1.5 mobile); procedural textures only (no fetches)
- Mobile: ~50% particles/points, post-processing & contact shadows off
- `prefers-reduced-motion`: static frame, `frameloop="demand"`
- Scroll/pointer written to a mutable store — zero React re-renders per frame
- Additive sprite "glow" fakes bloom cheaply where the composer is off
