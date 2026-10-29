"use client";

import React, { useState } from "react";
import { MoreVertical, Plus, GripVertical, Trash2, ScanBarcode, Edit, X, CheckCircle2, Trash } from "lucide-react";
import TabNavigation, { TabItem } from "../ui/tab";
import Image from "next/image";
import { useSppgStore } from "@/stores/useSppgStore";

export default function SppgTable() {
  const store = useSppgStore();
  const [currentTab, setCurrentTab] = useState("Products");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);


 const statusStyles: Record<string, string> = {
  reworked: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  perish: "bg-red-50 text-red-700 border-red-200",
};

const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    // Otomatis hilang setelah 3 detik
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Tab Navigation & Dynamic Action Button */}
      <div className="flex flex-col lg:flex-row md:items-start lg:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold" >SPPG Data</h1>
      </div>

      {/* Dynamic Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
                <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-500 font-medium">
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Address</th>
                    <th className="py-3.5 px-4">Telp</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                {store.sppg.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-gray-900">{row.name}</td>
                    <td className="py-3 px-4">
                        <span className="py-0.5 rounded-md ">
                        {row.address}
                        </span>
                    </td>
                    <td className="py-3 px-4">
                        <span className="py-0.5 rounded-md ">
                        {row.telp}
                        </span>
                    </td>                           
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
      </div>
    </div>
  );
}