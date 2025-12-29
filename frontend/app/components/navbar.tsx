"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import clsx from "clsx";
import LogoutModal from "./LogoutModal";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const checkScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", checkScroll);
        return () => window.removeEventListener("scroll", checkScroll);
    }, []);

    useEffect(() => {
        // Simple auth check
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, [pathname]); // Re-check on navigation

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
        setIsOpen(false);
    };

    const confirmLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setShowLogoutConfirm(false);
        router.push("/");
        router.refresh();
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Order", href: "/order" },
        { name: "Tracking", href: "/tracking" },
    ];

    const isDashboard = pathname.startsWith("/users") || pathname.startsWith("/admin");

    if (isDashboard) return null;

    return (
        <>
            <LogoutModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={confirmLogout}
            />

            <header
                className={clsx(
                    "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
                    isScrolled
                        ? "bg-white/80 backdrop-blur-md shadow-sm border-gray-200/50 py-3"
                        : "bg-transparent py-5"
                )}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl text-white font-bold shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-105">
                            CR
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity" />
                        </div>
                        <span className={clsx("font-bold text-xl tracking-tight transition-colors", isScrolled ? "text-gray-800" : "text-gray-800")}>
                            Clean Route
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx(
                                    "font-medium text-sm transition-colors relative",
                                    pathname === link.href
                                        ? "text-emerald-600"
                                        : "text-gray-600 hover:text-emerald-600"
                                )}
                            >
                                {link.name}
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-500 rounded-full"
                                    />
                                )}
                            </Link>
                        ))}

                        <div className="w-px h-6 bg-gray-200 mx-2" />

                        {isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/users"
                                    className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                                >
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogoutClick}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/auth/loginuser"
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-full shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
                            >
                                Sign In
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
                    >
                        <nav className="flex flex-col gap-6 text-lg font-medium">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={clsx(
                                            "block p-4 rounded-xl transition-colors",
                                            pathname === link.href
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="border-t pt-6 mt-2"
                            >
                                {isLoggedIn ? (
                                    <div className="flex flex-col gap-4">
                                        <Link
                                            href="/users"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 text-gray-800"
                                        >
                                            <LayoutDashboard size={20} />
                                            Dashboard User
                                        </Link>
                                        <button
                                            onClick={handleLogoutClick}
                                            className="flex items-center gap-3 p-4 rounded-xl text-red-500 hover:bg-red-50 w-full text-left"
                                        >
                                            <LogOut size={20} />
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/auth/loginuser"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full py-4 bg-emerald-600 text-white text-center rounded-xl font-bold shadow-lg shadow-emerald-500/30"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
