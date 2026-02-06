import supabase from "@/lib/supabase";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import PopularArticles from "@/components/PopularArticles";
import { Search } from "lucide-react";

// Revalidate every 60s so new articles appear without a full rebuild (ISR)
export const revalidate = 60;

const POSTS_PER_PAGE = 9;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const from = (currentPage - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  // Fetch posts with pagination
  const { data: posts, count } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);

  // For carousel/popular (fetch small batch of recent)
  const { data: recentPosts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="min-h-screen bg-transparent">
      {/* Featured Carousel replacing static Hero */}
      {recentPosts && <FeaturedCarousel posts={recentPosts} />}
      
      <div id="articles" className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 pb-24 sm:pb-32 scroll-mt-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Dernières <span className="text-zinc-500">Analyses</span>
              </h2>
              {/* Optional search trigger could go here */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {posts?.map((post) => (
                 <PostCard key={post.id} post={post} />
              )) || (
                 <div className="col-span-full text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
                    <p className="text-zinc-400">Aucune analyse disponible pour le moment.</p>
                 </div>
              )}
            </div>

            <Pagination totalPages={totalPages} />
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 space-y-8">
            {/* Search Widget Placeholder */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Rechercher un article..." 
                  className="w-full bg-transparent border-none text-sm text-zinc-300 placeholder-zinc-500 focus:ring-0 pl-9 py-3"
                />
              </div>
            </div>

            {/* Popular Articles Widget */}
            {recentPosts && <PopularArticles posts={recentPosts} />}

            {/* Ad Placeholder */}
            {/* <div className="h-64 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-800 border-dashed">
              <span className="text-xs text-zinc-600">Espace publicitaire</span>
            </div> */}

            {/* Sticky Container for future widgets */}
            <div className="sticky top-24">
              {/* Categories or Tags could go here */}
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}