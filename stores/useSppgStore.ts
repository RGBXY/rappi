import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BaseItem {
  id: number;
  [key: string]: any;
}

interface SppgState {
  sppg: BaseItem[];

  // Actions / Methods
  updateSppg: (id: number) => void;
  addSppg: (item: any) => void;
}

export const useSppgStore = create<SppgState>()(
  persist(
    (set) => ({
      sppg: [
        {  id: 1, name: "SPPG Kulon Progo Galur Pandowan", address: "Kec. Galur, Kulon Progo, Provinsi Daerah Istimewa Yogyakarta", telp: "+6285210752362" },
        {  id: 2, name: "SPPG Kulon Progo Nanggulan Donomulyo", address: "Kec. Nanggulan, Kulon Progo, Provinsi Daerah Istimewa Yogyakarta", telp: "+6285210712344" },
        {  id: 3, name: "SPPG Gunungkidul Wonosari Baleharjo 3", address: "Kec. Nanggulan, Kulon Progo, Provinsi Daerah Istimewa Yogyakarta", telp: "+6285210712344" },
      ],

      updateSppg: (id) => set((s) => ({ sppg: s.sppg.filter((p) => p.id !== id) })),
      addSppg: (id) => set((s) => ({ sppg: s.sppg.filter((p) => p.id !== id) })),
    }),
    { name: "sppg-app-storage" }
  )
);