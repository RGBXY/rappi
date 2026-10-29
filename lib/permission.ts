import { UserRole, UserSubRole } from "../stores/useUserStore";

export const PERMISSIONS = {
  // Akses Seluruh Sistem & Konfirmasi Akun
  MANAGE_USERS: ["super_admin"],
  
  // Modul Inventory Gudang & Restock Pemasok (KUD)
  CAN_MANAGE_WAREHOUSE: ["super_admin", "kud"],
  CAN_ADD_STOCK_IN: ["super_admin", "kud"], // Dijalankan oleh KUD saat suplai tiba
  
  // Modul Pemesanan & Penerimaan Dapur (SPPG)
  CAN_CREATE_ORDER: ["super_admin", "sppg"], // Purchasing SPPG membuat pesanan
  CAN_INSPECT_INBOUND: ["super_admin", "sppg"], // Bagian QC Inbound memeriksa & mengajukan retur/rework
  CAN_VIEW_REPORTS: ["super_admin", "kud", "sppg"],
};

export function hasPermission(
  userRole: UserRole | undefined,
  allowedRoles: string[]
): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}