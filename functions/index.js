/* Firebase Cloud Functions — scheduled stock-out sentinel.
   Deploy: firebase deploy --only functions
   Every hour, pulls /api/alerts from the deployed app and fans critical
   alerts out to FCM topics per centre (push to PHC manager phones). */
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
admin.initializeApp();

const APP_URL = process.env.APP_URL || "https://your-app.vercel.app";

exports.stockSentinel = onSchedule("every 60 minutes", async () => {
  const res = await fetch(`${APP_URL}/api/alerts?lang=en`);
  const { alerts } = await res.json();
  const critical = alerts.filter((a) => a.sev === "critical");
  await Promise.all(critical.map((a) =>
    admin.messaging().send({
      topic: `centre-${a.centre || "district"}`,
      notification: { title: "SwasthSetu · Critical", body: a.txt },
    }).catch(() => null)
  ));
  console.log(`stockSentinel: ${critical.length} critical alerts pushed`);
});
