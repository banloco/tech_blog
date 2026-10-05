import { createSupabaseServerClient } from "@/lib/supabase-server";
import { FileText, MessageSquare, Mail, Users } from "lucide-react";

async function getStats() {
  const supabase = await createSupabaseServerClient();

  const [postsRes, commentsRes, newsletterRes, contactsRes] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("comments").select("id", { count: "exact", head: true }),
    supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    supabase.from("contacts").select("id", { count: "exact", head: true }),
  ]);

  return {
    posts: postsRes.count ?? 0,
    comments: commentsRes.count ?? 0,
    subscribers: newsletterRes.count ?? 0,
    contacts: contactsRes.count ?? 0,
  };
}

const statCards = [
  { key: "posts" as const, label: "Articles publiés", icon: FileText, accent: "var(--brand)" },
  { key: "comments" as const, label: "Commentaires", icon: MessageSquare, accent: "var(--brand)" },
  { key: "subscribers" as const, label: "Abonnés newsletter", icon: Mail, accent: "var(--accent)" },
  { key: "contacts" as const, label: "Messages reçus", icon: Users, accent: "var(--accent)" },
];

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--ink)" }}
        >
          Dashboard
        </h1>
        <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "var(--text-dim)" }}>
          Vue d&apos;ensemble de votre blog
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ key, label, icon: Icon, accent }) => (
          <div
            key={key}
            className="p-6 transition-all"
            style={{ background: "var(--surface)", border: `1px solid var(--line-soft)`, borderTop: `2px solid ${accent}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className="w-5 h-5" style={{ color: accent }} />
            </div>
            <p
              className="text-3xl font-bold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--ink)" }}
            >
              {stats[key]}
            </p>
            <p className="text-xs uppercase tracking-widest mt-2" style={{ color: "var(--text-dim)" }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
