import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="text-gray-900 min-h-screen flex flex-col gap-4 sm:gap-0">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
