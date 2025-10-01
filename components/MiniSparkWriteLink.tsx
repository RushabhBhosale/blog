"use client";

import Link from "next/link";
import { useAuth } from "@/utils/useAuth";

export default function MiniSparkWriteLink() {
  const { user } = useAuth();
  const allowedEmail = "rushabhbhosale25757@gmail.com";
  const isAllowed = (user?.email || "").toLowerCase() === allowedEmail.toLowerCase();
  if (!isAllowed) return null;
  return (
    <Link href="/mini-sparks/add" className="text-sm text-primary underline">
      Write a Mini Spark →
    </Link>
  );
}

