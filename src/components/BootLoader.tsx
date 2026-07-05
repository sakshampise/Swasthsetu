"use client";
import React, { useEffect, useState } from "react";
import { Activity } from "lucide-react";

/* First-visit boot splash — minimal, modern, fast. */
export default function BootLoader() {
  const [phase, setPhase] = useState(1);
  useEffect(() => {
    const a = setTimeout(() => setPhase(2), 900);
    const b = setTimeout(() => setPhase(0), 1350);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (phase === 0) return null;
  return (
    <div className={`fixed inset-0 z-[100] grid place-items-center bg-[#f4faf9] transition-opacity duration-500 dark:bg-[#070d14] ${phase === 2 ? "opacity-0" : "opacity-100"}`}>
      <div className="anim-fade flex flex-col items-center gap-4">
        <div className="anim-pulseSoft grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-500 text-white shadow-xl shadow-teal-600/30">
          <Activity size={24} />
        </div>
        <div className="text-center">
          <p className="font-display text-lg font-extrabold tracking-tight text-slate-800 dark:text-slate-100">SwasthSetu <span className="text-teal-500">AI</span></p>
          <div className="mx-auto mt-3 h-1 w-28 overflow-hidden rounded-full bg-teal-500/15">
            <div className="anim-bar h-full w-1/3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
