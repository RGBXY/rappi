import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CoperativeProduct {
  productId: string;
  name: string;
  hargaSatuan: number;
  stockDisplay: number;
  stockWarehouse: number;
  stockTotal: number;
  satuan: string;
  date: string;
}

export interface CoperativeEntity {
  id: number;
  name: string;
  address: string;
  telp: string;
  rating: number; // e.g. 4.9, 4.7, 4.5
  totalReviews: number;
  products: CoperativeProduct[];
}

export interface CoperativeReviewItem {
  id: number;
  coperativeName: string;
  rating: number;
  aspek: string;
  reviewText: string;
  reviewer: string;
  date: string;
}

export interface SppgBarangMasukItem {
  id: number;
  kodeMasuk: string;
  productId: string;
  namaBarang: string;
  pemasok: string;
  qty: number;
  satuan: string;
  date: string;
  petugas: string;
}

export interface SppgBarangKeluarItem {
  id: number;
  kodeKeluar: string;
  productId: string;
  namaBarang: string;
  tujuan: string;
  qty: number;
  satuan: string;
  date: string;
  petugas: string;
}

export interface SppgOrderItem {
  id: number;
  orderId: string;
  koperasi: string;
  date: string;
  status: "Diproses" | "Diterima" | "Selesai";
  totalAmount: number;
  products: {
    productId: string;
    name: string;
    qty: number;
    satuan: string;
    hargaSatuan: number;
  }[];
}

export interface SppgInvoiceItem {
  id: number;
  invoiceId: string;
  orderId: string;
  koperasi: string;
  date: string;
  status: "Belum Dibayar" | "Lunas";
  totalAmount: number;
  products: {
    productId: string;
    name: string;
    qty: number;
    satuan: string;
    price: number;
  }[];
}

export interface SppgReceiptItem {
  id: number;
  receiptId: string;
  invoiceId: string;
  orderId: string;
  koperasi: string;
  paidAt: string;
  totalAmount: number;
  products: {
    productId: string;
    name: string;
    qty: number;
    satuan: string;
    price: number;
  }[];
}

interface SppgSystemState {
  coperatives: CoperativeEntity[];
  coperativeReviews: CoperativeReviewItem[];
  barangMasukList: SppgBarangMasukItem[];
  barangKeluarList: SppgBarangKeluarItem[];
  orders: SppgOrderItem[];
  invoices: SppgInvoiceItem[];
  receipts: SppgReceiptItem[];

  // Actions
  addReview: (item: Omit<CoperativeReviewItem, "id">) => void;
  deleteReview: (id: number) => void;
  addBarangMasuk: (item: Omit<SppgBarangMasukItem, "id">) => void;
  deleteBarangMasuk: (id: number) => void;
  addBarangKeluar: (item: Omit<SppgBarangKeluarItem, "id">) => void;
  deleteBarangKeluar: (id: number) => void;
  addOrder: (item: Omit<SppgOrderItem, "id">) => void;
  payInvoice: (invoiceId: string) => void;
}

export const useSppgSystemStore = create<SppgSystemState>()(
  persist(
    (set) => ({
      coperatives: [
        {
          id: 1,
          name: "Koperasi Budi Luhur",
          address: "Jl. Kaliurang KM 9, Sleman, D.I. Yogyakarta",
          telp: "+6281234567890",
          rating: 4.9,
          totalReviews: 12,
          products: [
            {
              productId: "PRD-251026-01",
              name: "Beras Pandan Wangi",
              hargaSatuan: 14000,
              stockDisplay: 250,
              stockWarehouse: 500,
              stockTotal: 750,
              satuan: "Kg",
              date: "25-10-2026",
            },
            {
              productId: "PRD-251026-04",
              name: "Pisang Cavendish",
              hargaSatuan: 7000,
              stockDisplay: 120,
              stockWarehouse: 80,
              stockTotal: 200,
              satuan: "Sisir",
              date: "26-10-2026",
            },
            {
              productId: "PRD-251026-06",
              name: "Telur Ayam Ras Segar",
              hargaSatuan: 28000,
              stockDisplay: 300,
              stockWarehouse: 200,
              stockTotal: 500,
              satuan: "Kg",
              date: "28-10-2026",
            },
          ],
        },
        {
          id: 2,
          name: "KUD Tani Makmur",
          address: "Jl. Wates KM 12, Sedayu, Bantul, D.I. Yogyakarta",
          telp: "+6285210752362",
          rating: 4.7,
          totalReviews: 8,
          products: [
            {
              productId: "PRD-251026-05",
              name: "Jagung Manis",
              hargaSatuan: 6500,
              stockDisplay: 150,
              stockWarehouse: 150,
              stockTotal: 300,
              satuan: "Kg",
              date: "27-10-2026",
            },
            {
              productId: "PRD-251026-07",
              name: "Daging Ayam Broiler",
              hargaSatuan: 36000,
              stockDisplay: 80,
              stockWarehouse: 120,
              stockTotal: 200,
              satuan: "Kg",
              date: "29-10-2026",
            },
          ],
        },
        {
          id: 3,
          name: "Koperasi Produsen Pertanian Sembada",
          address: "Jl. Magelang KM 14, Tempel, Sleman, D.I. Yogyakarta",
          telp: "+6287890123456",
          rating: 4.4,
          totalReviews: 5,
          products: [
            {
              productId: "PRD-251026-08",
              name: "Sayur Bayam Hijau",
              hargaSatuan: 3000,
              stockDisplay: 100,
              stockWarehouse: 100,
              stockTotal: 200,
              satuan: "Ikat",
              date: "29-10-2026",
            },
            {
              productId: "PRD-251026-09",
              name: "Wortel Segar",
              hargaSatuan: 11000,
              stockDisplay: 90,
              stockWarehouse: 110,
              stockTotal: 200,
              satuan: "Kg",
              date: "29-10-2026",
            },
          ],
        },
      ],

      coperativeReviews: [
        {
          id: 1,
          coperativeName: "Koperasi Budi Luhur",
          rating: 5,
          aspek: "Kualitas Bahan Pangan",
          reviewText: "Beras dan telur sangat segar, kemasan higienis, sangat cocok untuk standar program MBG.",
          reviewer: "SPPG Kulon Progo",
          date: "27-10-2026",
        },
        {
          id: 2,
          coperativeName: "KUD Tani Makmur",
          rating: 4,
          aspek: "Ketepatan Waktu Pengiriman",
          reviewText: "Pengiriman sayur dan jagung selalu tiba sebelum jam 06.00 pagi, siap olah tepat waktu.",
          reviewer: "SPPG Kulon Progo",
          date: "28-10-2026",
        },
      ],

      barangMasukList: [
        {
          id: 1,
          kodeMasuk: "BM-271026-01",
          productId: "PRD-251026-01",
          namaBarang: "Beras Pandan Wangi",
          pemasok: "Koperasi Budi Luhur",
          qty: 150,
          satuan: "Kg",
          date: "27-10-2026",
          petugas: "Siti Rahma",
        },
        {
          id: 2,
          kodeMasuk: "BM-281026-02",
          productId: "PRD-251026-06",
          namaBarang: "Telur Ayam Ras",
          pemasok: "Koperasi Budi Luhur",
          qty: 60,
          satuan: "Kg",
          date: "28-10-2026",
          petugas: "Ahmad Zaki",
        },
        {
          id: 3,
          kodeMasuk: "BM-291026-03",
          productId: "PRD-251026-05",
          namaBarang: "Jagung Manis",
          pemasok: "KUD Tani Makmur",
          qty: 40,
          satuan: "Kg",
          date: "29-10-2026",
          petugas: "Siti Rahma",
        },
      ],

      barangKeluarList: [
        {
          id: 1,
          kodeKeluar: "BK-281026-01",
          productId: "PRD-251026-01",
          namaBarang: "Beras Pandan Wangi",
          tujuan: "Dapur Masak MBG Pagi",
          qty: 50,
          satuan: "Kg",
          date: "28-10-2026",
          petugas: "Joko Widodo",
        },
        {
          id: 2,
          kodeKeluar: "BK-281026-02",
          productId: "PRD-251026-06",
          namaBarang: "Telur Ayam Ras",
          tujuan: "Menu Sarapan Sehat Siswa",
          qty: 30,
          satuan: "Kg",
          date: "28-10-2026",
          petugas: "Joko Widodo",
        },
        {
          id: 3,
          kodeKeluar: "BK-291026-03",
          productId: "PRD-251026-05",
          namaBarang: "Jagung Manis",
          tujuan: "Dapur Pengolahan Sup Siang",
          qty: 25,
          satuan: "Kg",
          date: "29-10-2026",
          petugas: "Rini Astuti",
        },
      ],

      orders: [
        {
          id: 1,
          orderId: "ORD-SPPG-251026-01",
          koperasi: "Koperasi Budi Luhur",
          date: "25-10-2026",
          status: "Diterima",
          totalAmount: 2450000,
          products: [
            {
              productId: "PRD-251026-01",
              name: "Beras Pandan Wangi",
              qty: 150,
              satuan: "Kg",
              hargaSatuan: 14000,
            },
            {
              productId: "PRD-251026-04",
              name: "Pisang Cavendish",
              qty: 50,
              satuan: "Sisir",
              hargaSatuan: 7000,
            },
          ],
        },
        {
          id: 2,
          orderId: "ORD-SPPG-281026-02",
          koperasi: "Koperasi Budi Luhur",
          date: "28-10-2026",
          status: "Diproses",
          totalAmount: 1680000,
          products: [
            {
              productId: "PRD-251026-06",
              name: "Telur Ayam Ras Segar",
              qty: 60,
              satuan: "Kg",
              hargaSatuan: 28000,
            },
          ],
        },
      ],

      invoices: [
        {
          id: 1,
          invoiceId: "INV-SPPG-251026-01",
          orderId: "ORD-SPPG-251026-01",
          koperasi: "Koperasi Budi Luhur",
          date: "25-10-2026",
          status: "Lunas",
          totalAmount: 2450000,
          products: [
            {
              productId: "PRD-251026-01",
              name: "Beras Pandan Wangi",
              qty: 150,
              satuan: "Kg",
              price: 14000,
            },
            {
              productId: "PRD-251026-04",
              name: "Pisang Cavendish",
              qty: 50,
              satuan: "Sisir",
              price: 7000,
            },
          ],
        },
        {
          id: 2,
          invoiceId: "INV-SPPG-281026-02",
          orderId: "ORD-SPPG-281026-02",
          koperasi: "Koperasi Budi Luhur",
          date: "28-10-2026",
          status: "Belum Dibayar",
          totalAmount: 1680000,
          products: [
            {
              productId: "PRD-251026-06",
              name: "Telur Ayam Ras Segar",
              qty: 60,
              satuan: "Kg",
              price: 28000,
            },
          ],
        },
      ],

      receipts: [
        {
          id: 1,
          receiptId: "RCP-SPPG-251026-01",
          invoiceId: "INV-SPPG-251026-01",
          orderId: "ORD-SPPG-251026-01",
          koperasi: "Koperasi Budi Luhur",
          paidAt: "25-10-2026 15:40",
          totalAmount: 2450000,
          products: [
            {
              productId: "PRD-251026-01",
              name: "Beras Pandan Wangi",
              qty: 150,
              satuan: "Kg",
              price: 14000,
            },
            {
              productId: "PRD-251026-04",
              name: "Pisang Cavendish",
              qty: 50,
              satuan: "Sisir",
              price: 7000,
            },
          ],
        },
      ],

      addReview: (item) =>
        set((state) => ({
          coperativeReviews: [
            { ...item, id: Date.now() },
            ...state.coperativeReviews,
          ],
        })),

      deleteReview: (id) =>
        set((state) => ({
          coperativeReviews: state.coperativeReviews.filter((r) => r.id !== id),
        })),

      addBarangMasuk: (item) =>
        set((state) => ({
          barangMasukList: [
            { ...item, id: Date.now() },
            ...state.barangMasukList,
          ],
        })),

      deleteBarangMasuk: (id) =>
        set((state) => ({
          barangMasukList: state.barangMasukList.filter((b) => b.id !== id),
        })),

      addBarangKeluar: (item) =>
        set((state) => ({
          barangKeluarList: [
            { ...item, id: Date.now() },
            ...state.barangKeluarList,
          ],
        })),

      deleteBarangKeluar: (id) =>
        set((state) => ({
          barangKeluarList: state.barangKeluarList.filter((b) => b.id !== id),
        })),

      addOrder: (item) =>
        set((state) => {
          const newOrder: SppgOrderItem = {
            ...item,
            id: Date.now(),
          };
          const newInvoice: SppgInvoiceItem = {
            id: Date.now() + 1,
            invoiceId: `INV-SPPG-${Date.now().toString().slice(-6)}`,
            orderId: newOrder.orderId,
            koperasi: newOrder.koperasi,
            date: newOrder.date,
            status: "Belum Dibayar",
            totalAmount: newOrder.totalAmount,
            products: newOrder.products.map((p) => ({
              productId: p.productId,
              name: p.name,
              qty: p.qty,
              satuan: p.satuan,
              price: p.hargaSatuan,
            })),
          };
          return {
            orders: [newOrder, ...state.orders],
            invoices: [newInvoice, ...state.invoices],
          };
        }),

      payInvoice: (invoiceId) =>
        set((state) => {
          const inv = state.invoices.find((i) => i.invoiceId === invoiceId);
          if (!inv) return state;

          const now = new Date();
          const paidAt = `${now.toLocaleDateString("id-ID")} ${now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}`;

          const newReceipt: SppgReceiptItem = {
            id: Date.now(),
            receiptId: `RCP-SPPG-${Date.now().toString().slice(-6)}`,
            invoiceId: inv.invoiceId,
            orderId: inv.orderId,
            koperasi: inv.koperasi,
            paidAt,
            totalAmount: inv.totalAmount,
            products: inv.products,
          };

          return {
            invoices: state.invoices.map((i) =>
              i.invoiceId === invoiceId ? { ...i, status: "Lunas" } : i
            ),
            receipts: [newReceipt, ...state.receipts],
          };
        }),
    }),
    {
      name: "sppg-system-storage",
    }
  )
);
