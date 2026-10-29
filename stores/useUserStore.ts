import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tipe Role Utama
export type UserRole = "super_admin" | "kud" | "sppg";

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
  login: (email: string, password: string) => { success: boolean; message: string };
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
        // Akun default Super Admin
        {
          id: 1,
          name: "Super Admin",
          email: "admin@rappi.com",
          password: "password123",
          role: "super_admin",
          subRole: "admin",
          status: "approved",
          createdAt: "2026-01-01",
        },
        // Contoh Akun KUD Approved
        {
          id: 2,
          name: "Budi Santoso",
          email: "budi@kud.com",
          password: "password123",
          role: "kud",
          subRole: "pengawas_warehouse",
          status: "approved",
          createdAt: "2026-02-10",
        },
        // Contoh Akun SPPG Pending (menunggu konfirmasi)
        {
          id: 3,
          name: "Siti Rahma",
          email: "siti@sppg.com",
          password: "password123",
          role: "sppg",
          subRole: "qc_inbound",
          status: "pending",
          createdAt: "2026-03-01",
        },
      ],

      login: (email, password) => {
        const { users } = get();
        const user = users.find((u) => u.email === email && u.password === password);

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

        // Simpan sesi user tanpa menyertakan password
        const { password: _, ...sessionUser } = user;
        set({ currentUser: sessionUser as User });
        return { success: true, message: "Login berhasil." };
      },

      register: (data) => {
        const { users } = get();
        const emailExists = users.some((u) => u.email === data.email);

        if (emailExists) {
          return { success: false, message: "Email sudah terdaftar." };
        }

        const newUser: User = {
          ...data,
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