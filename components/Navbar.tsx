"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Plus, User, LogOut } from "lucide-react";
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
    <header className="bg-white border-b-2 border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">DS</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Daily Sparks
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  pathname === cat.href
                    ? "bg-primary/10 text-primary border border-primary/40"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link href="/blog/add">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Post
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={signOut}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/signin">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <User className="w-4 h-4 mr-1" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-50 text-gray-600"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <div className="py-4 space-y-2">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                    pathname === cat.href
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link href="/blog/add" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-primary hover:bg-blue-700 text-white justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        New Post
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full text-gray-600 hover:bg-gray-50 hover:text-gray-900 justify-start"
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link href="/signin" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 justify-start"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
