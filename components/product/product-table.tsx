"use client";

import React, { useState } from "react";
import { Plus, ScanBarcode, Edit, X, CheckCircle2 } from "lucide-react";
import TabNavigation, { TabItem } from "../ui/tab";
import { useProductStore } from "@/stores/useProductStore";
import Image from "next/image";

export default function ProductTable() {
  const store = useProductStore();
  const [currentTab, setCurrentTab] = useState("Produk");

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
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Daftar Tab dengan badge dinamis dari store dalam Bahasa Indonesia
  const productTabs: TabItem[] = [
    { label: "Produk" },
    { label: "Stok Masuk" },
    { label: "Stok Keluar" },
    { label: "Retur", badge: store.returnList.length },
    { label: "Olah Kembali" },
    { label: "Pemusnahan" },
    { label: "Riwayat Stok" },
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
    Produk: {
      headers: [
        "ID Produk",
        "Nama Produk",
        "Harga Satuan",
        "Stok Display",
        "Stok Gudang",
        "Total Stok",
      ],
      getData: () => store.products,
      onUpdate: store.updateProduct,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold text-gray-900">
            {row.productId}
          </td>
          <td className="py-3 px-4 font-medium text-gray-900">{row.name}</td>
          <td className="py-3 px-4 font-medium text-gray-900">
            Rp {row.hargaSatuan?.toLocaleString("id-ID")} /{row.satuan || "Kg"}
          </td>
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
        </>
      ),
    },

    "Stok Masuk": {
      headers: ["ID Produk", "Nama Produk", "Pemasok", "Jumlah Masuk", "Tanggal"],
      getData: () => store.stockInList,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold text-gray-900">
            {row.productId}
          </td>
          <td className="py-3 px-4 font-medium">{row.name}</td>
          <td className="py-3 px-4 text-gray-700">{row.supplier}</td>
          <td className="py-3 px-4 font-semibold text-emerald-700">
            +{row.qty} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 text-gray-500 text-xs">{row.date}</td>
        </>
      ),
    },

    "Stok Keluar": {
      headers: ["ID Produk", "Nama Produk", "Jumlah Keluar", "Tanggal"],
      getData: () => store.stockOutList,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold text-gray-900">
            {row.productId}
          </td>
          <td className="py-3 px-4">{row.name}</td>
          <td className="py-3 px-4 font-semibold text-rose-600">
            -{row.qty} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 text-gray-500 text-xs">{row.date}</td>
        </>
      ),
    },

    Retur: {
      headers: ["ID Produk", "Nama Produk", "Jumlah Retur", "Alasan", "Status"],
      getData: () => store.returnList,
      onUpdate: store.upadteReturn,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold text-gray-900">
            {row.productId}
          </td>
          <td className="py-3 px-4">{row.name}</td>
          <td className="py-3 px-4 font-medium text-gray-900">
            {row.qty} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 text-gray-600">{row.reason}</td>
          <td className="py-3 px-4">
            <span
              className={`px-2 py-0.5 rounded-md text-xs border ${getStatusBadge(
                row.status
              )}`}
            >
              {row.status}
            </span>
          </td>
        </>
      ),
    },

    "Olah Kembali": {
      headers: [
        "ID Produk",
        "Nama Produk",
        "Stok Display",
        "Stok Gudang",
        "Total Stok",
      ],
      getData: () => store.reworkedList,
      onUpdate: store.upadteReturn,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold text-gray-900">
            {row.productId}
          </td>
          <td className="py-3 px-4">{row.name}</td>
          <td className="py-3 px-4 text-gray-600">
            {row.stockDisplay} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 text-gray-600">
            {row.stockWareHouse} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 font-semibold text-gray-900">
            {row.stock} {row.satuan || "Kg"}
          </td>
        </>
      ),
    },

    Kedaluwarsa: {
      headers: ["ID Produk", "Nama Produk", "Jumlah", "Alasan"],
      getData: () => store.perishList,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold text-gray-900">
            {row.productId}
          </td>
          <td className="py-3 px-4">{row.name}</td>
          <td className="py-3 px-4 font-medium text-rose-600">
            {row.qty} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 text-gray-600">{row.reason}</td>
        </>
      ),
    },

    "Riwayat Stok": {
      headers: [
        "ID Produk",
        "Nama Produk",
        "Stok Display",
        "Stok Gudang",
        "Total Stok",
        "Tanggal",
      ],
      getData: () => store.stockChangeLog,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold text-gray-900">
            {row.productId}
          </td>
          <td className="py-3 px-4">{row.name}</td>
          <td className="py-3 px-4 text-gray-600">
            {row.stockDisplay} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 text-gray-600">
            {row.stockWareHouse} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 font-semibold text-gray-900">
            {row.stock} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 text-gray-500 text-xs">{row.date}</td>
        </>
      ),
    },
  };

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
      {/* Tab Navigasi & Tombol Aksi */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <TabNavigation
          tabs={productTabs}
          activeTab={currentTab}
          onChange={(tab) => {
            setCurrentTab(tab);
          }}
        />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Stok Masuk</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen2(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <ScanBarcode className="w-4.5 h-4.5" />
              <span>Stok Keluar</span>
            </button>
          </div>
        </div>

        {/* Modal Stok Masuk */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">
                  Stok Masuk
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  triggerToast();
                  setIsModalOpen(false);
                }}
              >
                <div className="py-4 space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nama Produk
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama produk"
                      className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pemasok
                    </label>
                    <select
                      required
                      defaultValue=""
                      className="w-full px-3.5 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    >
                      <option value="" disabled>
                        Pilih Pemasok
                      </option>
                      <option value="supplier_a">PT Sumber Makmur</option>
                      <option value="supplier_b">CV Maju Jaya</option>
                      <option value="supplier_c">PT Berkah Abadi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Satuan Komoditas
                    </label>
                    <select
                      defaultValue="Kg"
                      className="w-full px-3.5 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Kg">Kg</option>
                      <option value="Sisir">Sisir</option>
                      <option value="Butir">Butir</option>
                      <option value="Liter">Liter</option>
                      <option value="Ikat">Ikat</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Stok Display
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
                        Stok Gudang
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

        {/* Modal Stok Keluar (Scan Barcode) */}
        {isModalOpen2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">
                  Stok Keluar
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen2(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  triggerToast();
                  setIsModalOpen2(false);
                }}
              >
                <div className="w-full flex flex-col items-center gap-6 my-5">
                  <div className="border w-full rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                    <Image
                      src={"/img/scan_barcode.png"}
                      width={300}
                      height={300}
                      alt="Scan Barcode"
                      className="w-full h-auto max-h-52 object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Scan Barcode Produk
                  </span>
                </div>

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

        {/* Notifikasi Toast */}
        {showToast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 transition-all animate-bounce-once">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-sm font-medium">
              Data berhasil disimpan!
            </span>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="p-1 -mr-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tabel Data Dinamis */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                {currentConfig.headers.map((headerText, idx) => (
                  <th key={idx} className="py-3.5 px-4">
                    {headerText}
                  </th>
                ))}
                {currentConfig.onUpdate && (
                  <th className="py-3.5 px-4 w-12 text-right">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {tableData.length > 0 ? (
                tableData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    {currentConfig.renderRow(row)}
                    {currentConfig.onUpdate && (
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Ubah</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={currentConfig.headers.length + 1}
                    className="py-12 text-center text-gray-400 font-normal"
                  >
                    Tidak Ada Data Ditemukan
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
