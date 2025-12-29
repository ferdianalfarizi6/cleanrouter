"use client";

import { useState } from "react";
import { orders as initialOrders } from "@/app/data/orders";

type StatusPesanan =
  | "Penjemputan"
  | "Dicuci"
  | "Diproses"
  | "Siap Diantar"
  | "Selesai";

const statusFlow: StatusPesanan[] = [
  "Penjemputan",
  "Dicuci",
  "Diproses",
  "Siap Diantar",
  "Selesai",
];

const formatRupiah = (value: number) =>
  "Rp " + value.toLocaleString("id-ID");

export default function OrdersPage() {
  // ⬇️ state lokal agar status bisa diubah
  const [orders, setOrders] = useState(initialOrders);

  const nextStatus = (current: StatusPesanan): StatusPesanan => {
    const idx = statusFlow.indexOf(current);
    return idx < statusFlow.length - 1
      ? statusFlow[idx + 1]
      : current;
  };

  const handleNextStatus = (id: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status: nextStatus(o.status) }
          : o
      )
    );
  };

  return (
    <div className="container">
      <h1>Daftar Order</h1>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Paket</th>
              <th>Total</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.nama}</td>
                <td>{order.paket}</td>
                <td>{formatRupiah(order.total)}</td>
                <td>
                  <span className={`status ${order.status.replace(" ", "-")}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-primary"
                    onClick={() => handleNextStatus(order.id)}
                    disabled={order.status === "Selesai"}
                  >
                    {order.status === "Selesai"
                      ? "Selesai"
                      : "Next Status"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .container {
          padding: 24px;
          background: #f1f5f9;
          min-height: 100vh;
        }
        h1 {
          color: #0d9488;
          margin-bottom: 16px;
        }
        .card {
          background: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        .btn-primary {
          background: #0d9488;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .status {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
