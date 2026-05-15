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
} from "lucide-react";

export default function SidebarMenu() {
  const pathname = usePathname();

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
        },
        {
          name: "Master Kategori",
          href: "/dashboard/kategori",
          icon: Tag,
          exact: false,
        },
        {
          name: "Data Anggota",
          href: "/dashboard/anggota",
          icon: Users,
          exact: false,
        },
      ],
    },
  ];

  return (
    <nav className="flex-1 space-y-6 overflow-y-auto pr-1 pb-4 scrollbar-hide">
      {menuGroups.map((group, idx) => (
        <div key={idx}>
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 px-2">
            {group.title}
          </h3>
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              // Cek apakah url sekarang cocok sama href menu
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold relative overflow-hidden"
                      : "text-zinc-600 font-medium hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  {/* Garis biru di sebelah kiri kalau aktif */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md" />
                  )}

                  {/* Efek icon loncat kecil */}
                  <Icon
                    className={`w-4 h-4 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
