"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.push("/signin"); // if signed in
    } else {
      router.push("/home"); // if NOT signed in
    }
  }, [isSignedIn, isLoaded, router]);

  return null;
}
