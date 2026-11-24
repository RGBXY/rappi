"use client";

import React, { useState, useMemo } from "react";
import { useSppgSystemStore } from "@/stores/useSppgSystemStore";
import {
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  Package,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function SppgStokTable() {
  const store = useSppgSystemStore();
  const [searchQuery, setSearchQuery] = useState("");

  // Kalkulasi data stok SPPG dinamis berdasarkan barangMasukList dan barangKeluarList
  const stockInventory = useMemo(() => {
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

    // 1. Akumulasi Barang Masuk
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

    // 2. Pengurangan Barang Keluar
    store.barangKeluarList.forEach((bk) => {
      const existing = map.get(bk.productId);
      if (existing) {
        existing.totalKeluar += bk.qty;
        existing.stokTersedia = Math.max(0, existing.stokTersedia - bk.qty);
      }
    });

    return Array.from(map.values());
  }, [store.barangMasukList, store.barangKeluarList]);

  // Statistik Ringkasan
  const totalKomoditas = stockInventory.length;
  const grandTotalMasuk = stockInventory.reduce((acc, curr) => acc + curr.totalMasuk, 0);
  const grandTotalKeluar = stockInventory.reduce((acc, curr) => acc + curr.totalKeluar, 0);
  const grandTotalTersedia = stockInventory.reduce((acc, curr) => acc + curr.stokTersedia, 0);

  // Filter pencarian
  const filteredInventory = useMemo(() => {
    if (!searchQuery.trim()) return stockInventory;
    const query = searchQuery.toLowerCase();
    return stockInventory.filter(
      (item) =>
        item.namaBarang.toLowerCase().includes(query) ||
        item.productId.toLowerCase().includes(query) ||
        item.stockId.toLowerCase().includes(query) ||
        item.pemasok.toLowerCase().includes(query)
    );
  }, [stockInventory, searchQuery]);

  return (
    <div className="space-y-6 mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Data Stok Bahan Pangan SPPG
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitoring kuantitas fisik komoditas bahan pangan yang tersimpan di gudang SPPG siap didistribusikan ke dapur MBG.
          </p>
        </div>

        {/* Quick Navigasi */}
        <div className="flex items-center gap-2">
          <Link
            href="/sppg/barang-masuk"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold shadow-2xs transition-colors"
          >
            <ArrowDownToLine className="w-4 h-4 text-emerald-600" />
            <span>Penerimaan Masuk</span>
          </Link>
          <Link
            href="/sppg/barang-keluar"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold shadow-2xs transition-colors"
          >
            <ArrowUpFromLine className="w-4 h-4 text-rose-600" />
            <span>Pengeluaran Dapur</span>
          </Link>
        </div>
      </div>

      {/* Kartu Ringkasan Stok */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Komoditas</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-gray-900">
              {totalKomoditas}
            </span>
            <span className="text-xs text-gray-500 ml-1.5">Jenis Bahan</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Komoditas tersimpan di gudang
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Stok Masuk</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-700">
              +{grandTotalMasuk.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-gray-500 ml-1.5">Unit</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Akumulasi dari pasokan Koperasi
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Keluar Dapur</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-rose-600">
              -{grandTotalKeluar.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-gray-500 ml-1.5">Unit</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Didistribusikan ke dapur MBG
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Sisa Stok Tersedia</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-gray-900">
              {grandTotalTersedia.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-gray-500 ml-1.5">Unit</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">
            Siap pakai di gudang SPPG
          </p>
        </div>
      </div>

      {/* Pencarian dan Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari komoditas, ID Stok, atau ID Produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
          />
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Menampilkan <strong className="text-gray-900">{filteredInventory.length}</strong> komoditas
        </div>
      </div>

      {/* Tabel Data Stok SPPG */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                <th className="py-3.5 px-4">ID Stok</th>
                <th className="py-3.5 px-4">ID Produk</th>
                <th className="py-3.5 px-4">Nama Komoditas</th>
                <th className="py-3.5 px-4">Pemasok (Koperasi)</th>
                <th className="py-3.5 px-4 text-center">Total Masuk</th>
                <th className="py-3.5 px-4 text-center">Total Keluar</th>
                <th className="py-3.5 px-4 text-center">Stok Tersedia</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr
                    key={item.productId}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-xs text-emerald-800">
                      {item.stockId}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs font-semibold">
                      {item.productId}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-900">
                      {item.namaBarang}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 text-xs">
                      {item.pemasok}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-emerald-700">
                      +{item.totalMasuk} {item.satuan}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-rose-600">
                      -{item.totalKeluar} {item.satuan}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold text-gray-900 bg-gray-100 border border-gray-200">
                        {item.stokTersedia} {item.satuan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.stokTersedia > 25 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aman</span>
                        </span>
                      ) : item.stokTersedia > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Menipis</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <span>Habis</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-gray-400 font-normal"
                  >
                    Tidak ada data stok komoditas ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
