"use client";

import React, { useState } from "react";
import { MoreVertical, Plus, GripVertical, Trash2, ScanBarcode, Edit, X, CheckCircle2 } from "lucide-react";
import TabNavigation, { TabItem } from "../ui/tab";
import { useProductStore } from "@/stores/useProductStore";
import Image from "next/image";

export default function ProductTable() {
  const store = useProductStore();
  const [currentTab, setCurrentTab] = useState("Products");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);


 const statusStyles: Record<string, string> = {
  reworked: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  perish: "bg-red-50 text-red-700 border-red-200",
};

const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
const [isModalOpen2, setIsModalOpen2] = useState<boolean>(false);

const getStatusBadge = (status?: string) => {
  const key = status?.toLowerCase() ?? "";
  return statusStyles[key] || "bg-gray-50 text-gray-700 border-gray-200";
};

const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    // Otomatis hilang setelah 3 detik
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Daftar Tab dengan badge dinamis dari store
  const productTabs: TabItem[] = [
    { label: "Products"},
    { label: "Stock in"},
    { label: "Stock out"},
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
          <td className="py-3 px-4 font-semibold ">{row.productId}</td>
          <td className="py-3 px-4 ">{row.name}</td>
          <td className="py-3 px-4 font-medium">{row.stockDisplay}</td>
          <td className="py-3 px-4">{row.stockWareHouse}</td>
          <td className="py-3 px-4">
            <span className="px-2 py-0.5 rounded-md text-sm">
              {row.stock}  
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
          <td className="py-3 px-4 font-semibold">
            <div>{row.productId}</div>
          </td>
          <td className="py-3 px-4 font-medium ">{row.name}</td>
          <td className="py-3 px-4">{row.supplier}</td>
          <td className="py-3 px-4 ">{row.qty}</td>
          <td className="py-3 px-4 ">{row.date}</td>
        </>
      ),
    },

    "Stock out": {
      headers: ["Product ID", "Product Name", "Qty", "Date"],
      getData: () => store.stockOutList,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold">{row.productId}</td>
          <td className="py-3 px-4">{row.name}</td>
          <td className="py-3 px-4 font-medium">{row.qty}</td>
          <td className="py-3 px-4">{row.date}</td>
        </>
      ),
    },

    Returns: {
      headers: ["Product ID", "Product Name", "Qty", "Reason", "Status"],
      getData: () => store.returnList,
      onUpdate: store.upadteReturn,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold">{row.productId}</td>
          <td className="py-3 px-4">{row.name}</td>
          <td className="py-3 px-4">{row.qty}</td>
          <td className="py-3 px-4">{row.reason}</td>
          <td className="py-3 px-4">
           <span
            className={`px-2 py-0.5 rounded-md text-sm border ${getStatusBadge(row.status)}`}
          >
            {row.status}
          </span>
          </td>
        </>
      ),
    },

    Reworked: {
      headers: ["Product ID", "Product Name", "Display Stock", "Warehouse Stock", "Total Stock"],
      getData: () => store.reworkedList,
      onUpdate: store.upadteReturn,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold">{row.productId}</td>
          <td className="py-3 px-4">{row.name}</td>
          <td className="py-3 px-4">{row.stockDisplay}</td>
          <td className="py-3 px-4 text-">{row.stockWareHouse}</td>
          <td className="py-3 px-4 text-">{row.stock}</td>
          
        </>
      ),
    },

    Perish: {
      headers: ["Product ID", "Product Name", "Qty", "Reason"],
      getData: () => store.perishList,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold">{row.productId}</td>
          <td className="py-3 px-4 ">{row.name}</td>
          <td className="py-3 px-4 text-">{row.qty}</td>
          <td className="py-3 px-4 text-">{row.reason}</td>
        </>
      ),
    },

    "Stock Change Log": {
      headers: ["Product ID", "Product Name", "Display Stock", "Warehouse Stock", "Total Stock", "Date"],
      getData: () => store.stockChangeLog,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold">{row.productId}</td>
          <td className="py-3 px-4">{row.name}</td>
          <td className="py-3 px-4">{row.stockDisplay}</td>
          <td className="py-3 px-4">{row.stockWareHouse}</td>
          <td className="py-3 px-4">{row.stock}</td>
          <td className="py-3 px-4">{row.date}</td>
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
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Stock in</span>
          </button>
          </div>
          <div className="flex items-center gap-2">
            <button
            type="button"
            onClick={() => setIsModalOpen2(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <ScanBarcode className="w-4.5 h-4.5" />
              <span>Stock out</span>
            </button>
          </div>
          </div>

          {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          {/* Card Container */}
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Stock In</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Modal */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast()
                setIsModalOpen(false);
              }}
            >
              <div className="py-4 space-y-4">
                {/* Input: Nama Produk */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama produk"
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

               <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <select
                  required
                  defaultValue=""
                  className="w-full px-3.5 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                >
                  <option value="" disabled>
                    Pilih Supplier
                  </option>
                  <option value="supplier_a">PT Sumber Makmur</option>
                  <option value="supplier_b">CV Maju Jaya</option>
                  <option value="supplier_c">PT Berkah Abadi</option>
                </select>
              </div>

                {/* Grid 2 Kolom untuk Stok */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Stock Display
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="0"
                      className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Stock Warehouse
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="0"
                      className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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

          {isModalOpen2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          {/* Card Container */}
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Stock Out</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen2(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Modal */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerToast()
                setIsModalOpen2(false);
              }}
            >
              <div className="w-full flex flex-col items-center gap-6 my-5" >
                <div className="border h- w-full" >
                  <Image src={"/img/scan_barcode.png"} width={300} height={300} alt="scan" className="w-full h-full"/>
                </div>
              <span className="mx-auto" >Scan Product Barcode</span>
              </div>

              {/* Footer Modal */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen2(false)}
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

      {/* ... kode modal kamu ... */}

      {/* Ganti alert() di onSubmit modal dengan triggerToast() */}
      {/* onSubmit={(e) => { e.preventDefault(); triggerToast(); setIsModalOpen(false); }} */}

      {/* Komponen Toast Pop-up */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white text-foreground rounded-xl shadow-lg border border-gray-400 transition-all animate-bounce-once">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">Data berhasil disimpan!</span>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="p-1 -mr-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      </div>

      {/* Dynamic Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium">
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
                    >
                     
                      {/* Sel Kolom Dinamis Sesuai Tab */}
                      {currentConfig.renderRow(row)}

                      {/* Tombol Delete / Action Dinamis */}
                      {currentConfig.onUpdate && (
                        <td className="py-3 px-4">
                          <button
                            onClick={() => currentConfig.onUpdate!(row.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Action"
                          >
                            <Edit className="w-3.5 h-3.5" />
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