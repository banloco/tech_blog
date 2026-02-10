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
      className={`group rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/70 transition-all duration-300 ${
        isAnimating ? "animate-in fade-in slide-in-from-left-4 duration-300" : ""
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* En-tête du commentaire */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-sm font-bold shadow-lg ring-2 ring-zinc-800 group-hover:ring-emerald-500/30 transition-all`}
          >
            {comment.author_name.charAt(0).toUpperCase()}
          </div>

          {/* Info auteur et date */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-semibold text-white truncate">
                {comment.author_name}
              </span>
              <span className="text-xs text-zinc-500 flex-shrink-0">
                {formatDate(comment.created_at)}
              </span>
            </div>

            {/* Contenu du commentaire */}
            <p className="text-sm text-zinc-300 leading-relaxed break-words whitespace-pre-wrap">
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
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              hasLiked
                ? "text-emerald-400 bg-emerald-500/10 cursor-not-allowed"
                : "text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/5"
            }`}
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
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isReplyFormVisible
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
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
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isReported
                ? "text-red-400 bg-red-500/10 cursor-not-allowed"
                : "text-zinc-400 hover:text-red-400 hover:bg-red-500/5"
            }`}
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all ml-auto"
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
        <div className="border-t border-zinc-800 p-4 sm:p-5 bg-zinc-900/50 animate-in fade-in slide-in-from-top-2 duration-200">
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
        <div className="border-t border-zinc-800 bg-zinc-900/30">
          <div className="ml-4 sm:ml-6 space-y-3 py-3 pr-3 border-l-2 border-emerald-500/20">
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
