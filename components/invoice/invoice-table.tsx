"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Eye } from "lucide-react";
import { useInvoiceStore, InvoiceItem } from "@/stores/useInvoiceStore";

export default function ProductTable() {
  const store = useInvoiceStore();

  // State untuk data invoice yang sedang dibuka detailnya
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);

  // State modal konfirmasi
  const [isModalOpen2, setIsModalOpen2] = useState<boolean>(false);
  const [isModalOpen3, setIsModalOpen3] = useState<boolean>(false);

  // State toaster
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("Data berhasil disimpan!");

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Data Invoice</h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar tagihan dan rincian produk yang dipesan.
          </p>
        </div>
      </div>

      {/* Dynamic Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium">
                <th className="py-3.5 px-4">ID Invoice</th>
                <th className="py-3.5 px-4">ID Pesanan</th>
                <th className="py-3.5 px-4">Tujuan / SPPG</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Total Tagihan</th>
                <th className="py-3.5 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {store.invoice.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-900">{row.invoiceId}</td>
                  <td className="py-3 px-4 text-gray-600">{row.orderId}</td>
                  <td className="py-3 px-4 text-gray-700">{row.sppg ?? "-"}</td>
                  <td className="py-3 px-4 text-gray-500">{row.date}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">
                    Rp {row.totalAmount.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoice(row)}
                      className="px-3.5 py-1.5 flex gap-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold text-xs transition-colors cursor-pointer"
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

      {/* ================= MODAL DETAIL INVOICE & PRODUK ================= */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl p-6 bg-white rounded-2xl shadow-xl transition-all">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Detail Tagihan - {selectedInvoice.invoiceId}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  ID Pesanan: {selectedInvoice.orderId} | {selectedInvoice.sppg ?? "-"} ({selectedInvoice.date})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabel Produk Spesifik Invoice Terpilih */}
            <div className="py-4 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                    <th className="py-3 px-4">ID Produk</th>
                    <th className="py-3 px-4">Nama Produk</th>
                    <th className="py-3 px-4 text-right">Harga Satuan</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                    <th className="py-3 px-4">Tanggal Masuk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {selectedInvoice.products.map((prod) => (
                    <tr key={prod.productId} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">{prod.productId}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">{prod.name}</td>
                      <td className="py-3 px-4 text-right">
                        Rp {prod.price.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-center">{prod.qty}</td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        Rp {(prod.qty * prod.price).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-gray-500">{prod.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI PENERIMAAN ================= */}
      {isModalOpen2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">
                Konfirmasi Terima Pesanan
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen2(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4">
              <p className="text-sm text-gray-600">
                Apakah Anda yakin ingin menerima invoice ini? Stok produk akan otomatis diperbarui ke inventaris.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen2(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen2(false);
                  setSelectedInvoice(null);
                  triggerToast("Invoice berhasil diterima!");
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
              >
                Ya, Terima Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI PENOLAKAN ================= */}
      {isModalOpen3 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-semibold text-red-600">Tolak Pesanan</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen3(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3">
              <p className="text-sm text-gray-600">
                Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menolak tagihan pesanan ini?
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen3(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen3(false);
                  setSelectedInvoice(null);
                  triggerToast("Pesanan telah ditolak!");
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
              >
                Tolak Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Komponen Toast Pop-up */}
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