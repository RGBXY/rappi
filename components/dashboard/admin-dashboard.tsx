"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  MoreVertical,
  GripVertical,
  Package,
  ShoppingCart,
  Truck,
  PackageMinus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import TabNavigation from "../ui/tab";
import { useProductStore } from "@/stores/useProductStore";

// Data dummy chart area bertumpuk/bergelombang
const chartData = [
  { date: "Jun 1", current: 40, previous: 25 },
  { date: "Jun 3", current: 95, previous: 48 },
  { date: "Jun 5", current: 75, previous: 40 },
  { date: "Jun 7", current: 65, previous: 50 },
  { date: "Jun 9", current: 100, previous: 60 },
  { date: "Jun 11", current: 35, previous: 20 },
  { date: "Jun 13", current: 90, previous: 50 },
  { date: "Jun 15", current: 70, previous: 45 },
  { date: "Jun 17", current: 110, previous: 65 },
  { date: "Jun 19", current: 45, previous: 28 },
  { date: "Jun 21", current: 85, previous: 52 },
  { date: "Jun 23", current: 115, previous: 60 },
  { date: "Jun 25", current: 40, previous: 22 },
  { date: "Jun 27", current: 105, previous: 58 },
  { date: "Jun 30", current: 85, previous: 50 },
];

export default function AdminDashboard() {
  const store = useProductStore();
  const [activeRange, setActiveRange] = useState("Last 30 days");
  const [currentTab, setCurrentTab] = useState("Products");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  return (
    <div className="space-y-6 mx-auto">
      {/* 1. Baris Kartu Metrik (4 Kolom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Order */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
            <ShoppingCart className="w-6 h-6" />
          </div>  
        </div>
        <div className="mt-5">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">10</h3>
          <p className="font-medium text-gray-500 mt-1">Total Order This Week</p>
         
        </div>
      </div>

      {/* Stock */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
            <Package className="w-6 h-6" />
          </div>
          
        </div>
        <div className="mt-5">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">200</h3>
          <p className="font-medium text-gray-500 mt-1">Warehouse Stock</p>
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
          <p className="font-medium text-gray-500 mt-1">Total Supplier</p>
        </div>
      </div>
    </div>

      {/* 2. Kartu Chart Area */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-gray-900">Total Order</h2>
            <p className="text-sm text-gray-400 mt-0.5">Total for the last 3 months</p>
          </div>

          {/* Filter Range Tab */}
          <div className="inline-flex rounded-xl border border-gray-200 p-0.5 text-sm font-medium bg-gray-50/50">
            {["Last 3 months", "Last 30 days", "Last 7 days"].map((range) => (
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
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
                tick={{ fontSize: 14, fill: "#9ca3af" }}
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

      {/* 4. Data Table */}
      <div className="flex gap-4" >
      <div className="w-full bg-white p-6 rounded-lg border border-gray-300" >
        <h1 className="font-semibold mb-4" >Product to Restock</h1>
        <div className="w-full overflow-hidden rounded-lg border">
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
                <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium">
                    <th className="py-3.5 px-4">Product ID</th>
                    <th className="py-3.5 px-4">Product Name</th>
                    <th className="py-3.5 px-4">Display Stock</th>
                    <th className="py-3.5 px-4">Warehouse Stock</th>
                    <th className="py-3.5 px-4">Total Stock</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                {store.products.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900">{row.productId}</td>
                    <td className="py-3 px-4">
                        <span className="py-0.5 rounded-md ">
                        {row.name}
                        </span>
                    </td>
                    <td className="py-3 px-4">
                        <span className="py-0.5 rounded-md ">
                        {row.stockDisplay}
                        </span>
                    </td>
                    <td className="py-3 px-4">
                        <span className="py-0.5 rounded-md ">
                        {row.stockWareHouse}
                        </span>
                    </td>
                    <td className="py-3 px-4">
                        <span className="py-0.5 rounded-md ">
                        {row.stock}
                        </span>
                    </td>                                      
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
      </div>
      <div className="w-full bg-white p-6 rounded-lg border border-gray-300" >
        <h1 className="font-semibold mb-4" >Product Return</h1>
        <div className="w-full overflow-hidden rounded-lg border">
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
                <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium">
                    <th className="py-3.5 px-4">Product ID</th>
                    <th className="py-3.5 px-4">Product Name</th>
                    <th className="py-3.5 px-4">Qty</th>
                    <th className="py-3.5 px-4">Reason</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                {store.returnList.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900">{row.productId}</td>
                    <td className="py-3 px-4">
                        <span className="py-0.5 rounded-md ">
                        {row.name}
                        </span>
                    </td>
                    <td className="py-3 px-4">
                        <span className="py-0.5 rounded-md ">
                        {row.qty}
                        </span>
                    </td>                    
                    <td className="py-3 px-4">
                        <span className="py-0.5 rounded-md ">
                        {row.reason}
                        </span>
                    </td>                    
                    <td className="py-3 px-4">
                        <span className="py-0.5 rounded-md ">
                        {row.status}
                        </span>
                    </td>                    
                    <td className="py-3 px-4">
                        <span className="py-0.5 rounded-md ">
                        {row.date}
                        </span>
                    </td>                    
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
      </div>
     
     
      </div>
    </div>
  );
}