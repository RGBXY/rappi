import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BaseItem {
  id: number;
  productId: string;
  name: string;
  satuan?: string;
  [key: string]: any;
}

export interface StockInProductItem {
  productId: string;
  name: string;
  supplier: string;
  satuan?: string;
  stockDisplay: number;
  stockWareHouse: number;
  qty: number;
}

export interface StockInBatchItem {
  id: number;
  stockId: string;
  date: string;
  products: StockInProductItem[];
  totalQty?: number;
  [key: string]: any;
}

interface InventoryState {
  products: BaseItem[];
  stockInList: any[];
  stockOutList: BaseItem[];
  returnList: BaseItem[];
  reworkedList: BaseItem[];
  perishList: BaseItem[];
  stockChangeLog: BaseItem[];
  // Actions / Methods
  addProduct: (item: Omit<BaseItem, "id">) => void;
  editProduct: (id: number, updatedItem: Partial<BaseItem>) => void;
  deleteProduct: (id: number) => void;
  updateProduct: (id: number) => void;
  updateStockAllocation: (
    productId: string,
    stockDisplay: number,
    stockWareHouse: number
  ) => void;
  updateReworkedAllocation: (
    id: number,
    stockDisplay: number,
    stockWareHouse: number
  ) => void;
  upadteReturn: (id: number) => void;
  processReturnItem: (payload: {
    id: number;
    destination: "reworked" | "rusak";
    stockDisplay?: number;
    stockWareHouse?: number;
    reason?: string;
  }) => void;
  addStockIn: (item: any) => void;
  addStockOut: (
    items: {
      stockId: string;
      orderId: string;
      productId: string;
      name: string;
      qty: number;
      satuan?: string;
      date?: string;
    }[]
  ) => void;
}

export const useProductStore = create<InventoryState>()(
  persist(
    (set) => ({
      products: [
        {
          id: 1,
          productId: "PRD-251026-01",
          name: "Beras Pandan Wangi",
          hargaSatuan: 14000,
          stockDisplay: 250,
          stockWareHouse: 500,
          stock: 750,
          satuan: "Kg",
          date: "25-10-2026",
        },
        {
          id: 2,
          productId: "PRD-251026-04",
          name: "Pisang Cavendish",
          hargaSatuan: 7000,
          stockDisplay: 120,
          stockWareHouse: 80,
          stock: 200,
          satuan: "Sisir",
          date: "25-10-2026",
        },
        {
          id: 3,
          productId: "PRD-251026-05",
          name: "Jagung Manis",
          hargaSatuan: 6500,
          stockDisplay: 150,
          stockWareHouse: 150,
          stock: 300,
          satuan: "Kg",
          date: "25-10-2026",
        },
        {
          id: 4,
          productId: "PRD-251026-06",
          name: "Telur Ayam Ras Segar",
          hargaSatuan: 28000,
          stockDisplay: 300,
          stockWareHouse: 200,
          stock: 500,
          satuan: "Kg",
          date: "25-10-2026",
        },
        {
          id: 5,
          productId: "PRD-251026-07",
          name: "Singkong",
          hargaSatuan: 5000,
          stockDisplay: 120,
          stockWareHouse: 80,
          stock: 200,
          satuan: "Kg",
          date: "25-10-2026",
        },
      ],
      stockInList: [
        {
          id: 1,
          stockId: "STK-251026-01",
          date: "25-10-2026",
          products: [
            {
              productId: "PRD-251026-01",
              name: "Beras Pandan Wangi",
              supplier: "Dona",
              satuan: "Kg",
              stockDisplay: 250,
              stockWareHouse: 500,
              qty: 750,
            },
            {
              productId: "PRD-251026-04",
              name: "Pisang Cavendish",
              supplier: "Dina",
              satuan: "Sisir",
              stockDisplay: 120,
              stockWareHouse: 80,
              qty: 200,
            },
          ],
          totalQty: 950,
        },
        {
          id: 2,
          stockId: "STK-251026-02",
          date: "25-10-2026",
          products: [
            {
              productId: "PRD-251026-05",
              name: "Jagung Manis",
              supplier: "Dona",
              satuan: "Kg",
              stockDisplay: 150,
              stockWareHouse: 150,
              qty: 300,
            },
            {
              productId: "PRD-251026-06",
              name: "Telur Ayam Ras Segar",
              supplier: "Dina",
              satuan: "Kg",
              stockDisplay: 300,
              stockWareHouse: 200,
              qty: 500,
            },
          ],
          totalQty: 800,
        },
        {
          id: 3,
          stockId: "STK-251026-03",
          date: "25-10-2026",
          products: [
            {
              productId: "PRD-251026-07",
              name: "Singkong",
              supplier: "Budi",
              satuan: "Kg",
              stockDisplay: 120,
              stockWareHouse: 80,
              qty: 200,
            },
          ],
          totalQty: 200,
        },
      ],
      stockOutList: [
        {
          id: 1,
          stockId: "STK-251026-01",
          orderId: "ORD-251026-04",
          productId: "PRD-251026-04",
          name: "Pisang Cavendish",
          qty: 50,
          satuan: "Sisir",
          date: "29-10-2026",
        },
        {
          id: 2,
          stockId: "STK-251026-01",
          orderId: "ORD-261026-04",
          productId: "PRD-251026-01",
          name: "Beras Pandan Wangi",
          qty: 100,
          satuan: "Kg",
          date: "29-10-2026",
        },
      ],
      returnList: [
        {
          id: 1,
          stockId: "STK-251026-01",
          orderId: "ORD-251026-04",
          productId: "PRD-251026-04",
          name: "Pisang Cavendish",
          qty: 10,
          satuan: "Sisir",
          reason: "Terlalu Matang",
          status: "Reworked",
          date: "30-10-2026",
        },
        {
          id: 2,
          stockId: "STK-251026-02",
          orderId: "ORD-251026-04",
          productId: "PRD-251026-06",
          name: "Telur Ayam Ras Segar",
          qty: 5,
          satuan: "Kg",
          reason: "Cangkang Retak",
          status: "Rusak",
          date: "30-10-2026",
        },
        {
          id: 3,
          stockId: "STK-251026-02",
          orderId: "ORD-251026-04",
          productId: "PRD-251026-05",
          name: "Jagung Manis",
          qty: 15,
          satuan: "Kg",
          reason: "Kualitas Menurun",
          status: "Pending",
          date: "30-10-2026",
        },
      ],
      reworkedList: [
        {
          id: 1,
          stockId: "STK-251026-01",
          orderId: "ORD-251026-04",
          productId: "PRD-251026-04",
          name: "Pisang Cavendish",
          stockDisplay: 6,
          stockWareHouse: 4,
          stock: 10,
          satuan: "Sisir",
          reason: "Terlalu Matang",
          status: "Reworked",
          date: "30-10-2026",
        },
      ],
      perishList: [
        {
          id: 1,
          stockId: "STK-251026-02",
          productId: "PRD-251026-06",
          name: "Telur Ayam Ras Segar",
          qty: 5,
          satuan: "Kg",
          reason: "Cangkang Retak",
          status: "Rusak",
          date: "30-10-2026",
        },
      ],
      stockChangeLog: [
        {
          id: 1,
          productId: "PRD-251026-01",
          name: "Beras Pandan Wangi",
          qty: 100,
          stockDisplay: 250,
          stockWareHouse: 500,
          stock: 750,
          satuan: "Kg",
          date: "30-10-2026",
        },
        {
          id: 2,
          productId: "PRD-251026-04",
          name: "Pisang Cavendish",
          qty: 50,
          stockDisplay: 120,
          stockWareHouse: 80,
          stock: 200,
          satuan: "Sisir",
          date: "30-10-2026",
        },
      ],

      addProduct: (item) =>
        set((s) => {
          const newItem: BaseItem = {
            id: Date.now(),
            productId: item.productId,
            name: item.name,
            satuan: item.satuan,
            hargaSatuan: item.hargaSatuan,
            stockDisplay: item.stockDisplay ?? 0,
            stockWareHouse: item.stockWareHouse ?? 0,
            stock: item.stock ?? 0,
            date: item.date || new Date().toISOString().split("T")[0],
          };
          return {
            products: [...s.products, newItem],
          };
        }),
      editProduct: (id, updatedItem) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, ...updatedItem } : p
          ),
        })),
      deleteProduct: (id) =>
        set((s) => ({
          products: s.products.filter((p) => p.id !== id),
        })),
      updateStockAllocation: (productId, stockDisplay, stockWareHouse) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.productId === productId
              ? {
                  ...p,
                  stockDisplay,
                  stockWareHouse,
                  stock: stockDisplay + stockWareHouse,
                }
              : p
          ),
        })),
      updateReworkedAllocation: (id, stockDisplay, stockWareHouse) =>
        set((s) => ({
          reworkedList: s.reworkedList.map((item) =>
            item.id === id
              ? {
                  ...item,
                  stockDisplay,
                  stockWareHouse,
                  stock: stockDisplay + stockWareHouse,
                }
              : item
          ),
        })),
      updateProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      upadteReturn: (id) =>
        set((s) => ({ returnList: s.returnList.filter((p) => p.id !== id) })),
      processReturnItem: ({ id, destination, stockDisplay = 0, stockWareHouse = 0, reason }) =>
        set((s) => {
          const returnItem = s.returnList.find((r) => r.id === id);
          if (!returnItem) return s;

          const today = new Date();
          const day = String(today.getDate()).padStart(2, "0");
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const year = today.getFullYear();
          const dateFormatted = `${day}-${month}-${year}`;

          const updatedReturnList = s.returnList.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: destination === "reworked" ? "Reworked" : "Rusak",
                  reason: reason || r.reason,
                }
              : r
          );

          if (destination === "reworked") {
            const existingReworkedIndex = s.reworkedList.findIndex(
              (rw) => rw.returnId === id || rw.productId === returnItem.productId
            );

            const newReworkedItem = {
              id: Date.now(),
              returnId: id,
              stockId: returnItem.stockId || "STK-251026-01",
              orderId: returnItem.orderId || "ORD-251026-04",
              productId: returnItem.productId,
              name: returnItem.name,
              stockDisplay: stockDisplay,
              stockWareHouse: stockWareHouse,
              stock: stockDisplay + stockWareHouse,
              satuan: returnItem.satuan || "Kg",
              reason: reason || returnItem.reason,
              status: "Reworked",
              date: dateFormatted,
            };

            const updatedReworkedList =
              existingReworkedIndex >= 0
                ? s.reworkedList.map((rw, idx) =>
                    idx === existingReworkedIndex ? newReworkedItem : rw
                  )
                : [newReworkedItem, ...s.reworkedList];

            return {
              returnList: updatedReturnList,
              reworkedList: updatedReworkedList,
            };
          } else {
            const newPerishItem = {
              id: Date.now(),
              returnId: id,
              stockId: returnItem.stockId || "STK-251026-02",
              productId: returnItem.productId,
              name: returnItem.name,
              qty: returnItem.qty,
              satuan: returnItem.satuan || "Kg",
              reason: reason || returnItem.reason,
              status: "Rusak",
              date: dateFormatted,
            };

            return {
              returnList: updatedReturnList,
              perishList: [newPerishItem, ...s.perishList],
            };
          }
        }),
      addStockIn: (batch: any) =>
        set((s) => {
          let updatedProducts = s.products;
          if (batch.products && Array.isArray(batch.products)) {
            updatedProducts = s.products.map((p) => {
              const matchedItems = batch.products.filter(
                (item: any) => item.productId === p.productId || item.name === p.name
              );
              if (matchedItems.length > 0) {
                const addDisplay = matchedItems.reduce(
                  (sum: number, item: any) => sum + (Number(item.stockDisplay) || 0),
                  0
                );
                const addWarehouse = matchedItems.reduce(
                  (sum: number, item: any) => sum + (Number(item.stockWareHouse) || 0),
                  0
                );
                const newDisplay = (p.stockDisplay || 0) + addDisplay;
                const newWarehouse = (p.stockWareHouse || 0) + addWarehouse;
                return {
                  ...p,
                  stockDisplay: newDisplay,
                  stockWareHouse: newWarehouse,
                  stock: newDisplay + newWarehouse,
                };
              }
              return p;
            });
          }

          const newBatchItem = {
            ...batch,
            id: batch.id || Date.now(),
          };

          return {
            products: updatedProducts,
            stockInList: [newBatchItem, ...s.stockInList],
          };
        }),

      addStockOut: (items) =>
        set((s) => {
          const today = new Date();
          const day = String(today.getDate()).padStart(2, "0");
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const year = today.getFullYear();
          const dateStr = `${day}-${month}-${year}`;

          // Kurangi stok gudang dari masing-masing produk
          const updatedProducts = s.products.map((p) => {
            const matchedItems = items.filter((item) => item.productId === p.productId);
            if (matchedItems.length > 0) {
              const totalOut = matchedItems.reduce(
                (acc, curr) => acc + (Number(curr.qty) || 0),
                0
              );
              const newWarehouse = Math.max(0, (p.stockWareHouse || 0) - totalOut);
              return {
                ...p,
                stockWareHouse: newWarehouse,
                stock: (p.stockDisplay || 0) + newWarehouse,
              };
            }
            return p;
          });

          // Tambahkan ke stockOutList
          const newEntries = items.map((item, index) => ({
            id: Date.now() + index,
            stockId: item.stockId,
            orderId: item.orderId,
            productId: item.productId,
            name: item.name,
            qty: item.qty,
            satuan: item.satuan,
            date: item.date || dateStr,
          }));

          return {
            products: updatedProducts,
            stockOutList: [...newEntries, ...s.stockOutList],
          };
        }),
    }),
    { name: "inventory-app-storage" }
  )
);
