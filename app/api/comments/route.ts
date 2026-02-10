import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { post_id, parent_id, author_name, author_email, content } = await request.json();

    // Validation des champs requis
    if (!post_id || !author_name || !author_email || !content) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    // Validation du nom
    if (author_name.trim().length < 2) {
      return NextResponse.json(
        { error: "Le nom doit contenir au moins 2 caractères." },
        { status: 400 }
      );
    }

    // Validation de l'email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author_email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    // Validation du contenu
    if (content.trim().length < 3) {
      return NextResponse.json(
        { error: "Le commentaire doit contenir au moins 3 caractères." },
        { status: 400 }
      );
    }

    if (content.trim().length > 2000) {
      return NextResponse.json(
        { error: "Le commentaire est trop long (maximum 2000 caractères)." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Vérifier que le post existe
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, slug")
      .eq("id", post_id)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: "Article introuvable." },
        { status: 404 }
      );
    }

    // Si c'est une réponse, vérifier que le commentaire parent existe
    if (parent_id) {
      const { data: parentComment, error: parentError } = await supabase
        .from("comments")
        .select("id")
        .eq("id", parent_id)
        .single();

      if (parentError || !parentComment) {
        return NextResponse.json(
          { error: "Commentaire parent introuvable." },
          { status: 404 }
        );
      }
    }

    // Insérer le commentaire (colonnes de base uniquement)
    const { data, error } = await supabase.from("comments").insert({
      post_id,
      parent_id: parent_id || null,
      author_name: author_name.trim(),
      author_email: author_email.toLowerCase().trim(),
      content: content.trim(),
      is_approved: false,
      // Note: likes_count et is_reported seront ajoutés après la migration
    }).select().single();

    if (error) {
      console.error("Comment insert error:", error);
      return NextResponse.json(
        { error: `Erreur lors de l'envoi du commentaire: ${error.message}` },
        { status: 500 }
      );
    }

    // Revalidate pages
    revalidatePath("/admin/commentaires");
    if (post.slug) {
      revalidatePath(`/posts/${post.slug}`);
    } else {
      revalidatePath(`/posts/${post_id}`);
    }

    return NextResponse.json({
      message: parent_id
        ? "Réponse envoyée ! Elle sera visible après modération."
        : "Commentaire envoyé ! Il sera visible après modération.",
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

