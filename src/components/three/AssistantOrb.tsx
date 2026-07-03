"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useApp } from "@/context/AppProvider";

const OrbScene = dynamic(() => import("./OrbScene"), { ssr: false, loading: () => null });

/* Floating AI hologram assistant — one tap jumps to AI Forecasting & Alerts. */
export default function AssistantOrb() {
  const { setPage, showToast, t } = useApp();
  return (
    <button
      onClick={() => { setPage("forecast"); showToast(t.liveAlerts); }}
      title="SwasthSetu AI assistant"
      className="group fixed bottom-5 right-5 z-40 h-14 w-14"
    >
      <span className="anim-ring absolute inset-0 rounded-full border-2 border-teal-400/50" />
      <span className="anim-ring absolute inset-0 rounded-full border-2 border-emerald-400/40" style={{ animationDelay: "1.1s" }} />
      <span className="absolute inset-0 overflow-hidden rounded-full shadow-xl shadow-teal-500/40 transition group-hover:scale-110">
        <OrbScene />
      </span>
    </button>
  );
}
