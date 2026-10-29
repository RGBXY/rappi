import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Tipe data produk di dalam invoice
export interface InvoiceProduct {
  productId: string;
  name: string;
  qty: number;
  satuan?: string;
  price: number;
  date: string;
}

// 2. Tipe data item invoice
export interface InvoiceItem {
  id: number;
  invoiceId: string;
  orderId: string;
  sppg?: string;
  date: string;
  totalAmount: number;
  products: InvoiceProduct[];
}

// 3. Interface State & Actions Store
interface InvoiceStore {
  invoice: InvoiceItem[];
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set) => ({
      invoice: [
        {
          id: 1,
          invoiceId: "INV-251026-04",
          orderId: "ORD-251026-04",
          sppg: "SPPG Kulon Progo Galur Pandowan",
          date: "25-10-2026",
          totalAmount: 675000,
          products: [
            {
              productId: "PRD-251026-04",
              name: "Pisang Cavendish",
              qty: 50,
              satuan: "Sisir",
              price: 7000,
              date: "25-10-2026",
            },
            {
              productId: "PRD-251026-05",
              name: "Jagung Manis",
              qty: 50,
              satuan: "Kg",
              price: 6500,
              date: "25-10-2026",
            },
          ],
        },
        {
          id: 2,
          invoiceId: "INV-261026-04",
          orderId: "ORD-261026-04",
          sppg: "SPPG Bantul Sewon",
          date: "26-10-2026",
          totalAmount: 950000,
          products: [
            {
              productId: "PRD-251026-01",
              name: "Beras Pandan Wangi",
              qty: 50,
              satuan: "Kg",
              price: 14000,
              date: "26-10-2026",
            },
            {
              productId: "PRD-251026-07",
              name: "Singkong",
              qty: 50,
              satuan: "Kg",
              price: 5000,
              date: "26-10-2026",
            },
          ],
        },
      ],
    }),
    {
      name: "invoice-storage",
    }
  )
);
