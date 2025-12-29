"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Users, LogOut, Settings, ShieldCheck, Menu, X, ChevronRight, Box } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import LogoutModal from "../../components/LogoutModal";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isDesktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
        }
    }, [router]);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
        setMobileSidebarOpen(false);
    };

    const confirmLogout = () => {
        localStorage.removeItem("adminToken");
        setShowLogoutConfirm(false);
        router.push("/admin/login");
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">

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

            {/* SIDEBAR */}
            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-40 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out shadow-2xl border-r border-slate-800",
                    isMobileSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0",
                    isDesktopSidebarOpen ? "md:w-72" : "md:w-20"
                )}
            >
                <div className={clsx("p-6 flex items-center gap-3 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm", !isDesktopSidebarOpen && "md:justify-center md:px-2")}>
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
                            <ShieldCheck size={22} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
                    </div>
                    <div className={clsx("transition-opacity duration-300", !isDesktopSidebarOpen && "md:hidden md:opacity-0")}>
                        <h1 className="font-bold text-lg text-white leading-tight">Admin Portal</h1>
                        <p className="text-[11px] font-medium text-emerald-500 uppercase tracking-widest">Clean Route</p>
                    </div>
                    <button
                        onClick={() => setMobileSidebarOpen(false)}
                        className="md:hidden ml-auto text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
                    {/* Navigation Groups */}
                    <div className="space-y-2">
                        <p className={clsx("px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 transition-opacity", !isDesktopSidebarOpen && "md:hidden")}>Utama</p>

                        <Link
                            href="/admin/dashboard"
                            onClick={() => setMobileSidebarOpen(false)}
                            className={clsx(
                                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium border border-transparent relative overflow-hidden",
                                pathname === "/admin/dashboard"
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                                !isDesktopSidebarOpen && "md:justify-center md:px-2"
                            )}
                            title="Dashboard"
                        >
                            <LayoutDashboard size={20} className={clsx("flex-shrink-0", pathname === "/admin/dashboard" ? "text-white" : "text-slate-500 group-hover:text-white transition-colors")} />
                            <span className={clsx("relative z-10 transition-opacity", !isDesktopSidebarOpen && "md:hidden")}>Dashboard</span>
                            {pathname === "/admin/dashboard" && isDesktopSidebarOpen && <ChevronRight size={16} className="ml-auto opacity-70" />}
                        </Link>

                        <Link
                            href="/admin/dashboard/orders"
                            onClick={() => setMobileSidebarOpen(false)}
                            className={clsx(
                                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium border border-transparent relative overflow-hidden",
                                pathname.startsWith("/admin/dashboard/orders")
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                                !isDesktopSidebarOpen && "md:justify-center md:px-2"
                            )}
                            title="Pesanan"
                        >
                            <Package size={20} className={clsx("flex-shrink-0", pathname.startsWith("/admin/dashboard/orders") ? "text-white" : "text-slate-500 group-hover:text-white transition-colors")} />
                            <span className={clsx("relative z-10 transition-opacity", !isDesktopSidebarOpen && "md:hidden")}>Pesanan</span>
                            {pathname.startsWith("/admin/dashboard/orders") && isDesktopSidebarOpen && <ChevronRight size={16} className="ml-auto opacity-70" />}
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <p className={clsx("px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 transition-opacity", !isDesktopSidebarOpen && "md:hidden")}>Manajemen</p>

                        <Link
                            href="/admin/dashboard/packages"
                            onClick={() => setMobileSidebarOpen(false)}
                            className={clsx(
                                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium border border-transparent relative overflow-hidden",
                                pathname.startsWith("/admin/dashboard/packages")
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                                !isDesktopSidebarOpen && "md:justify-center md:px-2"
                            )}
                            title="Paket Layanan"
                        >
                            <Box size={20} className={clsx("flex-shrink-0", pathname.startsWith("/admin/dashboard/packages") ? "text-white" : "text-slate-500 group-hover:text-white transition-colors")} />
                            <span className={clsx("relative z-10 transition-opacity", !isDesktopSidebarOpen && "md:hidden")}>Paket Layanan</span>
                            {pathname.startsWith("/admin/dashboard/packages") && isDesktopSidebarOpen && <ChevronRight size={16} className="ml-auto opacity-70" />}
                        </Link>

                        <Link
                            href="/admin/dashboard/customers"
                            onClick={() => setMobileSidebarOpen(false)}
                            className={clsx(
                                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium border border-transparent relative overflow-hidden",
                                pathname.startsWith("/admin/dashboard/customers")
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                                !isDesktopSidebarOpen && "md:justify-center md:px-2"
                            )}
                            title="Pelanggan"
                        >
                            <Users size={20} className={clsx("flex-shrink-0", pathname.startsWith("/admin/dashboard/customers") ? "text-white" : "text-slate-500 group-hover:text-white transition-colors")} />
                            <span className={clsx("relative z-10 transition-opacity", !isDesktopSidebarOpen && "md:hidden")}>Pelanggan</span>
                            {pathname.startsWith("/admin/dashboard/customers") && isDesktopSidebarOpen && <ChevronRight size={16} className="ml-auto opacity-70" />}
                        </Link>

                        <Link
                            href="/admin/dashboard/settings"
                            onClick={() => setMobileSidebarOpen(false)}
                            className={clsx(
                                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium border border-transparent relative overflow-hidden",
                                pathname.startsWith("/admin/dashboard/settings")
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                                !isDesktopSidebarOpen && "md:justify-center md:px-2"
                            )}
                            title="Pengaturan"
                        >
                            <Settings size={20} className={clsx("flex-shrink-0", pathname.startsWith("/admin/dashboard/settings") ? "text-white" : "text-slate-500 group-hover:text-white transition-colors")} />
                            <span className={clsx("relative z-10 transition-opacity", !isDesktopSidebarOpen && "md:hidden")}>Pengaturan</span>
                            {pathname.startsWith("/admin/dashboard/settings") && isDesktopSidebarOpen && <ChevronRight size={16} className="ml-auto opacity-70" />}
                        </Link>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-800/50 bg-slate-900/30">
                    <button
                        onClick={handleLogoutClick}
                        className={clsx(
                            "flex items-center gap-3 px-4 py-3.5 w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-medium group",
                            !isDesktopSidebarOpen && "md:justify-center md:px-2"
                        )}
                        title="Keluar Sistem"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform flex-shrink-0" />
                        <span className={clsx("transition-opacity", !isDesktopSidebarOpen && "md:hidden")}>Keluar Sistem</span>
                    </button>
                </div>
            </aside>

            {/* CONTENT AREA */}
            <div className={clsx("flex-1 flex flex-col transition-all duration-300", isDesktopSidebarOpen ? "md:ml-72" : "md:ml-20")}>
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-6 md:px-8 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
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
                        <h2 className="font-bold text-slate-800 text-lg md:text-xl">
                            {pathname === '/admin/dashboard' ? 'Ringkasan Bisnis' :
                                pathname.includes('/orders') ? 'Kelola Pesanan' : 'Admin Area'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-slate-800">Super Admin</div>
                                <div className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-emerald-100">
                                    VERIFIED
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-md ring-4 ring-slate-100">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
