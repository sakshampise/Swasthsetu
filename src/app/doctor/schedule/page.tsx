"use client";

import React, { useMemo } from "react";
import { Card, SectionTitle, Badge } from "@/components/ui";
import { APPOINTMENTS0, PATIENTS0 } from "@/lib/data";
import { Calendar } from "lucide-react";

/**
 * Doctor schedule page. Shows all upcoming appointments grouped by date.
 * In production this would integrate with a calendar component. For now
 * we render a simple grouped list of appointments.
 */
export default function DoctorSchedulePage() {
  // Build lookup for patient names.
  const patientById: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    PATIENTS0.forEach((p) => (map[p.id] = p.name));
    return map;
  }, []);
  // Group appointments by date for future appointments.
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = APPOINTMENTS0.filter((a) => a.date >= today);
  const grouped: Record<string, typeof upcoming> = {};
  upcoming.forEach((a) => {
    if (!grouped[a.date]) grouped[a.date] = [];
    grouped[a.date].push(a);
  });
  // Sort dates
  const dates = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <SectionTitle icon={Calendar}>Schedule</SectionTitle>
        {dates.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No upcoming appointments scheduled.
          </p>
        )}
        <div className="space-y-4">
          {dates.map((date) => (
            <div key={date}>
              <h4 className="mb-2 font-display text-sm font-bold text-slate-800 dark:text-slate-200">
                {date}
              </h4>
              <ul className="space-y-2">
                {grouped[date]
                  .sort((a, b) => (a.time < b.time ? -1 : 1))
                  .map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm hover:bg-teal-500/5 dark:hover:bg-teal-500/10"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {a.time} – {patientById[a.patientId] || "Patient"}
                        </p>
                        {a.reason && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {a.reason}
                          </p>
                        )}
                      </div>
                      <Badge kind={a.status === "booked" ? "info" : "neutral"}>
                        {a.status}
                      </Badge>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}