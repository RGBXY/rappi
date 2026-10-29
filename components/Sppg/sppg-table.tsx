"use client";

import React from "react";
import { useSppgStore } from "@/stores/useSppgStore";

export default function SppgTable() {
  const store = useSppgStore();

  return (
    <div className="space-y-6 mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Data SPPG Mitra
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar unit Satuan Pelayanan Pemenuhan Gizi (SPPG) penerima pasokan bahan pangan.
          </p>
        </div>
      </div>

      {/* Tabel Data SPPG */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium text-xs">
                <th className="py-3.5 px-4">Nama SPPG</th>
                <th className="py-3.5 px-4">Alamat Wilayah</th>
                <th className="py-3.5 px-4">No. Telepon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {store.sppg.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {row.name}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-600">
                    {row.address}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-600">{row.telp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
