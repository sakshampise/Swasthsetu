/* Vertex AI demand forecasting adapter.
   The UI's heuristic forecaster (lib/ai.ts) has the same signature, so swapping
   this in is a one-line change in app/api/forecast/route.ts.

   Server-side only. Setup:
   - gcloud auth application-default login (or a service account on Vercel)
   - GOOGLE_CLOUD_PROJECT + VERTEX_AI_LOCATION in env
   - npm i @google-cloud/aiplatform, then implement predict() against a
     trained AutoML Forecasting / TimesFM endpoint. */
export async function vertexForecast(_centre: unknown, _history: number[]) {
  throw new Error("Vertex AI not configured — see src/lib/vertex.ts for setup steps.");
}
