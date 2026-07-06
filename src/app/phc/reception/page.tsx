"use client";

import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { Card, SectionTitle, Badge } from "@/components/ui";
import { APPOINTMENTS0, PATIENTS0 } from "@/lib/data";
import { Users, PlusCircle } from "lucide-react";

/**
 * Reception page for PHC staff. Allows registration of walk-in
 * patients (simulation only) and shows the appointment queue for
 * the logged-in centre. This is a simplified placeholder; in a
 * production system the registration form would create a new
 * appointment record and interact with Supabase.
 */
export default function PHCReceptionPage() {
  const { user, showToast } = useApp();
  // Derive the centre for the logged-in staff.
  const centreId = user?.centre;
  // Build patient mapping for names.
  const patientById: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    PATIENTS0.forEach((p) => (map[p.id] = p.name));
    return map;
  }, []);
  // Filter appointments for this centre.
  const queue = APPOINTMENTS0.filter((a) => a.centre === centreId);
  // Registration form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const handleRegister = () => {
    if (!name || !email) {
      showToast("Please enter at least name and email");
      return;
    }
    // In real app we would create a new patient and appointment. Here we just reset and toast.
    showToast(`Patient ${name} registered`);
    setName("");
    setEmail("");
    setPhone("");
  };
  return (
    <div className="space-y-6">
      <Card className="p-4">
          <SectionTitle icon={PlusCircle}>New Patient Registration</SectionTitle>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-lg border border-slate-300 bg-white/50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-lg border border-slate-300 bg-white/50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="w-full rounded-lg border border-slate-300 bg-white/50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
            />
          </div>
          <button
            onClick={handleRegister}
            className="mt-3 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-teal-700 hover:to-emerald-600"
          >
            Register Patient
          </button>
      </Card>
      <Card className="p-4">
        <SectionTitle icon={Users}>Queue</SectionTitle>
        {queue.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No appointments scheduled for this centre.
          </p>
        )}
        <ul className="space-y-2">
          {queue.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm hover:bg-teal-500/5 dark:hover:bg-teal-500/10"
            >
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {patientById[a.patientId] || "Patient"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {a.date} · {a.time} · {a.reason}
                </p>
              </div>
              <Badge kind={a.status === "booked" ? "info" : "neutral"}>
                {a.status}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}