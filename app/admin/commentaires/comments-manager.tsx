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
    await supabase
      .from("comments")
      .update({ is_approved: true })
      .eq("id", id);
    router.refresh();
  }

  async function handleReject(id: string) {
    await supabase
      .from("comments")
      .update({ is_approved: false })
      .eq("id", id);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce commentaire ?")) return;
    await supabase.from("comments").delete().eq("id", id);
    router.refresh();
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
        <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
        <p className="text-zinc-400">Aucun commentaire pour le moment.</p>
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
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              filter === key
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {label}{" "}
            <span className="text-zinc-500 ml-1">({count})</span>
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {filteredComments.map((comment) => (
          <div
            key={comment.id}
            className={`rounded-xl border p-4 transition-all ${
              comment.is_approved
                ? "border-zinc-800 bg-zinc-900/50"
                : "border-amber-500/20 bg-amber-500/5"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white text-sm">
                    {comment.author_name}
                  </span>
                  <span className="text-zinc-500 text-xs">
                    {comment.author_email}
                  </span>
                  <span className="text-zinc-600 text-xs">
                    · {formatDate(comment.created_at)}
                  </span>
                </div>
                {comment.post && (
                  <p className="text-xs text-zinc-500 mb-2">
                    Sur:{" "}
                    <span className="text-emerald-400">
                      {comment.post.title}
                    </span>
                  </p>
                )}
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {comment.content}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {!comment.is_approved && (
                  <button
                    onClick={() => handleApprove(comment.id)}
                    className="p-2 rounded-md hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-400 transition-colors"
                    title="Approuver"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                {comment.is_approved && (
                  <button
                    onClick={() => handleReject(comment.id)}
                    className="p-2 rounded-md hover:bg-amber-500/10 text-zinc-400 hover:text-amber-400 transition-colors"
                    title="Désapprouver"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="p-2 rounded-md hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
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
