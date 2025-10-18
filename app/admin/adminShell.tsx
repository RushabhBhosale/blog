"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosClient from "@/lib/axiosclient";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/utils/useAuth";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCounts, setSidebarCounts] = useState({
    posts: 0,
    comments: 0,
    users: 0,
  });
  const { user, loading, isAuthenticated } = useAuth(); // your hook
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      toast.error("Not authorized");
      router.push("/home");
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
      } catch {}
    };
    loadCounts();
    return () => {
      ignore = true;
    };
  }, [loading, isAuthenticated, user]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated || user?.role !== "admin") return null;

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
