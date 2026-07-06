"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClipboardList, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, Logo } from "@/components/ui";
import { useApp } from "@/context/AppProvider";
import { authConfigured, submitAccessApplication } from "@/lib/auth";

export default function ApplyForAccessPage() {
  const { T } = useApp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    requestedRole: "doctor" as "doctor" | "staff" | "manager" | "admin",
    hospitalName: "",
    licenceNumber: "",
    department: "",
    message: "",
  });

  const setField = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    if (!form.fullName || !form.email || !form.requestedRole) {
      setErr("Full name, email and requested role are required.");
      return;
    }
    if (form.requestedRole === "doctor" && !form.licenceNumber) {
      setErr("Doctor applications require a medical licence number.");
      return;
    }
    setLoading(true);
    try {
      await submitAccessApplication(form);
      setSuccess("Application submitted successfully. Admin will verify and create your account.");
      setForm({ fullName: "", email: "", phone: "", requestedRole: "doctor", hospitalName: "", licenceNumber: "", department: "", message: "" });
    } catch (error: any) {
      setErr(error?.message || "Could not submit application. Please check Supabase configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative flex min-h-screen items-center justify-center ${T.app} font-body p-4 overflow-hidden`}>
      <div className="grad-mesh pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-sky-500/20 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-teal-500/15 blur-[110px]" />
      <Card className="relative z-10 w-full max-w-2xl p-7 anim-fade">
        <Link href="/login" className={`mb-5 block text-xs font-semibold ${T.sub} hover:text-teal-500`}>← Back to Login</Link>
        <div className="flex items-start justify-between gap-3">
          <Logo />
          <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${authConfigured() ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : "border-amber-500/30 bg-amber-500/10 text-amber-600"}`}>
            {authConfigured() ? "Connected" : "Supabase required"}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-teal-500 text-white shadow-lg"><ClipboardList size={18} /></div>
          <div>
            <h1 className={`font-display text-2xl font-extrabold ${T.head}`}>Apply for Staff / Doctor / Admin Access</h1>
            <p className={`text-sm ${T.sub}`}>Patient accounts can be created directly. Professional accounts require verification.</p>
          </div>
        </div>

        {err && <p className="mt-4 flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600"><AlertCircle size={14} />{err}</p>}
        {success && <p className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600"><CheckCircle2 size={14} />{success}</p>}

        <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2">
          <div>
            <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Full Name</label>
            <input value={form.fullName} onChange={(e) => setField("fullName", e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} />
          </div>
          <div>
            <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} />
          </div>
          <div>
            <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Phone</label>
            <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} />
          </div>
          <div>
            <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Requested Role</label>
            <select value={form.requestedRole} onChange={(e) => setField("requestedRole", e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`}>
              <option value="doctor">Doctor</option>
              <option value="staff">PHC Staff</option>
              <option value="manager">PHC/CHC Manager</option>
              <option value="admin">District Admin</option>
            </select>
          </div>
          <div>
            <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Hospital / PHC Name</label>
            <input value={form.hospitalName} onChange={(e) => setField("hospitalName", e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} />
          </div>
          <div>
            <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Licence Number</label>
            <input value={form.licenceNumber} onChange={(e) => setField("licenceNumber", e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} placeholder="Required for doctors" />
          </div>
          <div className="sm:col-span-2">
            <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Department</label>
            <input value={form.department} onChange={(e) => setField("department", e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} placeholder="General Medicine, Lab, Pharmacy…" />
          </div>
          <div className="sm:col-span-2">
            <label className={`text-[11px] font-bold uppercase tracking-wider ${T.sub}`}>Message</label>
            <textarea rows={4} value={form.message} onChange={(e) => setField("message", e.target.value)} className={`mt-1 w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 ${T.input}`} placeholder="Explain why you need access" />
          </div>
          <button disabled={loading} className="sm:col-span-2 w-full rounded-xl bg-gradient-to-r from-sky-600 to-teal-500 py-3 font-semibold text-white shadow-lg shadow-sky-600/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      </Card>
    </div>
  );
}
