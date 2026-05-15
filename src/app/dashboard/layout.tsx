// src/app/dashboard/layout.tsx
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ArrowRightLeft,
  CalendarCheck,
  Users,
  LogOut,
  Wallet,
  Search,
  Bell,
  ChevronDown,
  Plus,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50/80">
      {/* SIDEBAR (Light Premium Mode - Compact & Clean) */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-zinc-200 shadow-[2px_0_15px_rgb(0,0,0,0.02)] relative z-20">
        <div className="px-5 py-6 flex flex-col h-full relative z-10">
          {/* Brand Logo - Compact */}
          <div className="flex items-center gap-2.5 mb-6 group cursor-pointer">
            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center border border-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-white">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 transition-colors group-hover:text-primary">
              Kas Kita
            </span>
          </div>

          {/* Quick Action Button - Compact */}
          <Button className="w-full mb-6 h-9 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-lg shadow-sm shadow-primary/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Catat Transaksi
          </Button>

          {/* Navigation Menu - Compact Spacing & Font */}
          <nav className="flex-1 space-y-6 overflow-y-auto pr-1 pb-4 scrollbar-hide">
            {/* Group 1: Menu Utama */}
            <div>
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-2">
                Overview
              </h3>
              <div className="space-y-1">
                {/* Active Link */}
                <Link
                  href="/dashboard"
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold relative overflow-hidden transition-all"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md" />
                  <LayoutDashboard className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Dashboard</span>
                </Link>

                {/* Inactive Link */}
                <Link
                  href="/dashboard/transaksi"
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-600 text-sm font-medium hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                >
                  <ArrowRightLeft className="w-4 h-4 transition-transform group-hover:-rotate-12 group-hover:text-primary" />
                  <span>Transaksi Kas</span>
                </Link>
              </div>
            </div>

            {/* Group 2: Manajemen */}
            <div>
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-2">
                Manajemen
              </h3>
              <div className="space-y-1">
                <Link
                  href="/dashboard/iuran"
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-600 text-sm font-medium hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                >
                  <CalendarCheck className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:text-primary" />
                  <span>Iuran Bulanan</span>
                </Link>
                <Link
                  href="/dashboard/anggota"
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-600 text-sm font-medium hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                >
                  <Users className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:text-primary" />
                  <span>Data Anggota</span>
                </Link>
                <Link
                  href="/dashboard/pengaturan"
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-600 text-sm font-medium hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                >
                  <Settings className="w-4 h-4 transition-transform group-hover:rotate-90 group-hover:text-zinc-900" />
                  <span>Pengaturan</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* User Profile Card - Light Floating Style */}
          <div className="pt-4 mt-auto">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 hover:border-zinc-300 transition-colors">
              <div className="flex items-center gap-2.5 mb-2.5 px-1">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-bold text-zinc-900 truncate">
                    {session.user?.name}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-500 capitalize truncate">
                    {session.user?.role}
                  </span>
                </div>
              </div>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <Button
                  variant="ghost"
                  className="w-full h-8 bg-white hover:bg-rose-50 text-zinc-500 hover:text-rose-600 transition-colors border border-zinc-200 rounded-lg text-xs"
                  type="submit"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  Log Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* TOP HEADER (Light Mode & Compact) */}
        <header className="hidden lg:flex items-center justify-between px-8 py-3.5 bg-white/80 backdrop-blur-xl border-b border-zinc-200/60 sticky top-0 z-10">
          {/* Search Bar */}
          <div className="relative group w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Cari transaksi, anggota..."
              className="w-full bg-zinc-100/60 border border-transparent focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 h-9 pl-9 pr-4 rounded-lg text-sm outline-none transition-all"
            />
            {/* Shortcut hint */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <kbd className="hidden sm:inline-block bg-white border border-zinc-200 rounded px-1.5 py-0.5 text-[9px] font-bold text-zinc-400">
                Ctrl+K
              </kbd>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-400 hover:text-zinc-700 transition-colors group">
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
              <Bell className="w-4 h-4 group-hover:animate-[wiggle_1s_ease-in-out_infinite]" />
            </button>
            <div className="h-5 w-px bg-zinc-200" />
            <button className="flex items-center gap-2.5 hover:bg-zinc-50 py-1.5 px-2.5 rounded-lg transition-colors group border border-transparent hover:border-zinc-200">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {session.user?.name?.charAt(0) || "U"}
              </div>
              <span className="text-xs font-semibold text-zinc-700">
                {session.user?.name}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
