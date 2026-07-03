import { NextResponse } from "next/server";
import { footfallSeries, daysLeft } from "@/lib/ai";
import { CENTRES, MEDS0 } from "@/lib/data";
// import { vertexForecast } from "@/lib/vertex"; // ← flip to Vertex AI in production

/* POST /api/forecast { centreId } → 14-day history + 7-day OPD forecast
   and per-medicine depletion estimates for that centre. */
export async function POST(req: Request) {
  const { centreId = "wakad" } = await req.json().catch(() => ({}));
  const centre = CENTRES.find((c) => c.id === centreId) || CENTRES[0];
  const series = footfallSeries(centre);
  const meds = MEDS0.filter((m) => m.centre === centre.id).map((m) => ({ name: m.name, stock: m.stock, dailyUse: m.use, daysLeft: daysLeft(m) }));
  // Production: const series = await vertexForecast(centre, history)
  return NextResponse.json({ centre: centre.name, series, meds });
}
