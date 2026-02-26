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
        style={{ background: "#1a1a1a", borderColor: "#333" }}
      >
        <Users className="w-10 h-10 mx-auto mb-3" style={{ color: "#333" }} />
        <p style={{ color: "#888" }}>Aucun message reçu pour le moment.</p>
      </div>
    );
  }

  const unreadCount = contacts.filter((c) => !c.is_read).length;

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: "#888" }}>
        <span className="font-semibold" style={{ color: "#e8e8e8" }}>{contacts.length}</span>{" "}
        message{contacts.length > 1 ? "s" : ""}
        {unreadCount > 0 && (
          <span className="ml-2" style={{ color: "#C19A6B" }}>
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
              border: contact.is_read ? "1px solid #2a2a2a" : "1px solid rgba(0,229,255,0.2)",
              background: contact.is_read ? "#1a1a1a" : "rgba(0,229,255,0.02)",
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
                    <span className="w-2 h-2 shrink-0" style={{ background: "#00E5FF" }} />
                  )}
                  <span className="font-medium text-sm" style={{ color: "#e8e8e8" }}>
                    {contact.name}
                  </span>
                  <span className="text-xs" style={{ color: "#555" }}>
                    {contact.email}
                  </span>
                  <span className="text-xs" style={{ color: "#444" }}>
                    · {formatDate(contact.created_at)}
                  </span>
                </div>
                <p className="text-sm font-medium" style={{ color: "#e8e8e8" }}>
                  {contact.subject}
                </p>
                {expandedId !== contact.id && (
                  <p className="text-sm line-clamp-1 mt-1" style={{ color: "#888" }}>
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
                  style={{ color: "#555" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
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
                  style={{ color: "#555" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ff5555")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expandedId === contact.id && (
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid #2a2a2a" }}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#aaa" }}>
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
