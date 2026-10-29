"use client";

import React, { useState } from "react";
import {
  useSppgSystemStore,
  CoperativeEntity,
  CoperativeProduct,
} from "@/stores/useSppgSystemStore";
import {
  Eye,
  X,
  Star,
  ShoppingCart,
  CheckCircle2,
  Building,
} from "lucide-react";

export default function CoperativeMergedTable() {
  const store = useSppgSystemStore();

  // State untuk modal detail Koperasi
  const [selectedCoperative, setSelectedCoperative] =
    useState<CoperativeEntity | null>(null);

  // State untuk modal form pemesanan produk
  const [orderProduct, setOrderProduct] = useState<{
    coperative: CoperativeEntity;
    product: CoperativeProduct;
  } | null>(null);

  const [orderQty, setOrderQty] = useState<number>(50);

  // State Toast Notifikasi
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Data berhasil disimpan!");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Sorting: Data Koperasi dengan rating terbaik di paling atas
  const sortedCoperatives = [...store.coperatives].sort(
    (a, b) => b.rating - a.rating
  );

  const handleOpenOrder = (
    coperative: CoperativeEntity,
    product: CoperativeProduct
  ) => {
    setOrderProduct({ coperative, product });
    setOrderQty(Math.min(50, product.stockTotal || 10));
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderProduct) return;

    const { coperative, product } = orderProduct;
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()}`;

    const total = orderQty * product.hargaSatuan;

    store.addOrder({
      orderId: `ORD-SPPG-${Date.now().toString().slice(-6)}`,
      koperasi: coperative.name,
      date: dateStr,
      status: "Diproses",
      totalAmount: total,
      products: [
        {
          productId: product.productId,
          name: product.name,
          qty: orderQty,
          satuan: product.satuan,
          hargaSatuan: product.hargaSatuan,
        },
      ],
    });

    setOrderProduct(null);
    triggerToast(
      `Pesanan ${product.name} ke ${coperative.name} berhasil dibuat!`
    );
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Data Koperasi Mitra
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar Koperasi penyedia pasokan bahan pangan diurutkan berdasarkan rating kepuasan terbaik.
          </p>
        </div>
      </div>

      {/* Tabel Data Koperasi (Diurutkan dari rating terbaik) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                <th className="py-3.5 px-4">Nama Koperasi</th>
                <th className="py-3.5 px-4">Alamat</th>
                <th className="py-3.5 px-4">No. Telepon</th>
                <th className="py-3.5 px-4">Rating Kepuasan</th>
                <th className="py-3.5 px-4 text-center">Jumlah Produk</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {sortedCoperatives.map((cop, idx) => (
                <tr
                  key={cop.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {cop.name}
                        </div>
                        {idx === 0 && (
                          <span className="inline-block mt-0.5 px-2 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            Rating Terbaik
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-600 max-w-xs">
                    {cop.address}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-600">
                    {cop.telp}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        {cop.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({cop.totalReviews} ulasan)
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                      {cop.products.length} Komoditas
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedCoperative(cop)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Detail</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL DETAIL KOPERASI & DAFTAR PRODUK ================= */}
      {selectedCoperative && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl p-6 bg-white rounded-2xl shadow-xl transition-all max-h-[90vh] flex flex-col">
            {/* Header Modal */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedCoperative.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md text-amber-700 text-xs font-bold border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedCoperative.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {selectedCoperative.address} | Telp: {selectedCoperative.telp}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCoperative(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-judul Daftar Produk */}
            <div className="pt-4 pb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">
                Katalog Produk & Ketersediaan Stok
              </h4>
              <span className="text-xs text-gray-500">
                Klik tombol <strong>Pesan</strong> pada produk untuk membuat pesanan ke koperasi ini.
              </span>
            </div>

            {/* Tabel Produk Koperasi */}
            <div className="py-2 overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                    <th className="py-2.5 px-3">ID Produk</th>
                    <th className="py-2.5 px-3">Nama Produk</th>
                    <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                    <th className="py-2.5 px-3 text-center">Stok Display</th>
                    <th className="py-2.5 px-3 text-center">Stok Gudang</th>
                    <th className="py-2.5 px-3 text-center">Total Stok</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {selectedCoperative.products.map((prod) => (
                    <tr
                      key={prod.productId}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-semibold text-gray-900 text-xs">
                        {prod.productId}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-gray-900">
                        {prod.name}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-gray-900">
                        Rp {prod.hargaSatuan.toLocaleString("id-ID")} /{prod.satuan}
                      </td>
                      <td className="py-2.5 px-3 text-center text-gray-600 text-xs">
                        {prod.stockDisplay} {prod.satuan}
                      </td>
                      <td className="py-2.5 px-3 text-center text-gray-600 text-xs">
                        {prod.stockWarehouse} {prod.satuan}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {prod.stockTotal} {prod.satuan}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenOrder(selectedCoperative, prod)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Pesan</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Modal */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCoperative(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL FORM PESAN PRODUK ================= */}
      {orderProduct && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-4.5 h-4.5 text-emerald-600" />
                <span>Form Pemesanan Bahan Pangan</span>
              </h3>
              <button
                type="button"
                onClick={() => setOrderProduct(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmOrder}>
              <div className="py-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Koperasi Penyedia
                  </label>
                  <input
                    type="text"
                    disabled
                    value={orderProduct.coperative.name}
                    className="w-full px-3.5 py-2 text-sm bg-gray-100 text-gray-800 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Komoditas Bahan Pangan
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${orderProduct.product.name} (${orderProduct.product.productId})`}
                    className="w-full px-3.5 py-2 text-sm bg-gray-100 text-gray-800 border border-gray-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Kuantitas Pesanan
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={orderProduct.product.stockTotal}
                      value={orderQty}
                      onChange={(e) => setOrderQty(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Harga Satuan
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`Rp ${orderProduct.product.hargaSatuan.toLocaleString(
                        "id-ID"
                      )} /${orderProduct.product.satuan}`}
                      className="w-full px-3.5 py-2 text-sm bg-gray-100 text-gray-800 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-emerald-800 font-medium">
                    Total Estimasi Tagihan:
                  </span>
                  <span className="font-extrabold text-emerald-700 text-base">
                    Rp{" "}
                    {(
                      orderQty * orderProduct.product.hargaSatuan
                    ).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setOrderProduct(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Kirim Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Pop-up */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-70 flex items-center gap-3 px-4 py-3 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 transition-all animate-bounce-once">
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

