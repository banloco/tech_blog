"use client";

import Link from "next/link";
import { TrendingUp, Clock, MessageCircle, Eye } from "lucide-react";
import { estimateReadTime } from "@/lib/utils";
import type { Post } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

export default function PopularArticles({ posts }: { posts: Post[] }) {
  const { t } = useLanguage();
  
  // Sort by views descending
  const popularPosts = [...posts].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 4);

  if (popularPosts.length === 0) return null;

  return (
    <div className="bg-zinc-900/30 rounded-xl sm:rounded-2xl border border-zinc-800 p-4 sm:p-5 lg:p-6">
      <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0" />
        {t('mostRead')}
      </h3>

      <div className="space-y-4 sm:space-y-6">
        {popularPosts.map((post, index) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug || post.id}`}
            className="group flex gap-3 sm:gap-4 items-start"
          >
            <div className="flex-shrink-0 w-6 sm:w-8 text-xl sm:text-2xl font-bold text-zinc-700 group-hover:text-emerald-500/50 transition-colors">
              0{index + 1}
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors line-clamp-2">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-zinc-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  {estimateReadTime(post.content || "")}
                </span>
                {post.views_count !== undefined && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 flex-shrink-0" />
                    {post.views_count}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-zinc-800">
        <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
          <h4 className="text-xs sm:text-sm font-semibold text-white mb-1">
            {t('joinReaders')}
          </h4>
          <p className="text-[10px] sm:text-xs text-zinc-400 mb-2 sm:mb-3">
            {t('receiveAnalyses')}
          </p>
          <a href="#newsletter" className="text-[10px] sm:text-xs font-medium text-emerald-400 hover:text-emerald-300">
            {t('subscribeToNewsletter')} &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
