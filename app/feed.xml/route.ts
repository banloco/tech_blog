import supabase from "@/lib/supabase";
import { SITE } from "@/lib/site";
import { stripHtml, truncate } from "@/lib/utils";

// RSS feed of the latest articles: lets readers follow the blog, and lets newsletter tools
// (RSS-to-email) or social schedulers pick up each new article automatically.
export const revalidate = 3600;

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const { data } = await supabase
    .from("posts")
    .select("title, slug, excerpt, content, published_at, created_at, category:categories(name)")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(30);

  const items = ((data ?? []) as unknown as {
    title: string; slug: string; excerpt: string | null; content: string;
    published_at: string | null; created_at: string; category: { name: string } | null;
  }[]).map((p) => {
    const url = `${SITE.url}/posts/${p.slug}`;
    const summary = p.excerpt || truncate(stripHtml(p.content || ""), 300);
    return `    <item>
      <title>${escape(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.published_at || p.created_at).toUTCString()}</pubDate>
      ${p.category ? `<category>${escape(p.category.name)}</category>` : ""}
      <description>${escape(summary)}</description>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE.name)}</title>
    <link>${SITE.url}</link>
    <description>${escape(SITE.description)}</description>
    <language>fr</language>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
