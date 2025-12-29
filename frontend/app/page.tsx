"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, Truck, Clock, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-gradient-to-b from-emerald-50/50 to-white">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[100px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-[80px] -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 border border-emerald-200 text-emerald-700 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Layanan Laundry #1 di Wayhalim
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Laundry Bersih <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                Tanpa Ribet
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg">
              Kami jemput, cuci, dan antar kembali pakaian Anda dalam kondisi
              sempurna. Fokus pada hal penting, biarkan kami yang urus cucian.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/order"
                className="group relative px-8 py-4 bg-gray-900 text-white font-bold rounded-full overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Pesan Sekarang <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <Link
                href="/tracking"
                className="px-8 py-4 bg-white text-gray-700 font-bold rounded-full border border-gray-200 hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm hover:shadow-md"
              >
                Cek Status
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 text-gray-500 text-sm font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" /> 10k+ Pelanggan
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" /> Garansi Wangi
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-white rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
              <img
                src="/img/laundry.jpg"
                alt="Laundry App"
                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 text-white">
                <div className="font-bold text-2xl">Premium Quality</div>
                <div className="text-gray-200">Teknologi cuci modern & ramah lingkungan</div>
              </div>
            </div>

            {/* Floating Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs hidden md:block"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Truck size={24} />
                </div>
                <div>
                  <div className="font-bold text-gray-800">Gratis Jemput!</div>
                  <div className="text-xs text-gray-500">Antar jemput area Jabodetabek</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Kenapa Clean Route?</h2>
            <p className="text-gray-600">Kami memberikan standar baru dalam dunia laundry dengan mengutamakan kualitas, kecepatan, dan kenyamanan Anda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck size={32} />,
                title: "Antar Jemput Gratis",
                desc: "Hemat waktu Anda. Kami jemput pakaian kotor dan antar kembali saat bersih."
              },
              {
                icon: <Clock size={32} />,
                title: "Tepat Waktu",
                desc: "Proses pencucian terjadwal dan selesai sesuai estimasi yang kami berikan."
              },
              {
                icon: <Shield size={32} />,
                title: "Higienis & Aman",
                desc: "Setiap pakaian dicuci terpisah (1 mesin 1 pelanggan) dengan deterjen premium."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl border border-gray-100 transition-all group"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
