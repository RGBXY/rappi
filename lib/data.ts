import {
  LayoutDashboard,
  Bot,
  Boxes,
  Package,
  Truck,
  Receipt,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
  type LucideIcon,
  ReceiptCent,
  ReceiptText,
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
  group?: string; // Judul seksi (misal: "PRODUCT", "TRANSACTION")
  items: NavItem[];
}

export const sidebar_groups: NavGroup[] = [
  {
    // Kelompok Menu Utama (tanpa judul grup)
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    group: "PRODUCT",
    items: [
      {
        title: "Products",
        url: "/product",
        icon: Package,
      },
      {
        title: "Suppliers",
        url: "/supplier",
        icon: Truck,
      },
    ],
  },
  {
    group: "TRANSACTION",
    items: [
        {
        title: "Order",
        url: "/order",
        icon: ShoppingCart, 
        },
        {
        title: "SPPG",
        url: "/sppg",
        icon: Building,
        },
        {
        title: "Invoice",
        url: "/invoice",
        icon: FileText,     
        },
        {
        title: "Receipt",
        url: "/receipt",
        icon: Receipt,      
        },
    ],
  },
];