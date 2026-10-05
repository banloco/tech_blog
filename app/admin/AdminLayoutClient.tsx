"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function AdminLayoutClient({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Mobile Header */}
      <div
        className="lg:hidden fixed top-14 sm:top-16 left-0 right-0 z-30 px-4 py-3 flex items-center justify-between"
        style={{
          background: "color-mix(in srgb, var(--bg) 97%, transparent)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--line-soft)",
        }}
      >
        <h1
          className="text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--ink)" }}
        >
          Admin Dashboard
        </h1>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <AdminSidebar
        userEmail={userEmail}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 mt-[52px] lg:mt-0">
        {children}
      </main>
    </div>
  );
}
