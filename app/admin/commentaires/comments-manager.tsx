"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Check, X, Trash2, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/lib/types";
import { useState } from "react";

export default function CommentsManager({
  comments,
}: {
  comments: Comment[];
}) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const filteredComments = comments.filter((c) => {
    if (filter === "pending") return !c.is_approved;
    if (filter === "approved") return c.is_approved;
    return true;
  });

  async function handleApprove(id: string) {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: true }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'approbation");
      }

      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'approbation du commentaire");
    }
  }

  async function handleReject(id: string) {
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: false }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors du rejet");
      }

      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du rejet du commentaire");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce commentaire ?")) return;
    
    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression du commentaire");
    }
  }

  if (comments.length === 0) {
    return (
      <div
        className="text-center py-20 border border-dashed"
        style={{ background: "var(--surface)", borderColor: "var(--line)" }}
      >
        <MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--line)" }} />
        <p style={{ color: "var(--text-muted)" }}>Aucun commentaire pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(
          [
            { key: "all", label: "Tous", count: comments.length },
            {
              key: "pending",
              label: "En attente",
              count: comments.filter((c) => !c.is_approved).length,
            },
            {
              key: "approved",
              label: "Approuvés",
              count: comments.filter((c) => c.is_approved).length,
            },
          ] as const
        ).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="text-xs px-3 py-1.5 uppercase tracking-wider font-medium transition-colors"
            style={{
              color: filter === key ? "var(--brand)" : "var(--text-muted)",
              borderBottom: filter === key ? "2px solid var(--brand)" : "2px solid transparent",
              background: "transparent",
            }}
          >
            {label}{" "}
            <span style={{ color: "var(--text-dim)" }}>({count})</span>
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {filteredComments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 transition-all"
            style={{
              border: comment.is_approved ? "1px solid var(--line-soft)" : "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
              background: comment.is_approved ? "var(--surface)" : "color-mix(in srgb, var(--accent) 3%, transparent)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm" style={{ color: "var(--ink)" }}>
                    {comment.author_name}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                    {comment.author_email}
                  </span>
                  <span className="text-xs" style={{ color: "var(--line-strong)" }}>
                    · {formatDate(comment.created_at)}
                  </span>
                </div>
                {comment.post && (
                  <p className="text-xs mb-2" style={{ color: "var(--text-dim)" }}>
                    Sur:{" "}
                    <span style={{ color: "var(--brand)" }}>{comment.post.title}</span>
                  </p>
                )}
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {comment.content}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!comment.is_approved && (
                  <button
                    onClick={() => handleApprove(comment.id)}
                    className="p-2 transition-colors"
                    style={{ color: "var(--text-dim)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
                    title="Approuver"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                {comment.is_approved && (
                  <button
                    onClick={() => handleReject(comment.id)}
                    className="p-2 transition-colors"
                    style={{ color: "var(--text-dim)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
                    title="Désapprouver"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="p-2 transition-colors"
                  style={{ color: "var(--text-dim)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
