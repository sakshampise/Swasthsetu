"use client";

import React from "react";
import { useApp } from "@/context/AppProvider";
import { Card, SectionTitle, Badge } from "@/components/ui";
import { DOCTORS0 } from "@/lib/data";
import { Users } from "lucide-react";

/**
 * Attendance page for PHC staff. Lists all staff members assigned to
 * the centre along with their shifts, attendance status and
 * irregularity flags. This helps receptionists and managers track
 * who's present and available.
 */
export default function PHCAttendancePage() {
  const { user } = useApp();
  const centreId = user?.centre;
  const docs = DOCTORS0.filter((d) => d.centre === centreId);
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <SectionTitle icon={Users}>Staff Attendance</SectionTitle>
        {docs.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No staff records found for this centre.
          </p>
        )}
        <ul className="space-y-2">
          {docs.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm hover:bg-teal-500/5 dark:hover:bg-teal-500/10"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {d.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {d.role} · Shift {d.shift}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge kind={d.status === "present" ? "healthy" : d.status === "absent" ? "critical" : "low"}>
                  {d.status}
                </Badge>
                {d.irregular && (
                  <Badge kind="low">Irregular</Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}