"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Clock, CheckCircle, Truck, Info } from "lucide-react";
import { apiFetch } from "@/lib/api";

type TrackingRecord = {
    id: number;
    status: string;
    timestamp: string;
    orderId: number;
    order?: {
        name: string;
        serviceType: string;
        totalPrice?: number;
        isPaid?: boolean;
    };
};

export default function TrackingPage() {
    const [orderQuery, setOrderQuery] = useState("");
    const [tracks, setTracks] = useState<TrackingRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Helper untuk Status Label & Icon
    const getStatusInfo = (status: string) => {
        switch (status.toUpperCase()) {
            case "CREATED": return { label: "Pesanan Dibuat", icon: <Package size={20} />, color: "bg-blue-500" };
            case "PICKUP": return { label: "Jemput Paket", icon: <Truck size={20} />, color: "bg-amber-500" };
            case "WASHING": return { label: "Sedang Dicuci", icon: <Clock size={20} />, color: "bg-cyan-500" };
            case "DRYING": return { label: "Sedang Dikeringkan", icon: <Clock size={20} />, color: "bg-orange-500" };
            case "IRONING": return { label: "Sedang Disetrika", icon: <Clock size={20} />, color: "bg-purple-500" };
            case "COMPLETED": return { label: "Selesai / Siap Antar", icon: <CheckCircle size={20} />, color: "bg-emerald-500" };
            default: return { label: status, icon: <Clock size={20} />, color: "bg-gray-500" };
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderQuery) return;

        setLoading(true);
        setSearched(true);
        setTracks([]);

        try {
            const data = await apiFetch(`/api/track?orderId=${orderQuery}`);

            if (data.tracks) {
                setTracks(data.tracks);
            } else {
                setTracks([]);
            }
        } catch (error) {
            console.error("Gagal mengambil data tracking", error);
            setTracks([]);
        } finally {
            setLoading(false);
        }
    };

    const latestTrack = tracks[0];
    const orderDetails = latestTrack?.order;
    // Show payment if status is NOT CREATED and NOT PAID and PRICE > 0
    const showPayment = latestTrack &&
        latestTrack.status !== "CREATED" &&
        orderDetails &&
        !orderDetails.isPaid &&
        (orderDetails.totalPrice || 0) > 0;

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-gray-50">
            <div className="max-w-2xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-emerald-100/50 rounded-2xl mb-6 text-emerald-600">
                        <Search size={32} />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Lacak Pesanan</h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Masukkan ID pesanan atau nomor resi Anda untuk mengetahui update terkini status laundry.
                    </p>
                </motion.div>

                {/* Search Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 mb-10 pl-6 pr-2 py-2 flex items-center gap-4"
                >
                    <input
                        type="number"
                        value={orderQuery}
                        onChange={(e) => setOrderQuery(e.target.value)}
                        placeholder="Masukkan Order ID (contoh: 12)..."
                        className="flex-1 bg-transparent border-none outline-none text-lg text-gray-800 placeholder:text-gray-400 font-medium"
                        required
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "..." : "Lacak"}
                    </button>
                </motion.div>

                {/* Result */}
                {searched && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {tracks.length > 0 ? (
                            <div className="space-y-6">
                                {/* Payment Card (If Not Paid) */}
                                {showPayment && (
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-white rounded-3xl shadow-xl border border-red-100 overflow-hidden"
                                    >
                                        <div className="bg-red-50 p-6 flex items-center gap-4 border-b border-red-100">
                                            <div className="bg-red-100 p-3 rounded-xl text-red-600">
                                                <Info size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-red-900">Menunggu Pembayaran</h3>
                                                <p className="text-red-600 text-sm">Selesaikan pembayaran untuk memproses pesanan.</p>
                                            </div>
                                        </div>
                                        <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                                            <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200">
                                                <img
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ORDER-${orderQuery}-PAY`}
                                                    alt="QR Code Pembayaran"
                                                    className="w-40 h-40 object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 text-center md:text-left space-y-4">
                                                <div>
                                                    <div className="text-gray-500 text-sm uppercase font-bold tracking-wider mb-1">Total Tagihan</div>
                                                    <div className="text-4xl font-bold text-gray-900">
                                                        Rp {(orderDetails?.totalPrice || 0).toLocaleString("id-ID")}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                                                    Silakan scan QR Code di samping atau lakukan pembayaran ke kasir. Status akan berubah otomatis setelah dikonfirmasi admin.
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Tracking Card */}
                                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                                    <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                                        <div>
                                            <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Order ID</div>
                                            <div className="text-2xl font-mono font-bold">#{orderQuery}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Status Terkini</div>
                                            <div className="font-bold text-emerald-400">{getStatusInfo(tracks[0].status).label}</div>
                                        </div>
                                    </div>

                                    <div className="p-8 relative">
                                        {/* Vertical Line */}
                                        <div className="absolute left-12 top-8 bottom-8 w-0.5 bg-gray-100" />

                                        <div className="space-y-8 relative">
                                            {tracks.map((track, idx) => {
                                                const info = getStatusInfo(track.status);
                                                const isLatest = idx === 0;

                                                return (
                                                    <motion.div
                                                        key={track.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="flex gap-6 relative"
                                                    >
                                                        {/* Icon Dot */}
                                                        <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${isLatest ? info.color + " text-white scale-110" : "bg-gray-200 text-gray-400"}`}>
                                                            {info.icon}
                                                        </div>

                                                        {/* Content */}
                                                        <div className={`flex-1 pt-1 ${isLatest ? "text-gray-900" : "text-gray-500"}`}>
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2">
                                                                <h4 className={`font-bold text-lg ${isLatest ? "text-gray-900" : "text-gray-500"}`}>{info.label}</h4>
                                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
                                                                    {new Date(track.timestamp).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            {isLatest && <p className="text-sm text-gray-500">Status pesanan Anda telah diperbarui.</p>}
                                                        </div>
                                                    </motion.div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
                                <div className="text-6xl mb-4 opacity-20">📦</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Tidak Ditemukan</h3>
                                <p className="text-gray-500">Maaf, kami tidak menemukan pesanan dengan ID #{orderQuery}.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
