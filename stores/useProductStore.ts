import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BaseItem {
  id: number;
  productId: string;
  name: string;
  satuan?: string;
  [key: string]: any;
}

interface InventoryState {
  products: BaseItem[];
  stockInList: BaseItem[];
  stockOutList: BaseItem[];
  returnList: BaseItem[];
  reworkedList: BaseItem[];
  perishList: BaseItem[];
  stockChangeLog: BaseItem[];
  // Actions / Methods
  updateProduct: (id: number) => void;
  upadteReturn: (id: number) => void;
  addStockIn: (item: any) => void;
}

export const useProductStore = create<InventoryState>()(
  persist(
    (set) => ({
      products: [
        {
          id: 1,
          productId: "PRD-251026-01",
          name: "Beras Pandan Wangi",
          hargaSatuan: 14000,
          stockDisplay: 250,
          stockWareHouse: 500,
          stock: 750,
          satuan: "Kg",
          date: "25-10-2026",
        },
        {
          id: 2,
          productId: "PRD-251026-04",
          name: "Pisang Cavendish",
          hargaSatuan: 7000,
          stockDisplay: 120,
          stockWareHouse: 80,
          stock: 200,
          satuan: "Sisir",
          date: "25-10-2026",
        },
        {
          id: 3,
          productId: "PRD-251026-05",
          name: "Jagung Manis",
          hargaSatuan: 6500,
          stockDisplay: 150,
          stockWareHouse: 150,
          stock: 300,
          satuan: "Kg",
          date: "25-10-2026",
        },
        {
          id: 4,
          productId: "PRD-251026-06",
          name: "Telur Ayam Ras Segar",
          hargaSatuan: 28000,
          stockDisplay: 300,
          stockWareHouse: 200,
          stock: 500,
          satuan: "Kg",
          date: "25-10-2026",
        },
        {
          id: 5,
          productId: "PRD-251026-07",
          name: "Singkong",
          hargaSatuan: 5000,
          stockDisplay: 120,
          stockWareHouse: 80,
          stock: 200,
          satuan: "Kg",
          date: "25-10-2026",
        },
      ],
      stockInList: [
        {
          id: 1,
          productId: "PRD-251026-01",
          name: "Beras Pandan Wangi",
          supplier: "Dona",
          qty: 250,
          satuan: "Kg",
          date: "25-10-2026",
        },
        {
          id: 2,
          productId: "PRD-251026-04",
          name: "Pisang Cavendish",
          supplier: "Dina",
          qty: 120,
          satuan: "Sisir",
          date: "25-10-2026",
        },
        {
          id: 3,
          productId: "PRD-251026-05",
          name: "Jagung Manis",
          supplier: "Dona",
          qty: 150,
          satuan: "Kg",
          date: "25-10-2026",
        },
        {
          id: 4,
          productId: "PRD-251026-06",
          name: "Telur Ayam Ras Segar",
          supplier: "Dina",
          qty: 300,
          satuan: "Kg",
          date: "25-10-2026",
        },
      ],
      stockOutList: [
        {
          id: 1,
          productId: "PRD-251026-04",
          name: "Pisang Cavendish",
          qty: 50,
          satuan: "Sisir",
          date: "29-10-2026",
        },
        {
          id: 2,
          productId: "PRD-251026-01",
          name: "Beras Pandan Wangi",
          qty: 100,
          satuan: "Kg",
          date: "29-10-2026",
        },
      ],
      returnList: [
        {
          id: 1,
          productId: "PRD-251026-04",
          name: "Pisang Cavendish",
          qty: 10,
          satuan: "Sisir",
          reason: "Terlalu Matang",
          status: "Reworked",
          date: "30-10-2026",
        },
        {
          id: 2,
          productId: "PRD-251026-06",
          name: "Telur Ayam Ras Segar",
          qty: 5,
          satuan: "Kg",
          reason: "Cangkang Retak",
          status: "Perish",
          date: "30-10-2026",
        },
        {
          id: 3,
          productId: "PRD-251026-05",
          name: "Jagung Manis",
          qty: 15,
          satuan: "Kg",
          reason: "Kualitas Menurun",
          status: "Pending",
          date: "30-10-2026",
        },
      ],
      reworkedList: [
        {
          id: 1,
          productId: "PRD-251026-04",
          name: "Pisang Cavendish",
          stockDisplay: 120,
          stockWareHouse: 50,
          stock: 170,
          satuan: "Sisir",
          reason: "Terlalu Matang",
          status: "Reworked",
          date: "30-10-2026",
        },
      ],
      perishList: [
        {
          id: 1,
          productId: "PRD-251026-06",
          name: "Telur Ayam Ras Segar",
          qty: 5,
          satuan: "Kg",
          reason: "Cangkang Retak",
          status: "Perish",
          date: "30-10-2026",
        },
      ],
      stockChangeLog: [
        {
          id: 1,
          productId: "PRD-251026-01",
          name: "Beras Pandan Wangi",
          qty: 100,
          stockDisplay: 250,
          stockWareHouse: 500,
          stock: 750,
          satuan: "Kg",
          date: "30-10-2026",
        },
        {
          id: 2,
          productId: "PRD-251026-04",
          name: "Pisang Cavendish",
          qty: 50,
          stockDisplay: 120,
          stockWareHouse: 80,
          stock: 200,
          satuan: "Sisir",
          date: "30-10-2026",
        },
      ],

      updateProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      upadteReturn: (id) =>
        set((s) => ({ returnList: s.returnList.filter((p) => p.id !== id) })),
      addStockIn: (item) =>
        set((s) => ({
          stockInList: [...s.stockInList, { ...item, id: Date.now() }],
        })),
    }),
    { name: "inventory-app-storage" }
  )
);
