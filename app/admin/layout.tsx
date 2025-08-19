"use client";

import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/useAuth";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== "admin") {
        toast.error("Not authorized");
        router.push("/home");
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="flex bg-gray-50 h-screen antialiased">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 min-w-0">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
