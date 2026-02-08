import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { is_approved } = await request.json();

    const supabase = await createSupabaseServerClient();

    // Update comment approval status
    const { data: comment, error } = await supabase
      .from("comments")
      .update({ is_approved })
      .eq("id", id)
      .select("post_id")
      .single();

    if (error) {
      console.error("Comment update error:", error);
      return NextResponse.json(
        { error: `Erreur lors de la mise à jour: ${error.message}` },
        { status: 500 }
      );
    }

    // Revalidate the post page to show updated comments immediately
    if (comment?.post_id) {
      revalidatePath(`/posts/${comment.post_id}`);
      revalidatePath("/"); // Also revalidate homepage for comment count
    }

    return NextResponse.json({
      message: "Commentaire mis à jour avec succès",
      comment,
    });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: `Erreur serveur: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = await createSupabaseServerClient();

    // Get post_id before deleting
    const { data: comment } = await supabase
      .from("comments")
      .select("post_id")
      .eq("id", id)
      .single();

    // Delete the comment
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Comment delete error:", error);
      return NextResponse.json(
        { error: `Erreur lors de la suppression: ${error.message}` },
        { status: 500 }
      );
    }

    // Revalidate the post page
    if (comment?.post_id) {
      revalidatePath(`/posts/${comment.post_id}`);
      revalidatePath("/");
    }

    return NextResponse.json({
      message: "Commentaire supprimé avec succès",
    });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: `Erreur serveur: ${err.message}` },
      { status: 500 }
    );
  }
}
