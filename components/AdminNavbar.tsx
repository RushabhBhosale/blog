import { useAuth } from "@/utils/useAuth";
import { LogOut, Menu, Search, User } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const AdminNavbar = ({
  setSidebarOpen,
}: {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  return (
    <header className="bg-card shadow-2xl/5 rounded-2xl md:mt-2 md:mr-2 px-6 lg:px-8 py-2 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-muted/50 text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Welcome back, {user?.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3 min-w-[280px] border border-border/40">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1 font-medium"
            />
            <kbd className="px-2 py-1 bg-background text-xs text-muted-foreground rounded-lg border border-border/60 font-mono">
              ⌘ K
            </kbd>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant={"outline"}
              className="border-red-200 bg-red-200/40"
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
