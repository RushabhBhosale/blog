"use client";

import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  ChevronRight,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard, badge: null },
    { name: "Posts", href: "/admin/posts", icon: FileText, badge: "12" },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: FolderOpen,
      badge: null,
    },
    { name: "Users", href: "/admin/users", icon: Users, badge: "3" },
    { name: "Settings", href: "/admin/settings", icon: Settings, badge: null },
  ];

  return (
    <div className="flex h-screen bg-background antialiased">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 min-w-0">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto bg-background/50">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
