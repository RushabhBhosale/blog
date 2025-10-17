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
import axiosClient from "@/lib/axiosclient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [sidebarCounts, setSidebarCounts] = useState({
    posts: 0,
    comments: 0,
    users: 0,
  });

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || user?.role !== "admin") {
        toast.error("Not authorized");
        router.push("/home");
      }
    }
  }, [loading, isAuthenticated, user, router]);

  useEffect(() => {
    if (loading || !isAuthenticated || user?.role !== "admin") return;
    let ignore = false;
    const loadCounts = async () => {
      try {
        const [postRes, commentRes, userRes] = await Promise.all([
          axiosClient.get("/blog"),
          axiosClient.get("/comment"),
          axiosClient.get("/user"),
        ]);
        if (ignore) return;
        setSidebarCounts({
          posts: (postRes.data.blogs || []).length,
          comments: (commentRes.data.comments || []).length,
          users: (userRes.data.users || []).length,
        });
      } catch (error) {
        console.error("Failed to load admin sidebar counts", error);
      }
    };
    loadCounts();
    return () => {
      ignore = true;
    };
  }, [loading, isAuthenticated, user]);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="flex bg-gray-50 h-screen antialiased">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        counts={sidebarCounts}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
