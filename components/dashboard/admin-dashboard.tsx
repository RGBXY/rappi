"use client";

import React, { useState } from "react";
import {
  Package,
  ShoppingCart,
  Truck,
  PackageMinus,
  ArrowDownToLine,
  ArrowUpFromLine,
  Building,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useProductStore } from "@/stores/useProductStore";
import { useAuthStore } from "@/stores/useUserStore";
import { useSppgSystemStore } from "@/stores/useSppgSystemStore";

// Data dummy chart area bertumpuk
const chartData = [
  { date: "1 Jun", current: 40, previous: 25 },
  { date: "3 Jun", current: 95, previous: 48 },
  { date: "5 Jun", current: 75, previous: 40 },
  { date: "7 Jun", current: 65, previous: 50 },
  { date: "9 Jun", current: 100, previous: 60 },
  { date: "11 Jun", current: 35, previous: 20 },
  { date: "13 Jun", current: 90, previous: 50 },
  { date: "15 Jun", current: 70, previous: 45 },
  { date: "17 Jun", current: 110, previous: 65 },
  { date: "19 Jun", current: 45, previous: 28 },
  { date: "21 Jun", current: 85, previous: 52 },
  { date: "23 Jun", current: 115, previous: 60 },
  { date: "25 Jun", current: 40, previous: 22 },
  { date: "27 Jun", current: 105, previous: 58 },
  { date: "30 Jun", current: 85, previous: 50 },
];

export default function AdminDashboard() {
  const store = useProductStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const sppgStore = useSppgSystemStore();
  const [activeRange, setActiveRange] = useState("30 Hari Terakhir");

  const isSppg = currentUser?.role === "sppg";

  return (
    <div className="space-y-6 mx-auto">
      {/* 1. Baris Kartu Metrik (4 Kolom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isSppg ? (
          <>
            {/* SPPG Card 1: Total Pesanan */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-5">
                <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                  {sppgStore.orders.length}
                </h3>
                <p className="font-medium text-gray-500 mt-1">
                  Total Pesanan Bahan Pangan
                </p>
              </div>
            </div>

            {/* SPPG Card 2: Barang Masuk */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                  <ArrowDownToLine className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-5">
                <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                  {sppgStore.barangMasukList.reduce((acc, i) => acc + i.qty, 0)}{" "}
                  <span className="text-lg font-semibold text-gray-500">Kg</span>
                </h3>
                <p className="font-medium text-gray-500 mt-1">
                  Total Pasokan Masuk Gudang
                </p>
              </div>
            </div>

            {/* SPPG Card 3: Barang Keluar */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
                  <ArrowUpFromLine className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-5">
                <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                  {sppgStore.barangKeluarList.reduce((acc, i) => acc + i.qty, 0)}{" "}
                  <span className="text-lg font-semibold text-gray-500">Kg</span>
                </h3>
                <p className="font-medium text-gray-500 mt-1">
                  Distribusi ke Dapur Masak
                </p>
              </div>
            </div>

            {/* SPPG Card 4: Koperasi Mitra */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                  <Building className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-5">
                <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                  {sppgStore.coperatives.length}
                </h3>
                <p className="font-medium text-gray-500 mt-1">
                  Koperasi Mitra Pangan
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Coperative Card 1: Total Pesanan */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-5">
                <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                  10
                </h3>
                <p className="font-medium text-gray-500 mt-1">
                  Total Pesanan Minggu Ini
                </p>
              </div>
            </div>

            {/* Coperative Card 2: Stok Gudang */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                  <Package className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-5">
                <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                  500 <span className="text-lg font-semibold text-gray-500">Kg</span>
                </h3>
                <p className="font-medium text-gray-500 mt-1">Stok Gudang</p>
              </div>
            </div>

            {/* Coperative Card 3: Retur Produk */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                  <PackageMinus className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-5">
                <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                  15 <span className="text-lg font-semibold text-gray-500">Kg</span>
                </h3>
                <p className="font-medium text-gray-500 mt-1">
                  Produk Retur Minggu Ini
                </p>
              </div>
            </div>

            {/* Coperative Card 4: Total Pemasok */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                  <Truck className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-5">
                <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                  20
                </h3>
                <p className="font-medium text-gray-500 mt-1">Total Pemasok</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 2. Kartu Chart Area */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {isSppg ? "Aktivitas Pasokan & Permintaan" : "Tren Pesanan"}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Statistik pemenuhan selama 3 bulan terakhir
            </p>
          </div>

          {/* Filter Range Tab */}
          <div className="inline-flex rounded-xl border border-gray-200 p-0.5 text-sm font-medium bg-gray-50/50">
            {["3 Bulan Terakhir", "30 Hari Terakhir", "7 Hari Terakhir"].map((range) => (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeRange === range
                    ? "bg-emerald-100 text-emerald-900 font-semibold shadow-2xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="primaryArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="secondaryArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 13, fill: "#9ca3af" }}
                dy={10}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="natural"
                dataKey="current"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#primaryArea)"
              />
              <Area
                type="natural"
                dataKey="previous"
                stroke="#34d399"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#secondaryArea)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Data Tables */}
      <div className="flex flex-col lg:flex-row gap-4">
        {isSppg ? (
          <>
            {/* SPPG: Pasokan Masuk Terbaru */}
            <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h1 className="font-semibold text-gray-900 mb-4">
                Pasokan Masuk Terbaru
              </h1>
              <div className="w-full overflow-hidden rounded-xl border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                        <th className="py-3 px-4">Nama Barang</th>
                        <th className="py-3 px-4">Pemasok</th>
                        <th className="py-3 px-4 text-center">Jumlah</th>
                        <th className="py-3 px-4">Tanggal Masuk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {sppgStore.barangMasukList.slice(0, 4).map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="py-3 px-4 font-semibold text-gray-900">
                            {row.namaBarang}
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-xs">
                            {row.pemasok}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                              {row.qty} {row.satuan}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-xs">
                            {row.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* SPPG: Distribusi Keluar Terbaru */}
            <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h1 className="font-semibold text-gray-900 mb-4">
                Distribusi Keluar ke Dapur
              </h1>
              <div className="w-full overflow-hidden rounded-xl border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                        <th className="py-3 px-4">Nama Barang</th>
                        <th className="py-3 px-4">Tujuan Dapur</th>
                        <th className="py-3 px-4 text-center">Jumlah</th>
                        <th className="py-3 px-4">Tanggal Keluar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {sppgStore.barangKeluarList.slice(0, 4).map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="py-3 px-4 font-semibold text-gray-900">
                            {row.namaBarang}
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-xs">
                            {row.tujuan}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700">
                              {row.qty} {row.satuan}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-xs">
                            {row.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Coperative: Produk Perlu Restok */}
            <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h1 className="font-semibold text-gray-900 mb-4">
                Produk Perlu Restok
              </h1>
              <div className="w-full overflow-hidden rounded-xl border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                        <th className="py-3 px-4">ID Produk</th>
                        <th className="py-3 px-4">Nama Produk</th>
                        <th className="py-3 px-4">Stok Display</th>
                        <th className="py-3 px-4">Stok Gudang</th>
                        <th className="py-3 px-4">Total Stok</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {store.products.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="py-3 px-4 font-semibold text-gray-900">
                            {row.productId}
                          </td>
                          <td className="py-3 px-4 font-medium">{row.name}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {row.stockDisplay} {row.satuan || "Kg"}
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {row.stockWareHouse} {row.satuan || "Kg"}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                              {row.stock} {row.satuan || "Kg"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Coperative: Retur Produk */}
            <div className="w-full bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <h1 className="font-semibold text-gray-900 mb-4">
                Retur Produk
              </h1>
              <div className="w-full overflow-hidden rounded-xl border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                        <th className="py-3 px-4">ID Produk</th>
                        <th className="py-3 px-4">Nama Produk</th>
                        <th className="py-3 px-4">Jumlah Retur</th>
                        <th className="py-3 px-4">Alasan</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {store.returnList.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="py-3 px-4 font-semibold text-gray-900">
                            {row.productId}
                          </td>
                          <td className="py-3 px-4 font-medium">{row.name}</td>
                          <td className="py-3 px-4 font-semibold text-rose-600">
                            {row.qty} {row.satuan || "Kg"}
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-600">{row.reason}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-700 border border-amber-200">
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-xs">{row.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
