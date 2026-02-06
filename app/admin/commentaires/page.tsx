import { createSupabaseServerClient } from "@/lib/supabase-server";
import CommentsManager from "./comments-manager";
import type { Comment } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Commentaires | Admin IA & Capital",
  robots: { index: false, follow: false },
};

export default async function AdminCommentsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: comments } = await supabase
    .from("comments")
    .select("*, post:posts(title, slug)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Commentaires</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Modérer les commentaires des lecteurs
        </p>
      </div>

      <CommentsManager comments={(comments as Comment[]) || []} />
    </div>
  );
}
