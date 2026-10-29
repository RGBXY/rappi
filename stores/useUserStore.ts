import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tipe Role Utama
export type UserRole = "coperative" | "sppg" | "kud" | "super_admin";

// Sub-jabatan spesifik sesuai kebutuhan
export type UserSubRole = 
  | "supervisor" 
  | "pengawas_warehouse" 
  | "purchasing" 
  | "qc_inbound" 
  | "admin";

export type AccountStatus = "pending" | "approved" | "rejected";

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  subRole: UserSubRole;
  status: AccountStatus;
  createdAt: string;
}

interface AuthState {
  currentUser: User | null;
  users: User[];
  
  // Actions Autentikasi
  login: (email: string, password: string) => { success: boolean; message: string; role?: UserRole };
  register: (data: Omit<User, "id" | "status" | "createdAt">) => { success: boolean; message: string };
  logout: () => void;

  // Actions Super Admin
  approveUser: (userId: number) => void;
  rejectUser: (userId: number) => void;
  deleteUser: (userId: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [
        // Akun Coperative Utama
        {
          id: 1,
          name: "Koperasi Budi Luhur",
          email: "coperative@rappi.com",
          password: "password123",
          role: "coperative",
          subRole: "supervisor",
          status: "approved",
          createdAt: "2026-01-01",
        },
        // Akun KUD / Coperative Tambahan
        {
          id: 2,
          name: "Budi Santoso",
          email: "budi@kud.com",
          password: "password123",
          role: "coperative",
          subRole: "pengawas_warehouse",
          status: "approved",
          createdAt: "2026-02-10",
        },
        // Akun SPPG Utama
        {
          id: 3,
          name: "SPPG Kulon Progo",
          email: "sppg@rappi.com",
          password: "password123",
          role: "sppg",
          subRole: "purchasing",
          status: "approved",
          createdAt: "2026-03-01",
        },
        // Akun SPPG Tambahan
        {
          id: 4,
          name: "Siti Rahma",
          email: "siti@sppg.com",
          password: "password123",
          role: "sppg",
          subRole: "qc_inbound",
          status: "approved",
          createdAt: "2026-03-01",
        },
      ],

      login: (email, password) => {
        const { users } = get();
        // Normalize role if stored as "kud" to behave as "coperative"
        const user = users.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
        );

        if (!user) {
          return { success: false, message: "Email atau password salah." };
        }

        if (user.status === "pending") {
          return {
            success: false,
            message: "Akun Anda masih menunggu verifikasi dan persetujuan dari Super Admin.",
          };
        }

        if (user.status === "rejected") {
          return {
            success: false,
            message: "Pendaftaran akun Anda ditolak oleh Super Admin.",
          };
        }

        // Standardize kud as coperative
        const normalizedRole: UserRole = user.role === "kud" ? "coperative" : user.role;

        // Simpan sesi user tanpa menyertakan password
        const { password: _, ...sessionUser } = user;
        const finalUser: User = {
          ...sessionUser,
          role: normalizedRole,
        };
        set({ currentUser: finalUser });
        return { success: true, message: "Login berhasil.", role: normalizedRole };
      },

      register: (data) => {
        const { users } = get();
        const emailExists = users.some(
          (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
        );

        if (emailExists) {
          return { success: false, message: "Email sudah terdaftar." };
        }

        const newUser: User = {
          ...data,
          email: data.email.trim(),
          id: Date.now(),
          status: "pending", // Wajib pending secara default
          createdAt: new Date().toISOString().split("T")[0],
        };

        set({ users: [...users, newUser] });
        return {
          success: true,
          message: "Pendaftaran berhasil! Akun menunggu konfirmasi Super Admin sebelum bisa digunakan.",
        };
      },

      logout: () => set({ currentUser: null }),

      // Konfirmasi registrasi oleh Super Admin
      approveUser: (userId) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, status: "approved" } : u
          ),
        })),

      rejectUser: (userId) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, status: "rejected" } : u
          ),
        })),

      deleteUser: (userId) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
        })),
    }),
    {
      name: "auth-system-storage",
    }
  )
);
