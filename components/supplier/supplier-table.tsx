"use client";

import React, { useState } from "react";
import { Plus, Edit, Trash2, X, CheckCircle2, AlertTriangle, Truck } from "lucide-react";
import { useSupplierStore, SupplierItem } from "@/stores/useSupplierStore";

export default function SupplierTable() {
  const { suppliers, addSupplier, editSupplier, deleteSupplier } = useSupplierStore();

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    telp: "",
    address: "",
  });

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Data berhasil disimpan!");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      name: "",
      telp: "",
      address: "",
    });
    setIsCreateOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (supplier: SupplierItem) => {
    setSelectedSupplier(supplier);
    setFormData({
      name: supplier.name,
      telp: supplier.telp,
      address: supplier.address,
    });
    setIsEditOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (supplier: SupplierItem) => {
    setSelectedSupplier(supplier);
    setIsDeleteOpen(true);
  };

  // Submit Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) return;

    addSupplier({
      name: formData.name.trim(),
      telp: formData.telp.trim() || "-",
      address: formData.address.trim(),
    });

    setIsCreateOpen(false);
    triggerToast("Data pemasok berhasil ditambahkan!");
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || !formData.name.trim() || !formData.address.trim()) return;

    editSupplier(selectedSupplier.id, {
      name: formData.name.trim(),
      telp: formData.telp.trim() || "-",
      address: formData.address.trim(),
    });

    setIsEditOpen(false);
    setSelectedSupplier(null);
    triggerToast("Perubahan data pemasok berhasil disimpan!");
  };

  // Confirm Delete
  const handleDeleteConfirm = () => {
    if (!selectedSupplier) return;

    deleteSupplier(selectedSupplier.id);
    setIsDeleteOpen(false);
    setSelectedSupplier(null);
    triggerToast("Data pemasok berhasil dihapus!");
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header Halaman & Tombol Aksi */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Data Pemasok</h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar pihak pemasok komoditas pangan untuk kebutuhan gudang koperasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Tambah Pemasok</span>
          </button>
        </div>
      </div>

      {/* Tabel Data Pemasok */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                <th className="py-3.5 px-4">Nama Pemasok</th>
                <th className="py-3.5 px-4">Alamat</th>
                <th className="py-3.5 px-4">No. Telepon</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">
                    <Truck className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    Belum ada data pemasok. Klik &quot;Tambah Pemasok&quot; untuk menambahkan data baru.
                  </td>
                </tr>
              ) : (
                suppliers.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 text-sm leading-relaxed max-w-md">
                      {row.address}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-mono text-sm font-medium">
                      {row.telp}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 font-semibold">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(row)}
                          className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs transition-colors cursor-pointer"
                          title="Ubah Pemasok"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Ubah</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDelete(row)}
                          className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs transition-colors cursor-pointer"
                          title="Hapus Pemasok"
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

      {/* Modal Tambah Pemasok */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Tambah Pemasok Baru</h3>
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
                    Nama Pemasok
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: CV Tani Makmur"
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.telp}
                    onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
                    placeholder="+62..."
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Alamat kantor / gudang pemasok..."
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 resize-none"
                  />
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

      {/* Modal Ubah Pemasok */}
      {isEditOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Ubah Data Pemasok</h3>
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedSupplier(null);
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
                    Nama Pemasok
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: CV Tani Makmur"
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.telp}
                    onChange={(e) => setFormData({ ...formData, telp: e.target.value })}
                    placeholder="+62..."
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Alamat kantor / gudang pemasok..."
                    className="w-full px-3.5 py-2 text-sm text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                    setSelectedSupplier(null);
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

      {/* Modal Konfirmasi Hapus Pemasok */}
      {isDeleteOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-semibold text-gray-900">Hapus Pemasok</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setSelectedSupplier(null);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus data pemasok{" "}
                <span className="font-semibold text-gray-900">{selectedSupplier.name}</span>?
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteOpen(false);
                  setSelectedSupplier(null);
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
                Hapus Pemasok
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
