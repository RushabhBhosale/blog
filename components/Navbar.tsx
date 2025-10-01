"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Plus, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/useAuth";
import { usePathname } from "next/navigation";

export default function BlogNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, signOut, user } = useAuth();
  const toSlug = (s: string) =>
    (s || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "");
  const authorSlug = toSlug(user?.name || user?.email || "");
  const pathname = usePathname();

  const categories = [
    { name: "Home", href: "/home" },
    { name: "Anime", href: "/blogs/anime" },
    { name: "Tech", href: "/blogs/tech" },
    { name: "Travel", href: "/blogs/travel" },
    { name: "Media", href: "/blogs/media" },
    { name: "Mini Sparks", href: "/mini-sparks" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Lock body scroll and close on Escape when menu is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
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

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link href={authorSlug ? `/author/${authorSlug}` : "/"}>
                  <Button size="sm" variant="outline" className="text-gray-700">
                    My Posts
                  </Button>
                </Link>
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

        {/* Mobile Navigation: slide-in from right with backdrop */}
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity duration-200 opacity-100"
              onClick={() => setIsOpen(false)}
            />
            {/* Panel */}
            <div
              className={`absolute inset-y-0 right-0 w-[85%] max-w-sm sm:max-w-md bg-white shadow-2xl rounded-l-2xl transform transition-transform duration-300 ease-out ${
                isOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">DS</span>
                  </div>
                  <span className="font-semibold">Daily Sparks</span>
                </div>
                <button
                  aria-label="Close menu"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-50 text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="h-[calc(100vh-64px)] overflow-y-auto">
                <nav className="p-3">
                  <p className="px-3 pb-2 text-xs uppercase tracking-wide text-muted-foreground">Browse</p>
                  <ul className="space-y-1">
                    {categories.map((cat) => (
                      <li key={cat.name}>
                        <Link
                          href={cat.href}
                          className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                            pathname === cat.href
                              ? "bg-primary/10 text-primary border border-primary/30"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mx-3 my-2 border-t border-gray-200" />

                <div className="p-3 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href={authorSlug ? `/author/${authorSlug}` : "/"}
                        onClick={() => setIsOpen(false)}
                      >
                        <Button variant="outline" className="w-full justify-start">
                          My Posts
                        </Button>
                      </Link>
                      <Link href="/blog/add" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start">
                          <Plus className="w-4 h-4 mr-2" />
                          New Post
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-700 hover:bg-gray-50"
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
                      <Button variant="outline" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
