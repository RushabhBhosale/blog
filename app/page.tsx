"use client";

import { useAuth } from "@/utils/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/signin"); // if signed in
    } else {
      router.push("/home"); // if NOT signed in
    }
  }, [isAuthenticated, router]);

  return null;
}
