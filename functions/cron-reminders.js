module.exports = async function () {
  const APP_URL = process.env.APP_URL || "https://fiche-haccp.fr";
  const CRON_SECRET = process.env.CRON_SECRET;

  if (!CRON_SECRET) {
    console.error("CRON_SECRET not set");
    return { error: "CRON_SECRET not set" };
  }

  try {
    const res = await fetch(`${APP_URL}/api/cron/reminders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: CRON_SECRET }),
    });

    const data = await res.json();
    console.log(`Reminders sent: ${data.sent}, checked: ${data.checked}`);
    return data;
  } catch (err) {
    console.error("Cron reminder failed:", err.message);
    return { error: err.message };
  }
};
