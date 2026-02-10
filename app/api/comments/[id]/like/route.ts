import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: "ID du commentaire requis" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Vérifier que le commentaire existe
    const { data: comment, error: fetchError } = await supabase
      .from("comments")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError || !comment) {
      return NextResponse.json(
        { error: "Commentaire introuvable" },
        { status: 404 }
      );
    }

    // Note: Les likes sont gérés côté client (localStorage)
    // Après la migration, utilisez: supabase.rpc("increment_comment_likes", { comment_id: id })
    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

