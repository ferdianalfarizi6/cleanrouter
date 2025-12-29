"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface EditOrderModalProps {
    order: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditOrderModal({ order, onClose, onSuccess }: EditOrderModalProps) {
    const [packages, setPackages] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: order.name, // Usually user cannot change name if it's from profile, but logic is loose for now
        phone: order.phone,
        address: order.address,
        packageId: "",
        weight: order.weight || 0,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch packages
        apiFetch("/api/packages")
            .then(data => {
                setPackages(data);
                // Try to match current service type to a package
                // We try to find a package that matches the order's service type AND price if possible, 
                // OR just match by serviceType.
                const match = data.find((p: any) => p.serviceType === order.serviceType);
                if (match) {
                    setFormData(prev => ({ ...prev, packageId: match.id }));
                }
            })
            .catch(console.error);
    }, [order.serviceType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await apiFetch(`/api/order/${order.id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData),
            });
            onSuccess();
        } catch (err: any) {
            alert(err.message || "Gagal update order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg text-slate-800">Edit Pesanan #{order.id}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors"><X size={20} className="text-slate-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">No Handphone</label>
                        <input
                            className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="No HP"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Alamat Penjemputan</label>
                        <textarea
                            className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Alamat Lengkap"
                            rows={2}
                            required
                        />
                    </div>

                    {/* Package Select */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Paket Layanan</label>
                        <div className="relative">
                            <select
                                className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-100 outline-none transition-all appearance-none bg-white"
                                value={formData.packageId}
                                onChange={e => setFormData({ ...formData, packageId: e.target.value })}
                                required
                            >
                                <option value="">Pilih Paket</option>
                                {packages.map((p: any) => (
                                    <option key={p.id} value={p.id}>
                                        {p.label} (Rp {p.price.toLocaleString("id-ID")}/kg)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Weight */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Perkiraan Berat (Kg)</label>
                        <input
                            type="number"
                            min="1"
                            step="0.1"
                            className="w-full border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                            value={formData.weight}
                            onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
