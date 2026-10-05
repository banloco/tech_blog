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
        style={{ background: "var(--surface)", borderColor: "var(--line)" }}
      >
        <p style={{ color: "var(--text-muted)" }}>Aucun article pour le moment.</p>
        <Link
          href="/admin/articles/new"
          className="inline-block mt-4 text-sm transition-colors"
          style={{ color: "var(--brand)" }}
        >
          Créer votre premier article →
        </Link>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto"
      style={{ background: "var(--surface)", border: "1px solid var(--line-soft)" }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr
            className="text-left"
            style={{ borderBottom: "1px solid var(--line-soft)" }}
          >
            <th
              className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--text-dim)" }}
            >
              Titre
            </th>
            <th
              className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest hidden md:table-cell"
              style={{ color: "var(--text-dim)" }}
            >
              Statut
            </th>
            <th
              className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest hidden lg:table-cell"
              style={{ color: "var(--text-dim)" }}
            >
              Tags
            </th>
            <th
              className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest hidden sm:table-cell"
              style={{ color: "var(--text-dim)" }}
            >
              Date
            </th>
            <th
              className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-right"
              style={{ color: "var(--text-dim)" }}
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
              style={{ borderBottom: "1px solid var(--line-soft)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in srgb, var(--ink) 2%, transparent)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <td className="px-4 py-3">
                <Link
                  href={`/admin/articles/${post.id}/edit`}
                  className="font-medium transition-colors line-clamp-1"
                  style={{ color: "var(--ink)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
                >
                  {post.title}
                </Link>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={
                    post.status === "published"
                      ? { color: "var(--brand)", background: "color-mix(in srgb, var(--brand) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--brand) 20%, transparent)" }
                      : { color: "var(--accent)", background: "color-mix(in srgb, var(--accent) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }
                  }
                >
                  <span
                    className="w-1.5 h-1.5"
                    style={{
                      background: post.status === "published" ? "var(--brand)" : "var(--accent)",
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
                      style={{ background: "var(--line-soft)", color: "var(--text-muted)", border: "1px solid var(--line)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 hidden sm:table-cell whitespace-nowrap" style={{ color: "var(--text-dim)" }}>
                {post.published_at
                  ? formatDate(post.published_at)
                  : formatDate(post.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => toggleStatus(post)}
                    className="p-2 transition-colors"
                    style={{ color: "var(--text-dim)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
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
                    style={{ color: "var(--text-dim)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="p-2 transition-colors disabled:opacity-50"
                    style={{ color: "var(--text-dim)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
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
