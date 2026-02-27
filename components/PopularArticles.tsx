"use client";

import Link from "next/link";
import { Eye, Clock } from "lucide-react";
import { estimateReadTime, getTagCategory } from "@/lib/utils";
import type { Post } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

export default function PopularArticles({ posts }: { posts: Post[] }) {
  const { t } = useLanguage();

  const popularPosts = [...posts]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 4);

  if (popularPosts.length === 0) return null;

  return (
    <div className="p-4" style={{ background: "#1a1a1a", border: "1px solid #333" }}>
      {/* Header */}
      <h3
        className="text-[10px] font-semibold uppercase tracking-widest mb-4 pb-3"
        style={{
          color: "#888",
          letterSpacing: "0.14em",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        {t("mostRead")}
      </h3>

      <div className="space-y-4">
        {popularPosts.map((post, index) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug || post.id}`}
            className="group flex gap-3 items-start transition-opacity hover:opacity-80"
          >
            {/* Index number */}
            <span
              className="flex-shrink-0 text-lg font-bold leading-none mt-0.5"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: index === 0 ? "#C19A6B" : "#333",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="flex-1 min-w-0 space-y-1">
              {/* Category chip */}
              {post.category ? (
                <span
                  className="inline-block text-[8px] font-bold font-mono px-1 py-0.5 border tracking-widest"
                  style={{ color: post.category.color, borderColor: post.category.border, background: post.category.bg }}
                >
                  {post.category.name}
                </span>
              ) : post.tags && post.tags.length > 0 && (() => {
                const cat = getTagCategory(post.tags[0]);
                return (
                  <span
                    className="inline-block text-[8px] font-bold font-mono px-1 py-0.5 border tracking-widest"
                    style={{ color: cat.color, borderColor: cat.border, background: cat.bg }}
                  >
                    {cat.label}
                  </span>
                );
              })()}
              <h4
                className="text-xs font-medium line-clamp-2 leading-snug transition-colors group-hover:text-white"
                style={{ color: "#aaa" }}
              >
                {post.title}
              </h4>
              <div className="flex items-center gap-3 text-[9px]" style={{ color: "#555" }}>
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {estimateReadTime(post.content || "")}
                </span>
                {post.views_count !== undefined && post.views_count > 0 && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" />
                    {post.views_count.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div
        className="mt-5 pt-4 p-3"
        style={{
          borderTop: "1px solid #2a2a2a",
          background: "rgba(193,154,107,0.05)",
          border: "1px solid rgba(193,154,107,0.2)",
        }}
      >
        <h4 className="text-xs font-semibold mb-1" style={{ color: "#e8e8e8" }}>
          {t("joinReaders")}
        </h4>
        <p className="text-[10px] mb-2" style={{ color: "#666" }}>
          {t("receiveAnalyses")}
        </p>
        <a
          href="#newsletter"
          className="text-[10px] font-medium uppercase tracking-widest transition-opacity hover:opacity-70"
          style={{ color: "#C19A6B", letterSpacing: "0.1em" }}
        >
          {t("subscribeToNewsletter")} →
        </a>
      </div>
    </div>
  );
}
