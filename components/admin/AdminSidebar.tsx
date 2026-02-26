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
        collapsed ? "w-16" : "w-60"
      } flex-col transition-all duration-300 shrink-0`}
      style={{ background: "#0e0e0e", borderRight: "1px solid #2a2a2a" }}
    >
      {/* Toggle */}
      <div
        className="flex items-center justify-between p-4 h-16"
        style={{ borderBottom: "1px solid #2a2a2a" }}
      >
        {!collapsed && (
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.2em] truncate"
            style={{ color: "#C19A6B" }}
          >
            Admin Panel
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 transition-colors"
          style={{ color: "#555" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
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
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium uppercase tracking-wider transition-all"
              style={
                isActive
                  ? {
                      color: "#00E5FF",
                      background: "rgba(0,229,255,0.04)",
                      borderLeft: "2px solid #00E5FF",
                    }
                  : {
                      color: "#888",
                      borderLeft: "2px solid transparent",
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "#e8e8e8";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "#888";
              }}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 space-y-3" style={{ borderTop: "1px solid #2a2a2a" }}>
        {!collapsed && (
          <p className="text-[10px] truncate" style={{ color: "#555" }} title={userEmail}>
            {userEmail}
          </p>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-xs uppercase tracking-wider transition-all"
          style={{ color: "#ff5555", borderLeft: "2px solid transparent" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,85,85,0.06)";
            e.currentTarget.style.borderLeftColor = "#ff5555";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderLeftColor = "transparent";
          }}
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm lg:hidden z-40"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />

          {/* Sidebar */}
          <div
            className="fixed left-0 top-0 bottom-0 w-72 lg:hidden z-50 shadow-2xl"
            style={{ background: "#0e0e0e", borderRight: "1px solid #2a2a2a" }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div
                className="flex items-center justify-between p-4 h-16"
                style={{ borderBottom: "1px solid #2a2a2a" }}
              >
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "#C19A6B" }}
                >
                  Admin Panel
                </span>
                <button
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className="p-2 transition-colors"
                  style={{ color: "#888" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8e8")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const isActive =
                    href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium uppercase tracking-wider transition-all"
                      style={
                        isActive
                          ? {
                              color: "#00E5FF",
                              background: "rgba(0,229,255,0.04)",
                              borderLeft: "2px solid #00E5FF",
                            }
                          : {
                              color: "#888",
                              borderLeft: "2px solid transparent",
                            }
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User & Logout */}
              <div className="p-4 space-y-3" style={{ borderTop: "1px solid #2a2a2a" }}>
                <p
                  className="text-[10px] truncate"
                  style={{ color: "#555" }}
                  title={userEmail}
                >
                  {userEmail}
                </p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs uppercase tracking-wider transition-all"
                  style={{ color: "#ff5555" }}
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
