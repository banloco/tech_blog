const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.ai-and-capital.tech";
const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");

// One line of the "what you'll receive" list
function topicRow(color: string, title: string, desc: string, last = false): string {
  return `
                <tr>
                  <td style="padding:10px 0;${last ? "" : "border-bottom:1px solid #27272a;"}">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:14px;vertical-align:top;padding-top:2px;">
                          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-top:6px;"></span>
                        </td>
                        <td>
                          <p style="margin:0;font-size:14px;color:#f4f4f5;font-weight:600;">${title}</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#71717a;line-height:1.6;">${desc}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`;
}

const TOPICS: Array<[string, string, string]> = [
  ["#34d399", "Paiements & Mobile Money", "Encaisser en ligne avec MTN MoMo, Moov Money et les agrégateurs de paiement."],
  ["#C19A6B", "Entrepreneuriat & business", "Trouver des clients, fixer ses prix, se faire payer."],
  ["#60a5fa", "Dev & tutos", "Créer un site, une application ou une automatisation pas à pas."],
  ["#00E5FF", "IA pratique", "Gagner du temps avec l'IA, gratuitement, même sans ordinateur puissant."],
];

export function getWelcomeEmailHtml(email: string): string {
  const currentYear = new Date().getFullYear();
  const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenue sur IA & Capital 🚀</title>
</head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090b;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" style="max-width:600px;">

          <!-- Header / Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <a href="${SITE_URL}" style="text-decoration:none;">
                <span style="display:inline-block;background:linear-gradient(135deg,#10b981,#06b6d4);-webkit-background-clip:text;color:transparent;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
                  IA & Capital
                </span>
                <span style="display:block;color:#52525b;font-size:12px;margin-top:4px;letter-spacing:1px;text-transform:uppercase;">
                  Tech & business en Afrique
                </span>
              </a>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background-color:#18181b;border-radius:16px;border:1px solid #27272a;padding:40px 36px;">

              <p style="margin:0 0 8px;font-size:13px;color:#10b981;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                🚀 Bienvenue
              </p>
              <h1 style="margin:0 0 20px;font-size:24px;font-weight:700;color:#f4f4f5;line-height:1.3;">
                Merci pour votre inscription !
              </h1>

              <p style="margin:0 0 16px;font-size:15px;color:#a1a1aa;line-height:1.7;">
                Sur IA & Capital, je partage des guides concrets pour lancer et faire grandir
                une activité avec la tech, au Bénin et en Afrique de l'Ouest.
              </p>

              <p style="margin:0 0 24px;font-size:15px;color:#a1a1aa;line-height:1.7;">
                Pas de théorie déconnectée : des solutions <strong style="color:#f4f4f5;">gratuites ou abordables</strong>,
                que j'ai testées moi-même, adaptées à notre réalité (Mobile Money, connexion, budget).
              </p>

              <h2 style="margin:0 0 16px;font-size:17px;font-weight:700;color:#f4f4f5;">
                🧐 Ce que vous allez recevoir
              </h2>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                ${TOPICS.map(([color, title, desc], i) => topicRow(color, title, desc, i === TOPICS.length - 1)).join("")}
              </table>

              <div style="background:linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,182,212,0.08));border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:20px 24px;margin-bottom:32px;">
                <p style="margin:0;font-size:15px;color:#f4f4f5;line-height:1.7;">
                  <strong style="color:#10b981;">Un sujet qui vous intéresse ?</strong><br/>
                  Répondez simplement à cet e-mail pour me le dire : les meilleures idées
                  d'articles viennent des lecteurs. Votre réponse aide aussi votre boîte mail à
                  ne pas classer les prochains envois en spam.
                </p>
              </div>

              <p style="margin:0 0 4px;font-size:15px;color:#a1a1aa;">
                À bientôt,
              </p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#f4f4f5;">
                Christ, IA & Capital
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 8px;font-size:12px;color:#3f3f46;">
                <a href="${SITE_URL}" style="color:#10b981;text-decoration:none;">${SITE_HOST}</a>
                &nbsp;&bull;&nbsp;
                <a href="${SITE_URL}/privacy" style="color:#52525b;text-decoration:none;">Confidentialité</a>
                &nbsp;&bull;&nbsp;
                <a href="${unsubscribeUrl}" style="color:#52525b;text-decoration:none;">Se désinscrire</a>
              </p>
              <p style="margin:0;font-size:11px;color:#3f3f46;">
                © ${currentYear} IA & Capital – Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function getWelcomeEmailText(email: string): string {
  return `Bienvenue sur IA & Capital 🚀

Merci pour votre inscription !

Sur IA & Capital, je partage des guides concrets pour lancer et faire grandir une activité avec la tech, au Bénin et en Afrique de l'Ouest. Des solutions gratuites ou abordables, que j'ai testées moi-même.

CE QUE VOUS ALLEZ RECEVOIR :

${TOPICS.map(([, title, desc]) => `• ${title} : ${desc}`).join("\n")}

Un sujet qui vous intéresse ? Répondez simplement à cet e-mail pour me le dire.

À bientôt,
Christ, IA & Capital
${SITE_URL}

---
Se désinscrire : ${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}
`;
}
