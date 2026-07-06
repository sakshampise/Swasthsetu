"use client";

import React, { useMemo } from "react";
import { Card, SectionTitle } from "@/components/ui";
import { HEALTH_METRICS0, PRESCRIPTIONS0 } from "@/lib/data";
import {
  BrainCircuit,
  AlertTriangle,
  HeartPulse,
  Pill,
  Lightbulb,
} from "lucide-react";

/**
 * AI Clinical Assistant page for doctors. Provides a set of
 * placeholder AI-powered insights: diagnosis suggestions based on
 * patient symptoms and vitals, detection of abnormal readings,
 * drug interaction warnings, simple risk analysis and general
 * clinical suggestions. These functions are currently hard-coded but
 * demonstrate the structure and layout for integrating actual AI
 * services in the future.
 */
export default function DoctorAssistantPage() {
  // Detect abnormal metrics. We flag blood pressure > 130 and sugar > 110.
  const abnormal = useMemo(() => {
    return HEALTH_METRICS0.filter(
      (m) =>
        (m.type === "bp" && m.value > 130) ||
        (m.type === "sugar" && m.value > 110)
    );
  }, []);
  // Determine some dummy diagnosis suggestions.
  const diagnosisSuggestions = [
    "Common cold or viral infection",
    "Hypertension",
    "Diabetes mellitus",
    "Stress-related headache",
  ];
  // For drug interactions we inspect prescriptions and make dummy comments.
  const interactions = useMemo(() => {
    // Flatten medications from all prescriptions
    const meds = PRESCRIPTIONS0.flatMap((p) => p.medications.map((m) => m.name));
    // Simple rule: if both paracetamol and cough syrup exist there is minor interaction
    const hasPara = meds.some((m) => m.toLowerCase().includes("paracetamol"));
    const hasCough = meds.some((m) => m.toLowerCase().includes("syrup"));
    if (hasPara && hasCough) {
      return [
        {
          message:
            "Paracetamol and certain cough syrups can both contain acetaminophen. Ensure the total daily dose does not exceed 4 g.",
        },
      ];
    }
    return [];
  }, []);
  // Risk analysis could involve forecasting; we simply count abnormal metrics.
  const riskLevel = abnormal.length > 2 ? "High" : abnormal.length === 2 ? "Moderate" : "Low";

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <SectionTitle icon={BrainCircuit}>Diagnosis Suggestions</SectionTitle>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          {diagnosisSuggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </Card>
      <Card className="p-4">
        <SectionTitle icon={HeartPulse}>Abnormal Vitals</SectionTitle>
        {abnormal.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            All recent vitals appear normal.
          </p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {abnormal.map((m, i) => (
              <li key={i}>
                {m.type.toUpperCase()} reading of {m.value}
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card className="p-4">
        <SectionTitle icon={Pill}>Drug Interaction Warnings</SectionTitle>
        {interactions.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No significant drug interactions detected.
          </p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            {interactions.map((it, i) => (
              <li key={i}>{it.message}</li>
            ))}
          </ul>
        )}
      </Card>
      <Card className="p-4">
        <SectionTitle icon={AlertTriangle}>Risk Analysis</SectionTitle>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Based on recent vitals the patient’s risk level is
          <span className="font-bold"> {riskLevel}</span>.
        </p>
      </Card>
      <Card className="p-4">
        <SectionTitle icon={Lightbulb}>Clinical Suggestions</SectionTitle>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            Encourage the patient to maintain a healthy lifestyle with diet
            and exercise.
          </li>
          <li>
            Educate the patient on medication adherence and proper dosing.
          </li>
          <li>Schedule follow‑up appointments as needed.</li>
        </ul>
      </Card>
    </div>
  );
}