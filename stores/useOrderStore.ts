import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Tipe data produk di dalam order
export interface OrderProduct {
  productId: string;
  name: string;
  qty: number;
  date: string;
  hargaSatuan: number;
}

// 2. Tipe data item order utama
export interface OrderItem {
  id: number;
  orderId: string;
  sppg: string;
  date: string;
  products: OrderProduct[];
}

// 3. Interface State & Actions Store
interface OrderState {
  order: OrderItem[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      order: [
        {
          id: 1,
          orderId: "ORD-251026-04",
          sppg: "SPPG Kulon Progo Galur Pandowan",
          date: "25-10-2026",
          products: [
            {
              productId: "PRD-251026-04",
              name: "Pisang",
              hargaSatuan: 7000,
              qty: 50,
              date: "25-10-2026",
            },
            {
              productId: "PRD-251026-05",
              name: "Jagung",
              hargaSatuan: 7000,
              qty: 50,
              date: "25-10-2026",
            },
          ],
        },
        {
          id: 2,
          orderId: "ORD-261026-04",
          sppg: "SPPG Kulon Progo Nanggulan Donomulyo",
          date: "26-10-2026",
          products: [
            {
              productId: "PRD-251026-06",
              name: "Ubi",
              hargaSatuan: 7000,
              qty: 50,
              date: "25-10-2026",
            },
            {
              productId: "PRD-251026-01",
              name: "Singkong",
              hargaSatuan: 7000,
              qty: 50,
              date: "25-10-2026",
            },
          ],
        },
      ],
    }),
    {
      name: "order-storage", 
    }
  )
);