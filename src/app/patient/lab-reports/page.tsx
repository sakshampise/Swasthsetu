"use client";
import React from "react";
import { LABREPORTS0 } from "@/lib/data";
import { Card, SectionTitle } from "@/components/ui";
import { FlaskConical, Download, Info } from "lucide-react";

/**
 * Lab reports page. Lists lab reports for the patient with a short
 * summary. In a production build this would allow opening the PDF and
 * invoking AI summarisation; here we provide a download link to a
 * placeholder URL.
 */
export default function LabReportsPage() {
  return (
    <div className="space-y-5">
      <Card className="p-4">
        <SectionTitle icon={FlaskConical}>Lab Reports</SectionTitle>
        {LABREPORTS0.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">No lab reports available.</p>
        )}
        <ul className="space-y-3">
          {LABREPORTS0.map((r) => (
            <li key={r.id} className="rounded-xl border px-4 py-3 hover:bg-teal-500/5 dark:hover:bg-teal-500/10">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{r.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{r.summary}</p>
              <div className="mt-2 flex items-center gap-2">
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-teal-600 underline flex items-center gap-1">
                  <Download size={12} /> Download PDF
                </a>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Info size={12} /> AI summary available
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}