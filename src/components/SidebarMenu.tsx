// src/components/SidebarMenu.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowRightLeft,
  CalendarCheck,
  Tag,
  Users,
  ChevronRight
} from "lucide-react";

export default function SidebarMenu() {
  const pathname = usePathname();

  // Struktur menu sekarang support "badge" atau "dot" buat ngasih info tambahan
  const menuGroups = [
    {
      title: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          name: "Transaksi Kas",
          href: "/dashboard/transaksi",
          icon: ArrowRightLeft,
          exact: false,
          badge: "Baru", // Contoh nambahin label teks
        },
      ],
    },
    {
      title: "Manajemen",
      items: [
        {
          name: "Iuran Bulanan",
          href: "/dashboard/iuran",
          icon: CalendarCheck,
          exact: false,
          hasDot: true, // Contoh nambahin titik merah/biru notifikasi
        },
        
        {
          name: "Data Anggota",
          href: "/dashboard/anggota",
          icon: Users,
          exact: false,
        },
        {
          name: "Master Kategori",
          href: "/dashboard/kategori",
          icon: Tag,
          exact: false,
        },
      ],
    },
  ];

  return (
    <nav className="flex-1 space-y-8 overflow-y-auto pr-2 pb-4 custom-scrollbar">
      {menuGroups.map((group, idx) => (
        <div key={idx} className="space-y-3">
          <h3 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest px-3">
            {group.title}
          </h3>
          <div className="space-y-1.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-2.5 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white shadow-sm ring-1 ring-zinc-200/80 text-zinc-900"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Wadah Ikon (Icon Receptacle) */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "bg-transparent text-zinc-400 group-hover:bg-zinc-200/50 group-hover:text-zinc-700"
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                    </div>
                    
                    <span className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}>
                      {item.name}
                    </span>
                  </div>

                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}