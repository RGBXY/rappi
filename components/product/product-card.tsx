"use client";

import {
  Package,
  PackageMinus,
  Truck,
  Boxes,
} from "lucide-react";

export default function ProductCard() {
  return (
    <div className="space-y-6 mx-auto">
      {/* 1. Baris Kartu Metrik (4 Kolom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stok Gudang */}
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

        {/* Stok Display */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
              <Boxes className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900">
              250 <span className="text-lg font-semibold text-gray-500">Kg</span>
            </h3>
            <p className="font-medium text-gray-500 mt-1">Stok Display</p>
          </div>
        </div>

        {/* Retur Minggu Ini */}
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

        {/* Produk Olah Kembali */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900">
              170 <span className="text-lg font-semibold text-gray-500">Sisir</span>
            </h3>
            <p className="font-medium text-gray-500 mt-1">
              Produk Olah Kembali
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
