"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import EditOrderModal from "@/app/components/EditOrderModal";
import {
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ShoppingBag,
  TrendingUp,
  Trash2,
  Edit2
} from "lucide-react";
import clsx from "clsx";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

type Order = {
  id: number;
  serviceType: string;
  weight: number | null;
  totalPrice: number;
  status: string;
  isPaid: boolean;
  createdAt: string;
};

export default function UserHomePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const data = await apiFetch("/api/order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err: any) {
      console.error("Gagal ambil data", err);
      if (err.message && err.message.includes("Unauthorized")) {
        // Token expired or invalid
        localStorage.removeItem("token");
        window.location.href = "/auth/loginuser";
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;

    try {
      const token = localStorage.getItem("token");
      await apiFetch(`/api/order/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh order
      fetchOrders();
    } catch (err: any) {
      alert(err.message || "Gagal membatalkan pesanan");
    }
  };

  const pesananAktif = orders.filter(order => order.status !== "COMPLETED" && order.status !== "READY");
  const pesananSelesai = orders.filter(order => order.status === "COMPLETED" || order.status === "READY");
  // Only sum PAID orders
  const totalSpending = orders
    .filter(order => order.isPaid)
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 px-6 pt-24 pb-12 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Selamat Datang 👋
          </h1>
          <p className="text-slate-500 mt-1">Pantau status laundry Anda di sini.</p>
        </div>

        <Link
          href="/order"
          className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-500/40 transition-all hover:-translate-y-1 active:translate-y-0"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>Buat Pesanan Baru</span>
        </Link>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Pesanan"
          value={orders.length}
          icon={<ShoppingBag size={24} className="text-blue-600" />}
          bg="bg-blue-50"
          footer="Sepanjang waktu"
        />
        <StatsCard
          title="Pesanan Aktif"
          value={pesananAktif.length}
          icon={<Clock size={24} className="text-orange-600" />}
          bg="bg-orange-50"
          footer="Sedang diproses"
        />
        <StatsCard
          title="Pesanan Selesai"
          value={pesananSelesai.length}
          icon={<CheckCircle size={24} className="text-emerald-600" />}
          bg="bg-emerald-50"
          footer="Siap diambil / diantar"
        />
        <StatsCard
          title="Total Pengeluaran"
          value={`Rp ${(totalSpending / 1000).toFixed(0)}k`}
          icon={<TrendingUp size={24} className="text-purple-600" />}
          bg="bg-purple-50"
          footer="Estimasi biaya"
        />
      </div>

      {/* List Pesanan */}
      <motion.div variants={item} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-emerald-500" size={20} />
            Pesanan Terbaru
          </h2>
          <Link href="/tracking" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
            Lihat Semua
          </Link>
        </div>

        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Package size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="font-medium">Belum ada pesanan</p>
              <p className="text-sm">Yuk buat pesanan pertamamu!</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID Pesanan</th>
                  <th className="px-6 py-4">Paket Layanan</th>
                  <th className="px-6 py-4">Berat (Est)</th>
                  <th className="px-6 py-4">Total Biaya</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">#{order.id}</td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "px-2.5 py-1 rounded-lg text-xs font-bold",
                        order.serviceType === "EXPRESS"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      )}>
                        {order.serviceType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{order.weight ?? "-"} Kg</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      Rp {order.totalPrice.toLocaleString("id-ID")}
                      {order.isPaid ? (
                        <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Lunas</span>
                      ) : (
                        <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Belum Bayar</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {!order.isPaid && order.status === 'CREATED' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                            title="Edit Pesanan"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Batalkan Pesanan"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs italic">
                          {order.isPaid ? "Paid" : "Locked"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Edit Modal */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSuccess={() => {
            setEditingOrder(null);
            fetchOrders();
          }}
        />
      )}

    </motion.div>
  );
}

function StatsCard({ title, value, icon, bg, footer }: { title: string; value: string | number; icon: React.ReactNode; bg: string; footer: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500`}>
        {icon}
      </div>

      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${bg}`}>
          {icon}
        </div>
      </div>
      <div className="text-xs text-slate-400 font-medium bg-slate-50 inline-block px-2 py-1 rounded-lg">
        {footer}
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    CREATED: "bg-gray-100 text-gray-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PICKUP: "bg-amber-100 text-amber-700",
    WASHING: "bg-cyan-100 text-cyan-700",
    DRYING: "bg-orange-100 text-orange-700",
    IRONING: "bg-purple-100 text-purple-700",
    READY: "bg-emerald-100 text-emerald-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
  };

  const statusClass = styles[status] || "bg-gray-100 text-gray-700";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${statusClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
      {status}
    </span>
  );
}
