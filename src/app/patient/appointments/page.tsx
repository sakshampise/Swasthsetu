"use client";
import React, { useState, useMemo } from "react";
import { DOCTORS0, CENTRES } from "@/lib/data";
import { Card, SectionTitle, Badge } from "@/components/ui";
import { Search, Stethoscope, MapPin } from "lucide-react";

/**
 * Appointment booking page for patients. Patients can search for doctors
 * by name and view basic details such as department, shift and centre.
 * A full booking flow (slot selection, confirmation) would typically be
 * handled here, but for this build we focus on the search and listing.
 */
export default function PatientAppointmentsPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DOCTORS0;
    return DOCTORS0.filter((d) => d.name.toLowerCase().includes(q));
  }, [query]);
  return (
    <div className="space-y-5">
      <Card className="p-4">
        <SectionTitle icon={Stethoscope}>Find a Doctor</SectionTitle>
        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctor by name…"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-8 pr-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="space-y-3">
          {results.map((doc) => {
            const centre = CENTRES.find((c) => c.id === doc.centre);
            return (
              <div key={doc.id} className="rounded-xl border px-4 py-3 hover:bg-teal-500/5 dark:hover:bg-teal-500/10">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{doc.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{doc.role} · {doc.shift}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin size={12} /> {centre?.name}
                </p>
                <div className="mt-2 text-right">
                  <button
                    disabled
                    className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white shadow disabled:opacity-50"
                    title="Booking flow coming soon"
                  >
                    View Slots
                  </button>
                </div>
              </div>
            );
          })}
          {results.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">No doctors match your search.</p>
          )}
        </div>
      </Card>
    </div>
  );
}