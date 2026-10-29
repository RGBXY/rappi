import { create } from "zustand";
import { persist } from "zustand/middleware";
import { InvoiceItem } from "../stores/useInvoiceStore";

// 1. Tipe data produk di dalam receipt
export interface ReceiptProduct {
  productId: string;
  name: string;
  qty: number;
  satuan?: string;
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
  addReceiptFromInvoice: (invoice: InvoiceItem) => void;
}

export const useReceiptStore = create<ReceiptStore>()(
  persist(
    (set) => ({
      receipts: [
        {
          id: 1,
          receiptId: "RCP-251026-01",
          invoiceId: "INV-251026-04",
          orderId: "ORD-251026-04",
          sppg: "SPPG Kulon Progo Galur Pandowan",
          paidAt: "25-10-2026 14:30",
          totalAmount: 675000,
          products: [
            {
              productId: "PRD-251026-04",
              name: "Pisang Cavendish",
              qty: 50,
              satuan: "Sisir",
              price: 7000,
            },
            {
              productId: "PRD-251026-05",
              name: "Jagung Manis",
              qty: 50,
              satuan: "Kg",
              price: 6500,
            },
          ],
        },
      ],

      addReceiptFromInvoice: (invoice) => {
        const now = new Date();
        const dateStr = now.toLocaleDateString("id-ID");
        const timeStr = now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const productsWithPrice = invoice.products.map((p) => ({
          productId: p.productId,
          name: p.name,
          qty: p.qty,
          satuan: p.satuan || "Kg",
          price: (p as any).price || 7000,
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
