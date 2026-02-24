const MAILJET_API_KEY = process.env.MAILJET_API_KEY || "";
const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY || "";
const MAIL_FROM = process.env.MAIL_FROM || "yohann@kipdev.io";

interface MailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, toName, subject, html }: MailOptions): Promise<boolean> {
  if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY) {
    console.warn("Mailjet non configuré, email non envoyé");
    return false;
  }

  try {
    const res = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`).toString("base64"),
      },
      body: JSON.stringify({
        Messages: [
          {
            From: { Email: MAIL_FROM, Name: "Fiche HACCP" },
            To: [{ Email: to, Name: toName || to }],
            Subject: subject,
            HTMLPart: html,
          },
        ],
      }),
    });
    return res.ok;
  } catch (err) {
    console.error("Erreur envoi email:", err);
    return false;
  }
}

export function welcomeEmailHtml(name: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <h1 style="color:#065f46">Bienvenue sur Fiche HACCP !</h1>
      <p>Bonjour ${name},</p>
      <p>Votre compte a été créé avec succès. Vous pouvez dès maintenant :</p>
      <ul>
        <li>Télécharger gratuitement toutes nos fiches HACCP en PDF</li>
        <li>Découvrir notre espace de gestion HACCP</li>
      </ul>
      <p>Pour profiter de toutes les fonctionnalités (gestion des employés, suivi des tâches, traçabilité),
      découvrez notre abonnement à seulement <strong>20€/mois</strong>.</p>
      <a href="https://fiche-haccp.fr/tableau-de-bord"
         style="display:inline-block;background:#065f46;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;margin-top:10px">
        Accéder à mon espace
      </a>
      <p style="color:#6b7280;font-size:13px;margin-top:30px">
        — L'équipe Fiche HACCP<br>
        <a href="https://fiche-haccp.fr" style="color:#065f46">fiche-haccp.fr</a>
      </p>
    </div>
  `;
}
