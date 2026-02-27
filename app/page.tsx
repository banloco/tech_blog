import supabase from "@/lib/supabase";
import HomeClient from "./HomeClient";

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

  // Fetch posts in parallel — gracefully degrade to empty arrays on timeout
  const [postsResult, recentResult] = await Promise.allSettled([
    supabase
      .from("posts")
      .select("*, category:categories(*)", { count: "exact" })
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range(from, to),
    supabase
      .from("posts")
      .select("*, category:categories(*)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const posts =
    postsResult.status === "fulfilled" ? postsResult.value.data : null;
  const count =
    postsResult.status === "fulfilled" ? postsResult.value.count : 0;
  const recentPosts =
    recentResult.status === "fulfilled" ? recentResult.value.data : null;

  const totalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);

  return <HomeClient posts={posts} recentPosts={recentPosts} totalPages={totalPages} />;
}