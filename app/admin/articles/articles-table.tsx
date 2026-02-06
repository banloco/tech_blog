"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";
import { useState } from "react";

export default function ArticlesTable({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    setDeleting(id);
    await supabase.from("posts").delete().eq("id", id);
    router.refresh();
    setDeleting(null);
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    await supabase
      .from("posts")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);
    router.refresh();
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
        <p className="text-zinc-400">Aucun article pour le moment.</p>
        <Link
          href="/admin/articles/new"
          className="inline-block mt-4 text-sm text-emerald-400 hover:text-emerald-300"
        >
          Créer votre premier article →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 text-left text-zinc-400">
            <th className="px-4 py-3 font-medium">Titre</th>
            <th className="px-4 py-3 font-medium hidden md:table-cell">Statut</th>
            <th className="px-4 py-3 font-medium hidden lg:table-cell">Tags</th>
            <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {posts.map((post) => (
            <tr
              key={post.id}
              className="hover:bg-zinc-800/30 transition-colors"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/admin/articles/${post.id}/edit`}
                  className="font-medium text-white hover:text-emerald-400 transition-colors line-clamp-1"
                >
                  {post.title}
                </Link>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    post.status === "published"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      post.status === "published"
                        ? "bg-emerald-400"
                        : "bg-amber-400"
                    }`}
                  />
                  {post.status === "published" ? "Publié" : "Brouillon"}
                </span>
              </td>
              <td className="px-4 py-3 hidden lg:table-cell">
                <div className="flex gap-1 flex-wrap">
                  {(post.tags || []).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell whitespace-nowrap">
                {formatDate(post.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => toggleStatus(post.id, post.status)}
                    className="p-2 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    title={
                      post.status === "published"
                        ? "Passer en brouillon"
                        : "Publier"
                    }
                  >
                    {post.status === "published" ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <Link
                    href={`/admin/articles/${post.id}/edit`}
                    className="p-2 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="p-2 rounded-md hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
