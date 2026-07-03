"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  Pill, Users, BedDouble, Stethoscope, FlaskConical, BrainCircuit, ArrowRightLeft,
  BarChart3, Languages, Sparkles, ArrowRight, ChevronRight, Sun, Moon, Siren, Building2, LayoutDashboard,
} from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Card, Logo, LangPicker, TiltCard } from "@/components/ui";
import LandingScene from "@/components/LandingScene";

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
  hidden: { opacity: 0, y: 26 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Landing() {
  const { t, T, dark, setDark } = useApp();
  const heroRef = useRef<HTMLDivElement>(null);

  // GSAP hero entrance — staggered rise for badge, headline, copy, CTAs.
  useEffect(() => {
    if (!heroRef.current) return;
    const q = gsap.utils.selector(heroRef.current);
    const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "power3.out" } });
    tl.fromTo(q("[data-hero]"), { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.09 });
    return () => { tl.kill(); };
  }, []);

  return (
    <div className={`relative min-h-screen ${T.app} font-body`}>
      {/* Fixed WebGL stage — the page scrolls through its three chapters. */}
      <LandingScene dark={dark} />
      <div className="grad-mesh pointer-events-none fixed inset-0 z-0" />

      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <LangPicker compact />
          <button onClick={() => setDark(!dark)} className={`rounded-full border p-2 ${T.card}`}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
          <Link href="/login" className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:brightness-110">{t.signIn}</Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-24">
        {/* ---- Chapter 1 · Hero over the district globe ---- */}
        <section ref={heroRef} className="flex min-h-[86vh] items-center pt-6">
          <div className="max-w-xl">
            <div data-hero className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/25 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-500 backdrop-blur">
              <Sparkles size={13} /> Hack2Skill · Track 3 · Smart Health · Google Cloud
            </div>
            <h1 data-hero className={`font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl ${T.head}`}>
              {t.heroTitle1}<br />
              <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 bg-clip-text text-transparent">{t.heroTitle2}</span>
            </h1>
            <p data-hero className={`mt-4 max-w-xl text-[15px] leading-relaxed ${T.sub}`}>{t.heroSub}</p>
            <div data-hero className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/login" className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-3.5 font-semibold text-white shadow-xl shadow-teal-600/30 transition hover:brightness-110">
                {t.landingCta} <ArrowRight size={17} className="transition group-hover:translate-x-1" />
              </Link>
              <Link href="/login" className={`rounded-2xl border px-6 py-3.5 font-semibold backdrop-blur ${T.card} ${T.hover}`}>{t.watchDemo}</Link>
            </div>
            <div data-hero className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {[["10", t.totalCentres], ["7-day", "AI forecast"], ["3", t.language + "s"], ["60 FPS", "WebGL command view"]].map(([v, l]) => (
                <div key={l}><p className={`font-display text-xl font-bold ${T.head}`}>{v}</p><p className={`text-xs ${T.sub}`}>{l}</p></div>
              ))}
            </div>
            <p data-hero className={`mt-8 hidden items-center gap-2 text-[11px] sm:flex ${T.sub}`}>
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal-500" /> Scroll — the camera flies from the district globe to a live centre cluster.
            </p>
          </div>
        </section>

        {/* ---- Capabilities ---- */}
        <section className="py-16">
          <motion.p variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }} className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-teal-500">One platform · nine capabilities</motion.p>
          <motion.h2 variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }} className={`mt-2 text-center font-display text-2xl font-bold sm:text-3xl ${T.head}`}>Built for district health command</motion.h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div key={f.k} custom={i} variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
                <Card className="p-5 transition hover:-translate-y-1">
                  <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 p-2.5 text-white shadow-lg shadow-teal-600/25"><f.icon size={18} /></div>
                  <p className={`font-display text-sm font-bold ${T.head}`}>{(t as any)[f.k]}</p>
                  <p className={`mt-1 text-[13px] leading-relaxed ${T.sub}`}>{f.d}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---- Chapter 2 · District cluster narrative ---- */}
        <section className="flex min-h-[88vh] items-center">
          <motion.div variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="max-w-md">
            <Card className="p-6">
              <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 p-2.5 text-white shadow-lg"><Building2 size={18} /></div>
              <h3 className={`font-display text-2xl font-bold ${T.head}`}>Every PHC & CHC, one living map</h3>
              <p className={`mt-2 text-sm leading-relaxed ${T.sub}`}>Glowing indicators show each centre's live status — green healthy, amber strained, red critical. Animated routes are real transfer suggestions from the redistribution engine: <span className="font-semibold text-teal-500">ORS · Aundh → Wakad</span>.</p>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-xs font-medium text-rose-500"><Siren size={14} /> CHC Baner at 90% bed occupancy — referrals rerouted.</div>
            </Card>
          </motion.div>
        </section>

        {/* ---- Chapter 3 · Holo dashboard narrative + GCP ---- */}
        <section className="flex min-h-[88vh] items-center justify-end">
          <motion.div variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="max-w-md">
            <Card className="p-6">
              <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 p-2.5 text-white shadow-lg"><LayoutDashboard size={18} /></div>
              <h3 className={`font-display text-2xl font-bold ${T.head}`}>A command deck that floats to you</h3>
              <p className={`mt-2 text-sm leading-relaxed ${T.sub}`}>The AI assistant watches stock curves, bed pressure and attendance — and speaks up before things break: <span className="font-semibold text-teal-500">"Paracetamol runs out in 3 days at PHC Wakad."</span></p>
              <Link href="/login" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-teal-600/30 hover:brightness-110">{t.getStarted} <ChevronRight size={16} /></Link>
            </Card>
          </motion.div>
        </section>

        <section className="pb-6">
          <motion.div variants={rise} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
            <TiltCard>
              <Card className="p-6 sm:p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal-500">Google Cloud architecture</p>
                <h3 className={`mt-1 font-display text-xl font-bold ${T.head}`}>Vertex AI · Firebase Auth · Firestore/Supabase · Cloud Functions · Translate API · Looker-style analytics</h3>
                <p className={`mt-2 max-w-2xl text-sm ${T.sub}`}>Runs fully on mock data today; flip one env flag to go live. Cloud Functions push stock-out alerts, Vertex AI powers the 7-day demand model, Translate API extends beyond the 3 bundled languages.</p>
              </Card>
            </TiltCard>
          </motion.div>
        </section>

        <footer className={`mt-10 flex flex-col items-center gap-1 text-xs ${T.sub}`}>
          <Logo small />
          <p>SwasthSetu AI · Smart Health & Supply Chain · Pune District demo data</p>
        </footer>
      </main>
    </div>
  );
}
