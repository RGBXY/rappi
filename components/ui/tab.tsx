"use client";

import React from "react";

export interface TabItem {
  id?: string; // Opsional jika id berbeda dari label
  label: string;
  badge?: number | string;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabLabel: string) => void;
  className?: string;
}

export default function TabNavigation({
  tabs,
  activeTab,
  onChange,
  className = "",
}: TabNavigationProps) {
  return (
    <div
      className={`flex items-center gap-1.5 overflow-x-auto bg-gray-100 p-2 rounded-2xl ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.label;

        return (
          <button
            key={tab.label}
            type="button"
            onClick={() => onChange(tab.label)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? "bg-white border border-gray-200 text-gray-900 shadow-2xs font-semibold"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-200"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}