"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Eye, Check } from "lucide-react";
import { useOrderStore, OrderItem } from "@/stores/useOrderStore";

export default function OrderTable() {
  const store = useOrderStore();

  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [targetOrderAction, setTargetOrderAction] = useState<OrderItem | null>(null);
  const [isModalOpen2, setIsModalOpen2] = useState<boolean>(false);
  const [isModalOpen3, setIsModalOpen3] = useState<boolean>(false);

  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("Data berhasil disimpan!");

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const calculateOrderTotal = (order: OrderItem) => {
    return order.products.reduce((acc, p) => acc + p.qty * p.hargaSatuan, 0);
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Data Pesanan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar pesanan masuk dari SPPG, rincian produk komoditas, dan penetapan harga.
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
                <th className="py-3.5 px-4">Tujuan / SPPG</th>
                <th className="py-3.5 px-4">Tanggal Pesanan</th>
                <th className="py-3.5 px-4">Total Pesanan</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {store.order.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-900">{row.orderId}</td>
                  <td className="py-3 px-4">
                    <span className="text-gray-800 font-medium">{row.sppg}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{row.date}</td>
                  <td className="py-3 px-4 font-bold text-gray-900">
                    Rp {calculateOrderTotal(row).toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5 font-semibold">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(row)}
                        className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTargetOrderAction(row);
                          setIsModalOpen3(true);
                        }}
                        className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setTargetOrderAction(row);
                          setIsModalOpen2(true);
                        }}
                        className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-xs transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Terima</span>
                      </button>
                    </div>
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
          <div className="relative w-full max-w-4xl p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Rincian Pesanan - {selectedOrder.orderId}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Pemesan: {selectedOrder.sppg} ({selectedOrder.date})
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
                    <th className="py-2.5 px-3">ID Produk</th>
                    <th className="py-2.5 px-3">Nama Produk</th>
                    <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                    <th className="py-2.5 px-3 text-center">Jumlah</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {selectedOrder.products.map((row) => (
                    <tr key={row.productId} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-gray-900 text-xs">{row.productId}</td>
                      <td className="py-2.5 px-3 font-medium text-gray-900">{row.name}</td>
                      <td className="py-2.5 px-3 text-right">
                        Rp {row.hargaSatuan.toLocaleString("id-ID")} /{row.satuan || "Kg"}
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium">
                        {row.qty} {row.satuan || "Kg"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-gray-900">
                        Rp {(row.qty * row.hargaSatuan).toLocaleString("id-ID")}
                      </td>
                      <td className="py-2.5 px-3 text-gray-500 text-xs">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-sm">
                <span className="text-gray-500">Total Nilai Pesanan:</span>
                <span className="font-bold text-base text-emerald-600 ml-1.5">
                  Rp {calculateOrderTotal(selectedOrder).toLocaleString("id-ID")}
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

      {/* Modal Konfirmasi Terima */}
      {isModalOpen2 && targetOrderAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">
                Konfirmasi Terima Pesanan
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen2(false);
                  setTargetOrderAction(null);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <p className="text-sm text-gray-600">
                Apakah Anda yakin ingin menerima pesanan{" "}
                <span className="font-semibold text-gray-900">{targetOrderAction.orderId}</span>? Stok produk akan otomatis dialokasikan untuk pemenuhan.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen2(false);
                  setTargetOrderAction(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen2(false);
                  triggerToast(`Pesanan ${targetOrderAction.orderId} berhasil diterima!`);
                  setTargetOrderAction(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer"
              >
                Ya, Terima Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Tolak */}
      {isModalOpen3 && targetOrderAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-semibold text-rose-600">Tolak Pesanan</h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen3(false);
                  setTargetOrderAction(null);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-sm text-gray-600">
                Apakah Anda yakin ingin menolak pesanan{" "}
                <span className="font-semibold text-gray-900">{targetOrderAction.orderId}</span>?
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen3(false);
                  setTargetOrderAction(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen3(false);
                  triggerToast(`Pesanan ${targetOrderAction.orderId} telah ditolak!`);
                  setTargetOrderAction(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                Tolak Pesanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Komponen Toast Notifikasi */}
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
