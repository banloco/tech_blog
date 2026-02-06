"use client";

import { useState } from "react";
import { Heart, Flag, MessageCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/lib/types";

interface CommentItemProps {
  comment: Comment;
  onReply?: (commentId: string) => void;
}

export default function CommentItem({ comment, onReply }: CommentItemProps) {
  const [likes, setLikes] = useState(comment.likes_count || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isReported, setIsReported] = useState(false);

  async function handleLike() {
    if (hasLiked) return;
    
    try {
      await fetch(`/api/comments/${comment.id}/like`, { method: "POST" });
      setLikes(likes + 1);
      setHasLiked(true);
      localStorage.setItem(`liked_comment_${comment.id}`, "true");
    } catch (err) {
      console.error("Failed to like comment", err);
    }
  }

  async function handleReport() {
    if (isReported) return;
    
    if (!confirm("Signaler ce commentaire comme inapproprié ?")) return;
    
    try {
      await fetch(`/api/comments/${comment.id}/report`, { method: "POST" });
      setIsReported(true);
      alert("Commentaire signalé. Merci pour votre vigilance.");
    } catch (err) {
      console.error("Failed to report comment", err);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
          {comment.author_name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-medium text-white truncate">
              {comment.author_name}
            </span>
            <span className="text-xs text-zinc-500 flex-shrink-0">
              {formatDate(comment.created_at)}
            </span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed break-words">
            {comment.content}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 pl-11 sm:pl-13">
        <button
          onClick={handleLike}
          disabled={hasLiked}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            hasLiked
              ? "text-emerald-400 cursor-not-allowed"
              : "text-zinc-500 hover:text-emerald-400"
          }`}
          title={hasLiked ? "Déjà liké" : "Aimer ce commentaire"}
        >
          <Heart className={`w-3.5 h-3.5 ${hasLiked ? "fill-current" : ""}`} />
          <span>{likes > 0 ? likes : ""}</span>
        </button>

        {onReply && (
          <button
            onClick={() => onReply(comment.id)}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Répondre</span>
          </button>
        )}

        <button
          onClick={handleReport}
          disabled={isReported}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            isReported
              ? "text-red-400 cursor-not-allowed"
              : "text-zinc-500 hover:text-red-400"
          }`}
          title={isReported ? "Déjà signalé" : "Signaler"}
        >
          <Flag className={`w-3.5 h-3.5 ${isReported ? "fill-current" : ""}`} />
          {isReported && <span className="hidden sm:inline">Signalé</span>}
        </button>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 sm:ml-11 mt-4 space-y-3 border-l-2 border-zinc-800 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
}
