import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Plus } from "lucide-react";
import ArticlesTable from "./articles-table";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Articles | Admin IA & Capital",
  robots: { index: false, follow: false },
};

export default async function AdminArticlesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Articles</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Gérer vos publications
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </Link>
      </div>

      <ArticlesTable posts={(posts as Post[]) || []} />
    </div>
  );
}
