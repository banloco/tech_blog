"use client";

import FeaturedCarousel from "@/components/FeaturedCarousel";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import PopularArticles from "@/components/PopularArticles";
import MarketPulse from "@/components/MarketPulse";
import NewsletterInline from "@/components/NewsletterInline";
import { Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import type { Post } from "@/lib/types";

interface HomeClientProps {
  posts: Post[] | null;
  recentPosts: Post[] | null;
  totalPages: number;
}

export default function HomeClient({ posts, recentPosts, totalPages }: HomeClientProps) {
  const { t } = useLanguage();
  const [firstPost, ...remainingPosts] = posts || [];

  return (
    <main className="min-h-screen" style={{ background: "transparent" }}>
      {/* Featured Carousel Hero */}
      {recentPosts && <FeaturedCarousel posts={recentPosts} />}

      <div
        id="articles"
        className="mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20 pb-20 scroll-mt-20"
        style={{ maxWidth: "1280px" }}
      >
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Section Header */}
            <div
              className="flex items-baseline justify-between mb-8 pb-3"
              style={{ borderBottom: "1px solid #2a2a2a" }}
            >
              <h2
                className="text-sm uppercase tracking-widest font-medium"
                style={{ color: "#888", letterSpacing: "0.16em" }}
              >
                Dernières analyses
                <span
                  className="ml-3 text-[10px] px-1.5 py-0.5 border"
                  style={{ color: "#00E5FF", borderColor: "rgba(0,229,255,0.3)", letterSpacing: "0.08em" }}
                >
                  {posts?.length ?? 0} articles
                </span>
              </h2>
              <span className="text-[10px] uppercase tracking-widest" style={{ color: "#444" }}>
                {new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
              </span>
            </div>

            {posts && posts.length > 0 ? (
              <>
                {/* First post — full-width featured */}
                {firstPost && (
                  <div className="mb-3">
                    <PostCard post={firstPost} featured={true} />
                  </div>
                )}

                {/* Inline newsletter — compact bar between featured and grid */}
                <NewsletterInline />

                {/* Remaining — asymmetric 2-col grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {remainingPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            ) : (
              <div
                className="text-center py-20 border border-dashed"
                style={{ borderColor: "#2a2a2a" }}
              >
                <p className="text-sm" style={{ color: "#555" }}>
                  {t("noArticlesAvailable")}
                </p>
              </div>
            )}

            <Pagination totalPages={totalPages} />
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:w-72 xl:w-80 space-y-6">
            {/* Search */}
            <div
              className="flex items-center gap-2 border px-3 py-2"
              style={{ borderColor: "#333", background: "#1a1a1a" }}
            >
              <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#555" }} />
              <input
                type="text"
                placeholder={t("searchArticle")}
                className="w-full bg-transparent border-none text-xs focus:ring-0 focus:outline-none"
                style={{ color: "#888", fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Market Pulse Widget */}
            <MarketPulse />

            {/* Popular Articles */}
            <PopularArticles posts={recentPosts || []} />
          </aside>
        </div>
      </div>
    </main>
  );
}
