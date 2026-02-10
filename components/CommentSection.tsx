"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import type { Comment } from "@/lib/types";

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Organiser les commentaires avec leurs réponses
  const organizeComments = (allComments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // Première passe: créer la map
    allComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Deuxième passe: organiser la hiérarchie
    allComments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const commentsWithReplies = organizeComments(comments);
  const totalCount = comments.length;

  const handleNewComment = async () => {
    // Rafraîchir les commentaires après ajout
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement:", error);
    } finally {
      setIsLoading(false);
      setReplyingTo(null);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  return (
    <section className="space-y-8" id="commentaires">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-emerald-400" aria-hidden="true" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Commentaires
          {totalCount > 0 && (
            <span className="ml-2 text-lg text-zinc-400">({totalCount})</span>
          )}
        </h2>
      </div>

      {/* Liste des commentaires */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" aria-hidden="true" />
          <span className="sr-only">Chargement des commentaires...</span>
        </div>
      ) : commentsWithReplies.length > 0 ? (
        <div className="space-y-4">
          {commentsWithReplies.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              replyingTo={replyingTo}
              onCancelReply={handleCancelReply}
              postId={postId}
              onCommentAdded={handleNewComment}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-xl border border-zinc-800 bg-zinc-900/30">
          <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto mb-3" aria-hidden="true" />
          <p className="text-zinc-400 text-sm">
            Aucun commentaire pour le moment. Soyez le premier à partager votre avis !
          </p>
        </div>
      )}

      {/* Formulaire de nouveau commentaire */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          Laisser un commentaire
        </h3>
        <CommentForm
          postId={postId}
          onSuccess={handleNewComment}
        />
      </div>
    </section>
  );
}
