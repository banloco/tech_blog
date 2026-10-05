import supabase from "@/lib/supabase";
import { ogImage, OG_SIZE } from "@/lib/og";
import { CATEGORIES } from "@/lib/categories";

export const alt = "Article du Plan B";
export const size = OG_SIZE;
export const contentType = "image/png";

// Hex colors: CSS variables don't exist inside the generated image
const COLORS: Record<string, string> = {
  "gagner-de-l-argent": "#0E7A4B",
  "finances-perso": "#B45309",
  productivite: "#1D4ED8",
  "outils-ia": "#7C3AED",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabase.from("posts").select("title, category:categories(slug)").eq("slug", slug).maybeSingle();
  const post = data as { title: string; category: { slug: string } | null } | null;
  const catSlug = post?.category?.slug ?? "";
  const cat = CATEGORIES.find((c) => c.slug === catSlug);
  return ogImage({ title: post?.title ?? "Le Plan B", label: cat?.name, color: COLORS[catSlug] });
}
