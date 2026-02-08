import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  title: "Dashboard Admin | IA & Capital",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <AdminLayoutClient userEmail={user.email || ""}>{children}</AdminLayoutClient>;
}
