import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SupplierItem {
  id: number;
  name: string;
  address: string;
  telp: string;
  [key: string]: any;
}

export type BaseItem = SupplierItem;

interface SupplierState {
  suppliers: SupplierItem[];

  // Actions / Methods
  addSupplier: (item: Omit<SupplierItem, "id">) => void;
  editSupplier: (id: number, updatedItem: Partial<SupplierItem>) => void;
  deleteSupplier: (id: number) => void;
  updateSupplier: (id: number) => void;
}

export const useSupplierStore = create<SupplierState>()(
  persist(
    (set) => ({
      suppliers: [
        {
          id: 1,
          name: "Budi",
          address: "Jl. Mijil No.20, Manukan, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281",
          telp: "+6285210752362",
        },
        {
          id: 2,
          name: "Dina",
          address: "Jl. Sleman No.30, Manukan, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281",
          telp: "+6285210712344",
        },
        {
          id: 3,
          name: "Dona",
          address: "Jl. Babarsari No.40, Manukan, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281",
          telp: "+6285210712344",
        },
      ],

      addSupplier: (item) =>
        set((s) => {
          const newSupplier: SupplierItem = {
            id: Date.now(),
            name: item.name,
            address: item.address,
            telp: item.telp,
          };
          return {
            suppliers: [...s.suppliers, newSupplier],
          };
        }),

      editSupplier: (id, updatedItem) =>
        set((s) => ({
          suppliers: s.suppliers.map((sup) =>
            sup.id === id ? { ...sup, ...updatedItem } : sup
          ),
        })),

      deleteSupplier: (id) =>
        set((s) => ({
          suppliers: s.suppliers.filter((sup) => sup.id !== id),
        })),

      updateSupplier: (id) =>
        set((s) => ({
          suppliers: s.suppliers.filter((sup) => sup.id !== id),
        })),
    }),
    { name: "supplier-app-storage" }
  )
);
