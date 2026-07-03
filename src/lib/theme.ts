// Glassmorphism theme tokens shared by every page. Toggled by AppProvider.
import { Siren, AlertTriangle, Sparkles } from "lucide-react";

export const themes = {
  light: {
    app: "bg-[#f2f7f6] text-slate-800", nav: "bg-white/70 border-teal-900/10",
    card: "bg-white/75 border-white/60 shadow-[0_8px_30px_-12px_rgba(13,84,79,0.18)]",
    soft: "bg-teal-50/80", sub: "text-slate-500", head: "text-slate-900",
    input: "bg-white/80 border-slate-200 text-slate-800 placeholder-slate-400",
    hover: "hover:bg-teal-50/70", tblHead: "text-slate-400", grid: "#e2e8f0", axis: "#94a3b8",
    tip: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, color: "#0f172a" },
  },
  dark: {
    app: "bg-[#07120f] text-slate-200", nav: "bg-[#0a1a16]/80 border-white/5",
    card: "bg-white/[0.04] border-white/[0.07] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]",
    soft: "bg-white/[0.04]", sub: "text-slate-400", head: "text-white",
    input: "bg-white/5 border-white/10 text-white placeholder-slate-500",
    hover: "hover:bg-white/[0.05]", tblHead: "text-slate-500", grid: "#1e2b28", axis: "#64748b",
    tip: { backgroundColor: "#0c1f1a", border: "1px solid #1e3a34", borderRadius: 12, color: "#e2e8f0" },
  },
};

export const SEV = {
  critical: { dot: "bg-rose-500", chip: "bg-rose-500/12 text-rose-500 border-rose-500/25", Icon: Siren },
  warning: { dot: "bg-amber-500", chip: "bg-amber-500/12 text-amber-500 border-amber-500/25", Icon: AlertTriangle },
  info: { dot: "bg-sky-500", chip: "bg-sky-500/12 text-sky-500 border-sky-500/25", Icon: Sparkles },
};

