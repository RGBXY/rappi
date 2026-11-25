"use client";

import React, { useState } from "react";
import { Plus, ScanBarcode, Edit, X, CheckCircle2, Eye, Trash2, Package, ArrowRightLeft, Check, RefreshCw } from "lucide-react";
import TabNavigation, { TabItem } from "../ui/tab";
import { useProductStore, StockInProductItem } from "@/stores/useProductStore";
import { useSupplierStore } from "@/stores/useSupplierStore";
import { useOrderStore } from "@/stores/useOrderStore";
import Image from "next/image";

export default function StockTable() {
  const store = useProductStore();
  const { suppliers } = useSupplierStore();

  const [currentTab, setCurrentTab] = useState("Stok");

  const statusStyles: Record<string, string> = {
    reworked: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    perish: "bg-red-50 text-red-700 border-red-200",
    rusak: "bg-red-50 text-red-700 border-red-200",
  };

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpen2, setIsModalOpen2] = useState<boolean>(false);
  const [selectedStockIn, setSelectedStockIn] = useState<any | null>(null);

  // Modal Proses Barang Retur (Olah Kembali atau Rusak)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState<boolean>(false);
  const [selectedReturnItem, setSelectedReturnItem] = useState<any | null>(null);
  const [returnDestination, setReturnDestination] = useState<"reworked" | "rusak">("reworked");
  const [returnDisplay, setReturnDisplay] = useState<number>(0);
  const [returnWarehouse, setReturnWarehouse] = useState<number>(0);
  const [returnReason, setReturnReason] = useState<string>("");

  // Modal Ubah Penempatan Stok
  const [isEditAllocationOpen, setIsEditAllocationOpen] = useState<boolean>(false);
  const [selectedStockProduct, setSelectedStockProduct] = useState<any | null>(null);
  const [editContext, setEditContext] = useState<"stok" | "reworked">("stok");
  const [editDisplay, setEditDisplay] = useState<number>(0);
  const [editWarehouse, setEditWarehouse] = useState<number>(0);
  const [editTotal, setEditTotal] = useState<number>(0);

  // Form State untuk Tambah Stok Masuk
  const [autoStockId, setAutoStockId] = useState<string>("");
  const [draftProducts, setDraftProducts] = useState<StockInProductItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [inputDisplay, setInputDisplay] = useState<string>("");
  const [inputWarehouse, setInputWarehouse] = useState<string>("");

  // State untuk Stok Keluar (Berdasarkan Pesanan SPPG Diterima)
  const { order: orders } = useOrderStore();
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [orderOutItems, setOrderOutItems] = useState<
    {
      productId: string;
      name: string;
      qty: number;
      satuan?: string;
      stockId: string;
      scanned: boolean;
      stockWareHouse: number;
    }[]
  >([]);
  const [activeScanningId, setActiveScanningId] = useState<string | null>(null);

  const getStatusBadge = (status?: string) => {
    const key = status?.toLowerCase() ?? "";
    return statusStyles[key] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Data berhasil disimpan!");

  const triggerToast = (msg = "Data berhasil disimpan!") => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Saring stok masuk agar hanya memproses data dengan id STK (buang/abaikan data lama ber-ID PRD)
  const validStockInList = store.stockInList.filter((item: any) => {
    const sId = item.stockId || item.productId || "";
    return !sId.startsWith("PRD-");
  });

  // Generate ID Stok Otomatis: STK-DDMMYY-XX
  const generateStockId = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = String(today.getFullYear()).slice(-2);
    const datePrefix = `STK-${day}${month}${year}-`;

    let maxSeq = 0;
    validStockInList.forEach((s: any) => {
      const sId = s.stockId || "";
      if (typeof sId === "string" && sId.startsWith(datePrefix)) {
        const parts = sId.split("-");
        if (parts.length >= 3) {
          const seq = parseInt(parts[2], 10);
          if (!isNaN(seq) && seq > maxSeq) {
            maxSeq = seq;
          }
        }
      }
    });

    const nextSeq = String(maxSeq + 1).padStart(2, "0");
    return `${datePrefix}${nextSeq}`;
  };

  // Buka Modal Tambah Stok Masuk
  const handleOpenStockInModal = () => {
    const newStockId = generateStockId();
    setAutoStockId(newStockId);
    setDraftProducts([]);

    if (store.products.length > 0) {
      setSelectedProductId(store.products[0].productId);
    } else {
      setSelectedProductId("");
    }

    if (suppliers.length > 0) {
      setSelectedSupplier(suppliers[0].name);
    } else {
      setSelectedSupplier("");
    }

    setInputDisplay("");
    setInputWarehouse("");
    setIsModalOpen(true);
  };

  // Tambahkan Produk ke Daftar Draft Stok Masuk
  const handleAddProductToDraft = () => {
    if (!selectedProductId || !selectedSupplier) {
      alert("Harap pilih nama produk dan pemasok terlebih dahulu.");
      return;
    }

    const targetProduct = store.products.find(
      (p) => p.productId === selectedProductId
    );

    if (!targetProduct) {
      alert("Produk tidak ditemukan.");
      return;
    }

    const displayNum = Number(inputDisplay) || 0;
    const warehouseNum = Number(inputWarehouse) || 0;

    if (displayNum <= 0 && warehouseNum <= 0) {
      alert("Harap masukkan jumlah stok display atau stok gudang minimal 1.");
      return;
    }

    const totalQty = displayNum + warehouseNum;

    const newItem: StockInProductItem = {
      productId: targetProduct.productId,
      name: targetProduct.name,
      supplier: selectedSupplier,
      satuan: targetProduct.satuan || "Kg",
      stockDisplay: displayNum,
      stockWareHouse: warehouseNum,
      qty: totalQty,
    };

    setDraftProducts((prev) => [...prev, newItem]);
    setInputDisplay("");
    setInputWarehouse("");
  };

  // Hapus Produk dari Draft
  const handleRemoveDraftProduct = (index: number) => {
    setDraftProducts((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Simpan Batch Stok Masuk
  const handleSaveStockInBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (draftProducts.length === 0) {
      alert("Belum ada produk yang ditambahkan ke daftar stok masuk!");
      return;
    }

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const dateFormatted = `${day}-${month}-${year}`;

    const totalQty = draftProducts.reduce((sum, item) => sum + item.qty, 0);

    store.addStockIn({
      stockId: autoStockId,
      date: dateFormatted,
      products: draftProducts,
      totalQty,
    });

    setIsModalOpen(false);
    setCurrentTab("Stok Masuk");
    triggerToast("Data stok masuk berhasil disimpan!");
  };

  // Helper untuk mendapatkan array produk dari sebuah row stok masuk
  const getRowProducts = (row: any): StockInProductItem[] => {
    if (row.products && Array.isArray(row.products)) {
      return row.products;
    }
    return [
      {
        productId: row.productId || "-",
        name: row.name || "Produk",
        supplier: row.supplier || "-",
        satuan: row.satuan || "Kg",
        stockDisplay: row.stockDisplay ?? 0,
        stockWareHouse: row.stockWareHouse ?? (row.qty || 0),
        qty: row.qty || 0,
      },
    ];
  };

  // Helper untuk menghitung total kuantitas masuk
  const getRowTotalQty = (row: any): number => {
    if (row.totalQty !== undefined) return row.totalQty;
    const prods = getRowProducts(row);
    return prods.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  };

  // Helper mencari ID Stok kelompok asal untuk produk
  const getProductStockId = (productId: string) => {
    for (const batch of store.stockInList) {
      if (batch.products && Array.isArray(batch.products)) {
        if (batch.products.some((p: any) => p.productId === productId)) {
          return batch.stockId || `STK-${batch.id}`;
        }
      }
    }
    return "STK-251026-01";
  };

  // Muat daftar produk dari order yang dipilih untuk di-scan
  const loadOrderItemsToScan = (orderId: string) => {
    const ord = orders.find((o) => o.orderId === orderId);
    if (!ord) {
      setOrderOutItems([]);
      return;
    }

    const items = ord.products.map((p) => {
      const liveProduct = store.products.find((prod) => prod.productId === p.productId);
      const stockId = getProductStockId(p.productId);
      return {
        productId: p.productId,
        name: p.name,
        qty: p.qty,
        satuan: p.satuan || liveProduct?.satuan || "Kg",
        stockId: stockId,
        scanned: false,
        stockWareHouse: liveProduct?.stockWareHouse || 0,
      };
    });

    setOrderOutItems(items);
  };

  // Buka Modal Stok Keluar
  const handleOpenStockOutModal = () => {
    const firstOrder = orders.length > 0 ? orders[0] : null;
    if (firstOrder) {
      setSelectedOrderId(firstOrder.orderId);
      loadOrderItemsToScan(firstOrder.orderId);
    } else {
      setSelectedOrderId("");
      setOrderOutItems([]);
    }
    setIsModalOpen2(true);
  };

  // Simulasi Scan Produk 1 per 1
  const handleSimulateScan = (productId: string) => {
    setActiveScanningId(productId);
    setTimeout(() => {
      setOrderOutItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, scanned: true } : item
        )
      );
      setActiveScanningId(null);
      const target = orderOutItems.find((p) => p.productId === productId);
      triggerToast(`Barcode ${target?.name || "produk"} berhasil di-scan!`);
    }, 500);
  };

  // Reset status scan satu produk
  const handleResetScan = (productId: string) => {
    setOrderOutItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, scanned: false } : item
      )
    );
  };

  // Simpan Pengeluaran Stok
  const handleSaveStockOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderOutItems.length === 0) return;

    const allScanned = orderOutItems.every((item) => item.scanned);
    if (!allScanned) {
      alert("Harap selesaikan pemindaian (scan barcode) untuk seluruh produk terlebih dahulu!");
      return;
    }

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const dateFormatted = `${day}-${month}-${year}`;

    store.addStockOut(
      orderOutItems.map((item) => ({
        stockId: item.stockId,
        orderId: selectedOrderId,
        productId: item.productId,
        name: item.name,
        qty: item.qty,
        satuan: item.satuan,
        date: dateFormatted,
      }))
    );

    setIsModalOpen2(false);
    setCurrentTab("Stok Keluar");
    triggerToast("Stok keluar berhasil diproses! Stok gudang telah dipotong sesuai pesanan.");
  };

  // Buka Modal Ubah Penempatan Stok
  const handleOpenEditAllocation = (product: any, context: "stok" | "reworked" = "stok") => {
    const total =
      (Number(product.stockDisplay) || 0) + (Number(product.stockWareHouse) || 0);
    setSelectedStockProduct(product);
    setEditContext(context);
    setEditTotal(total);
    setEditDisplay(Number(product.stockDisplay) || 0);
    setEditWarehouse(Number(product.stockWareHouse) || 0);
    setIsEditAllocationOpen(true);
  };

  // Ubah input Display secara reaktif (Gudang otomatis menyesuaikan total)
  const handleDisplayChange = (valStr: string) => {
    let val = Number(valStr);
    if (isNaN(val)) val = 0;
    const clampedDisplay = Math.max(0, Math.min(val, editTotal));
    setEditDisplay(clampedDisplay);
    setEditWarehouse(editTotal - clampedDisplay);
  };

  // Ubah input Gudang secara reaktif (Display otomatis menyesuaikan total)
  const handleWarehouseChange = (valStr: string) => {
    let val = Number(valStr);
    if (isNaN(val)) val = 0;
    const clampedWarehouse = Math.max(0, Math.min(val, editTotal));
    setEditWarehouse(clampedWarehouse);
    setEditDisplay(editTotal - clampedWarehouse);
  };

  // Simpan Penempatan Stok
  const handleSaveAllocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockProduct) return;

    if (editContext === "reworked") {
      store.updateReworkedAllocation(
        selectedStockProduct.id,
        editDisplay,
        editWarehouse
      );
      triggerToast("Penempatan stok olah kembali berhasil diperbarui!");
    } else {
      store.updateStockAllocation(
        selectedStockProduct.productId,
        editDisplay,
        editWarehouse
      );
      triggerToast("Penempatan stok berhasil diperbarui!");
    }

    setIsEditAllocationOpen(false);
    setSelectedStockProduct(null);
  };

  // Buka Modal Proses Barang Retur
  const handleOpenProcessReturn = (item: any) => {
    setSelectedReturnItem(item);
    setReturnDestination("reworked");
    const total = Number(item.qty) || 0;
    const initialDisplay = Math.floor(total / 2);
    setReturnDisplay(initialDisplay);
    setReturnWarehouse(total - initialDisplay);
    setReturnReason(item.reason || "");
    setIsReturnModalOpen(true);
  };

  const handleReturnDisplayChange = (valStr: string) => {
    if (!selectedReturnItem) return;
    const total = Number(selectedReturnItem.qty) || 0;
    let val = Number(valStr);
    if (isNaN(val)) val = 0;
    const clamped = Math.max(0, Math.min(val, total));
    setReturnDisplay(clamped);
    setReturnWarehouse(total - clamped);
  };

  const handleReturnWarehouseChange = (valStr: string) => {
    if (!selectedReturnItem) return;
    const total = Number(selectedReturnItem.qty) || 0;
    let val = Number(valStr);
    if (isNaN(val)) val = 0;
    const clamped = Math.max(0, Math.min(val, total));
    setReturnWarehouse(clamped);
    setReturnDisplay(total - clamped);
  };

  const handleSaveProcessReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturnItem) return;

    store.processReturnItem({
      id: selectedReturnItem.id,
      destination: returnDestination,
      stockDisplay: returnDisplay,
      stockWareHouse: returnWarehouse,
      reason: returnReason,
    });

    setIsReturnModalOpen(false);
    setSelectedReturnItem(null);
    if (returnDestination === "reworked") {
      triggerToast("Barang retur berhasil dialihkan ke Olah Kembali!");
    } else {
      triggerToast("Barang retur berhasil dialihkan ke Bagian Rusak!");
    }
  };

  // Daftar Tab dengan badge dinamis dari store dalam Bahasa Indonesia
  const productTabs: TabItem[] = [
    { label: "Stok" },
    { label: "Stok Masuk", badge: validStockInList.length },
    { label: "Stok Keluar" },
    { label: "Retur", badge: store.returnList.length },
    { label: "Olah Kembali" },
    { label: "Rusak" },
  ];

  // Mapping konfigurasi tabel berdasarkan tab aktif
  const tabConfigs: Record<
    string,
    {
      headers: string[];
      getData: () => any[];
      onUpdate?: (id: number) => void;
      renderRow: (row: any) => React.ReactNode;
    }
  > = {
    Stok: {
      headers: [
        "ID Produk",
        "Nama Produk",
        "Harga Satuan",
        "Stok Display",
        "Stok Gudang",
        "Total Stok",
      ],
      getData: () => store.products,
      onUpdate: store.updateProduct,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold text-gray-900">
            {row.productId}
          </td>
          <td className="py-3 px-4 font-medium text-gray-900">{row.name}</td>
          <td className="py-3 px-4 font-medium text-gray-900">
            Rp {row.hargaSatuan?.toLocaleString("id-ID")} /{row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 text-gray-600">
            {row.stockDisplay} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 text-gray-600">
            {row.stockWareHouse} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
              {row.stock} {row.satuan || "Kg"}
            </span>
          </td>
        </>
      ),
    },

    "Stok Masuk": {
      headers: [
        "ID Stok",
        "Tanggal Masuk",
        "Jumlah Komoditas",
        "Total Stok Masuk",
        "Aksi",
      ],
      getData: () => validStockInList,
      renderRow: (row) => {
        const prods = getRowProducts(row);
        const totalQty = getRowTotalQty(row);
        const stockIdDisplay = row.stockId || `STK-${row.id}`;

        return (
          <>
            <td className="py-3 px-4 font-semibold text-gray-900">
              {stockIdDisplay}
            </td>
            <td className="py-3 px-4 text-gray-500 text-xs">{row.date}</td>
            <td className="py-3 px-4">
              <span className="text-gray-800 font-medium">
                {prods.length} Komoditas
              </span>
            </td>
            <td className="py-3 px-4 font-bold text-gray-900 text-right">
              +{totalQty.toLocaleString("id-ID")}{" "}
              <span className="text-xs font-normal text-gray-500">
                {prods[0]?.satuan || "Unit"}
              </span>
            </td>
            <td className="py-3 px-4 text-center">
              <button
                type="button"
                onClick={() => setSelectedStockIn(row)}
                className="px-3.5 py-1.5 inline-flex items-center gap-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Detail</span>
              </button>
            </td>
          </>
        );
      },
    },

    "Stok Keluar": {
      headers: [
        "ID Stok",
        "ID Pesanan",
        "ID Produk",
        "Nama Produk",
        "Jumlah Keluar",
        "Tanggal",
      ],
      getData: () => store.stockOutList,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold text-gray-900">
            {row.stockId || "STK-251026-01"}
          </td>
          <td className="py-3 px-4">
            <span className="px-2.5 py-1 rounded-md font-mono text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200">
              {row.orderId || "-"}
            </span>
          </td>
          <td className="py-3 px-4 font-semibold text-gray-900 text-xs">
            {row.productId}
          </td>
          <td className="py-3 px-4 font-medium text-gray-900">
            {row.name}
          </td>
          <td className="py-3 px-4 font-semibold text-rose-600">
            -{row.qty} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 text-gray-500 text-xs">{row.date}</td>
        </>
      ),
    },

    Retur: {
      headers: ["ID Stok", "ID Produk", "Nama Produk", "Jumlah Retur", "Alasan", "Status"],
      getData: () => store.returnList,
      onUpdate: () => {},
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold text-gray-900">
            {row.stockId || "STK-251026-01"}
          </td>
          <td className="py-3 px-4 font-semibold text-gray-900 text-xs">
            {row.productId}
          </td>
          <td className="py-3 px-4 font-medium text-gray-900">{row.name}</td>
          <td className="py-3 px-4 font-medium text-gray-900">
            {row.qty} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 text-gray-600">{row.reason}</td>
          <td className="py-3 px-4">
            <span
              className={`px-2 py-0.5 rounded-md text-xs border ${getStatusBadge(
                row.status?.toLowerCase() === "perish" ? "rusak" : row.status
              )}`}
            >
              {row.status?.toLowerCase() === "perish" ? "Rusak" : row.status}
            </span>
          </td>
        </>
      ),
    },

    "Olah Kembali": {
      headers: [
        "ID Stok",
        "ID Produk",
        "Nama Produk",
        "Stok Display",
        "Stok Gudang",
        "Total Stok",
      ],
      getData: () => store.reworkedList,
      onUpdate: () => {},
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold text-gray-900">
            {row.stockId || "STK-251026-01"}
          </td>
          <td className="py-3 px-4 font-semibold text-gray-900 text-xs">
            {row.productId}
          </td>
          <td className="py-3 px-4 font-medium text-gray-900">{row.name}</td>
          <td className="py-3 px-4 text-gray-600">
            {row.stockDisplay} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 text-gray-600">
            {row.stockWareHouse} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
              {row.stock} {row.satuan || "Kg"}
            </span>
          </td>
        </>
      ),
    },

    Rusak: {
      headers: ["ID Stok", "ID Produk", "Nama Produk", "Jumlah Rusak", "Alasan"],
      getData: () => store.perishList,
      renderRow: (row) => (
        <>
          <td className="py-3 px-4 font-semibold text-gray-900">
            {row.stockId || "STK-251026-02"}
          </td>
          <td className="py-3 px-4 font-semibold text-gray-900 text-xs">
            {row.productId}
          </td>
          <td className="py-3 px-4 font-medium text-gray-900">{row.name}</td>
          <td className="py-3 px-4 font-medium text-rose-600">
            {row.qty} {row.satuan || "Kg"}
          </td>
          <td className="py-3 px-4 text-gray-600">{row.reason}</td>
        </>
      ),
    },
  };

  const currentConfig = tabConfigs[currentTab] || {
    headers: ["Data", "Keterangan"],
    getData: () => [],
    renderRow: () => (
      <td colSpan={2} className="py-4 px-4 text-gray-400">
        Belum ada konfigurasi untuk tab ini
      </td>
    ),
  };

  const tableData = currentConfig.getData();

  // Ambil detail produk yang sedang dipilih saat input stok masuk
  const currentSelectedProduct = store.products.find(
    (p) => p.productId === selectedProductId
  );

  return (
    <div className="space-y-6 mx-auto">
      {/* Tab Navigasi & Tombol Aksi */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <TabNavigation
          tabs={productTabs}
          activeTab={currentTab}
          onChange={(tab) => {
            setCurrentTab(tab);
          }}
        />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenStockInModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Stok Masuk</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenStockOutModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <ScanBarcode className="w-4.5 h-4.5" />
              <span>Stok Keluar</span>
            </button>
          </div>
        </div>

        {/* Modal Tambah Stok Masuk */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl transition-all max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Tambah Stok Masuk Baru
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Tambahkan pasokan komoditas bahan pangan ke gudang &amp; display.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveStockInBatch}>
                <div className="py-4 space-y-4">
                  {/* Info Header: ID Stok Otomatis & Tanggal */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-gray-50/70 border border-gray-200/70 rounded-xl">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        ID Stok (Otomatis)
                      </label>
                      <div className="flex items-center px-3.5 py-2 text-sm font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-xl select-none">
                        {autoStockId}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Dibuat otomatis: STK-TGLBLNTHN-URUTAN
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tanggal Masuk
                      </label>
                      <div className="flex items-center px-3.5 py-2 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl">
                        {new Date().toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Form Tambah Item Produk ke Daftar */}
                  <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Input Produk Pasokan
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Nama Produk (Master Produk)
                        </label>
                        <select
                          value={selectedProductId}
                          onChange={(e) => setSelectedProductId(e.target.value)}
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                        >
                          {store.products.map((prod) => (
                            <option key={prod.productId} value={prod.productId}>
                              {prod.name} ({prod.productId})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Pemasok (Master Pemasok)
                        </label>
                        <select
                          value={selectedSupplier}
                          onChange={(e) => setSelectedSupplier(e.target.value)}
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                        >
                          {suppliers.map((sup) => (
                            <option key={sup.id} value={sup.name}>
                              {sup.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Stok Display ({currentSelectedProduct?.satuan || "Kg"})
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={inputDisplay}
                          onChange={(e) => setInputDisplay(e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Stok Gudang ({currentSelectedProduct?.satuan || "Kg"})
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={inputWarehouse}
                          onChange={(e) => setInputWarehouse(e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <button
                          type="button"
                          onClick={handleAddProductToDraft}
                          className="w-full py-2 px-3 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Tambah Produk</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Daftar Produk yang Ditambahkan Dalam Batch Ini */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Daftar Produk pada {autoStockId} ({draftProducts.length} Produk)
                    </label>

                    {draftProducts.length === 0 ? (
                      <div className="p-6 border border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-xs">
                        <Package className="w-6 h-6 mx-auto mb-1.5 text-gray-300" />
                        Belum ada produk yang ditambahkan ke daftar. Silakan pilih produk &amp; jumlah stok di atas, lalu klik <strong>&quot;+ Tambah Produk&quot;</strong>.
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                              <th className="py-2.5 px-3">Produk</th>
                              <th className="py-2.5 px-3">Pemasok</th>
                              <th className="py-2.5 px-3 text-center">Display</th>
                              <th className="py-2.5 px-3 text-center">Gudang</th>
                              <th className="py-2.5 px-3 text-right">Total Masuk</th>
                              <th className="py-2.5 px-3 text-center w-10">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-700">
                            {draftProducts.map((item, index) => (
                              <tr key={index} className="hover:bg-gray-50/50">
                                <td className="py-2 px-3 font-medium text-gray-900">
                                  {item.name}
                                </td>
                                <td className="py-2 px-3 text-gray-600">
                                  {item.supplier}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  {item.stockDisplay} {item.satuan}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  {item.stockWareHouse} {item.satuan}
                                </td>
                                <td className="py-2 px-3 text-right font-bold text-emerald-700">
                                  +{item.qty} {item.satuan}
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDraftProduct(index)}
                                    className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                    title="Hapus baris"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Total Kuantitas:{" "}
                    <strong className="text-gray-900 text-sm">
                      {draftProducts.reduce((sum, item) => sum + item.qty, 0)}
                    </strong>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={draftProducts.length === 0}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-xs ${
                        draftProducts.length === 0
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                      }`}
                    >
                      Simpan Stok Masuk
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Stok Keluar (Pemenuhan Pesanan SPPG & Scan Barcode) */}
        {isModalOpen2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl transition-all max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Stok Keluar - Pemenuhan Pesanan SPPG
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pilih pesanan diterima, simulasikan scan barcode tiap produk, dan potong stok gudang.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen2(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveStockOutSubmit}>
                <div className="py-4 space-y-4">
                  {/* Pilihan Data Pesanan SPPG Diterima */}
                  <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                    <label className="block text-xs font-semibold text-gray-700">
                      Pilih Data Pesanan SPPG (Diterima)
                    </label>
                    <select
                      value={selectedOrderId}
                      onChange={(e) => {
                        setSelectedOrderId(e.target.value);
                        loadOrderItemsToScan(e.target.value);
                      }}
                      className="w-full px-3.5 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 font-medium"
                    >
                      {orders.map((ord) => (
                        <option key={ord.orderId} value={ord.orderId}>
                          {ord.orderId} • {ord.sppg} ({ord.products.length} Komoditas) - {ord.date}
                        </option>
                      ))}
                    </select>

                    {selectedOrderId && (
                      <p className="text-xs text-emerald-700 font-medium pt-1">
                        Tujuan Distribusi: {orders.find((o) => o.orderId === selectedOrderId)?.sppg}
                      </p>
                    )}
                  </div>

                  {/* Progress Verifikasi Scan Barcode */}
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-900">
                        Status Verifikasi Barcode Fisik:
                      </span>
                      <span className="font-bold text-emerald-800">
                        {orderOutItems.filter((i) => i.scanned).length} dari {orderOutItems.length} Produk Ter-scan
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                        style={{
                          width: `${
                            orderOutItems.length > 0
                              ? (orderOutItems.filter((i) => i.scanned).length /
                                  orderOutItems.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Daftar Produk Pesanan & Tombol Simulasi Scan 1 per 1 */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-gray-700">
                      Rincian Produk Pesanan &amp; Asal Kelompok Stok
                    </label>

                    {orderOutItems.length === 0 ? (
                      <div className="p-6 border border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-xs">
                        Tidak ada produk dalam pesanan yang dipilih.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {orderOutItems.map((item) => (
                          <div
                            key={item.productId}
                            className={`p-3.5 rounded-xl border transition-all ${
                              item.scanned
                                ? "bg-emerald-50/40 border-emerald-300"
                                : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-sm text-gray-900">
                                    {item.name}
                                  </span>
                                  <span className="font-mono text-xs text-gray-500">
                                    ({item.productId})
                                  </span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-800 font-mono">
                                    ID Stok: {item.stockId}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                  <span>
                                    Jumlah Dipesan:{" "}
                                    <strong className="text-rose-600">
                                      -{item.qty} {item.satuan}
                                    </strong>
                                  </span>
                                  <span>
                                    Stok Gudang:{" "}
                                    <strong className="text-gray-900">
                                      {item.stockWareHouse} {item.satuan}
                                    </strong>
                                  </span>
                                  <span>
                                    Sisa Gudang:{" "}
                                    <strong className="text-emerald-700">
                                      {Math.max(0, item.stockWareHouse - item.qty)} {item.satuan}
                                    </strong>
                                  </span>
                                </div>
                              </div>

                              {/* Aksi Simulasi Scan Barcode 1 per 1 */}
                              <div className="shrink-0 flex items-center gap-2">
                                {item.scanned ? (
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white shadow-xs">
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Ter-scan ✓</span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleResetScan(item.productId)}
                                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                      title="Scan Ulang"
                                    >
                                      <RefreshCw className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSimulateScan(item.productId)}
                                    disabled={activeScanningId === item.productId}
                                    className="px-3 py-1.5 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:bg-blue-400"
                                  >
                                    <ScanBarcode className="w-3.5 h-3.5" />
                                    <span>
                                      {activeScanningId === item.productId
                                        ? "Memindai..."
                                        : "Scan Barcode"}
                                    </span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Simulasi Ilustrasi Scanner Barcode */}
                  <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex items-center justify-center gap-3">
                    <Image
                      src={"/img/scan_barcode.png"}
                      width={50}
                      height={50}
                      alt="Barcode Scanner"
                      className="object-contain"
                    />
                    <div className="text-xs text-gray-600">
                      <p className="font-semibold text-gray-800">
                        Simulasi Scanner Barcode Gudang
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Klik tombol <strong>&quot;Scan Barcode&quot;</strong> pada masing-masing produk untuk memverifikasi fisik komoditas sebelum barang dikeluarkan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Total Komoditas:{" "}
                    <strong className="text-gray-900 text-sm">
                      {orderOutItems.reduce((acc, curr) => acc + curr.qty, 0)} Unit
                    </strong>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen2(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={
                        orderOutItems.length === 0 ||
                        !orderOutItems.every((item) => item.scanned)
                      }
                      className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-xs ${
                        orderOutItems.length === 0 ||
                        !orderOutItems.every((item) => item.scanned)
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                      }`}
                    >
                      Selesaikan Pengeluaran Stok
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detail Stok Masuk (Mirip Tampilan Faktur) */}
        {selectedStockIn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="relative w-full max-w-4xl p-6 bg-white rounded-2xl shadow-xl transition-all max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Rincian Stok Masuk - {selectedStockIn.stockId || `STK-${selectedStockIn.id}`}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Tanggal Masuk: {selectedStockIn.date} | Total {getRowProducts(selectedStockIn).length} Komoditas Bahan Pangan
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStockIn(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                      <th className="py-2.5 px-3">ID Produk</th>
                      <th className="py-2.5 px-3">Nama Produk</th>
                      <th className="py-2.5 px-3">Pemasok</th>
                      <th className="py-2.5 px-3">Satuan</th>
                      <th className="py-2.5 px-3 text-center">Stok Display</th>
                      <th className="py-2.5 px-3 text-center">Stok Gudang</th>
                      <th className="py-2.5 px-3 text-right">Total Masuk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {getRowProducts(selectedStockIn).map((prod, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-gray-900 text-xs">
                          {prod.productId}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-gray-900">
                          {prod.name}
                        </td>
                        <td className="py-2.5 px-3 text-gray-600">
                          {prod.supplier}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {prod.satuan || "Kg"}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center text-gray-700 font-medium">
                          {prod.stockDisplay} {prod.satuan || "Kg"}
                        </td>
                        <td className="py-2.5 px-3 text-center text-gray-700 font-medium">
                          {prod.stockWareHouse} {prod.satuan || "Kg"}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                          +{prod.qty} {prod.satuan || "Kg"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm">
                  <span className="text-gray-500">Total Pasokan Masuk:</span>
                  <span className="font-bold text-base text-gray-900 ml-1.5 text-emerald-700">
                    +{getRowTotalQty(selectedStockIn).toLocaleString("id-ID")}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      {getRowProducts(selectedStockIn)[0]?.satuan || "Unit"}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStockIn(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Ubah Penempatan Stok (Display vs Gudang, Total Tetap) */}
        {isEditAllocationOpen && selectedStockProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl transition-all">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {editContext === "reworked"
                      ? "Ubah Penempatan Stok Olah Kembali"
                      : "Ubah Penempatan Stok"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedStockProduct.name} ({selectedStockProduct.productId})
                    {selectedStockProduct.stockId && (
                      <span className="ml-1 text-emerald-700 font-mono font-medium">
                        • {selectedStockProduct.stockId}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditAllocationOpen(false);
                    setSelectedStockProduct(null);
                  }}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAllocationSubmit}>
                <div className="py-4 space-y-4">
                  {/* Info Total Stok Terkunci */}
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-emerald-800">
                        Total Stok Keseluruhan (Terkunci)
                      </span>
                      <span className="text-sm font-bold text-emerald-900">
                        {editTotal} {selectedStockProduct.satuan || "Kg"}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700/80 mt-1">
                      {editContext === "reworked"
                        ? "Total stok berasal dari pesanan SPPG yang diretur. Anda dapat mengatur ulang pembagian antara stok display dan stok gudang."
                        : "Total stok tetap sama. Anda dapat mengatur ulang pembagian antara stok display dan stok gudang."}
                    </p>
                  </div>

                  {/* Range Slider Interaktif */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span>Display: {editDisplay} {selectedStockProduct.satuan || "Kg"}</span>
                      <span>Gudang: {editWarehouse} {selectedStockProduct.satuan || "Kg"}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={editTotal}
                      value={editDisplay}
                      onChange={(e) => handleDisplayChange(e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>0 Display</span>
                      <span>Rasio Penempatan</span>
                      <span>{editTotal} Display</span>
                    </div>
                  </div>

                  {/* Dua Input Numerik */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Stok Display ({selectedStockProduct.satuan || "Kg"})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={editTotal}
                        value={editDisplay}
                        onChange={(e) => handleDisplayChange(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm font-semibold text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Stok Gudang ({selectedStockProduct.satuan || "Kg"})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={editTotal}
                        value={editWarehouse}
                        onChange={(e) => handleWarehouseChange(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm font-semibold text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Validasi Kesesuaian */}
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200/60 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <ArrowRightLeft className="w-3.5 h-3.5 text-gray-500" />
                      <span>{editDisplay} + {editWarehouse}</span>
                    </div>
                    <span className="font-semibold text-emerald-700">
                      = {editTotal} {selectedStockProduct.satuan || "Kg"} (Sesuai)
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditAllocationOpen(false);
                      setSelectedStockProduct(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Proses Barang Retur (Olah Kembali vs Rusak) */}
        {isReturnModalOpen && selectedReturnItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="relative w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl transition-all">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    Proses Barang Retur
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Tentukan pengalihan barang retur ke Olah Kembali atau Bagian Rusak.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsReturnModalOpen(false);
                    setSelectedReturnItem(null);
                  }}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProcessReturnSubmit}>
                <div className="py-4 space-y-4">
                  {/* Detail Komoditas Retur */}
                  <div className="p-3.5 bg-gray-50/80 border border-gray-200/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 text-sm">
                        {selectedReturnItem.name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200">
                        {selectedReturnItem.stockId || "STK-251026-01"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-1 border-t border-gray-200/60">
                      <div>
                        <span className="text-gray-400">ID Produk:</span>{" "}
                        <span className="font-medium text-gray-800">{selectedReturnItem.productId}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Jumlah Retur:</span>{" "}
                        <span className="font-bold text-gray-900">{selectedReturnItem.qty} {selectedReturnItem.satuan || "Kg"}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Alasan Retur:</span>{" "}
                        <span className="font-medium text-gray-700">{selectedReturnItem.reason || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pilihan Tindakan / Destinasi */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Pilih Tindakan Pengalihan Barang:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setReturnDestination("reworked")}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          returnDestination === "reworked"
                            ? "border-emerald-600 bg-emerald-50/60 text-emerald-900 shadow-xs ring-1 ring-emerald-600"
                            : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="font-bold text-xs">Olah Kembali</span>
                          {returnDestination === "reworked" && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-tight">
                          Dapat diperbaiki / dialokasikan ke display atau gudang.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReturnDestination("rusak")}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          returnDestination === "rusak"
                            ? "border-rose-600 bg-rose-50/60 text-rose-900 shadow-xs ring-1 ring-rose-600"
                            : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="font-bold text-xs text-rose-700">Masuk Bagian Rusak</span>
                          {returnDestination === "rusak" && (
                            <CheckCircle2 className="w-4 h-4 text-rose-600" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-tight">
                          Barang cacat/afkir dan tidak dapat diolah kembali.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Jika Olah Kembali: Input Pembagian Stok Display & Gudang */}
                  {returnDestination === "reworked" && (
                    <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-900">
                          Alokasi Stok Olah Kembali
                        </span>
                        <span className="text-xs font-bold text-emerald-800">
                          Total: {selectedReturnItem.qty} {selectedReturnItem.satuan || "Kg"}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-700 leading-tight">
                        Tentukan kuantitas yang akan dimasukkan ke Stok Display dan Stok Gudang pada data Olah Kembali.
                      </p>

                      {/* Range Slider */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                          <span>Display: {returnDisplay} {selectedReturnItem.satuan || "Kg"}</span>
                          <span>Gudang: {returnWarehouse} {selectedReturnItem.satuan || "Kg"}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={Number(selectedReturnItem.qty) || 0}
                          value={returnDisplay}
                          onChange={(e) => handleReturnDisplayChange(e.target.value)}
                          className="w-full h-2 bg-emerald-200/80 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />
                      </div>

                      {/* 2 Input Numerik */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-medium text-gray-700 mb-1">
                            Stok Display ({selectedReturnItem.satuan || "Kg"})
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={Number(selectedReturnItem.qty) || 0}
                            value={returnDisplay}
                            onChange={(e) => handleReturnDisplayChange(e.target.value)}
                            className="w-full px-3 py-1.5 text-sm font-semibold text-gray-900 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-gray-700 mb-1">
                            Stok Gudang ({selectedReturnItem.satuan || "Kg"})
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={Number(selectedReturnItem.qty) || 0}
                            value={returnWarehouse}
                            onChange={(e) => handleReturnWarehouseChange(e.target.value)}
                            className="w-full px-3 py-1.5 text-sm font-semibold text-gray-900 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-emerald-800 pt-1">
                        <span>Kesesuaian Total:</span>
                        <span className="font-semibold">
                          {returnDisplay} + {returnWarehouse} = {Number(selectedReturnItem.qty) || 0} {selectedReturnItem.satuan || "Kg"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Jika Bagian Rusak: Konfirmasi & Alasan */}
                  {returnDestination === "rusak" && (
                    <div className="p-4 bg-rose-50/50 border border-rose-200/80 rounded-xl space-y-3">
                      <p className="text-xs text-rose-800 leading-relaxed">
                        Barang retur sebanyak <strong>{selectedReturnItem.qty} {selectedReturnItem.satuan || "Kg"}</strong> ini akan dicatat langsung ke dalam <strong>Bagian Rusak</strong> dengan status afkir.
                      </p>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Keterangan / Alasan Kerusakan
                        </label>
                        <input
                          type="text"
                          value={returnReason}
                          onChange={(e) => setReturnReason(e.target.value)}
                          placeholder="Contoh: Cangkang retak, busuk, berjamur"
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-rose-200 rounded-lg focus:outline-none focus:border-rose-600"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReturnModalOpen(false);
                      setSelectedReturnItem(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer shadow-xs ${
                      returnDestination === "rusak"
                        ? "bg-rose-600 hover:bg-rose-700"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    }`}
                  >
                    Simpan &amp; Proses Retur
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notifikasi Toast */}
        {showToast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 transition-all animate-bounce-once">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-sm font-medium">
              {toastMessage}
            </span>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="p-1 -mr-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tabel Data Dinamis */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                {currentConfig.headers.map((headerText, idx) => (
                  <th
                    key={idx}
                    className={`py-3.5 px-4 ${
                      headerText === "Total Stok Masuk" ? "text-right" : ""
                    } ${headerText === "Aksi" ? "text-center" : ""}`}
                  >
                    {headerText}
                  </th>
                ))}
                {currentConfig.onUpdate && (
                  <th className="py-3.5 px-4 w-12 text-center">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {tableData.length > 0 ? (
                tableData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    {currentConfig.renderRow(row)}
                    {currentConfig.onUpdate && (
                      <td className="py-3 px-4 text-center">
                        {currentTab === "Retur" && row.status?.toLowerCase() !== "pending" ? (
                          <span className="text-xs text-gray-400 font-medium select-none">-</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (currentTab === "Stok") {
                                handleOpenEditAllocation(row, "stok");
                              } else if (currentTab === "Olah Kembali") {
                                handleOpenEditAllocation(row, "reworked");
                              } else if (currentTab === "Retur") {
                                handleOpenProcessReturn(row);
                              } else if (currentConfig.onUpdate) {
                                currentConfig.onUpdate(row.id);
                              }
                            }}
                            className="px-3 py-1.5 inline-flex items-center gap-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs font-semibold transition-colors cursor-pointer"
                            title={currentTab === "Retur" ? "Proses Barang Retur" : "Ubah Penempatan Stok"}
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Ubah</span>
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={currentConfig.headers.length + (currentConfig.onUpdate ? 1 : 0)}
                    className="py-12 text-center text-gray-400 font-normal"
                  >
                    Tidak Ada Data Ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
