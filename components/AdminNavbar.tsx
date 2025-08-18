import { LogOut, Menu, Search, User } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

const AdminNavbar = ({
  setSidebarOpen,
}: {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border/60 px-6 lg:px-8 py-2 sticky top-0 z-30">
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
              Welcome back, Rushabh
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
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-foreground">
                Alex Johnson
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                alex@company.com
              </p>
            </div>

            <button className="p-3 rounded-xl bg-muted/50 border border-border/40">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            </button>

            <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/5 text-destructive border border-destructive/10 font-medium text-sm">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
