import { createSupabaseServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ArticleForm from "@/components/admin/ArticleForm";
import type { Post } from "@/lib/types";

export const metadata = {
  title: "Modifier article | Admin IA & Capital",
  robots: { index: false, follow: false },
};

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) {
    notFound();
  }

  return <ArticleForm article={post as Post} />;
}
