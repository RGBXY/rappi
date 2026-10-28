import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BaseItem {
  id: number;
  [key: string]: any;
}

interface InventoryState {
  products: BaseItem[];
  stockInList: BaseItem[];
  stockOutList: BaseItem[];
  returnList: BaseItem[];
  // Actions / Methods
  updateProduct: (id: number) => void;
  upadteReturn: (id: number) => void;
  addStockIn: (item: any) => void;
}

export const useProductStore = create<InventoryState>()(
  persist(
    (set) => ({
      products: [
        { id: 1, name: "Beras Premium", sku: "BRS-01", stock: 120, unit: "Kg", status: "Tersedia" },
        { id: 2, name: "Minyak Goreng", sku: "MYK-02", stock: 35, unit: "Liter", status: "Menipis" },
      ],
      stockInList: [
        { id: 101, docNo: "IN-2026-001", supplier: "PT Sumber Pangan", itemsCount: 4, date: "2026-10-25" },
        { id: 102, docNo: "IN-2026-002", supplier: "CV Berkah Jaya", itemsCount: 10, date: "2026-10-27" },
      ],
      stockOutList: [
        { id: 201, docNo: "OUT-001", recipient: "Dapur SPPG 1", totalQty: 40, date: "2026-10-28" },
      ],
      returnList: [
        { id: 301, reason: "Kemasan Bocor", productName: "Minyak Goreng", qty: 2, status: "Pending" },
      ],

      updateProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      upadteReturn: (id) => set((s) => ({ returnList: s.returnList.filter((p) => p.id !== id) })),
      addStockIn: (item) => set((s) => ({ stockInList: [...s.stockInList, { ...item, id: Date.now() }] })),
    }),
    { name: "inventory-app-storage" }
  )
);