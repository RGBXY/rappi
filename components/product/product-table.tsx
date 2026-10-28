"use client";

import React, { useState } from "react";
import { MoreVertical, Plus, GripVertical, Trash2, ScanBarcode } from "lucide-react";
import TabNavigation, { TabItem } from "../ui/tab";
import { useProductStore } from "@/stores/useProductStore";

export default function ProductTable() {
  const store = useProductStore();
  const [currentTab, setCurrentTab] = useState("Products");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Daftar Tab dengan badge dinamis dari store
  const productTabs: TabItem[] = [
    { label: "Products", badge: store.products.length },
    { label: "Stock in", badge: store.stockInList.length },
    { label: "Stock out", badge: store.stockOutList.length },
    { label: "Returns", badge: store.returnList.length },
    { label: "Reworked" },
    { label: "Perish" },
    { label: "Stock Change Log" },
  ];

  // Mapping konfigurasi tabel berdasarkan tab aktif
  const tabConfigs: Record<
    string,
    {
      headers: string[];
      getData: () => any[];
      onUpdate?: (id: number) => void;
      renderRow: (row: any) => React.ReactNode;
    }
  > = {
    Products: {
      headers: ["Product ID", "Product Name", "Display Stock", "Warehouse Stock", "Total Stock"],
      getData: () => store.products,
      onUpdate: store.updateProduct,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold text-gray-900">{row.name}</td>
          <td className="py-3 px-4 text-gray-500 font-mono">{row.sku}</td>
          <td className="py-3 px-4 font-medium">{row.stock}</td>
          <td className="py-3 px-4">{row.unit}</td>
          <td className="py-3 px-4">
            <span className="px-2 py-0.5 rounded-md text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
              {row.status}  
            </span>
          </td>
        </>
      ),
    },

    "Stock in": {
      headers: ["Product ID", "Product Name", "Supplier", "Qty", "Date"],
      getData: () => store.stockInList,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-mono font-medium">
            <div>
                {row.docNo}
            </div>
          </td>
          <td className="py-3 px-4 font-medium text-gray-900">{row.supplier}</td>
          <td className="py-3 px-4">{row.itemsCount} Barang</td>
          <td className="py-3 px-4 text-gray-500">{row.date}</td>
        </>
      ),
    },

    "Stock out": {
      headers: ["Product ID", "Product Name", "Qty", "Date"],
      getData: () => store.stockOutList,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-mono font-medium text-gray-800">{row.docNo}</td>
          <td className="py-3 px-4 text-gray-900">{row.recipient}</td>
          <td className="py-3 px-4 font-medium">{row.totalQty}</td>
          <td className="py-3 px-4 text-gray-500">{row.date}</td>
        </>
      ),
    },

    Returns: {
      headers: ["Product ID", "Product Name", "Qty", "Reason", "Status"],
      getData: () => store.returnList,
      onUpdate: store.upadteReturn,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-medium text-gray-900">{row.productName}</td>
          <td className="py-3 px-4 text-rose-600">{row.reason}</td>
          <td className="py-3 px-4 text-">{row.qty}</td>
          <td className="py-3 px-4">
            <span className="px-2 py-0.5 rounded-md text-[11px] bg-amber-50 text-amber-700 border border-amber-200">
              {row.status}
            </span>
          </td>
        </>
      ),
    },

    Reworked: {
      headers: ["Product ID", "Product Name", "Display Stock", "Warehouse Stock", "Total Stock"],
      getData: () => store.returnList,
      onUpdate: store.upadteReturn,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-medium text-gray-900">{row.productName}</td>
          <td className="py-3 px-4 text-rose-600">{row.reason}</td>
          <td className="py-3 px-4 text-">{row.qty}</td>
          <td className="py-3 px-4">
            <span className="px-2 py-0.5 rounded-md text-[11px] bg-amber-50 text-amber-700 border border-amber-200">
              {row.status}
            </span>
          </td>
        </>
      ),
    },

    Perish: {
      headers: ["Product ID", "Product Name", "Qty", "Reason"],
      getData: () => store.returnList,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-medium text-gray-900">{row.productName}</td>
          <td className="py-3 px-4 text-rose-600">{row.reason}</td>
          <td className="py-3 px-4 text-">{row.qty}</td>
          <td className="py-3 px-4">
            <span className="px-2 py-0.5 rounded-md text-[11px] bg-amber-50 text-amber-700 border border-amber-200">
              {row.status}
            </span>
          </td>
        </>
      ),
    },

    "Stock Change Log": {
      headers: ["Product ID", "Product Name", "Display Stock", "Warehouse Stock", "Total Stock"],
      getData: () => store.returnList,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-medium text-gray-900">{row.productName}</td>
          <td className="py-3 px-4 text-rose-600">{row.reason}</td>
          <td className="py-3 px-4 text-">{row.qty}</td>
          <td className="py-3 px-4">
            <span className="px-2 py-0.5 rounded-md text-[11px] bg-amber-50 text-amber-700 border border-amber-200">
              {row.status}
            </span>
          </td>
        </>
      ),
    },
  };

  // Ambil config aktif saat ini (dengan fallback jika tab belum dikonfigurasi)
  const currentConfig = tabConfigs[currentTab] || {
    headers: ["Data", "Keterangan"],
    getData: () => [],
    renderRow: () => (
      <td colSpan={2} className="py-4 px-4 text-gray-400">
        Belum ada konfigurasi untuk tab ini
      </td>
    ),
  };

  const tableData = currentConfig.getData();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(e.target.checked ? tableData.map((d) => d.id) : []);
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Tab Navigation & Dynamic Action Button */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <TabNavigation
          tabs={productTabs}
          activeTab={currentTab}
          onChange={(tab) => {
            setCurrentTab(tab);
            setSelectedIds([]);
          }}
        />

        {/* Action Button: Hanya muncul jika tab memiliki properti actionLabel */}
        <div className="flex items-center gap-2" >
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Stock in</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <ScanBarcode className="w-4.5 h-4.5" />
              <span>Stock out</span>
            </button>
          </div>
          </div>
      </div>

      {/* Dynamic Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium">
                <th className="py-3.5 px-4 w-10"></th>
                <th className="py-3.5 px-2 w-10">
                  <input
                    type="checkbox"
                    checked={tableData.length > 0 && selectedIds.length === tableData.length}
                    onChange={handleSelectAll}
                    className="rounded-sm border-gray-300 accent-emerald-600 cursor-pointer"
                  />
                </th>
                {/* Header Dinamis */}
                {currentConfig.headers.map((headerText, idx) => (
                  <th key={idx} className="py-3.5 px-4">
                    {headerText}
                  </th>
                ))}
                {/* Kolom Aksi (hanya jika ada onDelete) */}
                {currentConfig.onUpdate && <th className="py-3.5 px-4 w-12 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {tableData.length > 0 ? (
                tableData.map((row) => {
                  const isChecked = selectedIds.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors ${
                        isChecked ? "bg-emerald-50/40" : "hover:bg-gray-50/60"
                      }`}
                    >
                      <td className="py-3 px-4 text-gray-300">
                        <GripVertical className="w-4 h-4 cursor-grab" />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(row.id)}
                          className="rounded-sm border-gray-300 accent-emerald-600 cursor-pointer"
                        />
                      </td>

                      {/* Sel Kolom Dinamis Sesuai Tab */}
                      {currentConfig.renderRow(row)}

                      {/* Tombol Delete / Action Dinamis */}
                      {currentConfig.onUpdate && (
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => currentConfig.onUpdate!(row.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Action"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={currentConfig.headers.length + 3}
                    className="py-12 text-center text-gray-400 font-normal"
                  >
                    No Data Found
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