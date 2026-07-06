"use client";

import React, { useState } from "react";
import { Card, SectionTitle } from "@/components/ui";
import { CENTRES, PATIENTS0 } from "@/lib/data";
import {
  Siren,
  MapPin,
  Phone,
  Ambulance,
} from "lucide-react";
import { useApp } from "@/context/AppProvider";

/**
 * Emergency page for patients. Provides a one-click SOS button to
 * dispatch help, shows the nearest PHC, lists emergency contacts
 * and displays ambulance status. This page demonstrates how the
 * broader healthcare ecosystem can handle urgent situations.
 */
export default function PatientEmergencyPage() {
  const { showToast } = useApp();
  const [sosSent, setSosSent] = useState(false);
  // In a real app the patient profile would include a centre or
  // location attribute. Here we assume the first PHC in the list is
  // closest. You could use geolocation or the patient's registered
  // centre to determine proximity.
  const nearest = CENTRES.find((c) => c.type === "PHC") ?? CENTRES[0];
  const patient = PATIENTS0[0];

  const handleSOS = () => {
    setSosSent(true);
    showToast(
      `SOS sent to ${nearest.name}. Our team will contact you shortly.`
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 text-center">
        <Siren size={32} className="mx-auto mb-3 text-rose-600" />
        <h2 className="font-display text-xl font-bold text-slate-800 dark:text-slate-200">
          Emergency
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          If you are in immediate danger or need urgent medical help,
          press the SOS button below. We will notify the nearest PHC and
          dispatch an ambulance.
        </p>
        <button
          onClick={handleSOS}
          disabled={sosSent}
          className={`mt-4 rounded-full px-6 py-3 text-base font-bold text-white shadow-lg transition ${
            sosSent
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600"
          }`}
        >
          {sosSent ? "SOS Sent" : "Send SOS"}
        </button>
      </Card>
      <Card className="p-4">
        <SectionTitle icon={MapPin}>Nearest PHC</SectionTitle>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {nearest.name}, {nearest.area}
        </p>
      </Card>
      <Card className="p-4">
        <SectionTitle icon={Phone}>Emergency Contacts</SectionTitle>
        <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <span className="font-medium">Police:</span> 100
          </li>
          <li>
            <span className="font-medium">Ambulance:</span> 108
          </li>
          <li>
            <span className="font-medium">Disaster Helpline:</span> 112
          </li>
          {patient.phone && (
            <li>
              <span className="font-medium">Personal Contact:</span> {patient.phone}
            </li>
          )}
        </ul>
      </Card>
      <Card className="p-4">
        <SectionTitle icon={Ambulance}>Ambulance Status</SectionTitle>
        {sosSent ? (
          <p className="text-sm text-slate-700 dark:text-slate-300">
            An ambulance has been dispatched and will reach you shortly.
          </p>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No active emergency requests.
          </p>
        )}
      </Card>
    </div>
  );
}