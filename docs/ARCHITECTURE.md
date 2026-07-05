# Architecture

```
Browser ─ Next.js 14 (App Router, Vercel)
│  ├─ React 18 + Tailwind glassmorphism UI (EN/HI/MR i18n)
│  ├─ Recharts analytics · Framer Motion reveals & route transitions
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

## Motion design (simple & fast)
- Framer Motion: staggered hero, scroll-reveal sections, route transitions
- CSS keyframes: gradient-mesh drift, ECG pulse line, float, boot splash
- `prefers-reduced-motion` respected; no animation assets, no WebGL
