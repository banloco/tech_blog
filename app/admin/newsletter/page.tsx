import { createSupabaseServerClient } from "@/lib/supabase-server";
import NewsletterManager from "./newsletter-manager";
import type { NewsletterSubscriber } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Newsletter | Admin IA & Capital",
  robots: { index: false, follow: false },
};

export default async function AdminNewsletterPage() {
  const supabase = await createSupabaseServerClient();
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Newsletter</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Gérer les abonnés à la newsletter
        </p>
      </div>

      <NewsletterManager
        subscribers={(subscribers as NewsletterSubscriber[]) || []}
      />
    </div>
  );
}
