"use client";

import { useState, useEffect } from "react";
import { Heart, Flag, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/lib/utils";
import CommentForm from "./CommentForm";
import type { Comment } from "@/lib/types";

interface CommentItemProps {
  comment: Comment;
  onReply?: (commentId: string) => void;
  replyingTo?: string | null;
  onCancelReply?: () => void;
  postId?: string;
  onCommentAdded?: () => void;
  level?: number;
}

export default function CommentItem({
  comment,
  onReply,
  replyingTo,
  onCancelReply,
  postId,
  onCommentAdded,
  level = 0,
}: CommentItemProps) {
  // Utiliser localStorage pour likes et reports en attendant la migration
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const isReplyFormVisible = replyingTo === comment.id;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxLevel = 3; // Limite de profondeur d'imbrication

  // Charger l'état depuis localStorage
  useEffect(() => {
    const liked = localStorage.getItem(`liked_comment_${comment.id}`);
    if (liked === "true") {
      setHasLiked(true);
    }
    const reported = localStorage.getItem(`reported_comment_${comment.id}`);
    if (reported === "true") {
      setIsReported(true);
    }
    const storedLikes = localStorage.getItem(`likes_comment_${comment.id}`);
    if (storedLikes) {
      setLikes(parseInt(storedLikes, 10));
    } else if (comment.likes_count !== undefined) {
      // Utiliser la valeur de la DB si disponible après migration
      setLikes(comment.likes_count);
    }
  }, [comment.id, comment.likes_count]);

  // Animation d'entrée
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, []);

  async function handleLike() {
    if (hasLiked) return;

    try {
      const response = await fetch(`/api/comments/${comment.id}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const newLikes = likes + 1;
        setLikes(newLikes);
        setHasLiked(true);
        localStorage.setItem(`liked_comment_${comment.id}`, "true");
        localStorage.setItem(`likes_comment_${comment.id}`, newLikes.toString());
      }
    } catch (error) {
      console.error("Erreur lors du like:", error);
    }
  }

  async function handleReport() {
    if (isReported) return;

    if (!confirm("Signaler ce commentaire comme inapproprié ?")) return;

    try {
      const response = await fetch(`/api/comments/${comment.id}/report`, {
        method: "POST",
      });

      if (response.ok) {
        setIsReported(true);
        localStorage.setItem(`reported_comment_${comment.id}`, "true");
        alert("Commentaire signalé. Merci pour votre vigilance.");
      }
    } catch (error) {
      console.error("Erreur lors du signalement:", error);
    }
  }

  // Couleur de l'avatar basée sur le niveau
  const avatarColors = [
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-violet-500 to-purple-500",
    "from-orange-500 to-amber-500",
  ];
  const avatarColor = avatarColors[level % avatarColors.length];

  return (
    <div
      style={{
        border: "1px solid #2a2a2a",
        background: "#1a1a1a",
      }}
      className={`group transition-all duration-300 ${
        isAnimating ? "animate-in fade-in slide-in-from-left-4 duration-300" : ""
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* En-tête du commentaire */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div
            className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-sm font-bold"
            style={{ background: "#2a2a2a", border: "1px solid #333", color: "#e8e8e8" }}
          >
            {comment.author_name.charAt(0).toUpperCase()}
          </div>

          {/* Info auteur et date */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-semibold truncate" style={{ color: "#e8e8e8" }}>
                {comment.author_name}
              </span>
              <span className="text-xs flex-shrink-0" style={{ color: "#555" }}>
                {formatDate(comment.created_at)}
              </span>
            </div>

            {/* Contenu du commentaire */}
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap" style={{ color: "#aaa" }}>
              {comment.content}
            </p>
          </div>
        </div>

        {/* Barre d'actions */}
        <div className="flex items-center gap-1 sm:gap-2 pl-12 sm:pl-13 flex-wrap">
          {/* Bouton Like */}
          <button
            onClick={handleLike}
            disabled={hasLiked}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-all"
            style={hasLiked ? { color: "#00E5FF", background: "rgba(0,229,255,0.06)", cursor: "not-allowed" } : { color: "#888" }}
            onMouseEnter={(e) => !hasLiked && (e.currentTarget.style.color = "#00E5FF")}
            onMouseLeave={(e) => !hasLiked && (e.currentTarget.style.color = "#888")}
            title={hasLiked ? "Vous avez aimé ce commentaire" : "Aimer ce commentaire"}
            aria-label={hasLiked ? "Commentaire aimé" : "Aimer ce commentaire"}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? "fill-current" : ""}`} aria-hidden="true" />
            {likes > 0 && <span>{likes}</span>}
          </button>

          {/* Bouton Répondre */}
          {onReply && level < maxLevel && (
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-all"
              style={isReplyFormVisible ? { color: "#00E5FF", background: "rgba(0,229,255,0.06)" } : { color: "#888" }}
              onMouseEnter={(e) => !isReplyFormVisible && (e.currentTarget.style.color = "#e8e8e8")}
              onMouseLeave={(e) => !isReplyFormVisible && (e.currentTarget.style.color = "#888")}
              aria-label="Répondre à ce commentaire"
            >
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Répondre</span>
            </button>
          )}

          {/* Bouton Signaler */}
          <button
            onClick={handleReport}
            disabled={isReported}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-all"
            style={isReported ? { color: "#ff5555", background: "rgba(255,85,85,0.08)", cursor: "not-allowed" } : { color: "#888" }}
            onMouseEnter={(e) => !isReported && (e.currentTarget.style.color = "#ff5555")}
            onMouseLeave={(e) => !isReported && (e.currentTarget.style.color = "#888")}
            title={isReported ? "Déjà signalé" : "Signaler ce commentaire"}
            aria-label={isReported ? "Commentaire signalé" : "Signaler ce commentaire"}
          >
            <Flag className={`w-3.5 h-3.5 ${isReported ? "fill-current" : ""}`} aria-hidden="true" />
            {isReported && <span className="hidden sm:inline">Signalé</span>}
          </button>

          {/* Bouton afficher/masquer les réponses */}
          {hasReplies && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-all ml-auto"
              style={{ color: "#888" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
              aria-label={showReplies ? "Masquer les réponses" : "Afficher les réponses"}
            >
              {showReplies ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Masquer {comment.replies!.length} réponse{comment.replies!.length > 1 ? "s" : ""}</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Voir {comment.replies!.length} réponse{comment.replies!.length > 1 ? "s" : ""}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Formulaire de réponse */}
      {isReplyFormVisible && postId && (
        <div
          className="p-4 sm:p-5 animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ borderTop: "1px solid #2a2a2a", background: "#161616" }}
        >
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onSuccess={onCommentAdded}
            onCancel={onCancelReply}
            placeholder={`Répondre à ${comment.author_name}...`}
            autoFocus
          />
        </div>
      )}

      {/* Réponses imbriquées */}
      {hasReplies && showReplies && (
        <div style={{ borderTop: "1px solid #2a2a2a", background: "#161616" }}>
          <div className="ml-4 sm:ml-6 space-y-3 py-3 pr-3" style={{ borderLeft: "2px solid rgba(0,229,255,0.15)" }}>
            {comment.replies!.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                replyingTo={replyingTo}
                onCancelReply={onCancelReply}
                postId={postId}
                onCommentAdded={onCommentAdded}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
