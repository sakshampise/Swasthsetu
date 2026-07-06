"use client";

import React, { useMemo, useState } from "react";
import { Card, SectionTitle } from "@/components/ui";
import {
  APPOINTMENTS0,
  PATIENTS0,
  PRESCRIPTIONS0,
} from "@/lib/data";
import { PlusCircle, XCircle } from "lucide-react";
import { useApp } from "@/context/AppProvider";

/**
 * Consultation workspace for doctors. Allows selection of an appointment,
 * displays patient details and captures symptoms, diagnosis and clinical
 * notes. Includes a simple prescription builder to add medications
 * dynamically. When saved, the data isn't persisted but triggers a
 * toast to show where integration with Supabase should occur.
 */
export default function DoctorConsultationPage() {
  const { showToast } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  // Get upcoming appointments for the doctor.
  const appointments = APPOINTMENTS0.filter(
    (a) => (a.status === "booked" || a.status === "accepted") && a.date >= today
  );
  const patientById = useMemo(() => {
    const map: Record<string, any> = {};
    PATIENTS0.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, []);
  // Selected appointment ID
  const [apptId, setApptId] = useState<string>(appointments[0]?.id || "");
  const appointment = appointments.find((a) => a.id === apptId);
  const patient = appointment ? patientById[appointment.patientId] : null;
  // Consultation form state
  const [symptoms, setSymptoms] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState([
    { name: "", dosage: "", duration: "" },
  ]);

  // Handlers to update medications array
  const updateMed = (idx: number, key: string, value: string) => {
    setMedications((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [key]: value };
      return copy;
    });
  };
  const addMed = () => setMedications((prev) => [...prev, { name: "", dosage: "", duration: "" }]);
  const removeMed = (idx: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    // In a real system this would persist the consultation details
    // and generate a prescription record. Here we simply show a toast.
    showToast("Consultation saved and prescription generated");
    // Reset form
    setSymptoms("");
    setDiagnosis("");
    setNotes("");
    setMedications([{ name: "", dosage: "", duration: "" }]);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <SectionTitle>Consultation Workspace</SectionTitle>
        {/* Appointment selector */}
        <div className="mb-4">
          <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
            Select Appointment
          </label>
          <select
            value={apptId}
            onChange={(e) => setApptId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white/50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
          >
            {appointments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.date} {a.time} – {patientById[a.patientId]?.name || "Patient"}
              </option>
            ))}
          </select>
        </div>
        {/* Patient details */}
        {patient && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Name
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {patient.name}
              </p>
            </div>
            {patient.gender && (
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Gender
                </p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {patient.gender}
                </p>
              </div>
            )}
            {patient.dob && (
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Date of Birth
                </p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {patient.dob}
                </p>
              </div>
            )}
            {patient.allergies && (
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Allergies
                </p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {patient.allergies.join(", ")}
                </p>
              </div>
            )}
          </div>
        )}
        {/* Consultation fields */}
        <div className="mb-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Symptoms
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white/50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Diagnosis
            </label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-300 bg-white/50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Clinical Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-300 bg-white/50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
            />
          </div>
        </div>
        {/* Prescription builder */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Prescription
          </p>
          {medications.map((m, idx) => (
            <div
              key={idx}
              className="mb-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center"
            >
              <input
                type="text"
                placeholder="Medicine name"
                value={m.name}
                onChange={(e) => updateMed(idx, "name", e.target.value)}
                className="w-full flex-1 rounded-lg border border-slate-300 bg-white/50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
              />
              <input
                type="text"
                placeholder="Dosage"
                value={m.dosage}
                onChange={(e) => updateMed(idx, "dosage", e.target.value)}
                className="w-full flex-1 rounded-lg border border-slate-300 bg-white/50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
              />
              <input
                type="text"
                placeholder="Duration"
                value={m.duration}
                onChange={(e) => updateMed(idx, "duration", e.target.value)}
                className="w-full flex-1 rounded-lg border border-slate-300 bg-white/50 p-2 text-sm dark:border-slate-700 dark:bg-slate-800/50"
              />
              <button
                onClick={() => removeMed(idx)}
                title="Remove medicine"
                className="text-rose-500 hover:text-rose-600"
              >
                <XCircle size={18} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMed}
            className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:from-teal-700 hover:to-emerald-600"
          >
            <PlusCircle size={14} /> Add Medicine
          </button>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleSave}
            className="rounded-lg bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-teal-700 hover:to-emerald-600"
          >
            Save & Finish
          </button>
        </div>
      </Card>
    </div>
  );
}