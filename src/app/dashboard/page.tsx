// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import Link from "next/link";
import { getDashboardMetrics } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Inbox,
  Plus,
  CalendarCheck,
  Zap,
  Activity,
  CreditCard,
  History,
  MoreHorizontal,
} from "lucide-react";

// Efek garis grafik futuristik
const Sparkline = ({
  color,
  points,
  className = "",
}: {
  color: string;
  points: string;
  className?: string;
}) => (
  <svg
    className={`absolute w-full h-full opacity-[0.15] group-hover:opacity-30 transition-opacity duration-700 ${className}`}
    viewBox="0 0 100 50"
    preserveAspectRatio="none"
  >
    <path
      d={`M0,50 L${points
        .split(" ")
        .map((p) => p.replace(",", ","))
        .join(" L")} L100,50 Z`}
      fill={`url(#gradient-${color.replace("#", "")})`}
    />
    <polyline
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      points={points}
    />
    <defs>
      <linearGradient
        id={`gradient-${color.replace("#", "")}`}
        x1="0"
        x2="0"
        y1="0"
        y2="1"
      >
        <stop offset="0%" stopColor={color} stopOpacity="0.5" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export default async function DashboardPage() {
  const session = await auth();
  const metrics = await getDashboardMetrics();

  const hour = new Date().getHours();
  let greeting = "Selamat Pagi";
  if (hour >= 11 && hour < 15) greeting = "Selamat Siang";
  else if (hour >= 15 && hour < 18) greeting = "Selamat Sore";
  else if (hour >= 18 || hour < 3) greeting = "Selamat Malam";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 max-w-[1400px] mx-auto pb-12">
      {/* HEADER SECTION - ULTRA CLEAN */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-zinc-900 mb-2">
            {greeting},{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              {session?.user?.name?.split(" ")[0] || "Admin"}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white border border-zinc-200/80 shadow-sm text-xs font-bold text-zinc-600 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-zinc-400" />
            {new Date().toLocaleDateString("id-ID", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* ULTIMATE BENTO GRID (4 COLUMNS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* 1. BLACK CARD: TOTAL SALDO (Span 2) */}
        <div className="md:col-span-2 relative group overflow-hidden rounded-[32px] bg-zinc-950 p-8 shadow-2xl ring-1 ring-inset ring-white/10 transition-all hover:ring-white/20">
          {/* Radial Mesh Gradients */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-[32px]">
            <div className="absolute -top-[50%] -right-[20%] w-[80%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
            <div className="absolute -bottom-[50%] -left-[20%] w-[80%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-50" />
          </div>

          <Sparkline
            color="#3b82f6"
            points="0,40 10,42 20,35 30,38 40,20 50,25 60,15 70,22 80,10 90,12 100,5"
            className="bottom-0 left-0"
          />

          <div className="relative z-10 h-full flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-zinc-300 text-xs font-bold uppercase tracking-widest">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" /> Kas Utama
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full w-8 h-8"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>

            <div className="mt-8">
              <p className="text-zinc-400 text-sm font-medium mb-1">
                Total Saldo Tersedia
              </p>
              <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-white drop-shadow-lg">
                {metrics.saldo}
              </h2>
            </div>
          </div>
        </div>

        {/* 2. CARD: PEMASUKAN */}
        <div className="relative group overflow-hidden rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-inset ring-zinc-200/60 transition-all hover:shadow-xl hover:ring-emerald-500/30 flex flex-col justify-between min-h-[224px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent opacity-50" />

          <div className="relative z-10 flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-100 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Bulan Ini
            </span>
          </div>

          <div className="relative z-10 mt-auto pt-8">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">
              Pemasukan
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              {metrics.pemasukanBulanIni}
            </h3>
          </div>
        </div>

        {/* 3. CARD: PENGELUARAN */}
        <div className="relative group overflow-hidden rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-inset ring-zinc-200/60 transition-all hover:shadow-xl hover:ring-rose-500/30 flex flex-col justify-between min-h-[224px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-400/20 via-transparent to-transparent opacity-50" />

          <div className="relative z-10 flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-100 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Bulan Ini
            </span>
          </div>

          <div className="relative z-10 mt-auto pt-8">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">
              Pengeluaran
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              {metrics.pengeluaranBulanIni}
            </h3>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: TRANSACTIONS & QUICK ACTIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* KIRI: RIWAYAT TRANSAKSI (Span 3) */}
        <div className="xl:col-span-3 bg-white rounded-[32px] shadow-sm ring-1 ring-inset ring-zinc-200/60 overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                  Riwayat Arus Kas
                </h2>
                <p className="text-sm font-medium text-zinc-500">
                  Aktivitas keluar masuk uang terakhir.
                </p>
              </div>
            </div>
            <Link href="/dashboard/transaksi" className="hidden sm:block">
              <Button
                variant="outline"
                className="h-10 text-sm font-bold border-zinc-200 hover:border-primary/30 hover:bg-primary/5 rounded-xl transition-all group"
              >
                Lihat Semua{" "}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="p-4 sm:p-6 flex-1">
            {metrics.recentTransactions.length === 0 ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed border-zinc-100 bg-zinc-50/50">
                <div className="w-16 h-16 bg-white shadow-sm ring-1 ring-zinc-200 rounded-2xl flex items-center justify-center mb-4 transform rotate-3">
                  <Inbox className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-lg font-extrabold text-zinc-900">
                  Buku Kas Masih Kosong
                </h3>
                <p className="text-sm font-medium text-zinc-500 mt-1">
                  Belum ada transaksi yang tercatat di sistem.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {metrics.recentTransactions.map((trx) => {
                  const isIuranSistem = trx.description.startsWith("Iuran Bln");

                  return (
                    <div
                      key={trx.id}
                      className="group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white ring-1 ring-inset ring-zinc-100 hover:ring-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 cursor-default overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex items-center gap-4 sm:gap-6 z-10">
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                            trx.type === "income"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {trx.type === "income" ? (
                            <ArrowDownRight className="w-6 h-6" />
                          ) : (
                            <ArrowUpRight className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1.5">
                            <p className="text-base font-extrabold text-zinc-900 line-clamp-1">
                              {trx.description}
                            </p>
                            {isIuranSistem && (
                              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-primary/10 text-primary uppercase tracking-widest border border-primary/20">
                                Iuran Auto
                              </span>
                            )}
                          </div>
                          <p
                            className="text-xs sm:text-sm font-semibold text-zinc-500 flex items-center gap-2"
                            suppressHydrationWarning
                          >
                            <CalendarCheck className="w-3.5 h-3.5" />
                            {new Date(trx.date).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right z-10">
                        <div
                          className={`text-lg sm:text-xl font-extrabold tracking-tight ${
                            trx.type === "income"
                              ? "text-emerald-600"
                              : "text-zinc-900"
                          }`}
                        >
                          {trx.type === "income" ? "+" : "-"} Rp{" "}
                          {trx.amount.toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Tombol Mobile */}
          <div className="p-4 border-t border-zinc-100 sm:hidden bg-zinc-50/50">
            <Link href="/dashboard/transaksi" className="block">
              <Button
                variant="outline"
                className="w-full h-11 text-sm font-bold border-zinc-200 bg-white"
              >
                Lihat Semua Riwayat
              </Button>
            </Link>
          </div>
        </div>

        {/* KANAN: QUICK ACTIONS & INFO (Span 1) */}
        <div className="flex flex-col gap-6">
          {/* Info Anggota - Minimalist */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm ring-1 ring-inset ring-zinc-200/60 relative overflow-hidden group hover:ring-purple-500/30 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent opacity-50" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Anggota Aktif
                </p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                    {metrics.anggotaAktif}
                  </h3>
                  <span className="text-sm font-bold text-zinc-400">Orang</span>
                </div>
              </div>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden relative z-10">
              <div className="h-full bg-purple-500 rounded-full w-3/4" />
            </div>
          </div>

          {/* Quick Actions - Glassmorphism style */}
          <div className="bg-zinc-50/80 backdrop-blur-xl rounded-[32px] p-6 shadow-sm ring-1 ring-inset ring-zinc-200/60 flex-1">
            <h3 className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Command
              Center
            </h3>
            <div className="space-y-3">
              <Link href="/dashboard/transaksi" className="block">
                <div className="group flex items-center justify-between p-4 rounded-2xl bg-white ring-1 ring-inset ring-zinc-200/60 shadow-sm hover:shadow-md hover:ring-primary/40 hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-zinc-900">
                        Catat Manual
                      </p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        Input Transaksi
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/iuran" className="block">
                <div className="group flex items-center justify-between p-4 rounded-2xl bg-white ring-1 ring-inset ring-zinc-200/60 shadow-sm hover:shadow-md hover:ring-emerald-500/40 hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-zinc-900">
                        Cek Iuran
                      </p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        Matriks Tagihan
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
