"use client";

import React, { useMemo } from "react";
import { useApp } from "@/context/AppProvider";
import { Card, SectionTitle, Stat, Badge, Progress } from "@/components/ui";
import { CENTRES, MEDS0, TESTS0, DOCTORS0 } from "@/lib/data";
import {
  BedDouble,
  Pill,
  Users,
  FlaskConical,
} from "lucide-react";

/**
 * PHC staff dashboard. Presents an overview of the centre’s status:
 * bed occupancy, medicine stock, staff attendance and lab readiness.
 * The page derives data based on the logged-in user's assigned
 * centre. It also highlights medicines running low and tests that
 * require attention.
 */
export default function PHCDashboardPage() {
  const { user } = useApp();
  // Determine the active centre based on the user’s account. If none,
  // default to the first centre.
  const centreId = user?.centre || CENTRES[0].id;
  const centre = CENTRES.find((c) => c.id === centreId) || CENTRES[0];

  // Calculate bed occupancy percentage.
  const bedPct = Math.round((centre.occupied / centre.beds) * 100);

  // Determine low stock medicines for the centre.
  const meds = MEDS0.filter((m) => m.centre === centre.id);
  const lowStock = meds.filter((m) => m.stock < m.thr);

  // Staff attendance: number of present doctors vs total.
  const docs = DOCTORS0.filter((d) => d.centre === centre.id);
  const present = docs.filter((d) => d.status === "present");
  const attPct = Math.round((present.length / docs.length) * 100);

  // Lab tests status: number of tests available vs total.
  const tests = TESTS0.filter((t) => t.centre === centre.id);
  const availCount = tests.filter((t) => t.avail).length;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Stat
          i={0}
          icon={BedDouble}
          label="Bed Occupancy"
          value={`${bedPct}%`}
          sub={`${centre.occupied} of ${centre.beds} beds`}
          tone="rose"
        />
        <Stat
          i={1}
          icon={Pill}
          label="Low Stock Medicines"
          value={lowStock.length}
          sub={`${lowStock.length} of ${meds.length}`}
          tone="amber"
        />
        <Stat
          i={2}
          icon={Users}
          label="Staff Attendance"
          value={`${attPct}%`}
          sub={`${present.length} of ${docs.length} present`}
          tone="teal"
        />
        <Stat
          i={3}
          icon={FlaskConical}
          label="Tests Available"
          value={`${availCount} / ${tests.length}`}
          sub={`${availCount} available`}
          tone="sky"
        />
      </div>

      {/* Low stock medicines list */}
      <Card className="p-4">
        <SectionTitle icon={Pill}>Low Stock Medicines</SectionTitle>
        {lowStock.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            All medicines are above threshold levels.
          </p>
        )}
        <ul className="space-y-2">
          {lowStock.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm hover:bg-amber-500/5 dark:hover:bg-amber-500/10"
            >
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {m.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Stock: {m.stock} · Threshold: {m.thr}
                </p>
              </div>
              <Progress pct={Math.round((m.stock / m.thr) * 100)} tone="amber" />
            </li>
          ))}
        </ul>
      </Card>

      {/* Lab tests status */}
      <Card className="p-4">
        <SectionTitle icon={FlaskConical}>Lab Tests Status</SectionTitle>
        {tests.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No tests configured for this centre.
          </p>
        )}
        <ul className="space-y-2">
          {tests.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm hover:bg-teal-500/5 dark:hover:bg-teal-500/10"
            >
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {t.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Machine: {t.machine}
                </p>
              </div>
              <Badge kind={t.avail ? "healthy" : "critical"}>
                {t.avail ? "Available" : "Unavailable"}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}