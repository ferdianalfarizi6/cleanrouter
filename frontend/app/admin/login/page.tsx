"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck, Lock, User, Loader2 } from "lucide-react";
import clsx from "clsx";
import { apiFetch } from "@/lib/api";

export default function AdminLoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await apiFetch("/api/admin/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });

            // Simpan token dengan key yang BENAR
            localStorage.setItem("adminToken", data.token);
            router.push("/admin/dashboard");
        } catch (err: any) {
            setError(err.message || "Gagal masuk. Periksa kembali username dan password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 px-6 relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/20 rounded-full blur-[120px]" />

            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm relative z-10 border border-slate-100">

                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 shadow-inner">
                    <ShieldCheck size={32} />
                </div>

                <h1 className="text-2xl font-bold text-center mb-2 text-slate-900">
                    Admin Portal
                </h1>
                <p className="text-center text-slate-500 mb-8 text-sm">
                    Masuk untuk mengelola sistem
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 flex items-center gap-2 border border-red-100 animate-pulse font-medium">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-600" /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:text-slate-300 text-slate-800"
                                placeholder="Username Admin"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:text-slate-300 text-slate-800"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={clsx(
                            "w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 mt-4 flex items-center justify-center gap-2",
                            loading ? "bg-slate-400 cursor-not-allowed shadow-none" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30"
                        )}
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? "Memproses..." : "Masuk Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
}
