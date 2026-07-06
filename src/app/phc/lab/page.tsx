"use client";

import React from "react";
import { useApp } from "@/context/AppProvider";
import { Card, SectionTitle, Progress, Badge } from "@/components/ui";
import { TESTS0 } from "@/lib/data";
import { FlaskConical } from "lucide-react";

/**
 * Lab page for PHC staff. Shows diagnostic tests available at the
 * centre, their machine status, reagent level and whether they are
 * currently available. Future enhancements could allow uploading
 * results and ordering new tests.
 */
export default function PHCLabPage() {
  const { user } = useApp();
  const centreId = user?.centre;
  const tests = TESTS0.filter((t) => t.centre === centreId);
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <SectionTitle icon={FlaskConical}>Laboratory</SectionTitle>
        {tests.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No diagnostic tests configured for this centre.
          </p>
        )}
        <ul className="space-y-2">
          {tests.map((t) => {
            const pct = t.reagent;
            const tone = pct < 25 ? "critical" : pct < 60 ? "low" : "healthy";
            return (
              <li
                key={t.id}
                className="rounded-xl border px-3 py-2 text-sm hover:bg-teal-500/5 dark:hover:bg-teal-500/10"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Machine: {t.machine} · Last done: {t.last}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge kind={t.avail ? "healthy" : "critical"}>
                      {t.avail ? "Available" : "Unavailable"}
                    </Badge>
                    <div className="mt-1 w-32">
                      <Progress pct={pct} tone={tone} />
                    </div>
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