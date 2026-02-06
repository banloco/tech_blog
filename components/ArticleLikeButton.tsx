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
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        hasLiked
          ? "bg-emerald-500/20 text-emerald-500 cursor-not-allowed"
          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
      }`}
      title={hasLiked ? "Vous avez déjà aimé cet article" : "Aimer cet article"}
    >
      <Heart
        className={`w-5 h-5 ${hasLiked ? "fill-emerald-500" : ""}`}
      />
      <span className="font-medium">{likes}</span>
    </button>
  );
}
