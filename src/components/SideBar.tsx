"use client"

import { Home, FileUser, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Leaves",
    url: "/leaves",
    icon: FileUser,
  },
  {
    title: "Logout",
    url: "/auth/login",
    icon: LogOut,
  },
]

export function SideBar() {

    const resetLocalStorage = () => {
        localStorage.removeItem('access')
        localStorage.removeItem('employee_id')
    }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <h1 className="text-xl font-semibold text-black">Menu</h1>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                item.title === 'Logout' ? (
                <SidebarMenuItem key={item.title} onClick={resetLocalStorage}>
                    <SidebarMenuButton asChild>
                        <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}