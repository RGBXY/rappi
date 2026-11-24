"use client";

import React, { useState, useEffect } from "react";
import { useSppgSystemStore, SppgOrderItem } from "@/stores/useSppgSystemStore";
import { useProductStore } from "@/stores/useProductStore";
import {
  ScanBarcode,
  X,
  CheckCircle2,
  Calendar,
  Star,
  Check,
  AlertCircle,
  RotateCcw,
  PackageCheck,
  Building,
} from "lucide-react";
import Image from "next/image";

interface DraftProductItem {
  productId: string;
  stockId: string;
  name: string;
  orderQty: number;
  satuan: string;
  action: "diterima" | "retur";
  returQty: number;
  diterimaQty: number;
  returReason: string;
  scanned: boolean;
}

export default function BarangMasukTable() {
  const store = useSppgSystemStore();

  // Modal 1: Modal Scan Barcode Barang Masuk (dengan pilihan Order Lunas & Retur/Diterima)
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [draftItems, setDraftItems] = useState<DraftProductItem[]>([]);
  const [scanningProductId, setScanningProductId] = useState<string | null>(null);

  // Modal 2: Modal Form Review Koperasi (muncul otomatis setelah barang masuk)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [lastReceivedItem, setLastReceivedItem] = useState<{
    koperasi: string;
    namaBarang: string;
  } | null>(null);

  // State Form Review
  const [reviewData, setReviewData] = useState({
    rating: 5,
    aspek: "Kualitas Bahan Pangan",
    reviewText: "",
  });

  // State Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Data berhasil disimpan!");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Daftar pesanan yang telah dibayar (Lunas)
  const paidOrders = store.orders.filter((order) => {
    const isPaid = store.invoices.some(
      (inv) => inv.orderId === order.orderId && inv.status === "Lunas"
    );
    return isPaid || order.status === "Diterima" || order.status === "Selesai";
  });

  // Buka Modal Scan dan inisialisasi data order
  const handleOpenScanModal = () => {
    const defaultOrder = paidOrders.length > 0 ? paidOrders[0] : store.orders[0];
    if (defaultOrder) {
      setSelectedOrderId(defaultOrder.orderId);
      loadOrderDraft(defaultOrder);
    } else {
      setSelectedOrderId("");
      setDraftItems([]);
    }
    setIsScanModalOpen(true);
  };

  // Load produk dari order yang dipilih ke dalam draft scan/retur
  const loadOrderDraft = (order: SppgOrderItem) => {
    const items: DraftProductItem[] = order.products.map((p) => ({
      productId: p.productId,
      stockId: p.stockId || "STK-251026-01",
      name: p.name,
      orderQty: p.qty,
      satuan: p.satuan || "Kg",
      action: "diterima",
      returQty: 0,
      diterimaQty: p.qty,
      returReason: "Kualitas Menurun / Terlalu Matang",
      scanned: false,
    }));
    setDraftItems(items);
  };

  // Handler pergantian order di dropdown
  const handleOrderChange = (orderId: string) => {
    setSelectedOrderId(orderId);
    const order = store.orders.find((o) => o.orderId === orderId);
    if (order) {
      loadOrderDraft(order);
    }
  };

  // Toggle aksi per item: "diterima" atau "retur"
  const handleActionToggle = (productId: string, action: "diterima" | "retur") => {
    setDraftItems((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item;
        if (action === "diterima") {
          return {
            ...item,
            action: "diterima",
            returQty: 0,
            diterimaQty: item.orderQty,
            scanned: false,
          };
        } else {
          // Default retur sebagian: setengahnya atau minimal 1
          const defaultRetur = Math.max(1, Math.floor(item.orderQty / 2));
          return {
            ...item,
            action: "retur",
            returQty: defaultRetur,
            diterimaQty: item.orderQty - defaultRetur,
            scanned: false,
          };
        }
      })
    );
  };

  // Handler ubah kuantitas retur (misal dari 10 sisir ingin retur 5 sisir saja)
  const handleReturQtyChange = (productId: string, valStr: string) => {
    let val = Number(valStr);
    if (isNaN(val)) val = 0;

    setDraftItems((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item;
        const clampedRetur = Math.max(0, Math.min(val, item.orderQty));
        const newDiterima = item.orderQty - clampedRetur;
        return {
          ...item,
          returQty: clampedRetur,
          diterimaQty: newDiterima,
          scanned: false, // Reset scan saat jumlah berubah
        };
      })
    );
  };

  // Handler ubah alasan retur
  const handleReturReasonChange = (productId: string, reason: string) => {
    setDraftItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, returReason: reason } : item
      )
    );
  };

  // Simulasi scan produk 1 per 1
  const handleScanSingleItem = (productId: string) => {
    setScanningProductId(productId);
    setTimeout(() => {
      setDraftItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, scanned: true } : item
        )
      );
      setScanningProductId(null);
      const target = draftItems.find((p) => p.productId === productId);
      triggerToast(`Barcode ${target?.name || "produk"} berhasil di-scan!`);
    }, 500);
  };

  // Reset scan untuk 1 produk
  const handleResetScan = (productId: string) => {
    setDraftItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, scanned: false } : item
      )
    );
  };

  // 1. Eksekusi simpan barang masuk dan retur
  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (draftItems.length === 0) return;

    // Validasi: seluruh barang yang diterima (diterimaQty > 0) harus di-scan terlebih dahulu
    const unscannedAccepted = draftItems.some(
      (item) => item.diterimaQty > 0 && !item.scanned
    );

    if (unscannedAccepted) {
      alert(
        "Harap selesaikan pemindaian (scan barcode) untuk seluruh produk yang diterima ke gudang!"
      );
      return;
    }

    const currentOrder = store.orders.find((o) => o.orderId === selectedOrderId);
    const namaKoperasi = currentOrder?.koperasi || "Koperasi Budi Luhur";

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const dateStr = `${day}-${month}-${year}`;

    const receivedNames: string[] = [];

    // Proses masing-masing produk
    draftItems.forEach((item, idx) => {
      // 1. Jika ada barang diterima masuk gudang
      if (item.diterimaQty > 0) {
        store.addBarangMasuk({
          kodeMasuk: `BM-${Date.now().toString().slice(-6)}${idx}`,
          orderId: selectedOrderId,
          stockId: item.stockId,
          productId: item.productId,
          namaBarang: item.name,
          pemasok: namaKoperasi,
          qty: item.diterimaQty,
          satuan: item.satuan,
          date: dateStr,
          petugas: "Petugas QC SPPG",
        });
        receivedNames.push(`${item.name} (${item.diterimaQty} ${item.satuan})`);
      }

      // 2. Jika ada barang yang diretur
      if (item.returQty > 0) {
        store.addSppgReturn({
          orderId: selectedOrderId,
          stockId: item.stockId,
          productId: item.productId,
          namaBarang: item.name,
          pemasok: namaKoperasi,
          qty: item.returQty,
          satuan: item.satuan,
          reason: item.returReason,
          date: dateStr,
        });

        // Sinkronkan ke returnList Koperasi
        try {
          const coperativeStore = useProductStore.getState();
          coperativeStore.returnList.push({
            id: Date.now() + idx + 10,
            stockId: item.stockId,
            orderId: selectedOrderId,
            productId: item.productId,
            name: item.name,
            qty: item.returQty,
            satuan: item.satuan,
            reason: item.returReason,
            status: "Pending",
            date: dateStr,
          });
        } catch {
          // ignore error if store unavailable
        }
      }
    });

    setIsScanModalOpen(false);

    if (receivedNames.length > 0) {
      setLastReceivedItem({
        koperasi: namaKoperasi,
        namaBarang: receivedNames.join(", "),
      });
      // Buka otomatis Form Review Koperasi saat barang masuk ke gudang
      setIsReviewModalOpen(true);
      triggerToast("Penerimaan barang masuk berhasil dicatat ke gudang SPPG!");
    } else {
      triggerToast("Seluruh produk berhasil dicatat sebagai Retur ke Koperasi.");
    }
  };

  // 2. Eksekusi pengiriman review Koperasi
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastReceivedItem) return;

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()}`;

    store.addReview({
      coperativeName: lastReceivedItem.koperasi,
      rating: reviewData.rating,
      aspek: reviewData.aspek,
      reviewText:
        reviewData.reviewText ||
        `Pasokan ${lastReceivedItem.namaBarang} diterima dalam kondisi baik dan tepat waktu.`,
      reviewer: "SPPG Kulon Progo",
      date: dateStr,
    });

    setIsReviewModalOpen(false);
    setReviewData({
      rating: 5,
      aspek: "Kualitas Bahan Pangan",
      reviewText: "",
    });
    triggerToast(`Ulasan untuk ${lastReceivedItem.koperasi} berhasil disimpan!`);
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Data Barang Masuk
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pencatatan pasokan bahan pangan masuk dari Koperasi ke gudang SPPG berdasarkan pesanan lunas.
          </p>
        </div>

        {/* Tombol Scan Barcode */}
        <div>
          <button
            type="button"
            onClick={handleOpenScanModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <ScanBarcode className="w-4.5 h-4.5" />
            <span>Scan Barcode Barang Masuk</span>
          </button>
        </div>
      </div>

      {/* Tabel Data Barang Masuk */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                <th className="py-3.5 px-4">No. Penerimaan</th>
                <th className="py-3.5 px-4">ID Stok</th>
                <th className="py-3.5 px-4">ID Produk</th>
                <th className="py-3.5 px-4">Nama Barang</th>
                <th className="py-3.5 px-4">Pemasok / Koperasi</th>
                <th className="py-3.5 px-4 text-center">Jumlah Masuk</th>
                <th className="py-3.5 px-4">Tanggal Masuk</th>
                <th className="py-3.5 px-4">Petugas QC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {store.barangMasukList.length > 0 ? (
                store.barangMasukList.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {row.kodeMasuk}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-xs text-emerald-800">
                      {row.stockId || "STK-251026-01"}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {row.productId}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {row.namaBarang}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{row.pemasok}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        +{row.qty} {row.satuan}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-gray-900 font-medium text-xs">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{row.date}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {row.petugas}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-gray-400 font-normal"
                  >
                    Belum ada data barang masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL 1: SCAN BARCODE BARANG MASUK ================= */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Penerimaan &amp; Scan Barcode Barang Masuk
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verifikasi pasokan dari pesanan lunas. Tentukan produk yang diterima atau diretur.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScanModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScanSubmit}>
              <div className="py-4 space-y-4">
                {/* 1. Pemilihan Pesanan Lunas */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Pilih Data Pesanan (Telah Dibayar / Lunas):
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => handleOrderChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 shadow-2xs font-medium"
                  >
                    {store.orders.map((order) => (
                      <option key={order.orderId} value={order.orderId}>
                        {order.orderId} — {order.koperasi} ({order.date})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. List Produk dari Pesanan Terpilih */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Daftar Komoditas Pesanan
                    </h4>
                    <span className="text-xs text-gray-500">
                      Total: {draftItems.length} Produk
                    </span>
                  </div>

                  {draftItems.map((item) => (
                    <div
                      key={item.productId}
                      className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-3"
                    >
                      {/* Info Produk & ID Stok */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200/60">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">
                              {item.name}
                            </span>
                            <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200">
                              {item.stockId}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 font-mono">
                            ID Produk: {item.productId}
                          </span>
                        </div>

                        <div className="text-xs sm:text-right">
                          <span className="text-gray-500">Kuantitas Pesanan: </span>
                          <strong className="text-gray-900 font-bold text-sm">
                            {item.orderQty} {item.satuan}
                          </strong>
                        </div>
                      </div>

                      {/* 2 Pilihan: Diterima vs Retur */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleActionToggle(item.productId, "diterima")}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                            item.action === "diterima"
                              ? "bg-emerald-50 border-emerald-600 text-emerald-800 shadow-2xs"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <PackageCheck className="w-4 h-4" />
                          <span>Diterima Penuh</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleActionToggle(item.productId, "retur")}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                            item.action === "retur"
                              ? "bg-amber-50 border-amber-600 text-amber-800 shadow-2xs"
                              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Retur Sebagian / Penuh</span>
                        </button>
                      </div>

                      {/* Jika Memilih Retur: Tampilkan Input Kuantitas Retur & Alasan */}
                      {item.action === "retur" && (
                        <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-gray-700 font-medium mb-1">
                                Jumlah yang Diretur ({item.satuan}):
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={item.orderQty}
                                value={item.returQty}
                                onChange={(e) =>
                                  handleReturQtyChange(item.productId, e.target.value)
                                }
                                className="w-full px-3 py-1.5 text-sm font-semibold text-amber-900 bg-white border border-amber-300 rounded-lg focus:outline-none focus:border-amber-600"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-700 font-medium mb-1">
                                Sisa Diterima Masuk Gudang:
                              </label>
                              <div className="px-3 py-1.5 text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                                {item.diterimaQty} {item.satuan}
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-700 font-medium mb-1">
                              Alasan Pengembalian (Retur):
                            </label>
                            <input
                              type="text"
                              value={item.returReason}
                              onChange={(e) =>
                                handleReturReasonChange(item.productId, e.target.value)
                              }
                              placeholder="Contoh: Terlalu matang, cangkang retak, atau kualitas menurun"
                              className="w-full px-3 py-1.5 text-xs text-gray-800 bg-white border border-amber-200 rounded-lg focus:outline-none focus:border-amber-600"
                            />
                          </div>
                        </div>
                      )}

                      {/* Simulasi Scan Barcode untuk barang yang diterima */}
                      {item.diterimaQty > 0 ? (
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-gray-600">
                            Masuk Gudang:{" "}
                            <strong className="text-emerald-700 font-bold">
                              {item.diterimaQty} {item.satuan}
                            </strong>
                          </span>

                          <div>
                            {item.scanned ? (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-700 bg-emerald-100 border border-emerald-300">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Barcode Terverifikasi</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleResetScan(item.productId)}
                                  className="text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
                                >
                                  Reset
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={scanningProductId === item.productId}
                                onClick={() => handleScanSingleItem(item.productId)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                              >
                                <ScanBarcode className="w-3.5 h-3.5" />
                                <span>
                                  {scanningProductId === item.productId
                                    ? "Memindai Barcode..."
                                    : "Scan Barcode Produk"}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-700 text-xs font-medium pt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>
                            100% Pesanan ini diretur kembali ke Koperasi (0 {item.satuan} masuk gudang).
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Banner Informasi Simulasi Scanner */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <Image
                    src={"/img/scan_barcode.png"}
                    width={45}
                    height={45}
                    alt="Barcode Scanner"
                    className="object-contain shrink-0"
                  />
                  <div className="text-xs text-gray-600">
                    <p className="font-semibold text-gray-800">
                      Simulasi Pemindai Barcode Gudang SPPG
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Klik tombol <strong>&quot;Scan Barcode Produk&quot;</strong> pada masing-masing komoditas yang diterima untuk memverifikasi fisik barang sebelum disimpan di gudang.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsScanModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={
                    draftItems.length === 0 ||
                    draftItems.some((item) => item.diterimaQty > 0 && !item.scanned)
                  }
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-xs ${
                    draftItems.length === 0 ||
                    draftItems.some((item) => item.diterimaQty > 0 && !item.scanned)
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                  }`}
                >
                  Selesaikan Penerimaan Barang Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: FORM REVIEW KOPERASI (Muncul Setelah Barang Masuk) ================= */}
      {isReviewModalOpen && lastReceivedItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="space-y-0.5">
                <h3 className="text-base font-semibold text-gray-900">
                  Ulasan Koperasi Pemasok
                </h3>
                <p className="text-xs text-gray-500">
                  Barang telah diterima di gudang SPPG. Silakan beri ulasan terhadap layanan Koperasi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit}>
              <div className="py-4 space-y-3.5">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Koperasi Pemasok:</span>
                    <span className="font-semibold text-gray-900">
                      {lastReceivedItem.koperasi}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Barang Diterima:</span>
                    <span className="font-semibold text-gray-900">
                      {lastReceivedItem.namaBarang}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Rating Kepuasan (Bintang 1 - 5)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() =>
                          setReviewData({ ...reviewData, rating: star })
                        }
                        className="p-1 hover:scale-110 transition cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewData.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-gray-700 ml-2">
                      {reviewData.rating} Bintang
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Aspek Evaluasi
                  </label>
                  <select
                    value={reviewData.aspek}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, aspek: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Kualitas Bahan Pangan">
                      Kualitas Bahan Pangan
                    </option>
                    <option value="Ketepatan Waktu Pengiriman">
                      Ketepatan Waktu Pengiriman
                    </option>
                    <option value="Kesesuaian Timbangan / Kuantitas">
                      Kesesuaian Timbangan / Kuantitas
                    </option>
                    <option value="Pelayanan & Komunikasi">
                      Pelayanan & Komunikasi
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Catatan Ulasan
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Sayur dan beras sangat segar, kemasan bersih dan higienis..."
                    value={reviewData.reviewText}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        reviewText: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Lewati
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Kirim Ulasan
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
