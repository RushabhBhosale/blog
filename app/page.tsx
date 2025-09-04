"use client";

import { useAuth } from "@/utils/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, [isAuthenticated, router]);

  return null;
}
