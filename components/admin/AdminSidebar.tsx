"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Mail,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/commentaires", label: "Commentaires", icon: MessageSquare },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/contacts", label: "Contacts", icon: Users },
];

export default function AdminSidebar({ userEmail, mobileOpen, setMobileOpen }: { 
  userEmail: string;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const supabase = createSupabaseBrowserClient();

  // Close mobile menu on route change
  useEffect(() => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname, setMobileOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside
      className={`hidden lg:flex ${
        collapsed ? "w-16" : "w-64"
      } flex-col border-r border-zinc-800 bg-zinc-950/80 transition-all duration-300 shrink-0`}
    >
      {/* Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 h-16">
        {!collapsed && (
          <span className="text-sm font-semibold text-emerald-400 truncate">
            Admin Panel
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          aria-label={collapsed ? "Étendre le menu" : "Réduire le menu"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-zinc-800 space-y-3">
        {!collapsed && (
          <p className="text-xs text-zinc-500 truncate" title={userEmail}>
            {userEmail}
          </p>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-all"
          title="Déconnexion"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-40"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-zinc-950 border-r border-zinc-800 lg:hidden z-50 shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800 h-16">
                <span className="text-sm font-semibold text-emerald-400">
                  Admin Panel
                </span>
                <button
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const isActive =
                    href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User & Logout */}
              <div className="p-4 border-t border-zinc-800 space-y-3">
                <p className="text-xs text-zinc-500 truncate" title={userEmail}>
                  {userEmail}
                </p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
