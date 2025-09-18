"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Plus, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/useAuth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function BlogNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  // Sync search input with URL param (?s=)
  useEffect(() => {
    const q = (searchParams?.get("s") || "").trim();
    setSearch(q);
  }, [searchParams]);

  const categories = [
    { name: "Home", href: "/home" },
    { name: "Anime", href: "/blog/category/anime" },
    { name: "Tech", href: "/blog/category/tech" },
    { name: "Travel", href: "/blog/category/travel" },
    { name: "Media", href: "/blog/category/media" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[83rem] mx-auto px-4">
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
            {categories.map((cat, i) => (
              <Link
                key={i}
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

          {/* Desktop Search + Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = search.trim();
                router.push(q ? `/blogs?s=${encodeURIComponent(q)}` : "/blogs");
              }}
              role="search"
              aria-label="Site search"
              className="hidden xl:flex items-center gap-2 mr-2"
            >
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
              />
              <button
                type="submit"
                className="rounded-md border px-3 py-1.5 text-sm"
              >
                Search
              </button>
            </form>
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
              {/* Mobile search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = search.trim();
                  setIsOpen(false);
                  router.push(
                    q ? `/blogs?s=${encodeURIComponent(q)}` : "/blogs"
                  );
                }}
                role="search"
                aria-label="Site search"
                className="px-4 pb-2 flex items-center gap-2"
              >
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  Go
                </button>
              </form>
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
