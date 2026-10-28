"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarDashboard from "./sidebar-dashboard";
import { sidebar_groups } from "@/lib/data";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // 1. Ambil semua item navigasi dari seluruh grup
  const allNavItems = sidebar_groups.flatMap((group) => group.items);

  // 2. Cari item yang url-nya cocok dengan pathname saat ini
  const currentItem = allNavItems.find((item) => item.url === pathname);

  // 3. Ambil judulnya. Jika tidak ada di list, format otomatis dari URL (misal: "/stock-in" -> "Stock In")
  const pageTitle =
    currentItem?.title ||
    pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()) ||
    "Dashboard";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Responsive */}
      <SidebarDashboard isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Konten Samping (Kanan) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center gap-3 px-6 py-4 bg-white border-b sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
            aria-label="Buka menu"
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

          {/* Judul Dinamis */}
          <h1 className="font-semibold text-gray-800 text-base">
            {pageTitle}
          </h1>
        </header>

        {/* Konten Halaman */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}