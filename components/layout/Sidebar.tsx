// ============================================
// components/layout/Sidebar.tsx
// ============================================
"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Users, 
  ListChecks, 
  History, 
  Contact, 
  FileText, 
  KeyRound, 
  BarChart3, 
  UserCog
} from "lucide-react"
import { createBrowserClient } from '@supabase/ssr'
import { cn } from "@/lib/utils"
import Image from "next/image"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuSections = [
  {
    title: "Admin",
    requiredRole: "admin",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
      { icon: UserCog, label: "User Management", href: "/admin/users" },
      { icon: Contact, label: "Master Contacts", href: "/admin/contacts" },
      { icon: FileText, label: "Contact Reasons", href: "/admin/reasons" },
      { icon: ListChecks, label: "Contact Pages", href: "/admin/contact-pages" },
      { icon: KeyRound, label: "Code Redirects", href: "/admin/codes" },
      { icon: BarChart3, label: "Code Analytics", href: "/admin/codes/analytics" },
    ],
  },
  {
    title: "User",
    requiredRole: "user",
    items: [
      { icon: Users, label: "User Dashboard", href: "/user" },
    ],
  },
  {
    title: "System",
    requiredRole: "admin",
    items: [
      { icon: History, label: "Activity Logs", href: "/logs" },
    ],
  },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

          setRole(profile?.role || 'user')
        }
      } catch (error) {
        console.error('Error fetching user role:', error)
        setRole('user')
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [])

  if (loading) {
    return (
      <aside className="fixed left-0 top-0 z-50 h-full w-64 border-r bg-white shadow-sm md:sticky md:top-16 md:h-[calc(100vh-4rem)]">
        <div className="flex h-16 items-center border-b px-6 md:hidden">
          <h2 className="text-lg font-semibold">Menu</h2>
        </div>
        <nav className="flex flex-col gap-6 p-4">
          {/* Skeleton loaders for menu sections */}
          {[1, 2, 3].map((section) => (
            <div key={section}>
              {/* Section title skeleton */}
              <div className="mb-2 h-3 w-16 rounded bg-gray-200" />
              {/* Menu items skeleton */}
              <ul className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <li key={item} className="flex items-center gap-3 rounded-lg px-3 py-2">
                    <div className="h-5 w-5 rounded bg-gray-200" />
                    <div className="h-4 flex-1 rounded bg-gray-200" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    )
  }

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
          "fixed left-0 top-0 z-50 h-full w-64 border-r bg-white shadow-sm transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo header */}
        <div className="flex h-16 items-center border-b px-6">
          <Image 
            src="/logo.png"
            alt="COPARK Logo"
            width={150}
            height={40}
            className="object-contain"
          />
        </div>
        {/* Menu sections */}
        <nav className="flex flex-col gap-6 p-4">
          {menuSections.map((section) => {
            // Check if user has permission to see this section
            const hasAccess = role === section.requiredRole || 
                             (section.requiredRole === 'user' && role === 'admin')

            if (!hasAccess) return null

            return (
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
            )
          })}
        </nav>
      </aside>
    </>
  )
}