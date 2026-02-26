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
      <div
        className="text-center py-20 border border-dashed"
        style={{ background: "#1a1a1a", borderColor: "#333" }}
      >
        <Mail className="w-10 h-10 mx-auto mb-3" style={{ color: "#333" }} />
        <p style={{ color: "#888" }}>Aucun abonné pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "#888" }}>
          <span className="font-semibold" style={{ color: "#e8e8e8" }}>{subscribers.length}</span>{" "}
          abonné{subscribers.length > 1 ? "s" : ""}
        </p>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider transition-colors"
          style={{ border: "1px solid #333", background: "#1a1a1a", color: "#888" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#e8e8e8"; e.currentTarget.style.borderColor = "#555"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#333"; }}
        >
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      {/* Subscribers Table */}
      <div
        className="overflow-x-auto"
        style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              className="text-left"
              style={{ borderBottom: "1px solid #2a2a2a" }}
            >
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#555" }}>Email</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#555" }}>Date d&apos;inscription</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-right" style={{ color: "#555" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr
                key={subscriber.id}
                className="transition-colors"
                style={{ borderBottom: "1px solid #222" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="px-4 py-3" style={{ color: "#e8e8e8" }}>{subscriber.email}</td>
                <td className="px-4 py-3" style={{ color: "#555" }}>
                  {formatDate(subscriber.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(subscriber.id)}
                    className="p-2 transition-colors"
                    style={{ color: "#555" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ff5555")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
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
