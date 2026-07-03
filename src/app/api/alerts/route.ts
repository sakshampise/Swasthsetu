import { NextResponse } from "next/server";
import { buildAlerts } from "@/lib/ai";
import { CENTRES, MEDS0 } from "@/lib/data";
import { I18N } from "@/lib/i18n";

/* GET /api/alerts?lang=en|hi|mr — the same alert engine the UI uses,
   exposed for Cloud Functions / external dashboards / webhooks. */
export async function GET(req: Request) {
  const lang = (new URL(req.url).searchParams.get("lang") || "en") as keyof typeof I18N;
  const alerts = buildAlerts(MEDS0, CENTRES, I18N[lang] || I18N.en);
  return NextResponse.json({ generatedAt: new Date().toISOString(), count: alerts.length, alerts });
}
