"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();
    if (pathname.startsWith("/users") || pathname.startsWith("/admin")) return null;

    return (
        <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white font-bold text-xl">
                            <span className="bg-emerald-500 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm">CR</span>
                            Clean Route
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Solusi laundry profesional dengan layanan jemput antar premium.
                            Kami merawat pakaian Anda dengan standar kebersihan tertinggi.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Layanan</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/order" className="hover:text-emerald-400 transition-colors">Cuci Komplit</Link></li>
                            <li><Link href="/order" className="hover:text-emerald-400 transition-colors">Cuci Kering</Link></li>
                            <li><Link href="/order" className="hover:text-emerald-400 transition-colors">Setrika</Link></li>
                            <li><Link href="/pricing" className="hover:text-emerald-400 transition-colors">Daftar Harga</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Kontak Kami</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                <span>Jln. Kebahagiaan No. 123,<br />Jakarta Selatan, 12345</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-emerald-500 shrink-0" />
                                <span>+62 812-3456-7890</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-emerald-500 shrink-0" />
                                <span>support@cleanroute.id</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Ikuti Kami</h3>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-16 pt-8 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© 2025 Clean Route Laundry. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
