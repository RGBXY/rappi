import { create } from "zustand";
import { persist } from "zustand/middleware";
import { InvoiceItem } from "../stores/useInvoiceStore"; // Sesuaikan path file invoice store kamu

// 1. Tipe data produk di dalam receipt
export interface ReceiptProduct {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

// 2. Tipe data item receipt utama
export interface ReceiptItem {
  id: number;
  receiptId: string;
  invoiceId: string;
  orderId: string;
  sppg: string;
  paidAt: string;
  totalAmount: number;
  products: ReceiptProduct[];
}

// 3. Interface State & Actions
interface ReceiptStore {
  receipts: ReceiptItem[];
  addReceiptFromInvoice: (
    invoice: InvoiceItem,
  ) => void;
}

export const useReceiptStore = create<ReceiptStore>()(
  persist(
    (set) => ({
      // Mock data awal untuk kebutuhan demo / prototype
      receipts: [
        {
          id: 1,
          receiptId: "RCP-251026-01",
          invoiceId: "INV-251026-04",
          orderId: "ORD-251026-04",
          sppg: "SPPG Kulon Progo Galur Pandowan",
          paidAt: "25-10-2026 14:30",
          totalAmount: 125000,
          products: [
            {
              productId: "PRD-251026-04",
              name: "Pisang",
              qty: 50,
              price: 1500,
            },
            {
              productId: "PRD-251026-05",
              name: "Jagung",
              qty: 50,
              price: 1000,
            },
          ],
        },
      ],

      // Fungsi otomatis mengubah Invoice menjadi Receipt saat dibayar
      addReceiptFromInvoice: (invoice) => {
        const now = new Date();
        const dateStr = now.toLocaleDateString("id-ID");
        const timeStr = now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });

        // Hitung total bayar berdasarkan qty produk (harga default 1500 jika belum ada field harga)
        const productsWithPrice = invoice.products.map((p) => ({
          productId: p.productId,
          name: p.name,
          qty: p.qty,
          price: (p as any).price || 1500,
        }));

        const totalAmount = productsWithPrice.reduce(
          (acc, item) => acc + item.qty * item.price,
          0
        );

        const newReceipt: ReceiptItem = {
          id: Date.now(),
          receiptId: `RCP-${Date.now().toString().slice(-6)}`,
          invoiceId: invoice.invoiceId,
          orderId: invoice.orderId,
          sppg: invoice.sppg ?? "-",
          paidAt: `${dateStr} ${timeStr}`,
          totalAmount,
          products: productsWithPrice,
        };

        set((state) => ({
          receipts: [newReceipt, ...state.receipts],
        }));
      },
    }),
    {
      name: "receipt-storage",
    }
  )
);