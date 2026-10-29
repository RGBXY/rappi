"use client";

import React, { useState } from "react";
import { useAuthStore, UserRole, UserSubRole } from "../../stores/useUserStore";

export default function RegisterForm() {
  const register = useAuthStore((s) => s.register);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "kud" as UserRole,
    subRole: "supervisor" as UserSubRole,
  });
  const [feedback, setFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = register(formData);
    setFeedback({ msg: res.message, isError: !res.success });
    if (res.success) {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "kud",
        subRole: "supervisor",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-6 bg-white rounded-2xl border border-gray-200">
      <h2 className="text-lg font-bold text-gray-900">Registrasi Akun Baru</h2>

      {feedback && (
        <div className={`p-3 rounded-xl text-xs font-medium ${feedback.isError ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
          {feedback.msg}
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-gray-700">Nama Lengkap</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mt-1 px-3.5 py-2 border rounded-xl text-xs focus:outline-emerald-600"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-700">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mt-1 px-3.5 py-2 border rounded-xl text-xs focus:outline-emerald-600"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-700">Password</label>
        <input
          type="password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mt-1 px-3.5 py-2 border rounded-xl text-xs focus:outline-emerald-600"
        />
      </div>

      {/* Pilihan Entitas / Role */}
      <div>
        <label className="text-xs font-semibold text-gray-700">Instansi / Unit</label>
        <select
          value={formData.role}
          onChange={(e) => {
            const r = e.target.value as UserRole;
            setFormData({
              ...formData,
              role: r,
              subRole: r === "kud" ? "supervisor" : "purchasing",
            });
          }}
          className="w-full mt-1 px-3.5 py-2 border rounded-xl text-xs bg-white focus:outline-emerald-600"
        >
          <option value="kud">Pihak KUD (Pemasok / Logistik)</option>
          <option value="sppg">Pihak SPPG (Dapur / Konsumen MBG)</option>
        </select>
      </div>

      {/* Pilihan Sub-Role Sesuai Unit */}
      <div>
        <label className="text-xs font-semibold text-gray-700">Bagian / Divisi</label>
        <select
          value={formData.subRole}
          onChange={(e) => setFormData({ ...formData, subRole: e.target.value as UserSubRole })}
          className="w-full mt-1 px-3.5 py-2 border rounded-xl text-xs bg-white focus:outline-emerald-600"
        >
          {formData.role === "kud" ? (
            <>
              <option value="supervisor">Supervisor</option>
              <option value="pengawas_warehouse">Pengawas Warehouse</option>
            </>
          ) : (
            <>
              <option value="purchasing">Purchasing</option>
              <option value="qc_inbound">Bagian QC Inbound</option>
            </>
          )}
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
      >
        Ajukan Akun
      </button>
    </form>
  );
}