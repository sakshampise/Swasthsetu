"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CrossLoader = dynamic(() => import("./three/CrossLoader"), {
  ssr: false,
  // CSS fallback keeps the beat even before the WebGL chunk lands.
  loading: () => (
    <div style={{ perspective: "700px" }}>
      <div className="anim-spin3d relative h-16 w-16" style={{ filter: "drop-shadow(0 0 22px rgba(20,184,166,.55))" }}>
        <div className="absolute left-1/2 top-0 h-16 w-5 -translate-x-1/2 rounded-lg bg-gradient-to-b from-teal-500 to-emerald-500" />
        <div className="absolute left-0 top-1/2 h-5 w-16 -translate-y-1/2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500" />
      </div>
    </div>
  ),
});

/* First-visit boot sequence: 3D medical cross, then fade to the app. */
export default function BootLoader() {
  const [phase, setPhase] = useState(1);
  useEffect(() => {
    const a = setTimeout(() => setPhase(2), 1250);
    const b = setTimeout(() => setPhase(0), 1850);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (phase === 0) return null;
  return (
    <div className={`fixed inset-0 z-[100] grid place-items-center bg-[#f4faf9] transition-opacity duration-500 dark:bg-[#070d14] ${phase === 2 ? "opacity-0" : "opacity-100"}`}>
      <div className="flex flex-col items-center gap-4">
        <CrossLoader size={104} />
        <div className="text-center">
          <p className="font-display text-lg font-extrabold tracking-tight text-slate-800 dark:text-slate-100">SwasthSetu <span className="text-teal-500">AI</span></p>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Initialising district health grid…</p>
        </div>
      </div>
    </div>
  );
}
