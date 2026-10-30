"use client";

import React, { useState } from "react";
import { useSppgSystemStore } from "@/stores/useSppgSystemStore";
import {
  ScanBarcode,
  X,
  CheckCircle2,
  Calendar,
  Star,
} from "lucide-react";
import Image from "next/image";

export default function BarangMasukTable() {
  const store = useSppgSystemStore();

  // Modal 1: Modal Scan Barcode (sama persis dengan fitur stock out di KUD)
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

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

  // 1. Eksekusi scan barcode barang masuk
  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Data dummy simulasi dari barcode scan
    const sampleItems = [
      {
        productId: "PRD-251026-01",
        namaBarang: "Beras Pandan Wangi",
        pemasok: "Koperasi Budi Luhur",
        qty: 100,
        satuan: "Kg",
      },
      {
        productId: "PRD-251026-06",
        namaBarang: "Telur Ayam Ras",
        pemasok: "Koperasi Budi Luhur",
        qty: 40,
        satuan: "Kg",
      },
      {
        productId: "PRD-251026-05",
        namaBarang: "Jagung Manis",
        pemasok: "KUD Tani Makmur",
        qty: 50,
        satuan: "Kg",
      },
    ];

    const randomItem =
      sampleItems[Math.floor(Math.random() * sampleItems.length)];

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()}`;

    // Simpan ke daftar barang masuk
    store.addBarangMasuk({
      kodeMasuk: `BM-${Date.now().toString().slice(-6)}`,
      productId: randomItem.productId,
      namaBarang: randomItem.namaBarang,
      pemasok: randomItem.pemasok,
      qty: randomItem.qty,
      satuan: randomItem.satuan,
      date: dateStr,
      petugas: "Petugas QC SPPG",
    });

    setIsScanModalOpen(false);
    setLastReceivedItem({
      koperasi: randomItem.pemasok,
      namaBarang: randomItem.namaBarang,
    });

    // Buka otomatis Form Review Koperasi saat barang masuk ke gudang
    setIsReviewModalOpen(true);
    triggerToast(
      `Barang ${randomItem.namaBarang} (${randomItem.qty} ${randomItem.satuan}) berhasil masuk gudang!`
    );
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
            Pencatatan pasokan bahan pangan masuk dari Koperasi ke gudang SPPG melalui pemindaian barcode.
          </p>
        </div>

        {/* Tombol Scan Barcode */}
        <div>
          <button
            type="button"
            onClick={() => setIsScanModalOpen(true)}
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

      {/* ================= MODAL 1: SCAN BARCODE (Sama Persis KUD) ================= */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">
                Barang Masuk
              </h3>
              <button
                type="button"
                onClick={() => setIsScanModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScanSubmit}>
              <div className="w-full flex flex-col items-center gap-6 my-5">
                <div className="border w-full rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                  <Image
                    src={"/img/scan_barcode.png"}
                    width={300}
                    height={300}
                    alt="Scan Barcode"
                    className="w-full h-auto max-h-52 object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Scan Barcode Produk Masuk
                </span>
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
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Simpan
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
                  Barang telah diterima di gudang. Silakan beri ulasan terhadap layanan Koperasi.
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
