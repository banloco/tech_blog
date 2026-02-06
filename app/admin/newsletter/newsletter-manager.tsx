"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Trash2, Mail, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { NewsletterSubscriber } from "@/lib/types";

export default function NewsletterManager({
  subscribers,
}: {
  subscribers: NewsletterSubscriber[];
}) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet abonné ?")) return;
    await supabase.from("newsletter_subscribers").delete().eq("id", id);
    router.refresh();
  }

  function handleExportCSV() {
    const csv = [
      "Email,Date d'inscription",
      ...subscribers.map(
        (s) => `${s.email},${new Date(s.created_at).toISOString()}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter_subscribers_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  }

  if (subscribers.length === 0) {
    return (
      <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
        <Mail className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
        <p className="text-zinc-400">Aucun abonné pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          <span className="text-white font-semibold">{subscribers.length}</span>{" "}
          abonné{subscribers.length > 1 ? "s" : ""}
        </p>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      {/* Subscribers Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-400">
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Date d&apos;inscription</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {subscribers.map((subscriber) => (
              <tr
                key={subscriber.id}
                className="hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-4 py-3 text-white">{subscriber.email}</td>
                <td className="px-4 py-3 text-zinc-400">
                  {formatDate(subscriber.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(subscriber.id)}
                    className="p-2 rounded-md hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
