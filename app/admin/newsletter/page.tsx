import { createSupabaseServerClient } from "@/lib/supabase-server";
import NewsletterManager from "./newsletter-manager";
import type { NewsletterSubscriber } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Newsletter | Admin Le Plan B",
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
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--ink)" }}>Newsletter</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Gérer les abonnés à la newsletter
        </p>
      </div>

      <NewsletterManager
        subscribers={(subscribers as NewsletterSubscriber[]) || []}
      />
    </div>
  );
}
