"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Plus,
  Columns3,
  GripVertical,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

// Data baris tabel
const tableRows = [
  {
    id: 1,
    header: "Cover page",
    type: "Cover page",
    target: 18,
    limit: 5,
    reviewer: "Eddie Lake",
  },
  {
    id: 2,
    header: "Table of contents",
    type: "Table of contents",
    target: 29,
    limit: 24,
    reviewer: "Eddie Lake",
  },
  {
    id: 3,
    header: "Executive summary",
    type: "Narrative",
    target: 10,
    limit: 13,
    reviewer: "Eddie Lake",
  },
];

export default function AdminDashboard() {
  const [activeRange, setActiveRange] = useState("Last 30 days");
  const [activeTab, setActiveTab] = useState("Outline");

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

      {/* 2. Kartu Chart Area */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-gray-900">Total Visitors</h2>
            <p className="text-xs text-gray-400 mt-0.5">Total for the last 3 months</p>
          </div>

          {/* Filter Range Tab */}
          <div className="inline-flex rounded-xl border border-gray-200 p-0.5 text-xs font-medium bg-gray-50/50">
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
                tick={{ fontSize: 11, fill: "#9ca3af" }}
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

      {/* 3. Section Controls & Navigasi Tab */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tab Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: "Outline" },
            { label: "Past Performance", badge: 3 },
            { label: "Key Personnel", badge: 2 },
            { label: "Focus Documents" },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.label
                  ? "bg-white border border-gray-200 text-gray-900 shadow-2xs font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-700 text-[10px] flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50">
            <Columns3 className="w-3.5 h-3.5" />
            <span>Customize Columns</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Section</span>
          </button>
        </div>
      </div>

      {/* 4. Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium">
                <th className="py-3.5 px-4 w-10"></th>
                <th className="py-3.5 px-2 w-10">
                  <input type="checkbox" className="rounded-sm border-gray-300 accent-emerald-600" />
                </th>
                <th className="py-3.5 px-4">Header</th>
                <th className="py-3.5 px-4">Section Type</th>
                <th className="py-3.5 px-4 text-center">Target</th>
                <th className="py-3.5 px-4 text-center">Limit</th>
                <th className="py-3.5 px-4">Reviewer</th>
                <th className="py-3.5 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {tableRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4 text-gray-300">
                    <GripVertical className="w-4 h-4 cursor-grab" />
                  </td>
                  <td className="py-3 px-2">
                    <input type="checkbox" className="rounded-sm border-gray-300 accent-emerald-600" />
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{row.header}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-md border border-gray-200 bg-gray-50 text-gray-600 font-medium text-[11px]">
                      {row.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-3 py-1 rounded-md border border-gray-200 min-w-10 text-center font-medium">
                      {row.target}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-3 py-1 rounded-md border border-gray-200 min-w-10 text-center font-medium">
                      {row.limit}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">{row.reviewer}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="p-1 rounded-md text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}