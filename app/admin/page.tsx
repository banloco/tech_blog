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
  { key: "posts" as const, label: "Articles", icon: FileText, color: "emerald" },
  { key: "comments" as const, label: "Commentaires", icon: MessageSquare, color: "blue" },
  { key: "subscribers" as const, label: "Abonnés newsletter", icon: Mail, color: "purple" },
  { key: "contacts" as const, label: "Messages reçus", icon: Users, color: "amber" },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
};

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Vue d'ensemble de votre blog
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ key, label, icon: Icon, color }) => {
          const c = colorMap[color];
          return (
            <div
              key={key}
              className={`rounded-xl border ${c.border} ${c.bg} p-6 transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-5 h-5 ${c.text}`} />
              </div>
              <p className="text-3xl font-bold text-white">{stats[key]}</p>
              <p className="text-sm text-zinc-400 mt-1">{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
