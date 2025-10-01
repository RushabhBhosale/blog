"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/useAuth";

export default function MiniSparkEditButton({ slug }: { slug: string }) {
  const { user } = useAuth();
  const allowedEmail = "rushabhbhosale25757@gmail.com";
  const isAllowed = (user?.email || "").toLowerCase() === allowedEmail.toLowerCase();
  if (!isAllowed) return null;
  return (
    <Link href={`/mini-sparks/${encodeURIComponent(slug)}/edit`}>
      <Button size="sm" variant="outline">Edit Mini Spark</Button>
    </Link>
  );
}

