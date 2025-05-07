"use client"
import * as React from "react"
import { Users, ShieldCheck, Home, CalendarDays } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"

const menuItems = [
  {
    title: "Users",
    icon: Users,
    href: "/admin/users"
  },
  {
    title: "Roles",
    icon: ShieldCheck,
    href: "/admin/roles"
  },
  {
    title: "Studios",
    icon: Home,
    href: "/admin/studios"
  },
  {
    title: "Rooms",
    icon: Home,
    href: "/admin/rooms"    
  },
  {
    title: "Classes",
    icon: CalendarDays,
    href: "/admin/classes"
  }
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props}>
      <SidebarContent className="gap-2 px-2 py-4">
         <h2 className="text-lg font-semibold">Dance Flow Admin</h2>
                    <hr className="border-gray-200 dark:border-gray-700" />
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === item.href}
              >
                <Link href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}