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

export default function SupplierTable() {
  const [activeRange, setActiveRange] = useState("Last 30 days");
  const [activeTab, setActiveTab] = useState("Outline");

  return (
    <div className="space-y-6 mx-auto">
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