"use client";

import React, { useState, useMemo } from "react";
import { useSppgSystemStore } from "@/stores/useSppgSystemStore";
import {
  ScanBarcode,
  X,
  CheckCircle2,
  Calendar,
  Check,
  AlertTriangle,
  Building,
} from "lucide-react";
import Image from "next/image";

export default function BarangKeluarTable() {
  const store = useSppgSystemStore();

  // Modal Scan Barcode Barang Keluar
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  // State Form Barang Keluar
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [tujuanDapur, setTujuanDapur] = useState<string>("Dapur Masak MBG Pagi");
  const [jumlahKeluar, setJumlahKeluar] = useState<string>("10");
  const [isScanning, setIsScanning] = useState(false);
  const [isScanned, setIsScanned] = useState(false);

  // State Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Data berhasil disimpan!");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Hitung ketersediaan stok fisik di SPPG secara dinamis (Barang Masuk - Barang Keluar)
  const availableInventory = useMemo(() => {
    const map = new Map<
      string,
      {
        productId: string;
        stockId: string;
        namaBarang: string;
        pemasok: string;
        satuan: string;
        totalMasuk: number;
        totalKeluar: number;
        stokTersedia: number;
      }
    >();

    store.barangMasukList.forEach((bm) => {
      const existing = map.get(bm.productId) || {
        productId: bm.productId,
        stockId: bm.stockId || "STK-251026-01",
        namaBarang: bm.namaBarang,
        pemasok: bm.pemasok,
        satuan: bm.satuan,
        totalMasuk: 0,
        totalKeluar: 0,
        stokTersedia: 0,
      };
      existing.totalMasuk += bm.qty;
      existing.stokTersedia += bm.qty;
      map.set(bm.productId, existing);
    });

    store.barangKeluarList.forEach((bk) => {
      const existing = map.get(bk.productId);
      if (existing) {
        existing.totalKeluar += bk.qty;
        existing.stokTersedia = Math.max(0, existing.stokTersedia - bk.qty);
      }
    });

    return Array.from(map.values()).filter((item) => item.stokTersedia > 0);
  }, [store.barangMasukList, store.barangKeluarList]);

  // Buka modal dan inisialisasi pilihan produk
  const handleOpenScanModal = () => {
    if (availableInventory.length > 0) {
      setSelectedProductId(availableInventory[0].productId);
      setJumlahKeluar(
        Math.min(10, availableInventory[0].stokTersedia).toString()
      );
    } else {
      setSelectedProductId("");
      setJumlahKeluar("0");
    }
    setTujuanDapur("Dapur Masak MBG Pagi");
    setIsScanned(false);
    setIsScanning(false);
    setIsScanModalOpen(true);
  };

  const selectedProduct = useMemo(() => {
    return availableInventory.find((p) => p.productId === selectedProductId);
  }, [availableInventory, selectedProductId]);

  // Simulasi scan barcode 1 per 1
  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsScanned(true);
      triggerToast(
        `Barcode ${selectedProduct?.namaBarang || "produk"} berhasil di-scan!`
      );
    }, 500);
  };

  // Submit pengeluaran stok
  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const qtyNumber = Number(jumlahKeluar);
    if (isNaN(qtyNumber) || qtyNumber <= 0) {
      alert("Harap masukkan jumlah kuantitas stok keluar yang valid!");
      return;
    }

    if (qtyNumber > selectedProduct.stokTersedia) {
      alert(
        `Jumlah keluar melebihi sisa stok yang tersedia (${selectedProduct.stokTersedia} ${selectedProduct.satuan})!`
      );
      return;
    }

    if (!isScanned) {
      alert(
        "Harap lakukan pemindaian (scan barcode) produk terlebih dahulu sebelum mengeluarkan barang!"
      );
      return;
    }

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const dateStr = `${day}-${month}-${year}`;

    store.addBarangKeluar({
      kodeKeluar: `BK-${Date.now().toString().slice(-6)}`,
      stockId: selectedProduct.stockId,
      productId: selectedProduct.productId,
      namaBarang: selectedProduct.namaBarang,
      tujuan: tujuanDapur,
      qty: qtyNumber,
      satuan: selectedProduct.satuan,
      date: dateStr,
      petugas: "Petugas Distribusi SPPG",
    });

    setIsScanModalOpen(false);
    triggerToast(
      `Barang keluar ${selectedProduct.namaBarang} (${qtyNumber} ${selectedProduct.satuan}) ke ${tujuanDapur} berhasil dicatat!`
    );
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Data Barang Keluar
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pencatatan pengeluaran bahan pangan dari gudang SPPG ke dapur masak MBG melalui pemindaian barcode.
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
            <span>Scan Barcode Barang Keluar</span>
          </button>
        </div>
      </div>

      {/* Tabel Data Barang Keluar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                <th className="py-3.5 px-4">No. Pengeluaran</th>
                <th className="py-3.5 px-4">ID Stok</th>
                <th className="py-3.5 px-4">ID Produk</th>
                <th className="py-3.5 px-4">Nama Barang</th>
                <th className="py-3.5 px-4">Tujuan / Dapur Olah</th>
                <th className="py-3.5 px-4 text-center">Jumlah Keluar</th>
                <th className="py-3.5 px-4">Tanggal Keluar</th>
                <th className="py-3.5 px-4">Petugas Distribusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {store.barangKeluarList.length > 0 ? (
                store.barangKeluarList.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {row.kodeKeluar}
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
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        {row.tujuan}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        -{row.qty} {row.satuan}
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
                    Belum ada data barang keluar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL SCAN BARCODE BARANG KELUAR ================= */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Pengeluaran Stok ke Dapur Masak MBG
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tentukan tujuan dapur olah dan kuantitas stok yang dikeluarkan dari gudang SPPG.
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
                {/* 1. Pemilihan Produk dari Stok Tersedia */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Pilih Komoditas Bahan Pangan:
                  </label>
                  {availableInventory.length > 0 ? (
                    <select
                      value={selectedProductId}
                      onChange={(e) => {
                        setSelectedProductId(e.target.value);
                        setIsScanned(false);
                      }}
                      className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 shadow-2xs font-medium"
                    >
                      {availableInventory.map((item) => (
                        <option key={item.productId} value={item.productId}>
                          {item.namaBarang} ({item.stockId}) — Sisa: {item.stokTersedia}{" "}
                          {item.satuan}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>
                        Tidak ada stok bahan pangan yang tersedia di gudang SPPG saat ini.
                      </span>
                    </div>
                  )}
                </div>

                {/* Detail Kartu Produk Terpilih */}
                {selectedProduct && (
                  <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">
                        {selectedProduct.namaBarang}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200">
                        {selectedProduct.stockId}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-gray-600 pt-1 border-t border-gray-200/60">
                      <div>
                        <span className="text-gray-400">ID Produk:</span>{" "}
                        <span className="font-medium text-gray-800">
                          {selectedProduct.productId}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Pemasok:</span>{" "}
                        <span className="font-medium text-gray-800">
                          {selectedProduct.pemasok}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Sisa Stok Tersedia:</span>{" "}
                        <strong className="text-emerald-700 font-bold text-sm">
                          {selectedProduct.stokTersedia} {selectedProduct.satuan}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Input Form Tujuan Dapur */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Tujuan Dapur Olah Masak MBG:
                  </label>
                  <div className="space-y-2">
                    <select
                      value={tujuanDapur}
                      onChange={(e) => setTujuanDapur(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 shadow-2xs font-medium"
                    >
                      <option value="Dapur Masak MBG Pagi">
                        Dapur Masak MBG Pagi (Menu Sarapan Siswa)
                      </option>
                      <option value="Dapur Pengolahan Sup Siang">
                        Dapur Pengolahan Sup Siang (Menu Makan Siang)
                      </option>
                      <option value="Dapur Kudapan MBG Sore">
                        Dapur Kudapan MBG Sore (Menu Kudapan / Buah)
                      </option>
                      <option value="Dapur Menu Khusus Alergi Siswa">
                        Dapur Menu Khusus Alergi Siswa
                      </option>
                    </select>

                    <input
                      type="text"
                      value={tujuanDapur}
                      onChange={(e) => setTujuanDapur(e.target.value)}
                      placeholder="Atau ketik nama dapur tujuan kustom..."
                      className="w-full px-3.5 py-2 text-xs text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* 3. Input Form Jumlah Stok Keluar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Jumlah Stok Keluar ({selectedProduct?.satuan || "Kg"}):
                    </label>
                    {selectedProduct && (
                      <span className="text-[11px] text-gray-500">
                        Maksimal: {selectedProduct.stokTersedia}{" "}
                        {selectedProduct.satuan}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct?.stokTersedia || 1}
                    value={jumlahKeluar}
                    onChange={(e) => {
                      setJumlahKeluar(e.target.value);
                      setIsScanned(false);
                    }}
                    className="w-full px-3.5 py-2.5 text-sm font-semibold text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 shadow-2xs"
                  />
                </div>

                {/* 4. Simulasi Scan Barcode Pengeluaran */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={"/img/scan_barcode.png"}
                      width={45}
                      height={45}
                      alt="Scan Barcode"
                      className="object-contain shrink-0"
                    />
                    <div className="text-xs text-gray-600">
                      <p className="font-semibold text-gray-800">
                        Verifikasi Barcode Fisik Barang
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Scan barcode komoditas sebelum barang diangkut ke dapur olah.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-gray-200/60">
                    <div>
                      {isScanned ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-100 border border-emerald-300">
                          <Check className="w-3.5 h-3.5" />
                          <span>Barcode Pengeluaran Terverifikasi</span>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-700 font-medium">
                          Status: Belum di-scan
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isScanning || !selectedProduct}
                      onClick={handleSimulateScan}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <ScanBarcode className="w-4 h-4" />
                      <span>
                        {isScanning
                          ? "Memindai Barcode..."
                          : isScanned
                          ? "Scan Ulang"
                          : "Scan Barcode"}
                      </span>
                    </button>
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
                    !selectedProduct ||
                    !isScanned ||
                    Number(jumlahKeluar) <= 0 ||
                    Number(jumlahKeluar) > (selectedProduct?.stokTersedia || 0)
                  }
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-xs ${
                    !selectedProduct ||
                    !isScanned ||
                    Number(jumlahKeluar) <= 0 ||
                    Number(jumlahKeluar) > (selectedProduct?.stokTersedia || 0)
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                  }`}
                >
                  Selesaikan Pengeluaran Stok
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
