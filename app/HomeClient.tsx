"use client";

import FeaturedCarousel from "@/components/FeaturedCarousel";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import PopularArticles from "@/components/PopularArticles";
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

  return (
    <main className="min-h-screen bg-transparent">
      {/* Featured Carousel replacing static Hero */}
      {recentPosts && <FeaturedCarousel posts={recentPosts} />}
      
      <div id="articles" className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20 pb-16 sm:pb-24 lg:pb-32 scroll-mt-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 lg:mb-12 gap-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
                {t('latestAnalyses').split(' ')[0]} <span className="text-zinc-500">{t('latestAnalyses').split(' ')[1]}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {posts?.map((post) => (
                 <PostCard key={post.id} post={post} />
              )) || (
                 <div className="col-span-full text-center py-12 sm:py-20 bg-zinc-900/30 rounded-2xl sm:rounded-3xl border border-zinc-800 border-dashed">
                    <p className="text-sm sm:text-base text-zinc-400">{t('noArticlesAvailable')}</p>
                 </div>
              )}
            </div>

            <Pagination totalPages={totalPages} />
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 xl:w-96 space-y-6 sm:space-y-8">
            {/* Search Widget Placeholder */}
            <div className="rounded-xl sm:rounded-2xl border border-zinc-800 bg-zinc-900/50 p-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder={t('searchArticle')}
                  className="w-full bg-transparent border-none text-sm text-zinc-300 placeholder-zinc-500 focus:ring-0 pl-9 py-2.5 sm:py-3"
                />
              </div>
            </div>

            <PopularArticles posts={recentPosts || []} />
          </aside>
        </div>
      </div>
    </main>
  );
}
