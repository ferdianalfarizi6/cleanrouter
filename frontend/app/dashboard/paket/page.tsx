"use client";

import { useState, FormEvent } from "react";

interface Paket {
  id: number;
  nama: string;
  harga: number;
}

interface FormPaket {
  nama: string;
  harga: string; // ⬅️ PENTING: string, bukan number
}

export default function Page() {
  const [data, setData] = useState<Paket[]>([
    { id: 1, nama: "Cuci Kering", harga: 5000 },
    { id: 2, nama: "Cuci Setrika", harga: 7000 },
  ]);

  const [form, setForm] = useState<FormPaket>({
    nama: "",
    harga: "",
  });

  const [editId, setEditId] = useState<number | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const hargaNumber = Number(form.harga);

    if (isNaN(hargaNumber) || hargaNumber <= 0) {
      alert("Harga tidak valid");
      return;
    }

    if (editId) {
      setData(
        data.map((item) =>
          item.id === editId
            ? { id: editId, nama: form.nama, harga: hargaNumber }
            : item
        )
      );
      setEditId(null);
    } else {
      setData([
        ...data,
        {
          id: Date.now(),
          nama: form.nama,
          harga: hargaNumber,
        },
      ]);
    }

    // reset form
    setForm({ nama: "", harga: "" });
  };

  const handleEdit = (item: Paket) => {
    setForm({
      nama: item.nama,
      harga: item.harga.toString(),
    });
    setEditId(item.id);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin hapus paket?")) {
      setData(data.filter((item) => item.id !== id));
    }
  };

  const formatRupiah = (value: number) =>
    "Rp " + value.toLocaleString("id-ID");

  return (
    <>
      <div className="container">
        <h1>Manajemen Paket</h1>

        <form onSubmit={handleSubmit} className="card form">
          <input
            placeholder="Nama Paket"
            value={form.nama}
            onChange={(e) =>
              setForm({ ...form, nama: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Harga"
            value={form.harga}
            onChange={(e) =>
              setForm({
                ...form,
                harga: e.target.value.replace(/\D/g, ""),
              })
            }
            required
          />

          <button className="btn-primary">
            {editId ? "Update" : "Tambah"}
          </button>
        </form>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Nama Paket</th>
                <th>Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.nama}</td>
                  <td>{formatRupiah(item.harga)}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={3} align="center">
                    Data paket kosong
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .container {
          padding: 24px;
          background: #f1f5f9;
          min-height: 100vh;
        }

        h1 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #0d9488;
        }

        .card {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          margin-bottom: 20px;
        }

        .form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }

        input {
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
        }

        input:focus {
          outline: none;
          border-color: #0d9488;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #0d9488;
          color: white;
        }

        th,
        td {
          padding: 12px;
          font-size: 14px;
        }

        .btn-primary {
          background: #0d9488;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 6px;
        }

        .btn-edit {
          background: #f59e0b;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 4px;
          margin-right: 6px;
        }

        .btn-delete {
          background: #dc2626;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
}
