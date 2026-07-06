"use client";
import React from "react";
import { PRESCRIPTIONS0 } from "@/lib/data";
import { Card, SectionTitle } from "@/components/ui";
import { Pill } from "lucide-react";

/**
 * Medicine centre page. Shows current medicines from active prescriptions
 * along with simple reminder schedules. In a real application this would
 * integrate with a reminder service and local notifications. The refill
 * reminders are hard-coded for demonstration purposes.
 */
export default function MedicineCenterPage() {
  // Flatten medication list from all prescriptions.
  const meds = PRESCRIPTIONS0.flatMap((p) => p.medications.map((m) => ({ ...m, id: p.id })));
  return (
    <div className="space-y-5">
      <Card className="p-4">
        <SectionTitle icon={Pill}>Current Medicines</SectionTitle>
        {meds.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">No medicines currently prescribed.</p>
        )}
        <ul className="space-y-3">
          {meds.map((m, idx) => (
            <li key={idx} className="rounded-xl border px-4 py-3 hover:bg-teal-500/5 dark:hover:bg-teal-500/10">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{m.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dosage: {m.dosage} · Duration: {m.duration}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Reminders: 9:00 AM, 9:00 PM</p>
              <p className="text-xs text-amber-600 mt-1">Refill reminder: 3 days before end</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}