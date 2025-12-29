"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white p-4 shadow min-h-screen">
      <h2 className="mb-6 font-semibold text-lg">Menu</h2>

      <ul className="space-y-2 text-sm">
        <li>
          <Link
            href="/dashboard"
            className={`block p-2 rounded ${
              pathname === "/dashboard"
                ? "bg-teal-100 text-teal-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            href="/orders"
            className={`block p-2 rounded ${
              pathname === "/orders"
                ? "bg-teal-100 text-teal-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            Orders
          </Link>
        </li>

        <li>
          <Link
            href="/karyawan"
            className={`block p-2 rounded ${
              pathname === "/karyawan"
                ? "bg-teal-100 text-teal-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            Karyawan
          </Link>
        </li>

        <li>
          <Link
            href="/paket"
            className={`block p-2 rounded ${
              pathname === "/paket"
                ? "bg-teal-100 text-teal-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            Paket
          </Link>
        </li>
      </ul>
    </aside>
  );
}
