export function getWelcomeEmailHtml(email: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ia-capital.fr";
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenue chez IA & Capital 🚀</title>
</head>
<body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090b;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" style="max-width:600px;">

          <!-- Header / Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <a href="${siteUrl}" style="text-decoration:none;">
                <span style="display:inline-block;background:linear-gradient(135deg,#10b981,#06b6d4);-webkit-background-clip:text;color:transparent;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
                  IA & Capital
                </span>
                <span style="display:block;color:#52525b;font-size:12px;margin-top:4px;letter-spacing:1px;text-transform:uppercase;">
                  Tech Finance · Intelligence
                </span>
              </a>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background-color:#18181b;border-radius:16px;border:1px solid #27272a;padding:40px 36px;">

              <!-- Greeting -->
              <p style="margin:0 0 8px;font-size:13px;color:#10b981;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                🚀 Bienvenue à bord
              </p>
              <h1 style="margin:0 0 20px;font-size:24px;font-weight:700;color:#f4f4f5;line-height:1.3;">
                C'est un plaisir de vous compter parmi nous.
              </h1>

              <p style="margin:0 0 16px;font-size:15px;color:#a1a1aa;line-height:1.7;">
                Vous venez de rejoindre une communauté de lecteurs qui ont compris une chose essentielle :
                en 2026, la finance ne se lit plus seulement dans les bilans comptables,
                mais dans <strong style="color:#f4f4f5;">les lignes de code</strong>.
              </p>

              <p style="margin:0 0 24px;font-size:15px;color:#a1a1aa;line-height:1.7;">
                Le monde de l'investissement change à une vitesse vertigineuse. Entre l'IA qui pilote désormais
                les flux de capitaux et la blockchain qui rend les données transparentes, il est facile de se sentir dépassé.
              </p>

              <!-- Promise box -->
              <div style="background:linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,182,212,0.08));border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:20px 24px;margin-bottom:32px;">
                <p style="margin:0;font-size:15px;color:#f4f4f5;line-height:1.7;">
                  <strong style="color:#10b981;">Notre promesse chez IA & Capital ?</strong><br/>
                  Transformer ce déluge de données en analyses claires et
                  <strong style="color:#f4f4f5;">actionnables pour votre portefeuille</strong>.
                </p>
              </div>

              <!-- Weekly content -->
              <h2 style="margin:0 0 16px;font-size:17px;font-weight:700;color:#f4f4f5;">
                🧐 Ce que vous allez recevoir chaque semaine
              </h2>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:14px;vertical-align:top;padding-top:2px;">
                          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;margin-top:6px;"></span>
                        </td>
                        <td>
                          <p style="margin:0;font-size:14px;color:#f4f4f5;font-weight:600;">L'Analyse On-Chain</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#71717a;line-height:1.6;">
                            Ce que font réellement les "baleines" sur le marché.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:14px;vertical-align:top;padding-top:2px;">
                          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#3b82f6;margin-top:6px;"></span>
                        </td>
                        <td>
                          <p style="margin:0;font-size:14px;color:#f4f4f5;font-weight:600;">Le Radar Tech</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#71717a;line-height:1.6;">
                            Quelles entreprises (NVIDIA, Mistral, etc.) façonnent l'infrastructure financière de demain.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:14px;vertical-align:top;padding-top:2px;">
                          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#a855f7;margin-top:6px;"></span>
                        </td>
                        <td>
                          <p style="margin:0;font-size:14px;color:#f4f4f5;font-weight:600;">Stratégies IA</p>
                          <p style="margin:4px 0 0;font-size:13px;color:#71717a;line-height:1.6;">
                            Comment utiliser les nouveaux outils (ETFs IA, algorithmes) pour optimiser vos rendements.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Featured articles -->
              <div style="background-color:#09090b;border-radius:12px;border:1px solid #27272a;padding:20px 24px;margin-bottom:32px;">
                <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#f4f4f5;">
                  🎁 Pour commencer — Nos analyses les plus lues
                </h2>
                <p style="margin:0 0 14px;font-size:13px;color:#71717a;line-height:1.6;">
                  Si vous les avez manquées, commencez par ces dossiers de fond :
                </p>
                <p style="margin:0 0 8px;">
                  <a href="${siteUrl}/posts" style="color:#10b981;text-decoration:none;font-size:14px;font-weight:500;">
                    → Comment l'IA débusque la "Smart Money"
                  </a>
                </p>
                <p style="margin:0;">
                  <a href="${siteUrl}/posts" style="color:#10b981;text-decoration:none;font-size:14px;font-weight:500;">
                    → La fin de la gestion passive traditionnelle ?
                  </a>
                </p>
              </div>

              <!-- Reply request -->
              <div style="background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.2);border-radius:12px;padding:18px 22px;margin-bottom:32px;">
                <p style="margin:0;font-size:14px;color:#a1a1aa;line-height:1.7;">
                  <strong style="color:#f4f4f5;">Une petite faveur...</strong><br/>
                  Pour ne manquer aucune de nos analyses stratégiques, répondez à cet e-mail par un simple
                  <strong style="color:#3b82f6;">"Salut"</strong> ou
                  <strong style="color:#3b82f6;">"Bien reçu"</strong>.
                  Cela indique à votre boîte mail que nous sommes des amis et évite que nos futures pépites ne finissent dans les spams.
                </p>
              </div>

              <!-- Sign off -->
              <p style="margin:0 0 4px;font-size:15px;color:#a1a1aa;">
                À votre succès financier,
              </p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#f4f4f5;">
                L'équipe IA & Capital
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0 0 8px;font-size:12px;color:#3f3f46;">
                <a href="${siteUrl}" style="color:#10b981;text-decoration:none;">ia-capital.fr</a>
                &nbsp;&bull;&nbsp;
                <a href="${siteUrl}/privacy" style="color:#52525b;text-decoration:none;">Confidentialité</a>
                &nbsp;&bull;&nbsp;
                <a href="${siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}" style="color:#52525b;text-decoration:none;">Se désinscrire</a>
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ia-capital.fr";

  return `Bienvenue chez IA & Capital 🚀

C'est un plaisir de vous compter parmi nous.

Vous venez de rejoindre une communauté de lecteurs qui ont compris une chose essentielle : en 2026, la finance ne se lit plus seulement dans les bilans comptables, mais dans les lignes de code.

Notre promesse chez IA & Capital ?
Transformer ce déluge de données en analyses claires et actionnables pour votre portefeuille.

CE QUE VOUS ALLEZ RECEVOIR CHAQUE SEMAINE :

• L'Analyse On-Chain : Ce que font réellement les "baleines" sur le marché.
• Le Radar Tech : Quelles entreprises (NVIDIA, Mistral, etc.) façonnent l'infrastructure financière de demain.
• Stratégies IA : Comment utiliser les nouveaux outils (ETFs IA, algorithmes) pour optimiser vos rendements.

Pour commencer, retrouvez nos analyses les plus lues sur ${siteUrl}/posts

---
Une petite faveur : répondez à cet e-mail par un simple "Salut" pour éviter que nos analyses ne finissent dans vos spams.

À votre succès financier,
L'équipe IA & Capital
${siteUrl}

---
Se désinscrire : ${siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}
`;
}
