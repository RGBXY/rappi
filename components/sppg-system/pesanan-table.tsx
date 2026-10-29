"use client";

import React, { useState } from "react";
import { useSppgSystemStore, SppgOrderItem } from "@/stores/useSppgSystemStore";
import { Eye, X, CheckCircle2 } from "lucide-react";

export default function PesananTable() {
  const store = useSppgSystemStore();
  const [selectedOrder, setSelectedOrder] = useState<SppgOrderItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Data berhasil disimpan!");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Data Pesanan Pangan
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar pesanan bahan pangan yang diajukan pihak SPPG ke Koperasi mitra penyedia.
          </p>
        </div>
      </div>

      {/* Tabel Data Pesanan */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                <th className="py-3.5 px-4">ID Pesanan</th>
                <th className="py-3.5 px-4">Koperasi Tujuan</th>
                <th className="py-3.5 px-4">Tanggal Pesanan</th>
                <th className="py-3.5 px-4">Status Pesanan</th>
                <th className="py-3.5 px-4 text-right">Total Tagihan</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {store.orders.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {row.orderId}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {row.koperasi}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{row.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                        row.status === "Selesai"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : row.status === "Diterima"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    Rp {row.totalAmount.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(row)}
                      className="px-3 py-1.5 inline-flex items-center gap-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Pesanan */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Rincian Pesanan - {selectedOrder.orderId}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tujuan: {selectedOrder.koperasi} ({selectedOrder.date})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                    <th className="py-2.5 px-3">Nama Produk</th>
                    <th className="py-2.5 px-3 text-center">Kuantitas</th>
                    <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {selectedOrder.products.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {item.qty} {item.satuan}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        Rp {item.hargaSatuan.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-gray-900">
                        Rp {(item.qty * item.hargaSatuan).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-sm">
                <span className="text-gray-500">Total Nilai Pesanan:</span>
                <span className="font-bold text-base text-emerald-600 ml-1.5">
                  Rp {selectedOrder.totalAmount.toLocaleString("id-ID")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Pop-up */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 transition-all animate-bounce-once">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
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
  );
}
