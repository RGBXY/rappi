"use client";

import React from "react";
import { useAuthStore } from "../../stores/useUserStore";
import { Check, X } from "lucide-react";

export default function UserApprovalTable() {
  const { users, currentUser, approveUser, rejectUser } = useAuthStore();

  // Hanya tampilkan data jika yang login adalah Super Admin
  if (currentUser?.role !== "super_admin") {
    return null;
  }

  const pendingUsers = users.filter((u) => u.status === "pending");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs p-5 space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900 text-sm">Persetujuan Akun Pengguna</h3>
        <p className="text-xs text-gray-500">Konfirmasi akun KUD dan SPPG sebelum mereka dapat mengakses sistem.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-500 font-medium">
              <th className="py-2.5 px-3">Nama</th>
              <th className="py-2.5 px-3">Email</th>
              <th className="py-2.5 px-3">Instansi</th>
              <th className="py-2.5 px-3">Bagian</th>
              <th className="py-2.5 px-3">Tgl Daftar</th>
              <th className="py-2.5 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {pendingUsers.length > 0 ? (
              pendingUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/60">
                  <td className="py-2.5 px-3 font-semibold text-gray-900">{u.name}</td>
                  <td className="py-2.5 px-3">{u.email}</td>
                  <td className="py-2.5 px-3 uppercase font-medium">{u.role}</td>
                  <td className="py-2.5 px-3 capitalize">{u.subRole.replace(/_/g, " ")}</td>
                  <td className="py-2.5 px-3 text-gray-400">{u.createdAt}</td>
                  <td className="py-2.5 px-3 text-right space-x-1.5">
                    <button
                      onClick={() => approveUser(u.id)}
                      className="p-1 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                      title="Setujui"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => rejectUser(u.id)}
                      className="p-1 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                      title="Tolak"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">
                  Tidak ada permohonan akun yang pending.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}