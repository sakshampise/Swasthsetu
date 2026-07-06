"use client";
import React from "react";
import { APPOINTMENTS0, PRESCRIPTIONS0, PATIENTS0, DOCTORS0 } from "@/lib/data";
import { Card, SectionTitle, Badge } from "@/components/ui";
import { FileText } from "lucide-react";

/**
 * Medical records page. Shows a timeline of past appointments with
 * diagnoses (prescriptions) and lists of allergies/vaccinations from
 * the patient's profile. In a real application this would also include
 * diagnoses text and attachments, but here we reuse the prescription
 * medications for brevity.
 */
export default function MedicalRecordsPage() {
  const patient = PATIENTS0[0];
  // Combine appointments and prescriptions by appointmentId.
  const history = APPOINTMENTS0.filter((a) => a.status !== "booked").map((a) => {
    const pres = PRESCRIPTIONS0.find((p) => p.appointmentId === a.id);
    const doc = DOCTORS0.find((d) => d.id.toString() === a.doctorId);
    return { ...a, prescription: pres, doctor: doc };
  });
  return (
    <div className="space-y-5">
      <Card className="p-4">
        <SectionTitle icon={FileText}>Medical Records</SectionTitle>
        {/* Allergies and vaccinations */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Allergies</p>
          {patient.allergies && patient.allergies.length > 0 ? (
            <div className="mt-1 flex flex-wrap gap-2">
              {patient.allergies.map((all, i) => (
                <Badge key={i} kind="low">{all}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">No allergies recorded.</p>
          )}
        </div>
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Vaccinations</p>
          {patient.vaccinations && patient.vaccinations.length > 0 ? (
            <div className="mt-1 flex flex-wrap gap-2">
              {patient.vaccinations.map((vac, i) => (
                <Badge key={i} kind="info">{vac}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">No vaccinations recorded.</p>
          )}
        </div>
        {/* Timeline of visits */}
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Previous Visits</p>
          <ul className="space-y-3">
            {history.map((h) => (
              <li key={h.id} className="rounded-xl border px-4 py-3 hover:bg-teal-500/5 dark:hover:bg-teal-500/10">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{h.date} · {h.time}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{h.doctor?.name || "Doctor"} · {h.reason}</p>
                {h.prescription && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Prescribed: {h.prescription.medications.map((m) => m.name).join(", ")}
                  </p>
                )}
              </li>
            ))}
            {history.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">No records found.</p>
            )}
          </ul>
        </div>
      </Card>
    </div>
  );
}