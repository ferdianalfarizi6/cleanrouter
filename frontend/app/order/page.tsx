"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Truck, Scale, DollarSign, MapPin, Phone, User, Package } from "lucide-react";
import clsx from "clsx";
import { apiFetch } from "@/lib/api";

// Konfigurasi Harga
const PRICES = {
    REGULER: 7000,
    EXPRESS: 12000,
};

export default function OrderPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    const [packages, setPackages] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        packageId: "",
        serviceType: "REGULER",
        label: "-",
        price: 0,
        weight: "",
    });

    // Load available packages
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                // Use generic fetch which points to backend
                const res = await apiFetch("/api/packages", { method: "GET" });
                setPackages(res);
                // Set default if available
                if (res.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        packageId: res[0].id,
                        serviceType: res[0].serviceType,
                        label: res[0].label,
                        price: res[0].price || 0
                    }));
                }
            } catch (e) {
                console.error("Failed to load packages", e);
            }
        };
        fetchPackages();
    }, []);

    // Calculate Price
    const weightNum = parseFloat(formData.weight) || 0;
    const pricePerKg = formData.price;
    const estimatedTotal = weightNum * pricePerKg;

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/loginuser");
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle special case for package selection
    const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const pkgId = e.target.value;
        const pkg = packages.find(p => p.id === pkgId);
        if (pkg) {
            setFormData({
                ...formData,
                packageId: pkg.id,
                serviceType: pkg.serviceType,
                label: pkg.label,
                price: pkg.price || 0
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/loginuser");
            return;
        }

        try {
            const payload = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                packageId: formData.packageId,
                weight: weightNum,
            };

            await apiFetch("/api/order", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            router.push("/users");
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-gray-50/50">
            <div className="max-w-4xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Buat Pesanan Laundry</h1>
                    <p className="text-gray-500">Isi detail pesanan Anda, kami akan segera menjemputnya.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
                    >
                        {error && (
                            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-2 border border-red-100">
                                <span className="p-1 bg-red-100 rounded-full">!</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <User size={16} className="text-emerald-500" /> Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition outline-none"
                                        placeholder="Nama penerima"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Phone size={16} className="text-emerald-500" /> WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition outline-none"
                                        placeholder="0812..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <MapPin size={16} className="text-emerald-500" /> Alamat Penjemputan
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition outline-none resize-none"
                                    placeholder="Nama jalan, nomor rumah, patokan..."
                                />
                            </div>

                            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Package size={20} className="text-emerald-600" /> Detail Layanan
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Pilih Paket</label>
                                        <div className="relative">
                                            {packages.length > 0 ? (
                                                <select
                                                    onChange={handlePackageChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition outline-none appearance-none cursor-pointer"
                                                >
                                                    {packages.map((pkg) => (
                                                        <option key={pkg.id} value={pkg.id}>
                                                            {pkg.label} ({pkg.serviceType})
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-400 border border-gray-200 text-sm">
                                                    Memuat paket... (atau tidak ada paket)
                                                </div>
                                            )}
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <Scale size={16} className="text-emerald-500" /> Perkiraan Berat (Kg)
                                        </label>
                                        <input
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleChange}
                                            required
                                            min="1"
                                            step="0.1"
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition outline-none"
                                            placeholder="Min. 1"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={clsx(
                                    "w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-1",
                                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                                )}
                            >
                                {loading ? "Memproses..." : "Buat Pesanan Sekarang"}
                            </button>
                        </form>
                    </motion.div>

                    {/* Summary Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-1"
                    >
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
                            <h3 className="font-bold text-gray-900 text-lg mb-6 border-b pb-4">Ringkasan Pesanan</h3>

                            <div className="space-y-4 text-sm text-gray-600 mb-6">
                                <div className="flex justify-between">
                                    <span>Layanan</span>
                                    <span className="font-semibold text-gray-900">{formData.label}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tipe</span>
                                    <span className="font-semibold text-gray-900">{formData.serviceType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Harga / Kg</span>
                                    <span className="font-semibold text-gray-900">Rp {pricePerKg.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Berat</span>
                                    <span className="font-semibold text-gray-900">{weightNum} Kg</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-2xl text-white">
                                <div className="text-xs opacity-90 mb-1">Total Estimasi</div>
                                <div className="text-3xl font-bold flex items-start gap-1">
                                    <span className="text-lg mt-1">Rp</span>
                                    {estimatedTotal.toLocaleString("id-ID")}
                                </div>
                            </div>

                            <div className="mt-4 flex items-start gap-2 text-xs text-gray-400 bg-gray-50 p-3 rounded-xl">
                                <div className="mt-0.5 min-w-[16px]"><Truck size={14} /></div>
                                Harga belum termasuk ongkos kirim jika jarak &gt; 5km.
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
