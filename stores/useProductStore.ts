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
        {  id: 1, productId: "PRD-251026-04", name: "Banana", stockDisplay: 120, stockWareHouse: 50, stock: 170, date: "25-10-2026" },
        {  id: 2, productId: "PRD-251026-05", name: "Corn", stockDisplay: 120, stockWareHouse: 50, stock: 170, date: "25-10-2026" },
        {  id: 3, productId: "PRD-251026-06", name: "Paddy", stockDisplay: 120, stockWareHouse: 50, stock: 170, date: "25-10-2026" },
        {  id: 4, productId: "PRD-251026-07", name: "Cassava", stockDisplay: 120, stockWareHouse: 50, stock: 170, date: "25-10-2026" },
      ],
      stockInList: [
        {  id: 1, productId: "PRD-251026-01", name: "Cassava", supplier: "Budi", qty: 170, date: "25-10-2026" },
        {  id: 2, productId: "PRD-251026-06", name: "Paddy", supplier: "Doni", qty: 170, date: "25-10-2026" },
        {  id: 3, productId: "PRD-251026-05", name: "Corn", supplier: "Rina", qty: 170, date: "25-10-2026" },
        {  id: 4, productId: "PRD-251026-04", name: "Banana", supplier: "Roni", qty: 170, date: "25-10-2026" },
      ],
      stockOutList: [
        {  id: 1, productId: "PRD-291026-02", name: "Potato", qty: 170, date: "29-10-2026" },
      ],
      returnList: [
        {  id: 1, productId: "PRD-301026-02", name: "Banana", qty: 170, reason: "Expired", status: "Reworked", date: "30-10-2026" },
        {  id: 2, productId: "PRD-301026-03", name: "Potato", qty: 170, reason: "Expired", status: "Perish", date: "30-10-2026" },
        {  id: 3, productId: "PRD-301026-08", name: "Corn", qty: 170, reason: "Expired", status: "Pending", date: "30-10-2026" },
      ],
      reworkedList: [
        {  id: 1, productId: "PRD-301026-02", name: "Banana", stockDisplay: 120, stockWareHouse: 50, stock: 170, reason: "Expired", status: "Reworked", date: "30-10-2026" },
        {  id: 2, productId: "PRD-301026-03", name: "Potato", stockDisplay: 120, stockWareHouse: 50, stock: 170, reason: "Expired", status: "Perish", date: "30-10-2026" },
        {  id: 3, productId: "PRD-301026-08", name: "Corn", stockDisplay: 120, stockWareHouse: 50, stock: 170, reason: "Expired", status: "Pending", date: "30-10-2026" },
      ],
      perishList: [
        {  id: 1, productId: "PRD-301026-02", name: "Banana", qty: 170, reason: "Expired", status: "Reworked", date: "30-10-2026" },
        {  id: 2, productId: "PRD-301026-03", name: "Potato", qty: 170, reason: "Expired", status: "Perish", date: "30-10-2026" },
        {  id: 3, productId: "PRD-301026-08", name: "Corn", qty: 170, reason: "Expired", status: "Pending", date: "30-10-2026" },
      ],
      stockChangeLog: [
        {  id: 1, productId: "PRD-301026-02", name: "Banana", qty: 170, stockDisplay: 120, stockWareHouse: 50, stock: 170, date: "30-10-2026" },
        {  id: 2, productId: "PRD-301026-03", name: "Potato", qty: 170, stockDisplay: 120, stockWareHouse: 50, stock: 170, date: "30-10-2026" },
        {  id: 3, productId: "PRD-301026-08", name: "Corn", qty: 170, stockDisplay: 120, stockWareHouse: 50, stock: 170, date: "30-10-2026" },
      ],


      updateProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      upadteReturn: (id) => set((s) => ({ returnList: s.returnList.filter((p) => p.id !== id) })),
      addStockIn: (item) => set((s) => ({ stockInList: [...s.stockInList, { ...item, id: Date.now() }] })),
    }),
    { name: "inventory-app-storage" }
  )
);