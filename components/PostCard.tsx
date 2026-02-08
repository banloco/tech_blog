import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { estimateReadTime } from "@/lib/utils";
import type { Post } from "@/lib/types";

export default function PostCard({ post }: { post: Post }) {
  const tags = post.tags && post.tags.length > 0 ? post.tags : ["Article"];
  const readTime = estimateReadTime(post.content || "");

  return (
    <Link href={`/posts/${post.id}`} className="group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10 h-full">
      
      {/* Cover Image */}
      {post.cover_image && (
        <div className="relative aspect-video w-full overflow-hidden bg-zinc-800">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-zinc-500 mb-3 sm:mb-4 flex-wrap">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{new Date(post.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-zinc-700 flex-shrink-0"></span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 flex-shrink-0" />
            {readTime}
          </span>
        </div>

        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2 sm:mb-3">
          {post.title}
        </h3>
        
        <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 flex-1">
          {post.excerpt || post.content}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-zinc-800/50">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 mr-2">
            {tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] sm:text-xs font-medium px-2 py-1 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 whitespace-nowrap flex-shrink-0">
                {tag}
              </span>
            ))}
          </div>
          <div className="p-2 rounded-full bg-zinc-800 text-zinc-400 group-hover:bg-emerald-500 group-hover:text-white transition-all flex-shrink-0">
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
