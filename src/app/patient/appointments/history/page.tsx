"use client";
import React from "react";
import { APPOINTMENTS0, DOCTORS0 } from "@/lib/data";
import { Card, SectionTitle } from "@/components/ui";
import { History } from "lucide-react";

/**
 * Patient appointment history page. Lists past appointments with
 * status other than 'booked'. Shows the doctor, date/time and reason.
 */
export default function AppointmentHistoryPage() {
  const history = APPOINTMENTS0.filter((a) => a.status !== "booked");
  return (
    <div className="space-y-5">
      <Card className="p-4">
          <SectionTitle icon={History}>Appointment History</SectionTitle>
          {history.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">No appointment history available.</p>
          )}
          <ul className="space-y-2">
            {history.map((a) => {
              const doc = DOCTORS0.find((d) => d.id.toString() === a.doctorId);
              return (
                <li key={a.id} className="flex flex-col rounded-xl border px-3 py-2 hover:bg-teal-500/5 dark:hover:bg-teal-500/10">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{a.date} · {a.time}</p>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 capitalize">{a.status}</span>
                  </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {doc?.name || "Doctor"} · {a.reason}
                    </p>
                </li>
              );
            })}
          </ul>
      </Card>
    </div>
  );
}