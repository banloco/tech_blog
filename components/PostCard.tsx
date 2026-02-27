import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowUpRight } from "lucide-react";
import { estimateReadTime, formatDate, getTagCategory } from "@/lib/utils";
import type { Post } from "@/lib/types";

export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const tags = post.tags && post.tags.length > 0 ? post.tags : [];
  const readTime = estimateReadTime(post.content || "");
  const postUrl = post.slug || post.id;

  return (
    <Link
      href={`/posts/${postUrl}`}
      className="group relative flex flex-col overflow-hidden h-full transition-all"
      style={{
        background: "#1a1a1a",
        border: "1px solid #333",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,229,255,0.35)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 18px rgba(0,229,255,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#333";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Cover Image */}
      {post.cover_image && (
        <div className="relative overflow-hidden" style={{ aspectRatio: featured ? "21/9" : "16/9", background: "#111" }}>
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-103"
            style={{ opacity: 0.8 }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Subtle bottom gradient */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #1a1a1a 0%, transparent 50%)" }} />
        </div>
      )}

      {/* No image: abstract data-viz placeholder */}
      {!post.cover_image && (
        <div className="relative overflow-hidden" style={{ height: "80px", background: "#111" }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none" fill="none">
            <polyline
              points="0,50 40,35 80,55 120,20 160,45 200,15 240,40 280,25 320,50 360,10 400,40"
              stroke="rgba(0,229,255,0.25)"
              strokeWidth="1"
              fill="none"
            />
            <polyline
              points="0,50 40,35 80,55 120,20 160,45 200,15 240,40 280,25 320,50 360,10 400,40"
              stroke="transparent"
              strokeWidth="1"
              fill="rgba(0,229,255,0.04)"
            />
          </svg>
        </div>
      )}

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Category Badge + Reading Time */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {post.category ? (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-widest border font-mono"
              style={{
                color: post.category.color,
                borderColor: post.category.border,
                background: post.category.bg,
                letterSpacing: "0.12em",
              }}
            >
              {post.category.name}
            </span>
          ) : tags.slice(0, 1).map((tag) => {
            const cat = getTagCategory(tag);
            return (
              <span
                key={tag}
                className="text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-widest border font-mono"
                style={{
                  color: cat.color,
                  borderColor: cat.border,
                  background: cat.bg,
                  letterSpacing: "0.12em",
                }}
              >
                {cat.label}
              </span>
            );
          })}
          <span
            className="flex items-center gap-1 text-[10px] ml-auto"
            style={{ color: "#555" }}
          >
            <Clock className="w-2.5 h-2.5" aria-hidden="true" />
            {readTime}
          </span>
        </div>

        {/* Title */}
        <h3
          className="line-clamp-2 mb-2 transition-colors"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: featured ? "clamp(1.1rem, 2vw, 1.4rem)" : "1rem",
            color: "#e8e8e8",
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </h3>

        <p className="text-xs line-clamp-2 flex-1 mb-4" style={{ color: "#888", lineHeight: 1.6 }}>
          {post.excerpt || post.content?.substring(0, 140)}
        </p>

        {/* Footer row */}
        <div
          className="flex items-center justify-between mt-auto pt-3"
          style={{ borderTop: "1px solid #2a2a2a" }}
        >
          <span className="text-[10px]" style={{ color: "#555" }}>
            {formatDate(post.published_at || post.created_at)}
          </span>
          <span
            className="p-1.5 transition-all"
            style={{ background: "#2a2a2a", color: "#666" }}
          >
            <ArrowUpRight className="w-3 h-3 group-hover:text-cyan-400 transition-colors" style={{ color: "inherit" }} />
          </span>
        </div>
      </div>
    </Link>
  );
}
