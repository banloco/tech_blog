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

  return <HomeClient posts={posts} recentPosts={recentPosts} totalPages={totalPages} />;
}