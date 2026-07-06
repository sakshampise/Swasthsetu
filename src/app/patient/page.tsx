"use client";
import React, { useMemo } from "react";
import { useApp } from "@/context/AppProvider";
import { Card, SectionTitle, Stat } from "@/components/ui";
import {
  APPOINTMENTS0,
  PRESCRIPTIONS0,
  HEALTH_METRICS0,
  DOCTORS0,
} from "@/lib/data";
import { Calendar, Pill, HeartPulse } from "lucide-react";

/**
 * Patient dashboard (home) page. Displays a high-level summary of the
 * patient's upcoming appointments, active prescriptions and recent
 * health metrics. Also lists the next appointments and prescriptions.
 */
export default function PatientHomePage() {
  const { user } = useApp();

  // Upcoming appointments (status === booked).
  const upcoming = APPOINTMENTS0.filter((a) => a.status === "booked");
  // Completed prescriptions.
  const prescriptions = PRESCRIPTIONS0;
  // Compute last known metrics for bp and weight.
  const lastMetrics = useMemo(() => {
    const m: Record<string, number> = {};
    HEALTH_METRICS0.forEach((x) => { m[x.type] = x.value; });
    return m;
  }, []);
  // Determine next appointment.
  const next = upcoming[0];
  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Stat
          i={0}
          icon={Calendar}
          label="Next Appointment"
          value={next ? `${next.date} ${next.time}` : "None"}
          sub={next ? `with ${DOCTORS0.find((d) => d.id.toString() === next.doctorId)?.name || "Doctor"}` : undefined}
          tone="teal"
        />
        <Stat
          i={1}
          icon={Pill}
          label="Active Prescriptions"
          value={prescriptions.length}
          sub={prescriptions.length > 0 ? `${prescriptions[0].medications.length} medicines` : undefined}
          tone="sky"
        />
        <Stat
          i={2}
          icon={HeartPulse}
          label="Last BP"
          value={lastMetrics["bp"] ? `${lastMetrics["bp"]} mmHg` : "--"}
          sub={`Weight ${lastMetrics["weight"] || "--"} kg`}
          tone="violet"
        />
      </div>
      {/* Lists of upcoming appointments and prescriptions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <SectionTitle icon={Calendar}>Upcoming Appointments</SectionTitle>
          {upcoming.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming appointments.</p>
          )}
          <ul className="space-y-2">
            {upcoming.map((a) => {
              const doc = DOCTORS0.find((d) => d.id.toString() === a.doctorId);
              return (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm hover:bg-teal-500/5 dark:hover:bg-teal-500/10"
                >
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {a.date} · {a.time}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {doc?.name || "Doctor"} · {doc?.role}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-teal-600">Booked</span>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card className="p-4">
          <SectionTitle icon={Pill}>Active Prescriptions</SectionTitle>
          {prescriptions.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">No active prescriptions.</p>
          )}
          <ul className="space-y-2">
            {prescriptions.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border px-3 py-2 text-sm hover:bg-teal-500/5 dark:hover:bg-teal-500/10"
              >
                <p className="font-medium text-slate-800 dark:text-slate-200">Prescription #{p.id}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {p.medications.map((m) => m.name).join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}