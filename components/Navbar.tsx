"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from "@clerk/nextjs";

export default function BlogNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();

  const categories = [
    { name: "Home", href: "/" },
    { name: "Tech", href: "/category/tech" },
    { name: "Lifestyle", href: "/category/lifestyle" },
    { name: "Travel", href: "/category/travel" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          MyBlog
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="text-gray-700 hover:text-black transition"
            >
              {cat.name}
            </Link>
          ))}

          <button className="text-gray-600 hover:text-black transition">
            <Search size={20} />
          </button>

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Button asChild variant="secondary" size="sm">
              <Link href="/sign-in">Sign In</Link>
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
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gray-50 rounded-lg shadow p-4 space-y-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="block text-gray-700 hover:text-black transition"
              onClick={() => setIsOpen(false)}
            >
              {cat.name}
            </Link>
          ))}

          <button className="flex items-center text-gray-700 hover:text-black transition">
            <Search size={20} className="mr-2" /> Search
          </button>

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Button asChild variant="secondary" size="sm" className="w-full">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
