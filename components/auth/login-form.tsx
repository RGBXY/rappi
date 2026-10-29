"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/useUserStore";
import { LogIn, Lock, Mail, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const result = login(formData.email, formData.password);

    if (result.success) {
      // Masuk ke dashboard utama jika akun approved
      router.push("/dashboard");
    } else {
      // Menampilkan pesan error jika salah sandi / akun masih pending
      setErrorMessage(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-6">
      {/* Brand & Title */}
      <div className="space-y-1">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white text-base mb-3 shadow-2xs">
          R
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Masuk ke Portal Operasional
        </h1>
        <p className="text-xs text-gray-500">
          Gunakan akun terdaftar KUD, SPPG, atau Super Admin.
        </p>
      </div>

      {/* Pesan Kesalahan / Status Pending */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="nama@instansi.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-emerald-600 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-emerald-600 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <LogIn className="w-4 h-4" />
          <span>{isLoading ? "Memproses..." : "Masuk"}</span>
        </button>
      </form>
    </div>
  );
}