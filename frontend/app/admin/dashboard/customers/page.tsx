"use client";

import { useEffect, useState } from "react";
import { Search, User, Mail, Calendar, Package } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";

export default function AdminCustomersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const data = await apiFetch("/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(data.users);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Data Pelanggan</h2>
                    <p className="text-sm text-slate-500">Total {users.length} pengguna terdaftar</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari Nama atau Email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 h-40 animate-pulse" />
                    ))
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user, i) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="bg-slate-50 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                    ID: #{user.id}
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-slate-800 mb-1">{user.name}</h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Mail size={16} />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Calendar size={16} />
                                    <span>{new Date(user.createdAt).toLocaleDateString("id-ID")}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase">Total Pesanan</span>
                                <div className="flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                    <Package size={16} />
                                    {user._count.orders}
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-slate-400">
                        <User size={48} className="mx-auto mb-3 opacity-20" />
                        <p>Tidak ada data pelanggan ditemukan</p>
                    </div>
                )}
            </div>
        </div>
    );
}
