/* Google Cloud Translate adapter — extends the UI beyond bundled en/hi/mr.
   Server-side usage: const txt = await gTranslate("Stock critical", "ta"); */
export async function gTranslate(text: string, target: string): Promise<string> {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!key) return text; // graceful no-op without a key
  const r = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text, target, format: "text" }),
  });
  const j = await r.json();
  return j?.data?.translations?.[0]?.translatedText ?? text;
}
