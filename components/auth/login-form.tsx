"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/useUserStore";
import { LogIn, Lock, Mail, AlertCircle, Building, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pastikan status loading selalu reset saat form terbuka
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = login(formData.email, formData.password);

      if (result.success) {
        // Navigasi ke halaman dasbor
        router.push("/dashboard");
      } else {
        setErrorMessage(result.message);
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("Terjadi kendala saat memproses login. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  const handleSelectRoleDemo = (role: "coperative" | "sppg") => {
    setIsLoading(false);
    setErrorMessage(null);
    if (role === "coperative") {
      setFormData({
        email: "coperative@rappi.com",
        password: "password123",
      });
    } else {
      setFormData({
        email: "sppg@rappi.com",
        password: "password123",
      });
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-6">
      {/* Brand & Judul */}
      <div className="space-y-1">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground text-sm font-black border overflow-hidden p-1 bg-white">
          <Image src={"/img/logo.jpeg"} width={300} height={300} alt="logo" className="object-cover h-full w-full"/>
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Masuk ke Portal Operasional
        </h1>
        <p className="text-xs text-gray-500">
          Silakan masuk sesuai peran akun: Koperasi atau SPPG.
        </p>
      </div>

      {/* Pilihan Akun Demo */}
      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
          Pilih Akun Demo Cepat:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleSelectRoleDemo("coperative")}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-medium transition cursor-pointer"
          >
            <Building className="w-3.5 h-3.5 shrink-0" />
            <span>Peran Koperasi</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectRoleDemo("sppg")}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>Peran SPPG</span>
          </button>
        </div>
      </div>

      {/* Pesan Kesalahan */}
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
            Alamat Email
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
            Kata Sandi
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
        <Link href={"/"} >
          <button
            className="w-full py-2.5 px-4 rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>Kembali ke Homepage</span>
          </button>
        </Link>
      </form>
    </div>
  );
}
