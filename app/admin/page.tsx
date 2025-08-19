"use client";

import { useAuth } from "@/utils/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const DashBoardPage = () => {
  const { user, loading, isAuthenticated, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      toast.error("User not authenticated to access this page");
      router.push("/home");
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export default DashBoardPage;
