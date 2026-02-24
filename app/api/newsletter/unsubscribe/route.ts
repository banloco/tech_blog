import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new NextResponse(
      buildPage("Désinscription invalide", "L'adresse email fournie est invalide.", false),
      { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 400 }
    );
  }

  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("email", email.toLowerCase());

    if (error) {
      return new NextResponse(
        buildPage("Erreur", "Une erreur s'est produite lors de la désinscription. Réessayez plus tard.", false),
        { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 500 }
      );
    }

    return new NextResponse(
      buildPage(
        "Désinscription confirmée",
        `L'adresse <strong>${email}</strong> a bien été retirée de notre liste. Vous ne recevrez plus d'emails d'IA & Capital.`,
        true
      ),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch {
    return new NextResponse(
      buildPage("Erreur serveur", "Une erreur inattendue s'est produite.", false),
      { headers: { "Content-Type": "text/html; charset=utf-8" }, status: 500 }
    );
  }
}

function buildPage(title: string, body: string, success: boolean): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "/";
  const color = success ? "#10b981" : "#ef4444";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} – IA & Capital</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="max-width:480px;margin:auto;padding:40px 24px;text-align:center;">
    <span style="font-size:48px;">${success ? "✅" : "❌"}</span>
    <h1 style="color:${color};font-size:22px;margin:16px 0 8px;">${title}</h1>
    <p style="color:#a1a1aa;font-size:15px;line-height:1.6;">${body}</p>
    <a href="${siteUrl}" style="display:inline-block;margin-top:24px;padding:10px 24px;background:#10b981;color:#fff;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
      Retour sur IA & Capital
    </a>
  </div>
</body>
</html>`;
}
