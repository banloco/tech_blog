"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface ArticleLikeButtonProps {
  postId: string;
  initialLikes: number;
}

export default function ArticleLikeButton({ postId, initialLikes }: ArticleLikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const liked = localStorage.getItem(`post_liked_${postId}`) === "true";
    setHasLiked(liked);
  }, [postId]);

  const handleLike = async () => {
    if (hasLiked || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        setLikes(likes + 1);
        setHasLiked(true);
        localStorage.setItem(`post_liked_${postId}`, "true");
      }
    } catch (error) {
      console.error("Erreur lors du like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={hasLiked || isLoading}
      className="flex items-center gap-2 px-4 py-2 transition-colors"
      style={{
        background: hasLiked ? "rgba(0,229,255,0.06)" : "#1a1a1a",
        color: hasLiked ? "#00E5FF" : "#888",
        border: `1px solid ${hasLiked ? "rgba(0,229,255,0.3)" : "#333"}`,
        cursor: hasLiked ? "not-allowed" : "pointer",
      }}
      title={hasLiked ? "Vous avez déjà aimé cet article" : "Aimer cet article"}
    >
      <Heart
        className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`}
      />
      <span className="font-medium">{likes}</span>
    </button>
  );
}
