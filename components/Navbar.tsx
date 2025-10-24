"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Plus, User, LogOut } from "lucide-react";
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
  const { isAuthenticated, signOut, user } = useAuth();
  const toSlug = (s: string) =>
    (s || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "");
  const authorSlug = user?.username
    ? user.username
    : toSlug(user?.name || user?.email || "");
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
        <Link href={authorSlug ? `/author/${authorSlug}` : "/"}>My posts</Link>
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
    { name: "Tech", href: "/blogs/tech" },
    { name: "Travel", href: "/blogs/travel" },
    // { name: "Travel Stories", href: "/travel" },
    { name: "Media", href: "/blogs/media" },
    // { name: "Mini Sparks", href: "/mini-sparks" },
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
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">DS</span>
            </div>
            <span className="text-xl shrink-0 font-bold text-gray-900">
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

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-2">
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
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Sign in"
                  className="h-10 w-10 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <User className="w-4 h-4" />
                </Button>
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-gray-50 text-gray-600"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation: slide-in from right with backdrop */}
        {isOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
          >
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
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      DS
                    </div>
                    <span className="font-semibold text-gray-900">
                      Daily Sparks
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="Close menu"
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-md hover:bg-gray-50 text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-white">
                  {isAuthenticated ? (
                    <div className="border-b px-4 py-5">
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-primary/40 hover:bg-primary/5"
                      >
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt="User avatar"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-sm font-semibold uppercase text-gray-600">
                              {fallbackInitial}
                            </span>
                          )}
                        </div>
                        <span>View profile</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="border-b px-4 py-5">
                      <Link href="/signin" onClick={() => setIsOpen(false)}>
                        <Button className="w-full">Sign In</Button>
                      </Link>
                    </div>
                  )}

                  <nav className="px-4 py-6 space-y-6">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Browse
                      </p>
                      <ul className="mt-3 space-y-1.5">
                        {categories.map((cat) => (
                          <li key={cat.name}>
                            <Link
                              href={cat.href}
                              className={`flex items-center justify-between rounded-lg border border-transparent px-4 py-3 text-sm font-medium transition ${
                                pathname === cat.href
                                  ? "bg-primary/10 text-primary border-primary/40"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                              onClick={() => setIsOpen(false)}
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {isAuthenticated && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Account
                        </p>
                        <ul className="mt-3 space-y-1.5">
                          <li>
                            <Link
                              href={authorSlug ? `/author/${authorSlug}` : "/"}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                              My posts
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/profile"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                              Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/blog/add"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                              <span>New post</span>
                              <Plus className="w-4 h-4" />
                            </Link>
                          </li>
                          <li>
                            <button
                              type="button"
                              onClick={() => {
                                signOut();
                                setIsOpen(false);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}

                    {!isAuthenticated && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Account
                        </p>
                        <Link
                          href="/signin"
                          onClick={() => setIsOpen(false)}
                          className="mt-3 flex items-center justify-center rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-primary/40 hover:bg-primary/5"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Sign In
                        </Link>
                      </div>
                    )}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
