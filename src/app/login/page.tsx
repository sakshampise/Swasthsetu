"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, LogOut, ShieldCheck, UserPlus, KeyRound, ClipboardList } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Card, Logo } from "@/components/ui";
import { DEMO_USERS } from "@/lib/data";
import { authConfigured, routeForRole } from "@/lib/auth";
import { missingSupabaseMessage } from "@/lib/supabase";

type Mode = "login" | "signup" | "forgot";

export default function LoginPage() {
  const { t, T, login, signupPatient, forgotPassword, user, logout } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetMessages = () => { setErr(""); setSuccess(""); };

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!email || !password) { setErr("Please enter email and password."); return; }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error: any) {
      setErr(error?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const submitPatientSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!name || !email || !signupPassword) { setErr("Name, email and password are required."); return; }
    if (signupPassword.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (signupPassword !== confirmPassword) { setErr("Passwords do not match."); return; }
    setLoading(true);
    try {
      const result = await signupPatient({
        name: name.trim(),
        email: email.trim(),
        password: signupPassword,
        phone: phone.trim(),
        dob,
        gender,
        bloodType,
      });
      if (result?.needsConfirmation) {
        setSuccess("Account created. Please verify your email, then log in.");
        setMode("login");
      }
    } catch (error: any) {
      setErr(error?.message || "Could not create patient account.");
    } finally {
      setLoading(false);
    }
  };

  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!email) { setErr("Please enter your email address."); return; }
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSuccess("Password reset email sent. Check your inbox.");
    } catch (error: any) {
      setErr(error?.message || "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (u: any) => {
    setMode("login");
    setEmail(u.email);
    setPassword(u.pass);
    resetMessages();
  };

  const continueCurrent = () => {
    router.push(routeForRole(user?.role));
  };

  return (
    <div className={`relative flex min-h-screen items-center justify-center ${T.app} font-body p-4 overflow-hidden`}>
      <div className="grad-mesh pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-teal-500/20 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-emerald-500/15 blur-[110px]" />
      <Card className="relative z-10 w-full max-w-2xl p-7 anim-fade">
        <Link href="/" className={`mb-5 block text-xs font-semibold ${T.sub} hover:text-teal-500`}>← SwasthSetu AI</Link>
        <div className="flex items-start justify-between gap-3">
          <Logo />
          <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${authConfigured() ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : "border-amber-500/30 bg-amber-500/10 text-amber-600"}`}>
            {authConfigured() ? "Real Auth Connected" : "Supabase Setup Required"}
          </span>
        </div>

        {user && (
          <div className={`mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-teal-500/20 p-3 ${T.soft}`}>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 text-xs font-bold text-white">
              {user.name?.split(" ").map((x: string) => x[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`truncate text-xs font-bold ${T.head}`}>{user.name}</p>
              <p className={`text-[10px] ${T.sub}`}>{t.signedInAs} · {user.role}</p>
            </div>
            <button onClick={continueCurrent} className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white shadow">Continue</button>
            <button onClick={logout} title="Logout" className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-bold text-rose-500 ${T.card} ${T.hover}`}><LogOut size={12} /> Logout</button>
          </div>
        )}

        <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-teal-500/20 bg-teal-500/5 p-1">
          {[["login", "Login", KeyRound], ["signup", "New Patient", UserPlus], ["forgot", "Forgot", ShieldCheck]].map(([key, label, Icon]: any) => (
            <button key={key} onClick={() => { setMode(key); resetMessages(); }} className={`flex items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-bold transition ${mode === key ? "bg-teal-600 text-white shadow" : "text-teal-700 hover:bg-teal-500/10"}`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {err && <p className="mt-4 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600">{err}</p>}
        {success && <p className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600"><CheckCircle2 size={14} className="mr-1 inline" />{success}</p>}
        {!authConfigured() && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-700">
            {missingSupabaseMessage} Login, signup, forgot password, applications and database writes are disabled until these values are configured. No mock/local authentication is used.
          </div>
        )}


        {mode === "login" && (
          <form onSubmit={submitLogin} className="mt-5 space-y-3">
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} placeholder="you@example.com" />
            </div>
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} placeholder="••••••••" />
            </div>
            <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 py-3 font-semibold text-white shadow-lg shadow-teal-600/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Signing in…" : authConfigured() ? "Login" : "Configure Supabase to Login"}
            </button>
          </form>
        )}

        {mode === "signup" && (
          <form onSubmit={submitPatientSignup} className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} placeholder="Patient full name" />
            </div>
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} placeholder="patient@example.com" />
            </div>
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} placeholder="+91…" />
            </div>
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Date of Birth</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} />
            </div>
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Blood Group</label>
              <input value={bloodType} onChange={(e) => setBloodType(e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} placeholder="O+, A+, B−…" />
            </div>
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Password</label>
              <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} placeholder="Minimum 6 characters" />
            </div>
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} placeholder="Repeat password" />
            </div>
            <button disabled={loading} className="sm:col-span-2 w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 py-3 font-semibold text-white shadow-lg shadow-teal-600/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Creating account…" : authConfigured() ? "Create Patient Account" : "Configure Supabase to Sign Up"}
            </button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={submitForgot} className="mt-5 space-y-3">
            <p className={`text-sm ${T.sub}`}>Enter your email and we will send a secure password reset link.</p>
            <div>
              <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} placeholder="you@example.com" />
            </div>
            <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-500 py-3 font-semibold text-white shadow-lg shadow-teal-600/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Sending…" : authConfigured() ? "Send Reset Link" : "Configure Supabase to Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 p-4">
          <div className="flex items-center gap-2">
            <ClipboardList size={17} className="text-amber-600" />
            <p className="text-sm font-extrabold uppercase tracking-wider text-amber-700">Real Test Accounts</p>
          </div>
          <p className={`mt-1 text-xs ${T.sub}`}>Buttons only fill email/password. These accounts must exist in your Supabase Auth project first. There is no mock/local login fallback.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {DEMO_USERS.map((u) => (
              <button key={u.role} type="button" onClick={() => fillDemo(u)} className={`rounded-xl border px-3.5 py-2.5 text-left transition ${T.card} ${T.hover}`}>
                <span className={`block text-sm font-bold ${T.head}`}>{u.role.toUpperCase()} · {u.name}</span>
                <span className={`block text-[11px] ${T.sub}`}>{u.email} · {u.pass}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-5 rounded-2xl border border-sky-500/25 bg-sky-500/10 p-4 text-sm ${T.sub}`}>
          Doctor, PHC Staff, Manager, or District Admin accounts are not open signup accounts. They must apply first and get approved by an administrator.
          <Link href="/apply" className="ml-1 font-bold text-sky-600 hover:underline">Apply for access →</Link>
        </div>
      </Card>
    </div>
  );
}
