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
        style={{ background: "var(--surface)", borderColor: "var(--line)" }}
      >
        <Mail className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--line)" }} />
        <p style={{ color: "var(--text-muted)" }}>Aucun abonné pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          <span className="font-semibold" style={{ color: "var(--ink)" }}>{subscribers.length}</span>{" "}
          abonné{subscribers.length > 1 ? "s" : ""}
        </p>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider transition-colors"
          style={{ border: "1px solid var(--line)", background: "var(--surface)", color: "var(--text-muted)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.borderColor = "var(--text-dim)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--line)"; }}
        >
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      {/* Subscribers Table */}
      <div
        className="overflow-x-auto"
        style={{ background: "var(--surface)", border: "1px solid var(--line-soft)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              className="text-left"
              style={{ borderBottom: "1px solid var(--line-soft)" }}
            >
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Email</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>Date d&apos;inscription</th>
              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-right" style={{ color: "var(--text-dim)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr
                key={subscriber.id}
                className="transition-colors"
                style={{ borderBottom: "1px solid var(--line-soft)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in srgb, var(--ink) 2%, transparent)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td className="px-4 py-3" style={{ color: "var(--ink)" }}>{subscriber.email}</td>
                <td className="px-4 py-3" style={{ color: "var(--text-dim)" }}>
                  {formatDate(subscriber.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(subscriber.id)}
                    className="p-2 transition-colors"
                    style={{ color: "var(--text-dim)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
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
