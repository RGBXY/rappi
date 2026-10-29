"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import SidebarDashboard from "./sidebar-dashboard";
import { getSidebarGroups } from "@/lib/data";
import { useAuthStore } from "@/stores/useUserStore";
import { Building, User } from "lucide-react";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const currentUser = useAuthStore((s) => s.currentUser);

  useEffect(() => {
    // Jalankan pengecekan sesi hanya di sisi klien
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("auth-system-storage");
      if (!stored || !JSON.parse(stored)?.state?.currentUser) {
        router.push("/login");
      }
    }
  }, [router]);

  // 1. Ambil semua item navigasi dari seluruh grup sesuai role
  const groups = getSidebarGroups(currentUser?.role);
  const allNavItems = groups.flatMap((group) => group.items);

  // 2. Cari item yang url-nya cocok dengan pathname saat ini
  const currentItem = allNavItems.find((item) => item.url === pathname);

  // 3. Ambil judulnya dalam Bahasa Indonesia
  const pageTitle =
    currentItem?.title ||
    pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) ||
    "Dasbor";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Responsif */}
      <SidebarDashboard isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Konten Samping (Kanan) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between h-16 gap-3 px-6 py-4 bg-white border-b sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Buka menu navigasi"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Judul Halaman Dinamis */}
            <h1 className="font-semibold text-gray-800 text-base">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 border border-gray-300 bg-gray-50 text-gray-600 py-1.5 px-3 rounded-xl">
              <User size={16} />
              <span className="font-semibold text-xs capitalize">
                {currentUser?.subRole
                  ? currentUser.subRole.replace(/_/g, " ")
                  : "Pengawas"}
              </span>
            </div>

            <div
              className={`flex items-center gap-2 border py-1.5 px-3 rounded-xl ${
                currentUser?.role === "sppg"
                  ? "border-blue-300 bg-blue-50 text-blue-600"
                  : "border-green-300 bg-green-50 text-green-600"
              }`}
            >
              <Building size={16} />
              <span className="font-semibold text-xs capitalize">
                {currentUser?.role === "sppg" ? "SPPG" : "Koperasi"}
              </span>
            </div>
          </div>
        </header>

        {/* Konten Halaman */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
