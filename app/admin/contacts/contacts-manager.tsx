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
      <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
        <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
        <p className="text-zinc-400">Aucun message reçu pour le moment.</p>
      </div>
    );
  }

  const unreadCount = contacts.filter((c) => !c.is_read).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        <span className="text-white font-semibold">{contacts.length}</span>{" "}
        message{contacts.length > 1 ? "s" : ""}
        {unreadCount > 0 && (
          <span className="ml-2 text-amber-400">
            ({unreadCount} non lu{unreadCount > 1 ? "s" : ""})
          </span>
        )}
      </p>

      <div className="space-y-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`rounded-xl border p-4 transition-all cursor-pointer ${
              contact.is_read
                ? "border-zinc-800 bg-zinc-900/50"
                : "border-blue-500/20 bg-blue-500/5"
            }`}
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
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  )}
                  <span className="font-medium text-white text-sm">
                    {contact.name}
                  </span>
                  <span className="text-zinc-500 text-xs">
                    {contact.email}
                  </span>
                  <span className="text-zinc-600 text-xs">
                    · {formatDate(contact.created_at)}
                  </span>
                </div>
                <p className="text-sm font-medium text-zinc-200">
                  {contact.subject}
                </p>
                {expandedId !== contact.id && (
                  <p className="text-sm text-zinc-400 line-clamp-1 mt-1">
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
                  className="p-2 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
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
                  className="p-2 rounded-md hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expandedId === contact.id && (
              <div className="mt-4 pt-4 border-t border-zinc-800/50">
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
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
