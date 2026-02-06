import ArticleForm from "@/components/admin/ArticleForm";

export const metadata = {
  title: "Nouvel article | Admin IA & Capital",
  robots: { index: false, follow: false },
};

export default function NewArticlePage() {
  return <ArticleForm />;
}
