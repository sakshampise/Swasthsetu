"use client";

import React, { useMemo } from "react";
import { Card, SectionTitle, Stat, Badge } from "@/components/ui";
import {
  APPOINTMENTS0,
  LABREPORTS0,
  PATIENTS0,
  HEALTH_METRICS0,
} from "@/lib/data";
import {
  Calendar,
  FlaskConical,
  AlertTriangle,
  UserCircle,
} from "lucide-react";

/**
 * Doctor dashboard page. Displays high-level information relevant to
 * the doctor such as today’s appointments, pending lab reports and
 * patients who may require urgent attention based on their metrics.
 * This page uses demo data; in production these would be fetched
 * from Supabase or Firestore via API calls.
 */
export default function DoctorDashboardPage() {
  // Determine today in ISO string (yyyy-mm-dd) based on the user’s locale.
  const today = new Date().toISOString().slice(0, 10);
  // Filter appointments that are upcoming or accepted.
  const upcoming = APPOINTMENTS0.filter(
    (a) => (a.status === "booked" || a.status === "accepted") && a.date >= today
  );
  // All lab reports are considered pending for the doctor until they are reviewed.
  const pendingReports = LABREPORTS0;

  // Determine number of critical metrics above thresholds. For demonstration
  // we flag blood pressure > 130 mmHg and sugar > 110 mg/dL.
  const criticalCount = HEALTH_METRICS0.filter(
    (m) =>
      (m.type === "bp" && m.value > 130) ||
      (m.type === "sugar" && m.value > 110)
  ).length;

  // Build a mapping of patient names by id for easy lookup.
  const patientById: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    PATIENTS0.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Stat
          i={0}
          icon={Calendar}
          label="Today’s Appointments"
          value={upcoming.length}
          sub={upcoming.length > 0 ? `${upcoming[0].date} at ${upcoming[0].time}` : undefined}
          tone="teal"
        />
        <Stat
          i={1}
          icon={FlaskConical}
          label="Pending Lab Reports"
          value={pendingReports.length}
          sub={pendingReports.length > 0 ? pendingReports[0].title : undefined}
          tone="sky"
        />
        <Stat
          i={2}
          icon={AlertTriangle}
          label="Critical Alerts"
          value={criticalCount}
          sub={criticalCount > 0 ? `Patients needing attention` : undefined}
          tone="rose"
        />
      </div>

      {/* Upcoming appointments list */}
      <Card className="p-4">
        <SectionTitle icon={Calendar}>Upcoming Appointments</SectionTitle>
        {upcoming.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No appointments scheduled for today.
          </p>
        )}
        <ul className="space-y-2">
          {upcoming.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm hover:bg-teal-500/5 dark:hover:bg-teal-500/10"
            >
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {patientById[a.patientId] || "Patient"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {a.date} · {a.time}
                </p>
              </div>
              <Badge kind="info">{a.status}</Badge>
            </li>
          ))}
        </ul>
      </Card>

      {/* Pending lab reports */}
      <Card className="p-4">
        <SectionTitle icon={FlaskConical}>Pending Lab Reports</SectionTitle>
        {pendingReports.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No lab reports pending.
          </p>
        )}
        <ul className="space-y-2">
          {pendingReports.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border px-3 py-2 text-sm hover:bg-teal-500/5 dark:hover:bg-teal-500/10"
            >
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {r.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {patientById[r.patientId] || "Patient"}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      {/* Critical alerts summary */}
      <Card className="p-4">
        <SectionTitle icon={AlertTriangle}>Critical Alerts</SectionTitle>
        {criticalCount === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No abnormal vitals detected in recent readings.
          </p>
        ) : (
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {criticalCount} abnormal readings detected. Please review your
            patients’ vitals and follow up.
          </p>
        )}
      </Card>
    </div>
  );
}