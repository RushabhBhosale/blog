import type { Metadata } from "next";
import AdminShell from "./adminShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Admin | Daily Sparks",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
