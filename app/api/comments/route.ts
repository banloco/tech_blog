import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

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

    const { data, error } = await supabase.from("comments").insert({
      post_id,
      author_name: author_name.trim(),
      author_email: author_email.toLowerCase().trim(),
      content: content.trim(),
      is_approved: false,
    }).select().single();

    if (error) {
      console.error("Comment insert error:", error);
      return NextResponse.json(
        { error: `Erreur lors de l'envoi du commentaire: ${error.message}` },
        { status: 500 }
      );
    }

    // Revalidate admin comments page so new comment appears immediately
    revalidatePath("/admin/commentaires");

    return NextResponse.json({
      message: "Commentaire envoyé ! Il sera visible après modération.",
      comment: data,
    });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: `Erreur serveur: ${err.message}` },
      { status: 500 }
    );
  }
}
}
