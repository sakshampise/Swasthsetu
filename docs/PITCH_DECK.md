# Pitch Deck — SwasthSetu AI (12 slides)

1. **Title** — SwasthSetu AI: the AI command centre for PHCs & CHCs. Team, Track 3, Google Cloud. *(Open on the animated landing hero.)*
2. **The problem** — stock-outs, unmanaged footfall, no bed visibility, unpredictable attendance, manual registers. Districts learn about crises after they happen.
3. **Cost of the status quo** — a mother sent away for want of ORS; 90% occupancy at CHC Baner discovered at midnight; expired stock written off.
4. **The insight** — every crisis is visible 3–7 days early in the data. It just needs to be watched, forecast and acted on — automatically.
5. **The product** — one live command view: medicines, footfall, beds, doctors, labs. 3 roles, 3 languages (EN/HI/MR), any device.
6. **AI #1 · Early warning** — "Paracetamol runs out in 3 days at PHC Wakad." Consumption-aware depletion model + thresholds + expiry.
7. **AI #2 · Demand forecast** — 14-day history → 7-day OPD surge forecast per centre (Vertex AI-ready endpoint).
8. **AI #3 · Smart redistribution** — surplus↔deficit matching: "Transfer 320u ORS, Aundh → Wakad." One-tap approve updates both inventories.
9. **AI #4 · District radar** — composite risk score auto-flags underperforming centres (stock 35% · beds 25% · attendance 25% · labs 15%).
10. **Architecture** — Next.js + Supabase/Firestore · Cloud Functions alerts · Vertex AI · Translate API · Looker-style analytics. Mock→live via one env flag.
11. **Live demo** — the 60-second money path (see demo script).
12. **Impact & roadmap** — pilot: 10 centres, Pune. Next: e-Aushadhi/HMIS sync, WhatsApp alerts, ASHA mobile view. *Ask: pilot district + GCP credits.*
