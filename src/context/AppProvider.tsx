"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { I18N, type Lang } from "@/lib/i18n";
import { CENTRES, MEDS0, DEMO_USERS } from "@/lib/data";
import { buildAlerts } from "@/lib/ai";
import { themes } from "@/lib/theme";

const ROUTES: Record<string, string> = {
  dashboard: "/dashboard", medicines: "/dashboard/medicines", footfall: "/dashboard/footfall",
  beds: "/dashboard/beds", doctors: "/dashboard/doctors", labs: "/dashboard/labs",
  forecast: "/dashboard/forecasting", redistribution: "/dashboard/redistribution",
  reports: "/dashboard/reports", settings: "/dashboard/settings",
};
const PAGE_OF: Record<string, string> = Object.fromEntries(Object.entries(ROUTES).map(([k, v]) => [v, k]));

const Ctx = createContext<any>(null);
export const useApp = () => useContext(Ctx);

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState<Lang>("en");
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [meds, setMeds] = useState(MEDS0);
  const [toast, setToast] = useState<string | null>(null);
  const [focusCentre, setFocusCentre] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore session + prefs (localStorage is fine in the real app, unlike the sandboxed preview).
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("swasthsetu") || "{}");
      if (s.lang) setLang(s.lang);
      if (typeof s.dark === "boolean") setDark(s.dark);
      if (s.user) setUser(s.user);
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("swasthsetu", JSON.stringify({ lang, dark, user }));
    document.documentElement.classList.toggle("dark", dark);
  }, [lang, dark, user, hydrated]);

  const t = I18N[lang];
  const T = themes[dark ? "dark" : "light"];
  const alerts = useMemo(() => buildAlerts(meds, CENTRES, t), [meds, t]);
  const page = PAGE_OF[pathname] || "dashboard";

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2600); };
  const setPage = (key: string) => router.push(ROUTES[key] || "/dashboard");
  const setView = (v: string) => router.push(v === "login" ? "/login" : v === "app" ? "/dashboard" : "/");
  const login = (u: any) => { setUser(u); router.push("/dashboard"); };
  const logout = () => { setUser(null); router.push("/"); };
  const demoLogin = (role: string) => { const u = DEMO_USERS.find((d) => d.role === role); if (u) login(u); };

  const ctx = { t, T, lang, setLang, dark, setDark, user, login, logout, demoLogin, page, setPage, setView, meds, setMeds, centres: CENTRES, alerts, toast, showToast, focusCentre, setFocusCentre, hydrated };
  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}
