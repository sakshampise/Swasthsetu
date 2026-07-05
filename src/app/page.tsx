"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Pill, Users, BedDouble, Stethoscope, FlaskConical, BrainCircuit, ArrowRightLeft,
  BarChart3, Languages, Sparkles, ArrowRight, ChevronRight, Sun, Moon, Siren, Building2,
} from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Card, Logo, LangPicker, Progress } from "@/components/ui";
import { CENTRES, MEDS0 } from "@/lib/data";
import { riskScore } from "@/lib/ai";

const FEATURES = [
  { icon: Pill, k: "medicines", d: "Live stock, expiry & threshold tracking with auto stock-out warnings." },
  { icon: BrainCircuit, k: "forecast", d: "Vertex AI demand forecasting: 'Paracetamol runs out in 3 days.'" },
  { icon: ArrowRightLeft, k: "redistribution", d: "Smart transfer suggestions from surplus centres to needy ones." },
  { icon: Users, k: "footfall", d: "OPD & emergency counts with 7-day surge prediction." },
  { icon: BedDouble, k: "beds", d: "Ward-level occupancy with critical alerts & referral routing." },
  { icon: Stethoscope, k: "doctors", d: "Shift-wise attendance with irregular-pattern flagging." },
  { icon: FlaskConical, k: "labs", d: "Test availability, machine status & reagent audits." },
  { icon: BarChart3, k: "reports", d: "Looker-style analytics with AI risk score per centre." },
  { icon: Languages, k: "language", d: "English · हिन्दी · मराठी across the entire interface." },
];

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function Landing() {
  const { t, T, dark, setDark } = useApp();
  const risk = CENTRES.map((c) => ({ name: c.name.replace(/PHC |CHC /, ""), score: riskScore(c, MEDS0) })).sort((a, b) => b.score - a.score).slice(0, 4);

  return (
    <div className={`relative min-h-screen overflow-hidden ${T.app} font-body`}>
      {/* Animated gradient mesh + soft blobs — light, modern, CSS-only */}
      <div className="grad-mesh pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-teal-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-40 -right-40 h-[420px] w-[420px] rounded-full bg-emerald-400/15 blur-[120px]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <LangPicker compact />
          <button onClick={() => setDark(!dark)} className={`rounded-full border p-2 ${T.card}`}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
          <Link href="/login" className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:brightness-110">{t.signIn}</Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-24">
        {/* ---- Hero: staggered fade-up + one signature health-pulse line ---- */}
        <section className="grid items-center gap-10 pt-10 lg:grid-cols-2 lg:pt-16">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={rise} className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/25 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-500">
              <Sparkles size={13} /> Hack2Skill · Track 3 · Smart Health · Google Cloud
            </motion.div>
            <motion.h1 variants={rise} className={`font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl ${T.head}`}>
              {t.heroTitle1}<br />
              <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 bg-clip-text text-transparent">{t.heroTitle2}</span>
            </motion.h1>
            <motion.p variants={rise} className={`mt-4 max-w-xl text-[15px] leading-relaxed ${T.sub}`}>{t.heroSub}</motion.p>
            <motion.div variants={rise} className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/login" className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-3.5 font-semibold text-white shadow-xl shadow-teal-600/30 transition hover:brightness-110">
                {t.landingCta} <ArrowRight size={17} className="transition group-hover:translate-x-1" />
              </Link>
              <Link href="/login" className={`rounded-2xl border px-6 py-3.5 font-semibold ${T.card} ${T.hover}`}>{t.watchDemo}</Link>
            </motion.div>
            <motion.div variants={rise} className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {[["10", t.totalCentres], ["7-day", "AI forecast"], ["3", t.language + "s"], ["<60s", "alert latency"]].map(([v, l]) => (
                <div key={l}><p className={`font-display text-xl font-bold ${T.head}`}>{v}</p><p className={`text-xs ${T.sub}`}>{l}</p></div>
              ))}
            </motion.div>
            <motion.svg variants={rise} viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true" className="mt-8 h-10 w-full max-w-md opacity-80">
              <defs><linearGradient id="ecg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#14b8a6" /><stop offset="1" stopColor="#10b981" /></linearGradient></defs>
              <path d="M0 34 H130 l12 -16 14 30 12 -24 10 10 H300 l12 -14 13 24 11 -10 H470 l10 -8 12 14 H600" fill="none" stroke="url(#ecg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1000} className="anim-ecg" />
            </motion.svg>
          </motion.div>

          {/* Floating live-risk preview card */}
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}>
            <Card className="anim-float p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className={`font-display text-sm font-bold ${T.head}`}>District risk radar</p>
                <span className="flex items-center gap-1.5 rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-teal-500"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal-500" /> LIVE</span>
              </div>
              <div className="space-y-3">
                {risk.map((r) => (
                  <div key={r.name}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className={`font-semibold ${T.head}`}>{r.name}</span>
                      <span className={r.score >= 70 ? "font-bold text-rose-500" : r.score >= 45 ? "font-bold text-amber-500" : "font-bold text-emerald-500"}>{r.score}</span>
                    </div>
                    <Progress pct={r.score} tone={r.score >= 70 ? "bg-rose-500" : r.score >= 45 ? "bg-amber-500" : "bg-emerald-500"} />
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-2.5 text-xs font-medium text-rose-500"><Siren size={13} className="mb-1" />Paracetamol · PHC Wakad · 2 {t.daysLeft}</div>
                <div className="rounded-xl border border-sky-500/25 bg-sky-500/10 p-2.5 text-xs font-medium text-sky-500"><ArrowRightLeft size={13} className="mb-1" />ORS 320u · Aundh → Wakad</div>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* ---- Capabilities ---- */}
        <section className="mt-24">
          <motion.p variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }} className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-teal-500">One platform · nine capabilities</motion.p>
          <motion.h2 variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }} className={`mt-2 text-center font-display text-2xl font-bold sm:text-3xl ${T.head}`}>Built for district health command</motion.h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div key={f.k} custom={i % 3} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
                <Card className="p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-900/10">
                  <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 p-2.5 text-white shadow-lg shadow-teal-600/25"><f.icon size={18} /></div>
                  <p className={`font-display text-sm font-bold ${T.head}`}>{(t as any)[f.k]}</p>
                  <p className={`mt-1 text-[13px] leading-relaxed ${T.sub}`}>{f.d}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---- Alerts that arrive early ---- */}
        <section className="mt-24 grid gap-4 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -26 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
            <Card className="h-full p-6">
              <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 p-2.5 text-white shadow-lg"><Siren size={18} /></div>
              <h3 className={`font-display text-xl font-bold ${T.head}`}>Warnings, 3 days early</h3>
              <p className={`mt-2 text-sm leading-relaxed ${T.sub}`}>The depletion model watches every medicine's burn rate: <span className="font-semibold text-rose-500">"Paracetamol runs out in 3 days at PHC Wakad"</span> — raised automatically, in the manager's language, before the shelf is empty.</p>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 26 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>
            <Card className="h-full p-6">
              <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 p-2.5 text-white shadow-lg"><Building2 size={18} /></div>
              <h3 className={`font-display text-xl font-bold ${T.head}`}>One district, one view</h3>
              <p className={`mt-2 text-sm leading-relaxed ${T.sub}`}>Beds at <span className="font-semibold text-amber-500">CHC Baner hit 90%</span> — referrals reroute. Attendance dips below 60% — the centre gets flagged. Surplus ORS at Aundh — a transfer is suggested. All from one screen.</p>
              <Link href="/login" className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-teal-600/30 hover:brightness-110">{t.getStarted} <ChevronRight size={16} /></Link>
            </Card>
          </motion.div>
        </section>

        {/* ---- GCP ---- */}
        <motion.section className="mt-16" variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
          <Card className="p-6 sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-500">Google Cloud architecture</p>
            <h3 className={`mt-1 font-display text-xl font-bold ${T.head}`}>Vertex AI · Firebase Auth · Firestore/Supabase · Cloud Functions · Translate API · Looker-style analytics</h3>
            <p className={`mt-2 max-w-2xl text-sm ${T.sub}`}>Runs fully on mock data today; flip one env flag to go live. Cloud Functions push stock-out alerts, Vertex AI powers the 7-day demand model, Translate API extends beyond the 3 bundled languages.</p>
          </Card>
        </motion.section>

        <footer className={`mt-14 flex flex-col items-center gap-1 text-xs ${T.sub}`}>
          <Logo small />
          <p>SwasthSetu AI · Smart Health & Supply Chain · Pune District demo data</p>
        </footer>
      </main>
    </div>
  );
}
