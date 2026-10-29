"use client";

import React, { useState } from "react";
import { useSppgSystemStore, SppgInvoiceItem } from "@/stores/useSppgSystemStore";
import { Eye, X, CheckCircle2, CreditCard } from "lucide-react";

export default function InvoiceTable() {
  const store = useSppgSystemStore();
  const [selectedInvoice, setSelectedInvoice] = useState<SppgInvoiceItem | null>(null);
  const [confirmPayInvoice, setConfirmPayInvoice] = useState<SppgInvoiceItem | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Data berhasil disimpan!");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePay = (inv: SppgInvoiceItem) => {
    store.payInvoice(inv.invoiceId);
    setConfirmPayInvoice(null);
    if (selectedInvoice?.invoiceId === inv.invoiceId) {
      setSelectedInvoice({ ...inv, status: "Lunas" });
    }
    triggerToast(`Faktur ${inv.invoiceId} berhasil dibayar! Bukti kwitansi resmi telah diterbitkan.`);
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Data Faktur (Invoice)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar tagihan pembayaran pasokan bahan pangan yang diterima dari Koperasi mitra.
          </p>
        </div>
      </div>

      {/* Tabel Data Faktur */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                <th className="py-3.5 px-4">No. Faktur</th>
                <th className="py-3.5 px-4">Ref. Pesanan</th>
                <th className="py-3.5 px-4">Pihak Koperasi</th>
                <th className="py-3.5 px-4">Tanggal Tagihan</th>
                <th className="py-3.5 px-4">Status Pembayaran</th>
                <th className="py-3.5 px-4 text-right">Total Tagihan</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {store.invoices.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {row.invoiceId}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {row.orderId}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {row.koperasi}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{row.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                        row.status === "Lunas"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
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
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(row)}
                        className="px-3 py-1.5 flex items-center gap-1 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>

                      {row.status !== "Lunas" && (
                        <button
                          type="button"
                          onClick={() => setConfirmPayInvoice(row)}
                          className="px-3 py-1.5 flex items-center gap-1 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Bayar</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Faktur */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Rincian Faktur - {selectedInvoice.invoiceId}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ref: {selectedInvoice.orderId} | {selectedInvoice.koperasi} ({selectedInvoice.date})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
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
                    <th className="py-2.5 px-3 text-center">Jumlah</th>
                    <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {selectedInvoice.products.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {item.qty} {item.satuan}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        Rp {item.price.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-gray-900">
                        Rp {(item.qty * item.price).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-sm flex items-center gap-2">
                <span className="text-gray-500">Total Tagihan:</span>
                <span className="font-bold text-base text-gray-900">
                  Rp {selectedInvoice.totalAmount.toLocaleString("id-ID")}
                </span>
                <span
                  className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                    selectedInvoice.status === "Lunas"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {selectedInvoice.status}
                </span>
              </div>
              <div className="flex gap-2">
                {selectedInvoice.status !== "Lunas" && (
                  <button
                    type="button"
                    onClick={() => handlePay(selectedInvoice)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
                  >
                    Bayar Sekarang
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Pelunasan */}
      {confirmPayInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">
                Konfirmasi Pelunasan Faktur
              </h3>
              <button
                type="button"
                onClick={() => setConfirmPayInvoice(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-2 text-sm text-gray-600">
              <p>
                Konfirmasi pelunasan faktur{" "}
                <span className="font-semibold text-gray-900">
                  {confirmPayInvoice.invoiceId}
                </span>{" "}
                sebesar:
              </p>
              <p className="text-xl font-bold text-emerald-600">
                Rp {confirmPayInvoice.totalAmount.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-gray-500">
                Status tagihan akan otomatis berubah menjadi Lunas dan bukti kwitansi resmi akan segera diterbitkan.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setConfirmPayInvoice(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handlePay(confirmPayInvoice)}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Konfirmasi Pelunasan
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
