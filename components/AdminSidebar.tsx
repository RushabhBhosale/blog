import {
  ChevronRight,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Plus,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import axiosClient from "@/lib/axiosclient";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, badgeKey: null },
  { name: "Posts", href: "/admin/posts", icon: FileText, badgeKey: "posts" },
  { name: "Comments", href: "/admin/comments", icon: FileText, badgeKey: "comments" },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderOpen,
    badgeKey: "categories",
  },
  { name: "Users", href: "/admin/users", icon: Users, badgeKey: "users" },
  { name: "Settings", href: "/admin/settings", icon: Settings, badgeKey: null },
];

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [counts, setCounts] = useState({
    posts: 0,
    comments: 0,
    categories: 0,
    users: 0,
  });
  const [loadingCounts, setLoadingCounts] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoadingCounts(true);
        const [posts, comments, categories, users] = await Promise.all([
          axiosClient.get("/blog").catch(() => ({ data: { blogs: [] } })),
          axiosClient.get("/comment").catch(() => ({ data: { comments: [] } })),
          axiosClient.get("/category").catch(() => ({ data: { category: [] } })),
          axiosClient.get("/user").catch(() => ({ data: { users: [] } })),
        ]);
        if (!cancelled) {
          setCounts({
            posts: (posts.data.blogs || []).length,
            comments: (comments.data.comments || []).length,
            categories: (categories.data.category || []).length,
            users: (users.data.users || []).length,
          });
        }
      } finally {
        if (!cancelled) setLoadingCounts(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        w-72 bg-card
        transition-transform duration-200 ease-out
        flex flex-col shadow-2xl/5
        m-2 rounded-2xl
      `}
      >
        <div className="flex items-center justify-between p-3 border-b border-border/40">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-primary-foreground rounded-sm"></div>
              </div>
            </div>
            <div>
              <span className="font-bold text-lg text-foreground tracking-tight">
                AdminSpace
              </span>
              <p className="text-xs text-muted-foreground font-medium">
                Dashboard v2.1
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl bg-muted/50 text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 border-b border-border/40">
          <Link href={"/blog/add"}>
            <Button className="w-full rounded-full">
              <Plus className="w-4 h-4" />
              Create New Post
            </Button>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;
            const badgeValue =
              item.badgeKey && item.badgeKey in counts
                ? counts[item.badgeKey as keyof typeof counts] ?? 0
                : 0;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  setActiveItem(item.name);
                  setSidebarOpen(false);
                }}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm
                  ${
                    isActive
                      ? "bg-primary/5 text-primary border border-primary/10"
                      : "text-muted-foreground"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badgeKey
                    ? loadingCounts
                      ? <Badge>--</Badge>
                      : <Badge>{badgeValue}</Badge>
                    : null}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-border/40">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Rushabh Bhosale
              </p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
