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

  async function toggleStatus(post: Post) {
    const newStatus = post.status === "published" ? "draft" : "published";
    await supabase
      .from("posts")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        // Set published_at only the first time the post goes live
        ...(newStatus === "published" && !post.published_at
          ? { published_at: new Date().toISOString() }
          : {}),
      })
      .eq("id", post.id);
    router.refresh();
  }

  if (posts.length === 0) {
    return (
      <div
        className="text-center py-20 border border-dashed"
        style={{ background: "#1a1a1a", borderColor: "#333" }}
      >
        <p style={{ color: "#888" }}>Aucun article pour le moment.</p>
        <Link
          href="/admin/articles/new"
          className="inline-block mt-4 text-sm transition-colors"
          style={{ color: "#00E5FF" }}
        >
          Créer votre premier article →
        </Link>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto"
      style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr
            className="text-left"
            style={{ borderBottom: "1px solid #2a2a2a" }}
          >
            <th
              className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "#555" }}
            >
              Titre
            </th>
            <th
              className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest hidden md:table-cell"
              style={{ color: "#555" }}
            >
              Statut
            </th>
            <th
              className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest hidden lg:table-cell"
              style={{ color: "#555" }}
            >
              Tags
            </th>
            <th
              className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest hidden sm:table-cell"
              style={{ color: "#555" }}
            >
              Date
            </th>
            <th
              className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-right"
              style={{ color: "#555" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              className="transition-colors"
              style={{ borderBottom: "1px solid #222" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <td className="px-4 py-3">
                <Link
                  href={`/admin/articles/${post.id}/edit`}
                  className="font-medium transition-colors line-clamp-1"
                  style={{ color: "#e8e8e8" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00E5FF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#e8e8e8")}
                >
                  {post.title}
                </Link>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={
                    post.status === "published"
                      ? { color: "#00E5FF", background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.2)" }
                      : { color: "#C19A6B", background: "rgba(193,154,107,0.06)", border: "1px solid rgba(193,154,107,0.2)" }
                  }
                >
                  <span
                    className="w-1.5 h-1.5"
                    style={{
                      background: post.status === "published" ? "#00E5FF" : "#C19A6B",
                    }}
                  />
                  {post.status === "published" ? "Publié" : "Brouillon"}
                </span>
              </td>
              <td className="px-4 py-3 hidden lg:table-cell">
                <div className="flex gap-1 flex-wrap">
                  {(post.tags || []).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 uppercase tracking-wider"
                      style={{ background: "#222", color: "#888", border: "1px solid #333" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 hidden sm:table-cell whitespace-nowrap" style={{ color: "#555" }}>
                {post.published_at
                  ? formatDate(post.published_at)
                  : formatDate(post.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => toggleStatus(post)}
                    className="p-2 transition-colors"
                    style={{ color: "#555" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                    title={post.status === "published" ? "Passer en brouillon" : "Publier"}
                  >
                    {post.status === "published" ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <Link
                    href={`/admin/articles/${post.id}/edit`}
                    className="p-2 transition-colors"
                    style={{ color: "#555" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="p-2 transition-colors disabled:opacity-50"
                    style={{ color: "#555" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ff5555")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
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
