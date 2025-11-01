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
  );
}
