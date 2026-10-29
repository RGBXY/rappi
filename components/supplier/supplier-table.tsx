"use client";

import React, { useState } from "react";
import { MoreVertical, Plus, GripVertical, Trash2, ScanBarcode, Edit, X, CheckCircle2, Trash } from "lucide-react";
import TabNavigation, { TabItem } from "../ui/tab";
import { useProductStore } from "@/stores/useProductStore";
import Image from "next/image";
import { useSupplierStore } from "@/stores/useSupplierStore";

export default function ProductTable() {
  const store = useSupplierStore();
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

  return (
    <div className="space-y-6 mx-auto">
      {/* Tab Navigation & Dynamic Action Button */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold" >Suppliers Data</h1>

        {/* Action Button: Hanya muncul jika tab memiliki properti actionLabel */}
        <div className="flex items-center gap-2" >
          <div className="flex items-center gap-2">
           <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Add Supplier</span>
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
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Supplier Name"
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>  

               <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Telp
                </label>
                  <input
                    type="text"
                    required
                    placeholder="No Telp"
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
              </div>               
               <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Address
                </label>
                  <input
                    type="text"
                    required
                    placeholder="Supplier Address"
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
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
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Address</th>
                    <th className="py-3.5 px-4">Telp</th>
                    <th className="py-3.5 px-4">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                {store.suppliers.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900">{row.name}</td>
                    <td className="py-3 px-4">
                        <span className="py-0.5 rounded-md ">
                        {row.address}
                        </span>
                    </td>
                    <td className="py-3 px-4">
                        <span className="py-0.5 rounded-md ">
                        {row.telp}
                        </span>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() => store.updateSupplier!(row.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Action"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => store.updateSupplier!(row.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Action"
                        >
                          <Trash className="w-3.5 h-3.5" />
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