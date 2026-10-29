"use client";

import {
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Plus,
  Columns3,
  GripVertical,
  ShoppingCart,
  Package,
  PackageMinus,
  Truck,
} from "lucide-react"

export default function ProductCard() {
  return (
    <div className="space-y-6 mx-auto">
      {/* 1. Baris Kartu Metrik (4 Kolom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">      
      {/* Stock */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
            <Package className="w-6 h-6" />
          </div>
          
        </div>
        <div className="mt-5">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">1,234</h3>
          <p className="font-medium text-gray-500 mt-1">Warehouse Stock</p>
         
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
            <Package className="w-6 h-6" />
          </div>
          
        </div>
        <div className="mt-5">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">1,234</h3>
          <p className="font-medium text-gray-500 mt-1">Display Stock</p>
         
        </div>
      </div>

      {/* Active Accounts */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
            <PackageMinus className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">20</h3>
          <p className="font-medium text-gray-500 mt-1">Return Product This Week</p>
        </div>
      </div>

      {/* Growth Rate */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
            <Truck className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">20</h3>
          <p className="font-medium text-gray-500 mt-1">Reworked Porducts</p>
        </div>
      </div>
    </div>
    </div>
  );
}