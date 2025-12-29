"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Save, Loader2, RefreshCcw } from "lucide-react";
import clsx from "clsx";
import { apiFetch } from "@/lib/api";

const STATUSES = [
    "CREATED",
    "CONFIRMED",
    "PICKUP",
    "WASHING",
    "DRYING",
    "IRONING",
    "READY",
    "COMPLETED"
];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [updating, setUpdating] = useState<number | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const data = await apiFetch("/api/admin/orders", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(data.orders);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        if (!confirm(`Ubah status order #${orderId} menjadi ${newStatus}?`)) return;

        setUpdating(orderId);
        try {
            const token = localStorage.getItem("adminToken");
            await apiFetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });

            // Update local state
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err: any) {
            alert(err.message || "Gagal update status");
            console.error(err);
        } finally {
            setUpdating(null);
        }
    };

    const handlePaymentChange = async (orderId: number, isPaid: boolean) => {
        if (!confirm(`Ubah status pembayaran order #${orderId} menjadi ${isPaid ? "LUNAS" : "BELUM BAYAR"}?`)) return;

        setUpdating(orderId);
        try {
            const token = localStorage.getItem("adminToken");
            await apiFetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({ isPaid })
            });

            // Update local state
            setOrders(orders.map(o => o.id === orderId ? { ...o, isPaid } : o));
        } catch (err: any) {
            alert(err.message || "Gagal update status pembayaran");
            console.error(err);
        } finally {
            setUpdating(null);
        }
    };

    const filteredOrders = orders.filter(o =>
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        String(o.id).includes(search)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Manajemen Pesanan</h2>
                    <p className="text-sm text-slate-500">Kelola semua pesanan pelanggan</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={fetchOrders}
                        className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                        title="Refresh Data"
                    >
                        <RefreshCcw size={18} />
                    </button>
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari ID atau Nama..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                        <Loader2 size={32} className="animate-spin text-emerald-500 mb-2" />
                        <p>Memuat data pesanan...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-xs font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Pelanggan</th>
                                    <th className="px-6 py-4">Layanan</th>
                                    <th className="px-6 py-4">Berat/Harga</th>
                                    <th className="px-6 py-4">Pembayaran</th>
                                    <th className="px-6 py-4">Status Saat Ini</th>
                                    <th className="px-6 py-4 text-center">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-slate-700">#{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{order.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{order.address}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "px-2.5 py-1 rounded-lg text-xs font-bold border",
                                                order.serviceType === 'EXPRESS'
                                                    ? 'bg-red-50 text-red-700 border-red-100'
                                                    : 'bg-blue-50 text-blue-700 border-blue-100'
                                            )}>
                                                {order.serviceType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">{order.weight ? `${order.weight} Kg` : '-'}</div>
                                            <div className="font-bold text-emerald-600 text-xs">Rp {order.totalPrice.toLocaleString("id-ID")}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handlePaymentChange(order.id, !order.isPaid)}
                                                disabled={updating === order.id}
                                                className={clsx(
                                                    "px-3 py-1 rounded-full text-xs font-bold border transition-all",
                                                    order.isPaid
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                                        : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                                )}
                                            >
                                                {order.isPaid ? "LUNAS" : "BELUM BAYAR"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5",
                                                order.status === 'CREATED' && "bg-slate-100 text-slate-600",
                                                order.status === 'CONFIRMED' && "bg-blue-50 text-blue-600",
                                                (order.status === 'PICKUP' || order.status === 'WASHING' || order.status === 'DRYING' || order.status === 'IRONING') && "bg-orange-50 text-orange-600",
                                                (order.status === 'READY' || order.status === 'COMPLETED') && "bg-emerald-50 text-emerald-600"
                                            )}>
                                                <span className={clsx("w-1.5 h-1.5 rounded-full",
                                                    order.status === 'CREATED' && "bg-slate-400",
                                                    order.status === 'CONFIRMED' && "bg-blue-500",
                                                    (order.status === 'PICKUP' || order.status === 'WASHING') && "bg-orange-500",
                                                    (order.status === 'READY' || order.status === 'COMPLETED') && "bg-emerald-500"
                                                )} />
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="relative group/select">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        disabled={updating === order.id}
                                                        className={clsx(
                                                            "appearance-none pl-3 pr-8 py-2 rounded-xl border text-xs font-bold cursor-pointer outline-none transition-all shadow-sm w-36",
                                                            "bg-white border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-700 focus:ring-2 focus:ring-emerald-100",
                                                            updating === order.id && "opacity-50 cursor-wait"
                                                        )}
                                                    >
                                                        {STATUSES.map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                    {updating === order.id ? (
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                            <Loader2 size={14} className="animate-spin text-emerald-600" />
                                                        </div>
                                                    ) : (
                                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                            Tidak ada pesanan yang ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
