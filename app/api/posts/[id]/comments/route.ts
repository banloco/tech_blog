import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID du post requis" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Récupérer tous les commentaires approuvés pour cet article
    const { data: comments, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", id)
      .eq("is_approved", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Comments fetch error:", error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des commentaires" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      comments: comments || [],
      count: comments?.length || 0,
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
