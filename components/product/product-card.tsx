"use client";

import {
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Plus,
  Columns3,
  GripVertical,
} from "lucide-react"

export default function ProductCard() {
  return (
    <div className="space-y-6 mx-auto">
      {/* 1. Baris Kartu Metrik (4 Kolom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-sm font-medium text-gray-500">Total Revenue</span>
            <span className="flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <TrendingUp className="w-3 h-3 mr-1" /> +12.5%
            </span>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900">$1,250.00</h3>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
              Trending up this month <TrendingUp className="w-3.5 h-3.5" />
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Visitors for the last 6 months</p>
          </div>
        </div>

        {/* New Customers */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-sm font-medium text-gray-500">New Customers</span>
            <span className="flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
              <TrendingDown className="w-3 h-3 mr-1" /> -20%
            </span>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900">1,234</h3>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
              Down 20% this period <TrendingDown className="w-3.5 h-3.5" />
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Acquisition needs attention</p>
          </div>
        </div>

        {/* Active Accounts */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-sm font-medium text-gray-500">Active Accounts</span>
            <span className="flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <TrendingUp className="w-3 h-3 mr-1" /> +12.5%
            </span>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900">45,678</h3>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
              Strong user retention <TrendingUp className="w-3.5 h-3.5" />
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Engagement exceed targets</p>
          </div>
        </div>

        {/* Growth Rate */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-sm font-medium text-gray-500">Growth Rate</span>
            <span className="flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <TrendingUp className="w-3 h-3 mr-1" /> +4.5%
            </span>
          </div>
          <div className="my-3">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900">4.5%</h3>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
              Steady performance <TrendingUp className="w-3.5 h-3.5" />
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Meets growth projections</p>
          </div>
        </div>
      </div>
    </div>
  );
}