import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BaseItem {
  id: number;
  [key: string]: any;
}

interface SupplierState {
  suppliers: BaseItem[];

  // Actions / Methods
  updateSupplier: (id: number) => void;
  addSupplier: (item: any) => void;
}

export const useSupplierStore = create<SupplierState>()(
  persist(
    (set) => ({
      suppliers: [
        {  id: 1, name: "Budi", address: "Jl. Mijil No.20, Manukan, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281", telp: "+6285210752362" },
        {  id: 2, name: "Dina", address: "Jl. Sleman No.30, Manukan, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281", telp: "+6285210712344" },
        {  id: 3, name: "Dona", address: "Jl. Babarsari No.40, Manukan, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281", telp: "+6285210712344" },
      ],

      updateSupplier: (id) => set((s) => ({ suppliers: s.suppliers.filter((p) => p.id !== id) })),
      addSupplier: (id) => set((s) => ({ suppliers: s.suppliers.filter((p) => p.id !== id) })),
    }),
    { name: "supplier-app-storage" }
  )
);