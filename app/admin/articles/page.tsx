import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Plus } from "lucide-react";
import ArticlesTable from "./articles-table";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Articles | Admin Le Plan B",
  robots: { index: false, follow: false },
};

export default async function AdminArticlesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--ink)" }}
          >
            Articles
          </h1>
          <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "var(--text-dim)" }}>
            Gérer vos publications
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-[var(--accent-hover)]"
          style={{ background: "var(--accent)", color: "var(--bg)" }}
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </Link>
      </div>

      <ArticlesTable posts={(posts as Post[]) || []} />
    </div>
  );
}
