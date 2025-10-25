// ============================================
// components/layout/Sidebar.tsx
// ============================================

"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  History,
  Contact,
  FileText,
  KeyRound,
  BarChart3,
  ListChecks,
  UserCog,
  MapPin,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  icon: any
  label: string
  href?: string
  children?: MenuItem[]
}

const menuSections: { title: string; requiredRole: string; items: MenuItem[] }[] = [
  {
    title: "Admin",
    requiredRole: "admin",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },

      {
        icon: MapPin,
        label: "Address Module",
        children: [
          { icon: ListChecks, label: "Address Lists", href: "/admin/address" },
          { icon: BarChart3, label: "Wallboard View", href: "/admin/address/wallboard" },
        ],
      },
      {
        icon: Contact,
        label: "Contact Module",
        children: [
          { icon: Contact, label: "Master Contacts", href: "/admin/contacts" },
          { icon: FileText, label: "Contact Reasons", href: "/admin/reasons" },
          { icon: ListChecks, label: "Contact Pages", href: "/admin/contact-pages" },
        ],
      },
      {
        icon: KeyRound,
        label: "Code Redirect Module",
        children: [
          { icon: KeyRound, label: "Code Redirects", href: "/admin/codes" },
          { icon: BarChart3, label: "Code Analytics", href: "/admin/codes/analytics" },
          { icon: LayoutDashboard, label: "Public Landing Page", href: "/public" },
        ],
      },
      {
        icon: UserCog,
        label: "User Management",
        href: "/admin/users",
      },
    ],
  },
  {
    title: "User",
    requiredRole: "user",
    items: [{ icon: Users, label: "User Dashboard", href: "/user" }],
  },
  {
    title: "System",
    requiredRole: "admin",
    items: [{ icon: History, label: "Activity Logs", href: "/logs" }],
  },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()
          setRole(profile?.role || "user")
        }
      } catch (error) {
        console.error("Error fetching user role:", error)
        setRole("user")
      } finally {
        setLoading(false)
      }
    }
    fetchUserRole()
  }, [])

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label))
  }

  if (loading) {
    return (
      <aside className="fixed left-0 top-0 z-50 h-full w-64 border-r bg-white shadow-sm md:sticky md:top-0 md:h-screen" />
    )
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 border-r bg-white shadow-md transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Image
            src="/logo.png"
            alt="COPARK Logo"
            width={150}
            height={40}
            className="object-contain"
          />
        </div>

        <nav className="flex flex-col gap-6 p-4 overflow-y-auto">
          {menuSections.map((section) => {
            const hasAccess =
              role === section.requiredRole ||
              (section.requiredRole === "user" && role === "admin")

            if (!hasAccess) return null

            return (
              <div key={section.title}>
                <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                  {section.title}
                </p>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isDropdown = !!item.children
                    const isActive = pathname.startsWith(item.href ?? "")

                    return (
                      <li key={item.label}>
                        {isDropdown ? (
                          <button
                            onClick={() => toggleDropdown(item.label)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100",
                              openDropdown === item.label
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            )}
                          >
                            <div className="flex items-center">
                              <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                              {item.label}
                            </div>
                            {openDropdown === item.label ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        ) : (
                          <Link
                            href={item.href!}
                            className={cn(
                              "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100",
                              pathname === item.href
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            )}
                          >
                            <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                            {item.label}
                          </Link>
                        )}

                        {isDropdown && openDropdown === item.label && (
                          <ul className="ml-8 mt-1 space-y-1 border-l border-gray-200 pl-2">
                            {item.children?.map((sub) => (
                              <li key={sub.label}>
                                <Link
                                  href={sub.href!}
                                  className={cn(
                                    "flex items-center rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-gray-900",
                                    pathname === sub.href
                                      ? "bg-gray-100 text-gray-900"
                                      : ""
                                  )}
                                >
                                  <sub.icon className="mr-3 h-4 w-4 text-gray-400" />
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
