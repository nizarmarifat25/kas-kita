// src/app/dashboard/layout.tsx
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { LogOut, Wallet, Search, Bell, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

// IMPORT MENU DINAMIS YANG BARU DIBIKIN
import SidebarMenu from "@/components/SidebarMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  // User Profile Component (Biar bersih)
  const UserProfileCard = (
    <div className="pt-4 mt-auto border-t border-zinc-100">
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 hover:border-zinc-300 transition-colors">
        <div className="flex items-center gap-2.5 mb-2.5 px-1">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shrink-0">
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
  );

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50/80">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-zinc-200 shadow-[2px_0_15px_rgb(0,0,0,0.02)] relative z-20">
        <div className="px-5 py-6 flex flex-col h-full relative z-10">
          <div className="flex items-center gap-2.5 mb-8 group cursor-pointer">
            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center border border-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-white">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 transition-colors group-hover:text-primary">
              Kas Kita
            </span>
          </div>
          
          {/* Menu & Profile Component */}
          <SidebarMenu />
          {UserProfileCard}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* HEADER MOBILE */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3.5 bg-white border-b border-zinc-200/60 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 h-9 w-9 transition-colors">
                <Menu className="w-4 h-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-5 flex flex-col border-r-0">
                <SheetTitle className="sr-only">Menu Navigasi Mobile</SheetTitle>
                <div className="flex items-center gap-2.5 mb-8">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center border border-primary/20">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-xl font-extrabold tracking-tight text-zinc-900">
                    Kas Kita
                  </span>
                </div>
                {/* Render Menu & Profile */}
                <SidebarMenu />
                {UserProfileCard}
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-zinc-900">Kas Kita</span>
            </div>
          </div>
          
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
            {session.user?.name?.charAt(0) || "U"}
          </div>
        </header>

        {/* TOP HEADER DESKTOP */}
        <header className="hidden lg:flex items-center justify-end px-8 py-3.5 bg-white/80 backdrop-blur-xl border-b border-zinc-200/60 sticky top-0 z-10">
         

          <div className="flex items-center gap-4">
           
            <button className="flex items-center gap-2.5 hover:bg-zinc-50 py-1.5 px-2.5 rounded-lg transition-colors group border border-transparent hover:border-zinc-200">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                {session.user?.name?.charAt(0) || "U"}
              </div>
              <span className="text-xs font-semibold text-zinc-700">
                {session.user?.name}
              </span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </div>
      </main>
    </div>
  );
}