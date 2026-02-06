import { createSupabaseServerClient } from "@/lib/supabase-server";
import ContactsManager from "./contacts-manager";
import type { Contact } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contacts | Admin IA & Capital",
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
        <h1 className="text-2xl font-bold text-white">Messages de contact</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Consulter et gérer les messages reçus
        </p>
      </div>

      <ContactsManager contacts={(contacts as Contact[]) || []} />
    </div>
  );
}
