"use client";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { I18N, type Lang } from "@/lib/i18n";
import { CENTRES, MEDS0, DEMO_USERS } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { getProfile, routeForRole, signInWithEmail, signOutUser, signUpPatient, sendPasswordReset, type PatientSignupPayload } from "@/lib/auth";
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

  // Restore UI preferences and subscribe to the real Supabase Auth session.
  // No localStorage/mock auth fallback is used. If Supabase env vars are missing,
  // the app simply has no authenticated session and auth actions throw a clear
  // configuration error from lib/supabase.ts.
  useEffect(() => {
    let mounted = true;

    const restore = async () => {
      try {
        const s = JSON.parse(localStorage.getItem("swasthsetu_prefs") || "{}");
        if (s.lang) setLang(s.lang);
        if (typeof s.dark === "boolean") setDark(s.dark);
      } catch {}

      if (supabase) {
        const { data } = await supabase.auth.getUser();
        if (mounted && data.user) {
          try {
            setUser(await getProfile(data.user));
          } catch {
            setUser(null);
            try { await supabase.auth.signOut(); } catch {}
          }
        }
      }

      if (mounted) setHydrated(true);
    };

    restore();

    const { data: listener } = supabase
      ? supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!session?.user) {
            setUser(null);
            return;
          }
          try {
            setUser(await getProfile(session.user));
          } catch {
            setUser(null);
            try { await supabase.auth.signOut(); } catch {}
          }
        })
      : { data: null as any };

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("swasthsetu_prefs", JSON.stringify({ lang, dark }));
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.lang = lang;
  }, [lang, dark, hydrated]);

  const t = I18N[lang];
  const T = themes[dark ? "dark" : "light"];
  const alerts = useMemo(() => buildAlerts(meds, CENTRES, t), [meds, t]);
  const page = PAGE_OF[pathname] || "dashboard";

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => { setToast(msg); if (toastTimer.current) clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 2600); };
  const setPage = (key: string) => router.push(ROUTES[key] || "/dashboard");
  const setView = (v: string) => router.push(v === "login" ? "/login" : v === "app" ? "/dashboard" : "/");
  const login = async (email: string, password?: string) => {
    const appUser = await signInWithEmail(email, password || "");
    setUser(appUser);
    router.push(routeForRole(appUser.role));
    return appUser;
  };

  const signupPatient = async (payload: PatientSignupPayload) => {
    const result = await signUpPatient(payload);
    if (result.user) {
      setUser(result.user);
      router.push(routeForRole(result.user.role));
    }
    return result;
  };

  const forgotPassword = async (email: string) => {
    await sendPasswordReset(email);
  };

  const logout = async () => {
    try { if (supabase) await signOutUser(); } catch {}
    setUser(null);
    router.push("/");
  };

  const demoLogin = (role: string) => {
    const u = DEMO_USERS.find((d) => d.role === role);
    if (!u) return;
    // Real-auth only: demo buttons fill credentials on the login page.
    // They do not create a local/mock session here. Seed these users in Supabase
    // first if you want one-click demo credentials to authenticate.
    router.push(`/login?email=${encodeURIComponent(u.email)}`);
  };

  const ctx = { t, T, lang, setLang, dark, setDark, user, setUser, login, signupPatient, forgotPassword, logout, demoLogin, page, setPage, setView, meds, setMeds, centres: CENTRES, alerts, toast, showToast, focusCentre, setFocusCentre, hydrated };
  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}
