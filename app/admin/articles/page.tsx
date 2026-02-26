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
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#e8e8e8" }}
          >
            Articles
          </h1>
          <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "#555" }}>
            Gérer vos publications
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-[#d4b080]"
          style={{ background: "#C19A6B", color: "#121212" }}
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </Link>
      </div>

      <ArticlesTable posts={(posts as Post[]) || []} />
    </div>
  );
}
