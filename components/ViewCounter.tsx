"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function ViewCounter({ postId }: { postId: string }) {
  useEffect(() => {
    // Wait until hydration is complete and we are client-side
    const incrementView = async () => {
      // Use sessionStorage to prevent duplicate view counts in same session?
      // Or just fire. For now, we just fire to ensure "real" stats.
      const key = `viewed_${postId}`;
      if (sessionStorage.getItem(key)) return;

      try {
        await fetch(`/api/posts/${postId}/view`, { method: "POST" });
        sessionStorage.setItem(key, "true");
      } catch (err) {
        console.error("Failed to increment view count", err);
      }
    };

    const timeout = setTimeout(incrementView, 2000); // 2s delay to count as "view"
    return () => clearTimeout(timeout);
  }, [postId]);

  return null;
}
