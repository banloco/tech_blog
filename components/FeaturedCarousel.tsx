"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play, Clock, ArrowUpRight } from "lucide-react";
import { estimateReadTime, formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

export default function FeaturedCarousel({ posts }: { posts: Post[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { t } = useLanguage();
  const featuredPosts = posts.slice(0, 5);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredPosts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredPosts.length, isPaused]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % featuredPosts.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);

  if (featuredPosts.length === 0) return null;

  const post = featuredPosts[currentIndex];
  const readTime = estimateReadTime(post.content || "");
  const tags = post.tags && post.tags.length > 0 ? post.tags : ["Featured"];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ borderBottom: "1px solid #333" }}
      aria-roledescription="carousel"
      aria-label="Articles à la une"
    >
      <div className="relative" style={{ minHeight: "480px" }}>
        {featuredPosts.map((p, index) => {
          const active = index === currentIndex;
          return (
            <div
              key={p.id}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: active ? 1 : 0, zIndex: active ? 1 : 0 }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} sur ${featuredPosts.length}`}
              aria-hidden={!active}
            >
              {/* Background */}
              <div className="absolute inset-0" style={{ background: "#0e0e0e" }}>
                {p.cover_image ? (
                  <Image
                    src={p.cover_image}
                    alt={`Illustration: ${p.title}`}
                    fill
                    className="object-cover"
                    style={{ opacity: 0.25 }}
                    priority={index === 0}
                    sizes="100vw"
                  />
                ) : (
                  /* Abstract geometric SVG fallback */
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 1440 480"
                    preserveAspectRatio="xMidYMid slice"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ opacity: 0.18 }}
                  >
                    <circle cx="1200" cy="240" r="380" stroke="#00E5FF" strokeWidth="0.5" fill="none" />
                    <circle cx="1200" cy="240" r="250" stroke="#C19A6B" strokeWidth="0.5" fill="none" />
                    <circle cx="1200" cy="240" r="120" stroke="#00E5FF" strokeWidth="0.5" fill="none" />
                    <line x1="820" y1="0" x2="1440" y2="480" stroke="#333" strokeWidth="0.5" />
                    <line x1="1000" y1="0" x2="1440" y2="320" stroke="#333" strokeWidth="0.5" />
                    <line x1="1440" y1="100" x2="820" y2="480" stroke="#333" strokeWidth="0.5" />
                    <rect x="0" y="0" width="700" height="480" fill="url(#fadeLeft)" />
                  </svg>
                )}
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to right, #0e0e0e 55%, rgba(14,14,14,0.7) 75%, rgba(14,14,14,0.2) 100%)",
                  }}
                />
              </div>

              {/* Content */}
              <div
                className="relative z-10 flex flex-col justify-end h-full px-6 sm:px-10 lg:px-16 pb-10 sm:pb-14 lg:pb-16 pt-20"
                style={{ minHeight: "480px" }}
              >
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className="px-2 py-0.5 text-[9px] font-semibold tracking-widest uppercase border"
                    style={{ color: "#C19A6B", borderColor: "#C19A6B", background: "rgba(193,154,107,0.08)" }}
                  >
                    {t("featured")}
                  </span>
                  {tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[9px] font-medium tracking-widest uppercase border"
                      style={{ color: "#00E5FF", borderColor: "rgba(0,229,255,0.3)", background: "rgba(0,229,255,0.05)" }}
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    className="text-[10px] flex items-center gap-1"
                    style={{ color: "#666" }}
                  >
                    <Clock className="w-2.5 h-2.5" />
                    {estimateReadTime(p.content || "")}
                  </span>
                  <span className="text-[10px]" style={{ color: "#555" }}>
                    {formatDate(p.published_at || p.created_at)}
                  </span>
                </div>

                {/* Title */}
                <Link href={`/posts/${p.slug || p.id}`} className="block max-w-2xl mb-4">
                  <h1
                    className="leading-tight hover:opacity-80 transition-opacity"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)",
                      color: "#e8e8e8",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}
                  >
                    {p.title}
                  </h1>
                </Link>

                {/* Excerpt */}
                {p.excerpt && (
                  <p
                    className="max-w-xl line-clamp-2 mb-6 hidden sm:block"
                    style={{ color: "#888", fontSize: "13px", lineHeight: 1.6 }}
                  >
                    {p.excerpt}
                  </p>
                )}

                {/* CTA */}
                <Link
                  href={`/posts/${p.slug || p.id}`}
                  className="inline-flex items-center gap-2 border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all self-start"
                  style={{
                    color: "#e8e8e8",
                    borderColor: "#e8e8e8",
                    background: "transparent",
                    letterSpacing: "0.1em",
                    fontSize: "10px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#00E5FF";
                    (e.currentTarget as HTMLElement).style.borderColor = "#00E5FF";
                    (e.currentTarget as HTMLElement).style.color = "#121212";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.borderColor = "#e8e8e8";
                    (e.currentTarget as HTMLElement).style.color = "#e8e8e8";
                  }}
                >
                  {t("readArticle")}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Controls ── */}
      {/* Pause/Play */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="absolute top-4 right-4 z-30 p-2 border transition-all"
        style={{
          background: "rgba(18,18,18,0.85)",
          borderColor: "#333",
          color: isPaused ? "#00E5FF" : "#888",
        }}
        aria-label={isPaused ? "Reprendre" : "Pause"}
      >
        {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
      </button>

      {/* Prev/Next */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 border transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
        style={{ background: "rgba(18,18,18,0.85)", borderColor: "#333", color: "#888" }}
        aria-label={t("previousArticle")}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 border transition-all"
        style={{ background: "rgba(18,18,18,0.85)", borderColor: "#333", color: "#888" }}
        aria-label={t("nextArticle")}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-4 right-6 z-30 flex items-center gap-2">
        {featuredPosts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="transition-all"
            style={{
              width: index === currentIndex ? "24px" : "6px",
              height: "2px",
              background: index === currentIndex ? "#00E5FF" : "#444",
            }}
            aria-label={`Slide ${index + 1}`}
            aria-current={index === currentIndex ? "true" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
