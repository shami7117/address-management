// ============================================
// components/layout/Sidebar.tsx
// ============================================

"use client"

import React from "react"
import Link from "next/link"
import { LayoutDashboard, Users, ListChecks, History } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuSections = [
  {
    title: "Admin",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    ],
  },
  {
    title: "User",
    items: [
      { icon: Users, label: "User Dashboard", href: "/user" },
    ],
  },
  {
    title: "System",
    items: [
      { icon: History, label: "Activity Logs", href: "/logs" },
    ],
  },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 border-r bg-white shadow-sm transition-transform duration-300 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile header */}
        <div className="flex h-16 items-center border-b px-6 md:hidden">
          <h2 className="text-lg font-semibold">Menu</h2>
        </div>

        {/* Menu sections */}
        <nav className="flex flex-col gap-6 p-4">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                      <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
