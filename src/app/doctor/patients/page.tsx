"use client";

import React, { useMemo, useState } from "react";
import { Card, SectionTitle, Badge } from "@/components/ui";
import { APPOINTMENTS0, PATIENTS0 } from "@/lib/data";
import { Search } from "lucide-react";

/**
 * Patient Queue page. Displays the list of patients waiting to be seen
 * by the doctor today. Provides a simple search field to filter
 * patients by name and assigns a random priority to each appointment
 * for demonstration. In a real application priority would be
 * calculated using triage scores or urgency flags.
 */
export default function DoctorPatientQueuePage() {
  // Build a mapping from patient id to name for lookup.
  const patientById: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    PATIENTS0.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, []);

  // Compose queue from appointments with status booked or accepted.
  const queue = useMemo(() => {
    return APPOINTMENTS0.filter(
      (a) => a.status === "booked" || a.status === "accepted"
    ).map((a) => {
      // Randomly assign a priority for demonstration purposes. In the
      // future this should be derived from triage scores.
      const rnd = a.reason?.toLowerCase().includes("fever") ? 0.8 : Math.random();
      const priority = rnd > 0.66 ? "High" : rnd > 0.33 ? "Medium" : "Low";
      return { ...a, patientName: patientById[a.patientId], priority };
    });
  }, [patientById]);

  const [search, setSearch] = useState("");
  const filtered = queue.filter((q) =>
    q.patientName.toLowerCase().includes(search.toLowerCase())
  );

  // Map priority levels to badge kinds defined in the ui component. The
  // Badge component accepts "critical", "low", "healthy", "info", or
  // "neutral". High priority is mapped to critical, medium to low and
  // low to healthy.
  const badgeTone = (p: string) => {
    switch (p) {
      case "High":
        return "critical";
      case "Medium":
        return "low";
      default:
        return "healthy";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <SectionTitle icon={Search}>
          Patient Queue
          <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
            ({filtered.length} results)
          </span>
        </SectionTitle>
        <div className="mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient name…"
            className="w-full rounded-lg border border-slate-300 bg-white/50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
          />
        </div>
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No patients found.
          </p>
        )}
        <ul className="space-y-2">
          {filtered.map((q) => (
            <li
              key={q.id}
              className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm hover:bg-teal-500/5 dark:hover:bg-teal-500/10"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {q.patientName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {q.date} · {q.time} · {q.reason}
                </p>
              </div>
              <Badge kind={badgeTone(q.priority)}>{q.priority}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}