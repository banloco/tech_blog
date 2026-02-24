import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import {
  getWelcomeEmailHtml,
  getWelcomeEmailText,
} from "@/lib/emails/welcome-template";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Check duplicate
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Vous êtes déjà inscrit à la newsletter." },
        { status: 409 }
      );
    }

    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: email.toLowerCase(),
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json(
        { error: "Erreur lors de l'inscription." },
        { status: 500 }
      );
    }

    // Send welcome email (non-blocking — a failure doesn't cancel the subscription)
    try {
      await sendEmail({
        to: email.toLowerCase(),
        subject: "Bienvenue chez IA & Capital 🚀 (Votre boussole Tech Finance)",
        html: getWelcomeEmailHtml(email.toLowerCase()),
        text: getWelcomeEmailText(email.toLowerCase()),
      });
    } catch (emailError) {
      console.error("[Newsletter] Welcome email failed:", emailError);
      // Subscription is saved — we just log the email error
    }

    return NextResponse.json({
      message: "Inscription réussie ! Vérifiez votre boîte mail pour votre email de bienvenue.",
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
