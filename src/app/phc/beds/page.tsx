"use client";

import React from "react";
import { useApp } from "@/context/AppProvider";
import { Card, SectionTitle, Progress } from "@/components/ui";
import { CENTRES } from "@/lib/data";
import { BedDouble } from "lucide-react";

/**
 * Beds management page. Displays bed occupancy for the current centre
 * and provides a visual representation of capacity. In future versions
 * this page could allow admitting and discharging patients.
 */
export default function PHCBedsPage() {
  const { user } = useApp();
  const centreId = user?.centre;
  const centre = CENTRES.find((c) => c.id === centreId) || CENTRES[0];
  const pct = Math.round((centre.occupied / centre.beds) * 100);
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <SectionTitle icon={BedDouble}>Bed Management</SectionTitle>
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {centre.occupied} of {centre.beds} beds occupied
          </p>
          <Progress pct={pct} tone={pct > 80 ? "critical" : pct > 60 ? "low" : "healthy"} />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Occupancy: {pct}%
          </p>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Beds are auto-assigned on a first‑come first‑served basis. Contact the ward
          manager to arrange admissions or discharges.
        </p>
      </Card>
    </div>
  );
}