"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSidebarGroups } from "@/lib/data";
import { useAuthStore } from "@/stores/useUserStore";
import Image from "next/image";
import { LogOut } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function SidebarDashboard({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);

  const groups = getSidebarGroups(currentUser?.role);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* 1. Backdrop Gelap di Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* 2. Kontainer Sidebar */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky md:top-0 md:h-screen md:shrink-0
        `}
      >
        {/* Header Sidebar */}
        <div className="h-16 flex items-center justify-between px-6 border-b">
          <div className="flex items-center gap-3">
            <Image
              src={"/img/logo.jpeg"}
              alt="Logo Rappi"
              width={300}
              height={300}
              className="w-9 h-9 border rounded-lg"
            />
            <span className="font-bold text-lg text-gray-900 tracking-tight">
              RAPPI APP
            </span>
          </div>
          {/* Tombol Tutup Mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Tutup menu navigasi"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu Navigasi Berkelompok */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {groups.map((section, idx) => (
            <div
              key={idx}
              className={idx !== 0 ? "pt-4 border-t border-gray-100" : ""}
            >
              {/* Judul Kategori */}
              {section.group && (
                <p className="px-3 pb-2 text-[11px] font-bold tracking-wider text-gray-400 uppercase select-none">
                  {section.group}
                </p>
              )}

              {/* Daftar Link Menu */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.url;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.url}
                      href={item.url}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Sidebar: Profil Pengguna & Keluar */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {currentUser?.name || "Pengguna"}
            </p>
            <p className="text-[11px] text-gray-500 capitalize">
              Peran: {currentUser?.role === "sppg" ? "SPPG" : "Koperasi"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Keluar dari akun"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
