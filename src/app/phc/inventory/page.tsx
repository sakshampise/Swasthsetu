"use client";

import React from "react";
import { useApp } from "@/context/AppProvider";
import { Card, SectionTitle, Progress } from "@/components/ui";
import { MEDS0 } from "@/lib/data";
import { Pill } from "lucide-react";

/**
 * Inventory page for PHC staff. Lists all medicines stocked at the
 * logged-in centre along with a progress bar indicating stock level
 * relative to the reorder threshold. This helps staff quickly
 * identify medicines that need replenishment.
 */
export default function PHCInventoryPage() {
  const { user } = useApp();
  const centreId = user?.centre;
  const meds = MEDS0.filter((m) => m.centre === centreId);
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <SectionTitle icon={Pill}>Medicine Inventory</SectionTitle>
        {meds.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No medicine data available for this centre.
          </p>
        )}
        <ul className="space-y-2">
          {meds.map((m) => {
            const pct = Math.min(100, Math.round((m.stock / m.thr) * 100));
            const tone = pct < 50 ? "amber" : pct < 75 ? "info" : "healthy";
            return (
              <li
                key={m.id}
                className="rounded-xl border px-3 py-2 text-sm hover:bg-teal-500/5 dark:hover:bg-teal-500/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {m.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Stock: {m.stock} · Threshold: {m.thr}
                    </p>
                  </div>
                  <div className="w-32">
                    <Progress pct={pct} tone={tone} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}