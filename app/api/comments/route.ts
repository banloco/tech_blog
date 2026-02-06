import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { post_id, author_name, author_email, content } = await request.json();

    if (!post_id || !author_name || !author_email || !content) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author_email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from("comments").insert({
      post_id,
      author_name: author_name.trim(),
      author_email: author_email.toLowerCase().trim(),
      content: content.trim(),
      is_approved: false,
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json(
        { error: "Erreur lors de l'envoi du commentaire." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Commentaire envoyé ! Il sera visible après modération.",
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
