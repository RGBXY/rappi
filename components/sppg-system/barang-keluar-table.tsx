"use client";

import React, { useState } from "react";
import { useSppgSystemStore } from "@/stores/useSppgSystemStore";
import {
  ScanBarcode,
  X,
  CheckCircle2,
  Trash2,
  Calendar,
} from "lucide-react";
import Image from "next/image";

export default function BarangKeluarTable() {
  const store = useSppgSystemStore();

  // Modal Scan Barcode (sama persis dengan fitur stock out di KUD)
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  // State Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Data berhasil disimpan!");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulasi data hasil barcode scan barang keluar
    const sampleOutputs = [
      {
        productId: "PRD-251026-01",
        namaBarang: "Beras Pandan Wangi",
        tujuan: "Dapur Masak MBG Pagi",
        qty: 30,
        satuan: "Kg",
      },
      {
        productId: "PRD-251026-06",
        namaBarang: "Telur Ayam Ras",
        tujuan: "Menu Sarapan Sehat Siswa",
        qty: 20,
        satuan: "Kg",
      },
      {
        productId: "PRD-251026-05",
        namaBarang: "Jagung Manis",
        tujuan: "Dapur Pengolahan Sup Siang",
        qty: 15,
        satuan: "Kg",
      },
    ];

    const randomItem =
      sampleOutputs[Math.floor(Math.random() * sampleOutputs.length)];

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()}`;

    store.addBarangKeluar({
      kodeKeluar: `BK-${Date.now().toString().slice(-6)}`,
      productId: randomItem.productId,
      namaBarang: randomItem.namaBarang,
      tujuan: randomItem.tujuan,
      qty: randomItem.qty,
      satuan: randomItem.satuan,
      date: dateStr,
      petugas: "Petugas Distribusi SPPG",
    });

    setIsScanModalOpen(false);
    triggerToast(
      `Barang keluar ${randomItem.namaBarang} (${randomItem.qty} ${randomItem.satuan}) berhasil dicatat!`
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
            onClick={() => setIsScanModalOpen(true)}
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
                <th className="py-3.5 px-4">ID Produk</th>
                <th className="py-3.5 px-4">Nama Barang</th>
                <th className="py-3.5 px-4">Tujuan / Dapur Olah</th>
                <th className="py-3.5 px-4 text-center">Jumlah Keluar</th>
                <th className="py-3.5 px-4">Tanggal Keluar</th>
                <th className="py-3.5 px-4">Petugas Distribusi</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
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
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          store.deleteBarangKeluar(row.id);
                          triggerToast("Data barang keluar berhasil dihapus.");
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus data"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">
                Barang Keluar
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
                  Scan Barcode Produk Keluar
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
