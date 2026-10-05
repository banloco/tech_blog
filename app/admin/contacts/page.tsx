import { createSupabaseServerClient } from "@/lib/supabase-server";
import ContactsManager from "./contacts-manager";
import type { Contact } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contacts | Admin Le Plan B",
  robots: { index: false, follow: false },
};

export default async function AdminContactsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--ink)" }}>Messages de contact</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Consulter et gérer les messages reçus
        </p>
      </div>

      <ContactsManager contacts={(contacts as Contact[]) || []} />
    </div>
  );
}
