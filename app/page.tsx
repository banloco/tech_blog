import supabase from "@/lib/supabase";
import Hero from "@/components/Hero";
import PostCard from "@/components/PostCard";

// Revalidate every 60s so new articles appear without a full rebuild (ISR)
export const revalidate = 60;

export default async function Home() {
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-transparent">
      <Hero />
      
      <div id="articles" className="container mx-auto px-6 py-20 pb-32 scroll-mt-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Analyses <span className="text-zinc-500">Récentes</span>
          </h2>
          {/* Link to see all works if you have a separate page */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post) => (
             <PostCard key={post.id} post={post} />
          )) || (
             <div className="col-span-full text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
                <p className="text-zinc-400">Aucune analyse disponible pour le moment.</p>
             </div>
          )}
        </div>
      </div>
    </main>
  );
}