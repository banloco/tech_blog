import Link from "next/link";
import { TrendingUp, Clock, MessageCircle, Eye } from "lucide-react";
import { estimateReadTime } from "@/lib/utils";
import type { Post } from "@/lib/types";

export default function PopularArticles({ posts }: { posts: Post[] }) {
  // Sort by views descending
  const popularPosts = [...posts].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 4);

  if (popularPosts.length === 0) return null;

  return (
    <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800 p-6">
      <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
        <TrendingUp className="w-5 h-5 text-emerald-400" />
        Les plus lus
      </h3>

      <div className="space-y-6">
        {popularPosts.map((post, index) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="group flex gap-4 items-start"
          >
            <div className="flex-shrink-0 w-8 text-2xl font-bold text-zinc-700 group-hover:text-emerald-500/50 transition-colors">
              0{index + 1}
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors line-clamp-2">
                {post.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {estimateReadTime(post.content || "")}
                </span>
                {post.views_count !== undefined && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.views_count}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-zinc-800">
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
          <h4 className="text-sm font-semibold text-white mb-1">
            Rejoignez 2000+ lecteurs
          </h4>
          <p className="text-xs text-zinc-400 mb-3">
            Recevez nos meilleures analyses chaque semaine.
          </p>
          <a href="#newsletter" className="text-xs font-medium text-emerald-400 hover:text-emerald-300">
            S'inscrire à la newsletter &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
