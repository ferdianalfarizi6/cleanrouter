"use client";

import { useEffect, useState } from "react";
import { DollarSign, Package, Truck, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import clsx from "clsx";

export default function AdminDashboardIndex() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            // API Fetch handles non-200 by throwing, so we catch it.
            const json = await apiFetch("/api/admin/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setData(json);
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || "Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
        </div>
    );

    if (!data) return (
        <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100 text-red-600">
            <p className="font-bold">Gagal memuat data dashboard.</p>
            <p className="text-sm mt-2 font-mono bg-red-100/50 p-2 rounded inline-block">{errorMsg}</p>
            <p className="text-sm mt-2 opacity-80">Pastikan server backend berjalan dan Anda memiliki akses admin.</p>
            <button onClick={fetchDashboard} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                Coba Lagi
            </button>
        </div>
    );

    const { summary, activeOrders } = data;

    const stats = [
        {
            title: "Pesanan Masuk",
            value: summary.pesananMasuk,
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100"
        },
        {
            title: "Sedang Diproses",
            value: summary.sedangDiproses,
            icon: Clock,
            color: "text-orange-600",
            bg: "bg-orange-50",
            border: "border-orange-100"
        },
        {
            title: "Siap Diantar",
            value: summary.siapDiantar,
            icon: Truck,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100"
        },
        {
            title: "Total Pendapatan",
            value: `Rp ${summary.totalPendapatan.toLocaleString("id-ID")}`,
            icon: DollarSign,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            border: "border-indigo-100"
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className={`p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            {/* <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                <ArrowUpRight size={12} className="mr-1" />
                                +12%
                            </span> */}
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
                            <h4 className="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</h4>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Pesanan Aktif Terbaru</h3>
                        <p className="text-slate-500 text-sm mt-1">Daftar pesanan yang sedang berjalan</p>
                    </div>
                    <Link
                        href="/admin/dashboard/orders"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
                    >
                        Lihat Semua
                        <ArrowUpRight size={16} />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-slate-500 bg-slate-50/80 uppercase text-xs font-bold tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Pelanggan</th>
                                <th className="px-6 py-4">Layanan</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Waktu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {activeOrders.map((order: any, idx: number) => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-slate-700">#{order.id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{order.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${order.serviceType === 'EXPRESS' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                            {order.serviceType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-700">Rp {order.totalPrice.toLocaleString("id-ID")}</td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1.5",
                                            order.status === 'CREATED' && "bg-slate-100 text-slate-600",
                                            order.status === 'CONFIRMED' && "bg-blue-50 text-blue-600",
                                            (order.status === 'PICKUP' || order.status === 'PROCESSING' || order.status === 'WASHING' || order.status === 'DRYING' || order.status === 'IRONING') && "bg-orange-50 text-orange-600",
                                            (order.status === 'READY' || order.status === 'COMPLETED') && "bg-emerald-50 text-emerald-600"
                                        )}>
                                            <span className={clsx("w-1.5 h-1.5 rounded-full",
                                                order.status === 'CREATED' && "bg-slate-400",
                                                order.status === 'CONFIRMED' && "bg-blue-500",
                                                (order.status === 'PICKUP' || order.status === 'PROCESSING' || order.status === 'WASHING' || order.status === 'DRYING' || order.status === 'IRONING') && "bg-orange-500",
                                                (order.status === 'READY' || order.status === 'COMPLETED') && "bg-emerald-500"
                                            )} />
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                                    </td>
                                </tr>
                            ))}
                            {activeOrders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        <Package size={48} className="mx-auto mb-3 opacity-20" />
                                        <p>Belum ada pesanan aktif saat ini</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
