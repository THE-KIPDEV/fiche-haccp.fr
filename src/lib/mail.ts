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

function emailWrapper(content: string): string {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:32px 20px">
      <div style="border-bottom:3px solid #065f46;padding-bottom:16px;margin-bottom:24px">
        <strong style="color:#065f46;font-size:18px">Fiche HACCP</strong>
      </div>
      ${content}
      <div style="border-top:1px solid #e5e7eb;margin-top:32px;padding-top:16px">
        <p style="color:#9ca3af;font-size:12px;margin:0">
          <a href="https://fiche-haccp.fr" style="color:#065f46;text-decoration:none">fiche-haccp.fr</a>
        </p>
      </div>
    </div>
  `;
}

export function welcomeEmailHtml(name: string): string {
  return emailWrapper(`
    <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Bienvenue, ${name}</h2>
    <p style="color:#374151;line-height:1.6;margin:0 0 16px">
      Votre compte a été créé. Vous pouvez dès maintenant télécharger
      gratuitement toutes les fiches HACCP en PDF depuis votre espace.
    </p>
    <a href="https://fiche-haccp.fr/tableau-de-bord"
       style="display:inline-block;background:#065f46;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">
      Accéder à mon espace
    </a>
    <p style="color:#6b7280;font-size:13px;margin-top:24px;line-height:1.5">
      Pour la gestion complète (employés, tâches, traçabilité), découvrez
      l'abonnement Pro à 20€/mois depuis votre tableau de bord.
    </p>
  `);
}

export function subscriptionConfirmEmailHtml(name: string): string {
  return emailWrapper(`
    <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Abonnement Pro activé</h2>
    <p style="color:#374151;line-height:1.6;margin:0 0 16px">
      Bonjour ${name}, votre abonnement Pro est maintenant actif.
      Vous avez accès à toutes les fonctionnalités :
    </p>
    <ul style="color:#374151;line-height:1.8;padding-left:20px;margin:0 0 16px">
      <li>Gestion des employés</li>
      <li>Création et suivi des tâches HACCP</li>
      <li>Traçabilité complète</li>
      <li>Tableau de bord en temps réel</li>
    </ul>
    <a href="https://fiche-haccp.fr/tableau-de-bord"
       style="display:inline-block;background:#065f46;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px">
      Accéder à mon espace
    </a>
  `);
}

export function subscriptionCancelEmailHtml(name: string): string {
  return emailWrapper(`
    <h2 style="color:#111827;font-size:20px;margin:0 0 12px">Abonnement annulé</h2>
    <p style="color:#374151;line-height:1.6;margin:0 0 16px">
      Bonjour ${name}, votre abonnement Pro a été annulé.
      Vous conservez l'accès aux fiches HACCP gratuites en PDF.
    </p>
    <p style="color:#6b7280;font-size:13px;line-height:1.5">
      Vous pouvez réactiver votre abonnement à tout moment depuis votre espace.
    </p>
    <a href="https://fiche-haccp.fr/tableau-de-bord/abonnement"
       style="display:inline-block;background:#065f46;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;margin-top:12px">
      Gérer mon abonnement
    </a>
  `);
}
