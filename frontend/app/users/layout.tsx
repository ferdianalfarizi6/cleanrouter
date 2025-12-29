"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  LogOut,
  User,
  PlusCircle,
  Search,
  LayoutDashboard,
  X,
  Home
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import LogoutModal from "../components/LogoutModal";
import { apiFetch } from "@/lib/api";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openProfile, setOpenProfile] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [user, setUser] = useState<any>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await apiFetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.user) setUser(res.user);
      } catch (e) {
        console.error("Failed to fetch user", e);
      }
    };
    fetchUser();
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setOpenProfile(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutConfirm(false);
    router.push("/auth/loginuser");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">

      <LogoutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
      />

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ===== SIDEBAR ===== */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 flex flex-col shadow-xl md:shadow-sm transition-all duration-300 ease-in-out",
          isMobileSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0",
          isDesktopSidebarOpen ? "md:w-64" : "md:w-20"
        )}
      >
        <div className={clsx("px-6 py-6 flex items-center gap-3 justify-between", !isDesktopSidebarOpen && "md:justify-center md:px-2")}>
          <div className="flex items-center gap-2 overflow-hidden flex-shrink-0">
            <div className="bg-emerald-600 text-white w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-200 flex-shrink-0">
              CR
            </div>
            <span className={clsx("text-xl font-bold text-slate-800 tracking-tight transition-opacity", !isDesktopSidebarOpen && "md:hidden")}>Clean Route</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-emerald-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto overflow-x-hidden">
          <p className={clsx("px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 transition-opacity", !isDesktopSidebarOpen && "md:hidden")}>Menu Utama</p>

          {[
            { href: "/", icon: Home, label: "Home" },
            { href: "/users", icon: LayoutDashboard, label: "Dashboard" },
            { href: "/order", icon: PlusCircle, label: "Buat Pesanan" },
            { href: "/tracking", icon: Search, label: "Cek Status" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileSidebarOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium whitespace-nowrap",
                pathname === link.href
                  ? "bg-emerald-50 text-emerald-700 font-semibold shadow-sm ring-1 ring-emerald-100"
                  : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600",
                !isDesktopSidebarOpen && "md:justify-center md:px-2"
              )}
              title={link.label}
            >
              <link.icon size={20} className="flex-shrink-0" />
              <span className={clsx("transition-opacity", !isDesktopSidebarOpen && "md:hidden")}>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleLogoutClick}
            className={clsx(
              "w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium whitespace-nowrap",
              !isDesktopSidebarOpen && "md:justify-center md:px-2"
            )}
            title="Sign Out"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className={clsx("transition-opacity", !isDesktopSidebarOpen && "md:hidden")}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className={clsx("flex-1 flex flex-col transition-all duration-300", isDesktopSidebarOpen ? "md:ml-64" : "md:ml-20")}>
        {/* ===== NAVBAR ===== */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 md:px-8 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
            >
              <Menu size={24} />
            </button>
            <button
              onClick={() => setDesktopSidebarOpen(!isDesktopSidebarOpen)}
              className="hidden md:block p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="font-bold text-xl text-slate-800 hidden sm:block">
              Dashboard Pelanggan
            </h1>
            <h1 className="font-bold text-lg text-slate-800 sm:hidden">
              Clean Route
            </h1>
          </div>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-100"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md ring-2 ring-white">
                {user ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-slate-700">{user ? user.name : "User"}</p>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Pelanggan</p>
              </div>
            </button>

            <AnimatePresence>
              {openProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden origin-top-right z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-700">{user ? user.name : "User"}</p>
                    <p className="text-xs text-slate-400 truncate">{user ? user.email : "Pelanggan"}</p>
                  </div>

                  <Link
                    href="/users/settings"
                    onClick={() => setOpenProfile(false)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <User size={16} />
                    Settings Akun
                  </Link>

                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
