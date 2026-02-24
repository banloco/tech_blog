import { createClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";

// Use a plain service client — sitemap has no request/cookies context
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 3600; // re-generate at most every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, ""); // strip trailing slash

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Fetch published posts — gracefully degrade if Supabase is unavailable
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const { data: posts, error } = await getSupabase()
      .from("posts")
      .select("id, slug, updated_at, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (!error && posts) {
      postEntries = posts.map((post) => ({
        url: `${baseUrl}/posts/${post.slug || post.id}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error("[sitemap] Failed to fetch posts:", err);
    // Return static pages only — better than an HTML error page
  }

  return [...staticPages, ...postEntries];
}
