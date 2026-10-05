"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Trash2, Users, MailOpen, Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Contact } from "@/lib/types";
import { useState } from "react";

export default function ContactsManager({
  contacts,
}: {
  contacts: Contact[];
}) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleMarkRead(id: string, isRead: boolean) {
    await supabase
      .from("contacts")
      .update({ is_read: !isRead })
      .eq("id", id);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce message ?")) return;
    await supabase.from("contacts").delete().eq("id", id);
    router.refresh();
  }

  if (contacts.length === 0) {
    return (
      <div
        className="text-center py-20 border border-dashed"
        style={{ background: "var(--surface)", borderColor: "var(--line)" }}
      >
        <Users className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--line)" }} />
        <p style={{ color: "var(--text-muted)" }}>Aucun message reçu pour le moment.</p>
      </div>
    );
  }

  const unreadCount = contacts.filter((c) => !c.is_read).length;

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        <span className="font-semibold" style={{ color: "var(--ink)" }}>{contacts.length}</span>{" "}
        message{contacts.length > 1 ? "s" : ""}
        {unreadCount > 0 && (
          <span className="ml-2" style={{ color: "var(--accent)" }}>
            ({unreadCount} non lu{unreadCount > 1 ? "s" : ""})
          </span>
        )}
      </p>

      <div className="space-y-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="p-4 transition-all cursor-pointer"
            style={{
              border: contact.is_read ? "1px solid var(--line-soft)" : "1px solid color-mix(in srgb, var(--brand) 20%, transparent)",
              background: contact.is_read ? "var(--surface)" : "color-mix(in srgb, var(--brand) 2%, transparent)",
            }}
          >
            <div
              className="flex items-start justify-between gap-4"
              onClick={() =>
                setExpandedId(expandedId === contact.id ? null : contact.id)
              }
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {!contact.is_read && (
                    <span className="w-2 h-2 shrink-0" style={{ background: "var(--brand)" }} />
                  )}
                  <span className="font-medium text-sm" style={{ color: "var(--ink)" }}>
                    {contact.name}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                    {contact.email}
                  </span>
                  <span className="text-xs" style={{ color: "var(--line-strong)" }}>
                    · {formatDate(contact.created_at)}
                  </span>
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                  {contact.subject}
                </p>
                {expandedId !== contact.id && (
                  <p className="text-sm line-clamp-1 mt-1" style={{ color: "var(--text-muted)" }}>
                    {contact.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkRead(contact.id, contact.is_read);
                  }}
                  className="p-2 transition-colors"
                  style={{ color: "var(--text-dim)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
                  title={
                    contact.is_read
                      ? "Marquer comme non lu"
                      : "Marquer comme lu"
                  }
                >
                  {contact.is_read ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <MailOpen className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(contact.id);
                  }}
                  className="p-2 transition-colors"
                  style={{ color: "var(--text-dim)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expandedId === contact.id && (
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--line-soft)" }}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-muted)" }}>
                  {contact.message}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
