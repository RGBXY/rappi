import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Tipe data produk di dalam invoice (ditambahkan field price)
export interface InvoiceProduct {
  productId: string;
  name: string;
  qty: number;
  price: number; // Harga satuan produk
  date: string;
}

// 2. Tipe data item invoice (ditambahkan field totalAmount)
export interface InvoiceItem {
  id: number;
  invoiceId: string;
  orderId: string;
  sppg?: string;
  date: string;
  totalAmount: number; // Total harga keseluruhan invoice (sum of qty * price)
  products: InvoiceProduct[];
}

// 3. Interface State & Actions Store
interface InvoiceStore {
  invoice: InvoiceItem[];
  // Action opsional jika ingin menghitung ulang total / tambah data
  // addInvoice?: (newInvoice: InvoiceItem) => void;
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
          totalAmount: 125000, // (50 * 1500) + (50 * 1000) = 75.000 + 50.000
          products: [
            {
              productId: "PRD-251026-04",
              name: "Pisang",
              qty: 50,
              price: 1500,
              date: "25-10-2026",
            },
            {
              productId: "PRD-251026-05",
              name: "Jagung",
              qty: 50,
              price: 1000,
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
          totalAmount: 175000, // (50 * 2000) + (50 * 1500) = 100.000 + 75.000
          products: [
            {
              productId: "PRD-251026-06",
              name: "Ubi",
              qty: 50,
              price: 2000,
              date: "25-10-2026",
            },
            {
              productId: "PRD-251026-01",
              name: "Singkong",
              qty: 50,
              price: 1500,
              date: "25-10-2026",
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