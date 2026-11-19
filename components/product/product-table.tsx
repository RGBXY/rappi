"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, X, CheckCircle2, AlertTriangle, Package } from "lucide-react";
import { useProductStore, BaseItem } from "@/stores/useProductStore";

const SATUAN_OPTIONS = ["Kg", "Sisir", "Butir", "Liter", "Ikat", "Dus", "Karung"];

export default function ProductTable() {
  const { products, addProduct, editProduct, deleteProduct } = useProductStore();

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<BaseItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    hargaSatuan: "",
    satuan: "Kg",
  });

  // Toast Notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Data berhasil disimpan!");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Generate automatic Product ID with pattern PRD-{DDMMYY}-{sequence}
  const generateProductId = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = String(today.getFullYear()).slice(-2);
    const datePrefix = `PRD-${day}${month}${year}-`;

    // Filter produk yang dibuat pada hari dan tanggal yang sama
    let maxSeq = 0;
    products.forEach((p) => {
      if (p.productId && p.productId.startsWith(datePrefix)) {
        const parts = p.productId.split("-");
        if (parts.length >= 3) {
          const seq = parseInt(parts[2], 10);
          if (!isNaN(seq) && seq > maxSeq) {
            maxSeq = seq;
          }
        }
      }
    });

    const nextSeq = String(maxSeq + 1).padStart(2, "0");
    return `${datePrefix}${nextSeq}`;
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      productId: generateProductId(),
      name: "",
      hargaSatuan: "",
      satuan: "Kg",
    });
    setIsCreateOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (product: BaseItem) => {
    setSelectedProduct(product);
    setFormData({
      productId: product.productId,
      name: product.name,
      hargaSatuan: String(product.hargaSatuan || 0),
      satuan: product.satuan || "Kg",
    });
    setIsEditOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (product: BaseItem) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  // Submit Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const autoProductId = formData.productId || generateProductId();

    addProduct({
      productId: autoProductId,
      name: formData.name.trim(),
      hargaSatuan: Number(formData.hargaSatuan) || 0,
      satuan: formData.satuan,
      stock: 0,
      stockDisplay: 0,
      stockWareHouse: 0,
    });

    setIsCreateOpen(false);
    triggerToast("Produk berhasil ditambahkan!");
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !formData.name.trim()) return;

    editProduct(selectedProduct.id, {
      name: formData.name.trim(),
      hargaSatuan: Number(formData.hargaSatuan) || 0,
      satuan: formData.satuan,
    });

    setIsEditOpen(false);
    setSelectedProduct(null);
    triggerToast("Perubahan data produk berhasil disimpan!");
  };

  // Confirm Delete
  const handleDeleteConfirm = () => {
    if (!selectedProduct) return;

    deleteProduct(selectedProduct.id);
    setIsDeleteOpen(false);
    setSelectedProduct(null);
    triggerToast("Produk berhasil dihapus!");
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header Halaman & Tombol Aksi */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Data Produk</h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar katalog produk komoditas koperasi beserta harga satuan dan satuan komoditas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* Tabel Data Produk */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                <th className="py-3.5 px-4">ID Produk</th>
                <th className="py-3.5 px-4">Nama Produk</th>
                <th className="py-3.5 px-4">Harga Satuan</th>
                <th className="py-3.5 px-4">Satuan Komoditas</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
                    <Package className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    Belum ada data produk. Klik &quot;Tambah Produk&quot; untuk menambahkan.
                  </td>
                </tr>
              ) : (
                products.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-900 text-xs">
                      {row.productId}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-900">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      Rp {(row.hargaSatuan || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {row.satuan || "Kg"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-semibold">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(row)}
                          className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs transition-colors cursor-pointer"
                          title="Ubah Produk"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Ubah</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDelete(row)}
                          className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs transition-colors cursor-pointer"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Produk */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Tambah Produk Baru</h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="py-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    ID Produk (Otomatis)
                  </label>
                  <div className="flex items-center px-3.5 py-2 text-sm font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-xl select-none">
                    {formData.productId}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Dihasilkan otomatis: PRD-TGLBLNTHN-URUTAN
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Beras Pandan Wangi"
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Harga Satuan (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={formData.hargaSatuan}
                    onChange={(e) => setFormData({ ...formData, hargaSatuan: e.target.value })}
                    placeholder="14000"
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Satuan Komoditas
                  </label>
                  <select
                    value={formData.satuan}
                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  >
                    {SATUAN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
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

      {/* Modal Ubah Produk */}
      {isEditOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Ubah Data Produk</h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedProduct(null);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="py-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    ID Produk
                  </label>
                  <div className="flex items-center px-3.5 py-2 text-sm font-mono font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-xl select-none">
                    {formData.productId}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Beras Pandan Wangi"
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Harga Satuan (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={formData.hargaSatuan}
                    onChange={(e) => setFormData({ ...formData, hargaSatuan: e.target.value })}
                    placeholder="14000"
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Satuan Komoditas
                  </label>
                  <select
                    value={formData.satuan}
                    onChange={(e) => setFormData({ ...formData, satuan: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  >
                    {SATUAN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Produk */}
      {isDeleteOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-semibold text-gray-900">Hapus Produk</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setSelectedProduct(null);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus produk{" "}
                <span className="font-semibold text-gray-900">{selectedProduct.name}</span> (
                <span className="font-mono text-xs text-gray-700">{selectedProduct.productId}</span>)?
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Hapus Produk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifikasi Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 transition-all animate-bounce-once">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
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
  );
}
