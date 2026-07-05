// ------- SwasthSetu AI heuristics -------
// These deterministic models power the demo. In production, swap the bodies of
// forecast() / riskScore() for calls to Vertex AI (see lib/vertex.ts) — the
// function signatures are already shaped for that handoff.
import type { Centre, Med } from "./data";

export const sRand = (n) => { const x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); };
export const daysLeft = (m) => (m.use > 0 ? Math.floor(m.stock / m.use) : 999);
export const medStatus = (m) => { const d = daysLeft(m); return d <= 3 || m.stock === 0 ? "critical" : d <= 7 || m.stock < m.thr ? "low" : "healthy"; };
export const occPct = (c) => Math.round((c.occupied / c.beds) * 100);

export function riskScore(c, meds) {
  const my = meds.filter((m) => m.centre === c.id);
  const stockRisk = my.length ? Math.max(...my.map((m) => (daysLeft(m) <= 3 ? 100 : daysLeft(m) <= 7 ? 70 : 20))) : 20;
  const bedRisk = Math.min(100, occPct(c) * 1.05);
  const attRisk = Math.max(0, 100 - c.att);
  const testRisk = Math.round((1 - c.testsOk / c.testsTotal) * 100);
  return Math.round(stockRisk * 0.35 + bedRisk * 0.25 + attRisk * 0.25 + testRisk * 0.15);
}

export function footfallSeries(c, hist = 14, fut = 7) {
  const out = [];
  for (let i = -hist; i < 0; i++) {
    const v = Math.round(c.opd * (0.72 + 0.42 * sRand(c.seed + i)) + 16 * Math.sin(i / 2.1));
    out.push({ d: `D${hist + i + 1}`, opd: v, em: Math.round(v * (0.05 + 0.05 * sRand(c.seed * 2 + i))) });
  }
  const avg = out.slice(-7).reduce((s, p) => s + p.opd, 0) / 7;
  for (let i = 0; i < fut; i++) {
    const v = Math.round(avg * (1.03 + i * 0.015) * (i % 7 === 1 ? 1.14 : 1));
    out.push({ d: `+${i + 1}`, forecast: v });
  }
  return out;
}

export function buildTransfers(meds) {
  const recs = [];
  const byName = {};
  meds.forEach((m) => { (byName[m.name] = byName[m.name] || []).push(m); });
  Object.values(byName).forEach((list) => {
    const needy = list.filter((m) => daysLeft(m) <= 7);
    const rich = list.filter((m) => daysLeft(m) >= 25).sort((a, b) => daysLeft(b) - daysLeft(a));
    needy.forEach((n) => {
      const r = rich.find((x) => x.centre !== n.centre);
      if (r) recs.push({ id: `${r.id}-${n.id}`, med: n.name, from: r.centre, to: n.centre, qty: Math.min(Math.ceil(n.use * 10), Math.floor(r.stock * 0.35)), fromId: r.id, toId: n.id });
    });
  });
  return recs;
}

export function buildAlerts(meds, centres, t) {
  const cn = (id) => centres.find((c) => c.id === id)?.name || id;
  const a = [];
  meds.forEach((m) => { const d = daysLeft(m); if (d <= 3) a.push({ sev: "critical", icon: "pill", txt: `${m.name}: ${t.runsOutIn} ${d}d · ${cn(m.centre)}`, time: "2m" }); });
  centres.forEach((c) => { if (occPct(c) >= 88) a.push({ sev: "critical", icon: "bed", txt: `${c.name}: ${occPct(c)}% ${t.occupancy.toLowerCase()}`, time: "11m" }); });
  centres.forEach((c) => { if (c.att < 60) a.push({ sev: "warning", icon: "doc", txt: `${c.name}: ${t.attendance.toLowerCase()} ${c.att}% (< 60%)`, time: "34m" }); });
  a.push({ sev: "warning", icon: "surge", txt: `CHC Pimpri: ${t.peakWarning} +18% (Mon OPD)`, time: "1h" });
  buildTransfers(meds).slice(0, 2).forEach((r) => a.push({ sev: "info", icon: "swap", txt: `${t.transferUnits} ${r.qty} × ${r.med}: ${cn(r.from)} → ${cn(r.to)}`, time: "1h" }));
  meds.forEach((m) => { if (new Date(m.exp) < new Date("2026-09-01")) a.push({ sev: "warning", icon: "cal", txt: `${m.name} · ${cn(m.centre)}: ${t.expiry} ${m.exp}`, time: "3h" }); });
  return a;
}

