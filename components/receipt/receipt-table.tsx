"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Receipt,
  Eye,
  Send,
  Printer,
} from "lucide-react";
import { useReceiptStore, ReceiptItem } from "@/stores/useReceiptStore";

export default function ReceiptTable() {
  const receiptStore = useReceiptStore();
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Data berhasil disimpan!");

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSendReceipt = (receiptId: string) => {
    triggerToast(`Kwitansi ${receiptId} berhasil dikirim!`);
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Data Kwitansi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar bukti penerimaan dan pelunasan pembayaran yang sah.
          </p>
        </div>
      </div>

      {/* Dynamic Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium">
                <th className="py-3.5 px-4">No. Kwitansi</th>
                <th className="py-3.5 px-4">Ref. Invoice</th>
                <th className="py-3.5 px-4">ID Pesanan</th>
                <th className="py-3.5 px-4">SPPG / Tujuan</th>
                <th className="py-3.5 px-4">Waktu Bayar</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {receiptStore.receipts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    Belum ada data kwitansi.
                  </td>
                </tr>
              ) : (
                receiptStore.receipts.map((row) => (
                  <tr key={row.receiptId} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900">{row.receiptId}</td>
                    <td className="py-3 px-4 text-gray-600">{row.invoiceId}</td>
                    <td className="py-3 px-4 text-gray-600">{row.orderId}</td>
                    <td className="py-3 px-4 text-gray-700">{row.sppg}</td>
                    <td className="py-3 px-4 text-gray-500">{row.paidAt}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      Rp {row.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {/* Aksi 1: Menampilkan Modal Receipt */}
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(row)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors text-xs font-semibold cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>

                        {/* Aksi 2: Mengirim Kwitansi */}
                        <button
                          type="button"
                          onClick={() => handleSendReceipt(row.receiptId)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors text-xs font-semibold cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Kirim</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL VISUAL KWITANSI ================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Tombol Tutup */}
            <button
              type="button"
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Konten Kwitansi Fisik */}
            <div className="p-6">
              {/* Status Header */}
              <div className="flex flex-col items-center text-center pb-4 border-b border-dashed border-gray-200">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-gray-900">KWITANSI PEMBAYARAN</h4>
                <p className="text-xs text-gray-400 mt-0.5">{selectedReceipt.receiptId}</p>
                <span className="text-2xl font-black text-gray-900 mt-2">
                  Rp {selectedReceipt.totalAmount.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Informasi Pembayaran */}
              <div className="py-3 border-b border-dashed border-gray-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Waktu Bayar:</span>
                  <span className="font-medium text-gray-800">{selectedReceipt.paidAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ref. Invoice:</span>
                  <span className="font-medium text-gray-800">{selectedReceipt.invoiceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ID Pesanan:</span>
                  <span className="font-medium text-gray-800">{selectedReceipt.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tujuan / SPPG:</span>
                  <span className="font-medium text-gray-800 text-right truncate max-w-45">
                    {selectedReceipt.sppg}
                  </span>
                </div>
              </div>

              {/* Rincian Produk */}
              <div className="py-3 border-b border-dashed border-gray-200 space-y-2 text-xs">
                <p className="font-semibold text-gray-700">Rincian Barang:</p>
                {selectedReceipt.products.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-600">
                    <span>
                      {item.name} <span className="text-gray-400">×{item.qty}</span>
                    </span>
                    <span className="font-medium text-gray-900">
                      Rp {(item.qty * item.price).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Grand Total */}
              <div className="pt-3 flex justify-between items-center text-sm font-bold text-gray-900">
                <span>STATUS</span>
                <span className="text-emerald-600 font-extrabold tracking-wider">LUNAS</span>
              </div>
            </div>

            {/* Footer Modal / Tombol Cetak & Tutup */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak
              </button>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="py-2 px-4 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-100 transition cursor-pointer"
              >
                Tutup
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