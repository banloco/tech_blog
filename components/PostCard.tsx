import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { estimateReadTime, formatDate, stripHtml, truncate } from "@/lib/utils";
import { categoryInfo } from "@/lib/categories";
import type { Post } from "@/lib/types";
import CategoryBadge from "./CategoryBadge";

type Variant = "default" | "featured" | "compact";

export default function PostCard({ post, variant = "default" }: { post: Post; variant?: Variant }) {
  const cat = categoryInfo(post.category);
  const Icon = cat?.icon;
  const color = cat?.color ?? "var(--accent)";
  const excerpt = post.excerpt ? stripHtml(post.excerpt) : truncate(stripHtml(post.content || ""), 160);
  const href = `/posts/${post.slug || post.id}`;
  const featured = variant === "featured";

  if (variant === "compact") {
    return (
      <Link href={href} className="group flex gap-4 py-4">
        <div className="min-w-0 flex-1">
          {cat && <CategoryBadge category={cat} small />}
          <h3 className="mt-1.5 font-bold leading-snug group-hover:underline" style={{ color: "var(--ink)" }}>{post.title}</h3>
          <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>{estimateReadTime(post.content || "")} de lecture</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={`card card-link group flex h-full flex-col overflow-hidden ${featured ? "md:flex-row" : ""}`}>
      <div className={`relative shrink-0 overflow-hidden ${featured ? "aspect-[16/9] md:aspect-auto md:w-1/2" : "aspect-[16/9]"}`}
        style={{ background: `color-mix(in srgb, ${color} 10%, var(--surface-2))` }}>
        {post.cover_image ? (
          <Image src={post.cover_image} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes={featured ? "(max-width: 768px) 100vw, 600px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"} />
        ) : (
          // No cover: the category icon on a soft tint, so cards never look broken
          Icon && <Icon className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 opacity-60" style={{ color }} aria-hidden="true" />
        )}
      </div>

      <div className={`flex flex-1 flex-col ${featured ? "p-6 sm:p-8 md:justify-center" : "p-5"}`}>
        {cat && <CategoryBadge category={cat} />}
        <h3 className={`mt-3 font-extrabold leading-tight group-hover:underline decoration-2 ${featured ? "text-2xl sm:text-3xl" : "text-lg"}`}
          style={{ color: "var(--ink)", textDecorationColor: color }}>
          {post.title}
        </h3>
        {excerpt && (
          <p className={`mt-2 leading-relaxed ${featured ? "text-base sm:text-lg line-clamp-4" : "text-sm line-clamp-3"}`} style={{ color: "var(--text-muted)" }}>
            {excerpt}
          </p>
        )}
        <p className="mt-auto flex items-center gap-2 pt-4 text-sm" style={{ color: "var(--text-dim)" }}>
          <time dateTime={post.published_at || post.created_at}>{formatDate(post.published_at || post.created_at)}</time>
          <span aria-hidden="true">·</span>
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {estimateReadTime(post.content || "")}
        </p>
      </div>
    </Link>
  );
}
