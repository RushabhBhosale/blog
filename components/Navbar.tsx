"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/useAuth";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function BlogNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
  const { isAuthenticated, signOut, user } = useAuth();
  const pathname = usePathname();
  const avatarUrl = user?.imageUrl?.trim();
  const getInitial = (value?: string | null) => {
    const trimmed = value?.trim?.();
    return trimmed ? trimmed.charAt(0).toUpperCase() : null;
  };
  const fallbackInitial =
    getInitial(user?.name) || getInitial(user?.email) || "U";
  const renderAvatarButton = () => (
    <Button
      variant="outline"
      aria-label="Account menu"
      className={`h-10 w-10 shrink-0 overflow-hidden rounded-full border-gray-300 p-0 text-sm font-medium text-gray-600 transition ${
        avatarUrl ? "" : "bg-gray-100"
      }`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user?.name || user?.email || "User avatar"}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="uppercase">{fallbackInitial}</span>
      )}
    </Button>
  );
  const accountMenuItems = (
    <>
      <DropdownMenuItem asChild>
        <Link href="/author/rushabh">My posts</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/profile">Profile</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/blog/add">
          <div className="flex items-center justify-between w-full">
            <span>New post</span>
            <Plus className="w-4 h-4" />
          </div>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault();
          signOut();
        }}
      >
        <div className="flex items-center gap-2 text-destructive">
          <LogOut className="w-4 h-4" />
          Sign out
        </div>
      </DropdownMenuItem>
    </>
  );

  const categories = [
    { name: "Home", href: "/home" },
    { name: "Anime", href: "/blogs/anime" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    if (isOpen) {
      setShouldRenderMenu(true);
      return;
    }
    const timeout = window.setTimeout(() => setShouldRenderMenu(false), 300);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

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
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">DS</span>
              </div>
              <span className="text-xl shrink-0 font-bold text-gray-900">
                Daily Sparks
              </span>
            </Link>

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

            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {renderAvatarButton()}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {accountMenuItems}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/signin">
                  <Button>Sign in</Button>
                </Link>
              )}
            </div>

            <div className="lg:hidden flex items-center gap-2">
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {renderAvatarButton()}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {accountMenuItems}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {!isAuthenticated && (
                <Link href="/signin">
                  <Button size="sm">Sign in</Button>
                </Link>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md hover:bg-gray-50 text-gray-600"
                aria-label="Toggle navigation menu"
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      {shouldRenderMenu && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
            className={`lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-black/40 transition-opacity duration-300 ${
              isOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          />
          <nav
            id="mobile-navigation"
            aria-hidden={!isOpen}
            className={`lg:hidden fixed top-16 bottom-0 right-0 z-[60] w-80 max-w-full border-l border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
              isOpen
                ? "translate-x-0 pointer-events-auto"
                : "translate-x-full pointer-events-none"
            }`}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <span className="text-lg font-semibold text-gray-900">
                  Menu
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="space-y-2">
                  {categories.map((cat, i) => (
                    <Link
                      key={i}
                      href={cat.href}
                      onClick={() => setIsOpen(false)}
                      className={`block rounded-md px-4 py-2 text-sm font-medium transition ${
                        pathname === cat.href
                          ? "bg-primary/10 text-primary border border-primary/40"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-6 border-t border-gray-200 pt-4 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/author/rushabh"
                        className="block text-sm font-medium text-gray-700 hover:text-gray-900"
                        onClick={() => setIsOpen(false)}
                      >
                        My posts
                      </Link>
                      <Link
                        href="/profile"
                        className="block text-sm font-medium text-gray-700 hover:text-gray-900"
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/blog/add"
                        className="block text-sm font-medium text-gray-700 hover:text-gray-900"
                        onClick={() => setIsOpen(false)}
                      >
                        New post
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={() => {
                          setIsOpen(false);
                          signOut();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <Link href="/signin" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Sign in</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
