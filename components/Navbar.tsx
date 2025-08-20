"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/useAuth";
import { usePathname } from "next/navigation";

export default function BlogNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();
  const pathname = usePathname();

  const categories = [
    { name: "Home", href: "/home" },
    { name: "Anime", href: "/category/anime" },
    { name: "Tech", href: "/category/tech" },
    { name: "Travel", href: "/category/travel" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Daily Sparks
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`transition ${
                pathname === cat.href
                  ? "text-black font-semibold"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {cat.name}
            </Link>
          ))}

          {isAuthenticated && (
            <Link href="/blog/add">
              <Button variant="default" size="sm">
                + Add Blog
              </Button>
            </Link>
          )}

          {isAuthenticated ? (
            <Button size="sm" variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          ) : (
            <Button asChild variant="secondary" size="sm">
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`md:hidden transform transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gray-50 rounded-lg shadow p-4 space-y-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`block transition rounded px-2 py-1 ${
                pathname === cat.href
                  ? "text-black font-semibold bg-gray-100"
                  : "text-gray-700 hover:text-black hover:bg-gray-100"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {cat.name}
            </Link>
          ))}

          {isAuthenticated && (
            <Link href="/blog/add" className="block">
              <Button variant="default" className="w-full">
                + Add Blog
              </Button>
            </Link>
          )}

          {isAuthenticated ? (
            <Button
              size="sm"
              onClick={signOut}
              className="w-full"
              variant="outline"
            >
              Sign Out
            </Button>
          ) : (
            <Button asChild variant="secondary" size="sm" className="w-full">
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
