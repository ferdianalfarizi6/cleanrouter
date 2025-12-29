"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Box, Search, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import clsx from "clsx";

export default function PackagesPage() {
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLabel, setNewLabel] = useState("");
    const [newServiceType, setNewServiceType] = useState("REGULER");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const data = await apiFetch("/api/admin/packages", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPackages(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Gagal memuat paket");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus paket ini?")) return;

        try {
            const token = localStorage.getItem("adminToken");
            await apiFetch(`/api/admin/packages/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPackages();
        } catch (err: any) {
            alert(err.message || "Gagal menghapus paket");
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem("adminToken");
            await apiFetch("/api/admin/packages", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    label: newLabel,
                    serviceType: newServiceType
                })
            });

            setIsModalOpen(false);
            setNewLabel("");
            setNewServiceType("REGULER");
            fetchPackages();
        } catch (err: any) {
            alert(err.message || "Gagal membuat paket");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Manajemen Paket</h2>
                    <p className="text-sm text-slate-500">Kelola jenis layanan laundry</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Plus size={20} />
                    Tambah Paket
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
                    ))
                ) : packages.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-slate-400">
                        <Box size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Belum ada paket tersedia</p>
                    </div>
                ) : (
                    packages.map((pkg) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group hover:shadow-md transition-all"
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(pkg.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 mb-3">
                                <div className={clsx(
                                    "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm",
                                    pkg.serviceType === "EXPRESS" ? "bg-purple-500" : "bg-blue-500"
                                )}>
                                    <Box size={20} />
                                </div>
                                <div>
                                    <span className={clsx(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                        pkg.serviceType === "EXPRESS" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                    )}>
                                        {pkg.serviceType}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-800">{pkg.label}</h3>
                            <p className="text-xs text-slate-400 mt-2">ID: {pkg.id}</p>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Tambah Paket Baru</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                    <Plus size={24} className="rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Paket</label>
                                    <input
                                        type="text"
                                        value={newLabel}
                                        onChange={(e) => setNewLabel(e.target.value)}
                                        placeholder="Contoh: Cuci Kering + Setrika"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tipe Layanan</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setNewServiceType("REGULER")}
                                            className={clsx(
                                                "py-3 rounded-xl border font-medium transition-all",
                                                newServiceType === "REGULER"
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                                            )}
                                        >
                                            Regular
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewServiceType("EXPRESS")}
                                            className={clsx(
                                                "py-3 rounded-xl border font-medium transition-all",
                                                newServiceType === "EXPRESS"
                                                    ? "border-purple-500 bg-purple-50 text-purple-700"
                                                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                                            )}
                                        >
                                            Express
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 mt-4"
                                >
                                    {submitting ? <Loader2 size={20} className="animate-spin" /> : "Simpan Paket"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
