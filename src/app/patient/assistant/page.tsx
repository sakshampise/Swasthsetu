"use client";

import React, { useState } from "react";
import {
  Card,
  SectionTitle,
  Badge,
} from "@/components/ui";
import {
  PRESCRIPTIONS0,
  LABREPORTS0,
} from "@/lib/data";
import {
  Stethoscope,
  FileText,
  FlaskConical,
  BookOpen,
  HelpCircle,
} from "lucide-react";

/**
 * Patient AI Assistant page. This page aggregates several
 * AI-powered utilities for patients: a simple symptom checker,
 * explanation of prescriptions, summarisation of lab reports,
 * and a general health education / FAQ section. None of these
 * tools call remote services yet – they rely on basic heuristics
 * and placeholder content. When the backend is ready these
 * functions can be replaced by calls to Gemini/OpenAI or other
 * APIs without changing the UI.
 */
export default function PatientAssistantPage() {
  // Symptom checker state
  const [symptoms, setSymptoms] = useState("");
  const [triage, setTriage] = useState<string | null>(null);

  // Prescription explanation state
  const [selectedRx, setSelectedRx] = useState<string>("");

  // When the symptom checker is executed we do a very naive
  // matching against known keywords. In a real system this would
  // call an AI service. The triage result is a simple string.
  const handleSymptomCheck = () => {
    const text = symptoms.toLowerCase();
    if (!text.trim()) {
      setTriage(null);
      return;
    }
    if (text.includes("fever") || text.includes("cough")) {
      setTriage(
        "Your symptoms may indicate a common infection such as a cold or flu. Stay hydrated and consult a doctor if they persist."
      );
    } else if (text.includes("chest") || text.includes("pain")) {
      setTriage(
        "Chest pain can be serious. Please seek medical attention immediately or call emergency services."
      );
    } else {
      setTriage(
        "We cannot provide a confident assessment based on the entered symptoms. Please consult a healthcare professional."
      );
    }
  };

  // Retrieve the selected prescription object
  const prescription = PRESCRIPTIONS0.find((p) => p.id === selectedRx);

  return (
    <div className="space-y-6">
      {/* Symptom checker */}
      <Card className="p-4">
        <SectionTitle icon={Stethoscope}>Symptom Checker</SectionTitle>
        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
          Enter your symptoms below and click
          <strong> Check</strong>. An AI model can triage your condition and
          suggest next steps. For now we use simple rules.
        </p>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={4}
          placeholder="e.g. fever, cough and body ache"
          className="w-full rounded-lg border border-slate-300 bg-white/50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
        />
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleSymptomCheck}
            className="rounded-lg bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-1.5 text-sm font-semibold text-white shadow transition hover:from-teal-700 hover:to-emerald-600"
          >
            Check
          </button>
          {triage && (
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {triage}
            </span>
          )}
        </div>
      </Card>

      {/* Prescription explanation */}
      <Card className="p-4">
        <SectionTitle icon={FileText}>Explain Prescriptions</SectionTitle>
        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
          Select one of your prescriptions to get a plain language
          explanation of the medications and how to take them.
        </p>
        <select
          value={selectedRx}
          onChange={(e) => setSelectedRx(e.target.value)}
          className="mb-3 w-full rounded-lg border border-slate-300 bg-white/50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
        >
          <option value="">Select a prescription…</option>
          {PRESCRIPTIONS0.map((p) => (
            <option key={p.id} value={p.id}>
              Prescription #{p.id}
            </option>
          ))}
        </select>
        {prescription && (
          <div className="space-y-2">
            {prescription.medications.map((m, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {m.name}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {m.dosage} for {m.duration}. {m.notes}
                </p>
                <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">
                  This medicine helps relieve your symptoms. Always follow
                  your doctor’s instructions.
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Lab report explanation */}
      <Card className="p-4">
        <SectionTitle icon={FlaskConical}>Explain Lab Reports</SectionTitle>
        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
          Review your lab reports and get a summary in simple terms. AI
          explanation will be added in the future.
        </p>
        {LABREPORTS0.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No lab reports available.
          </p>
        )}
        <ul className="space-y-3">
          {LABREPORTS0.map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {r.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {r.summary}
              </p>
              <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">
                AI Explanation: Coming soon.
              </p>
            </li>
          ))}
        </ul>
      </Card>

      {/* Health education & FAQ */}
      <Card className="p-4">
        <SectionTitle icon={BookOpen}>Health Education & FAQ</SectionTitle>
        <div className="mb-4 space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <p className="font-semibold">General wellness tips:</p>
          <ul className="list-inside list-disc pl-2 space-y-1">
            <li>Eat a balanced diet rich in fruits, vegetables and grains.</li>
            <li>Exercise at least 30 minutes on most days of the week.</li>
            <li>Stay hydrated by drinking plenty of water.</li>
            <li>Get 7–8 hours of sleep each night.</li>
            <li>Avoid smoking and limit alcohol consumption.</li>
          </ul>
        </div>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p className="font-semibold">Frequently Asked Questions:</p>
          <div>
            <p className="font-medium">How do I book an appointment?</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Navigate to the Appointments section, search for a doctor or PHC and
              select an available slot.
            </p>
          </div>
          <div>
            <p className="font-medium">Can I request prescription refills?</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Yes, you will receive reminders before your medicines run out. You
              can request a refill from the Medicine Centre page.
            </p>
          </div>
          <div>
            <p className="font-medium">Where do I see my test results?</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Lab reports are available under the Lab Reports section. You can
              view and download them there.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}