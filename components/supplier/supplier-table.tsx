"use client";

import React, { useState } from "react";
import { Plus, Edit, X, CheckCircle2, Trash } from "lucide-react";
import { useSupplierStore } from "@/stores/useSupplierStore";

export default function SupplierTable() {
  const store = useSupplierStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header Halaman & Tombol Aksi */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Data Pemasok
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar pihak pemasok komoditas pangan untuk kebutuhan gudang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Tambah Pemasok</span>
          </button>
        </div>

        {/* Modal Tambah Pemasok */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">
                  Tambah Pemasok Baru
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  triggerToast();
                  setIsModalOpen(false);
                }}
              >
                <div className="py-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nama Pemasok
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama pemasok"
                      className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nomor Telepon
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+62..."
                      className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Alamat Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alamat kantor / gudang pemasok"
                      className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notifikasi Toast */}
        {showToast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 transition-all animate-bounce-once">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-sm font-medium">
              Data berhasil disimpan!
            </span>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="p-1 -mr-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tabel Data Pemasok */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                <th className="py-3.5 px-4">Nama Pemasok</th>
                <th className="py-3.5 px-4">Alamat</th>
                <th className="py-3.5 px-4">No. Telepon</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {store.suppliers.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {row.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-xs">
                    {row.address}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-xs">{row.telp}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex gap-1.5">
                      <button
                        onClick={() => store.updateSupplier!(row.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Ubah"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => store.updateSupplier!(row.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
