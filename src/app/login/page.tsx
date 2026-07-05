"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Card, Logo } from "@/components/ui";
import { DEMO_USERS } from "@/lib/data";

export default function LoginPage() {
  const { t, T, login, user, hydrated } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_USERS[0].email);
  const [pass, setPass] = useState(DEMO_USERS[0].pass);
  const [err, setErr] = useState("");
  useEffect(() => { if (hydrated && user) router.replace("/dashboard"); }, [hydrated, user, router]);
  const submit = (e: React.FormEvent) => { e.preventDefault(); const u = DEMO_USERS.find((x) => x.email === email && x.pass === pass); if (!u) { setErr("Invalid credentials — use a demo account below."); return; } setErr(""); login(u); };
  return (
    <div className={`relative flex min-h-screen items-center justify-center ${T.app} font-body p-4 overflow-hidden`}>
      <div className="grad-mesh pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-teal-500/20 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-emerald-500/15 blur-[110px]" />
      <Card className="relative z-10 w-full max-w-md p-7 anim-fade">
          <Link href="/" className={`mb-5 block text-xs font-semibold ${T.sub} hover:text-teal-500`}>← SwasthSetu AI</Link>
          <Logo />
          <h2 className={`mt-5 font-display text-xl font-bold ${T.head}`}>{t.welcome}</h2>
          <p className={`text-sm ${T.sub}`}>{t.tagline}</p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>{t.email}</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} />
            </div>
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>{t.password}</label>
              <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} />
            </div>
            {err && <p className="text-xs font-semibold text-rose-500">{err}</p>}
            <button className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 py-3 font-semibold text-white shadow-lg shadow-teal-600/30 transition hover:brightness-110">{t.signIn}</button>
          </form>
          <div className="mt-6">
            <p className={`mb-2 text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>{t.quickLogin}</p>
            <div className="grid gap-2">
              {DEMO_USERS.map((u) => (
                <button key={u.role} onClick={() => { setEmail(u.email); setPass(u.pass); login(u); }} className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition ${T.card} ${T.hover}`}>
                  <span>
                    <span className={`block text-sm font-semibold ${T.head}`}>{t[u.role]}</span>
                    <span className={`block text-[11px] ${T.sub}`}>{u.email} · {u.pass}</span>
                  </span>
                  <ChevronRight size={15} className="text-teal-500" />
                </button>
              ))}
            </div>
          </div>
      </Card>
    </div>
  );
}
