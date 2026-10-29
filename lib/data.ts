import {
  LayoutDashboard,
  Package,
  Truck,
  Receipt,
  ArrowDownToLine,
  ArrowUpFromLine,
  type LucideIcon,
  ShoppingCart,
  FileText,
  Building,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavGroup {
  group?: string; // Judul seksi (misal: "PRODUK", "TRANSAKSI", "DATA KOPERASI")
  items: NavItem[];
}

// 1. Menu untuk Peran Koperasi (Coperative)
export const coperative_sidebar_groups: NavGroup[] = [
  {
    items: [
      {
        title: "Dasbor",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "PRODUK",
    items: [
      {
        title: "Produk",
        url: "/product",
        icon: Package,
      },
      {
        title: "Pemasok",
        url: "/supplier",
        icon: Truck,
      },
    ],
  },
  {
    group: "TRANSAKSI",
    items: [
      {
        title: "Pesanan",
        url: "/order",
        icon: ShoppingCart,
      },
      {
        title: "SPPG",
        url: "/sppg",
        icon: Building,
      },
      {
        title: "Faktur",
        url: "/invoice",
        icon: FileText,
      },
      {
        title: "Kwitansi",
        url: "/receipt",
        icon: Receipt,
      },
    ],
  },
];

// 2. Menu untuk Peran SPPG (Sistem SPPG)
export const sppg_sidebar_groups: NavGroup[] = [
  {
    items: [
      {
        title: "Dasbor",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "DATA KOPERASI",
    items: [
      {
        title: "Data Koperasi",
        url: "/sppg/coperative",
        icon: Building,
      },
    ],
  },
  {
    group: "DATA PRODUK",
    items: [
      {
        title: "Barang Masuk",
        url: "/sppg/barang-masuk",
        icon: ArrowDownToLine,
      },
      {
        title: "Barang Keluar",
        url: "/sppg/barang-keluar",
        icon: ArrowUpFromLine,
      },
    ],
  },
  {
    group: "DATA PEMESANAN",
    items: [
      {
        title: "Pesanan",
        url: "/sppg/pesanan",
        icon: ShoppingCart,
      },
      {
        title: "Faktur",
        url: "/sppg/invoice",
        icon: FileText,
      },
      {
        title: "Kwitansi",
        url: "/sppg/kwitansi",
        icon: Receipt,
      },
    ],
  },
];

// Default fallback
export const sidebar_groups: NavGroup[] = coperative_sidebar_groups;

// Helper untuk mengambil navigasi sesuai role aktif
export function getSidebarGroups(role?: string): NavGroup[] {
  if (role === "sppg") {
    return sppg_sidebar_groups;
  }
  return coperative_sidebar_groups;
}
